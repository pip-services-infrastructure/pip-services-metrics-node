var _ = require('lodash');
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { MetricRecordV1 } from '../data/version1';
import { IMetricsPersistence } from './IMetricsPersistence';
import { TimeHorizonV1 } from '../data/version1';
import { ConfigParams } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { TimeHorizonConverter } from './TimeHorizonConverter';
import { TimeRangeComposer } from './TimeRangeComposer';
import { DataPage } from 'pip-services3-commons-node';
import { MetricsMongoDbSchema } from './MetricsMongoDbSchema';
import { PagingParams } from 'pip-services3-commons-node';
import { MetricUpdateV1 } from '../data/version1';
import { MetricRecordIdComposer } from './MetricRecordIdComposer';
import { TimeIndexComposer } from './TimeIndexComposer';
    
export class MetricsMongoDbPersistence 
extends IdentifiableMongoDbPersistence<MetricRecordV1, string> 
implements IMetricsPersistence
    {
        private readonly TimeHorizons =  [
            TimeHorizonV1.Total,
            TimeHorizonV1.Year,
            TimeHorizonV1.Month,
            TimeHorizonV1.Day,
            TimeHorizonV1.Hour,
            TimeHorizonV1.Minute
    ];

    protected _maxPageSize:number = 100;

    constructor()
    {
        //super('metrics', MetricsMongoDbSchema());
        super('metrics');
    }

        public configure(config:ConfigParams)
        {
            super.configure(config);

            this._maxPageSize = config.getAsIntegerWithDefault("max_page_size", this._maxPageSize);
        }

        private  composeFilter( filterParams:FilterParams): any
        {
            filterParams = filterParams || new FilterParams();

            let criteria = [];

            let id = filterParams.getAsNullableString('id');
            if (id != null) 
                criteria.push({ _id: id });

            let name = filterParams.getAsNullableString("name");
            if (name != null)
            {
                criteria.push({ name: name });
            }

            let names = filterParams.getAsObject('names');
            if (_.isString(names))
                names = names.split(',');
            if (_.isArray(names))
                criteria.push({ name: { $in: names } });

            let timeHorizon = TimeHorizonConverter.fromString(filterParams.getAsNullableString("time_horizon"));
            criteria.push({ timeHorizon: timeHorizon });

            let fromRange = TimeRangeComposer.composeFromRangeFromFilter(timeHorizon, filterParams);
            let toRange = TimeRangeComposer.composeToRangeFromFilter(timeHorizon, filterParams);
            criteria.push({ timeHorizon: {$gt: fromRange, $lt: toRange} });

            let dimension1 = filterParams.getAsNullableString("dimension1");
            if (!dimension1 != null && dimension1 != "*")
            {
                criteria.push({ dimension1: dimension1 });
            }

            let dimension2 = filterParams.getAsNullableString("dimension2");
            if (!dimension2 != null && dimension2 != "*")
            {
                criteria.push({ dimension2: dimension2 });
            }

            let dimension3 = filterParams.getAsNullableString("dimension3");
            if (!dimension3 != null && dimension3 != "*")
            {
                criteria.push({ dimension3: dimension3 });
            }

            return criteria.length > 0 ? { $and: criteria } : null;
        }

        public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
            callback: (err: any, page: DataPage<MetricRecordV1>) => void): void {
            super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
        }

        public set(correlationId:string, item:MetricRecordV1)
        {
            var filter = Builders<MetricRecord>.Filter.Eq(x => x.Id, item.Id);

            var data = Builders<MetricRecord>.Update
                .Set(x => x.Name, item.Name)
                .Set(x => x.TimeHorizon, item.TimeHorizon)
                .Set(x => x.Range, item.Range)
                .Set(x => x.Dimension1, item.Dimension1)
                .Set(x => x.Dimension2, item.Dimension2)
                .Set(x => x.Dimension3, item.Dimension3)
                .Set(x => x.Values, item.Values);

            var result = this._collection.updateOne(filter, data, new UpdateOptions{ IsUpsert = true });

            this._logger.trace(correlationId, "Set item with id {%n}", item.id);
        }

        public  updateOne(correlationId:string, update:MetricUpdateV1, maxTimeHorizon:TimeHorizonV1)
        {
            // The code is optimized for bulk updates
            let updItem: Array<MetricUpdateV1>;
            updItem.push(update);
            this.updateMany(correlationId, updItem, maxTimeHorizon);
        }

        public updateMany(correlationId:string, updates:Array<MetricUpdateV1>, maxTimeHorizon:TimeHorizonV1)
        {
            var writeModels = new List<WriteModel<MetricRecord>>();
            var count = 0;

            foreach (var update in updates)
            {
                foreach (var timeHorizon in TimeHorizons)
                {
                    if (timeHorizon > maxTimeHorizon)
                        continue;

                    var id = MetricRecordIdComposer.composeIdFromUpdate(timeHorizon, update);
                    var range = TimeRangeComposer.composeRangeFromUpdate(timeHorizon, update);
                    var index = TimeIndexComposer.composeIndexFromUpdate(timeHorizon, update);

                    var filter = Builders<MetricRecord>.Filter.Eq(x => x.Id, id);

                    var data = Builders<MetricRecord>.Update
                     .SetOnInsert(x => x.Name, update.Name)
                     .SetOnInsert(x => x.TimeHorizon, (int)timeHorizon)
                     .SetOnInsert(x => x.Range, range)
                     .SetOnInsert(x => x.Dimension1, update.Dimension1)
                     .SetOnInsert(x => x.Dimension2, update.Dimension2)
                     .SetOnInsert(x => x.Dimension3, update.Dimension3)
                     .Inc(x => x.Values[index].Count, 1)
                     .Inc(x => x.Values[index].Sum, update.Value)
                     .Min(x => x.Values[index].Min, update.Value)
                     .Max(x => x.Values[index].Max, update.Value);

                    var writeModel = new UpdateOneModel<MetricRecord>(filter, data);
                    writeModel.IsUpsert = true;

                    writeModels.Add(writeModel);
                    count++;

                    // Large number of operations hangs the server
                    if (writeModels.Count >= 200)
                    {
                        await _collection.BulkWriteAsync(writeModels, new BulkWriteOptions() { IsOrdered = false });
                        writeModels.Clear();
                    }
                }
            }

            if (writeModels.Count > 0)
            {
                await _collection.BulkWriteAsync(writeModels, new BulkWriteOptions() { IsOrdered = false });
            }

            this._logger.trace(correlationId, $"Updated {count} metrics");
        }

        public deleteByFilter(correlationId:string, filter:FilterParams)
        {
            var documentSerializer = BsonSerializer.SerializerRegistry.GetSerializer<MetricRecord>();
            var filterDefinition = this.composeFilter(filter);
            var renderedFilter = filterDefinition.Render(documentSerializer, BsonSerializer.SerializerRegistry);

            var result = await this._collection.deleteMany(filterDefinition);

            this._logger.trace(correlationId, $"Deleted {result.DeletedCount} metrics");
        }

    }

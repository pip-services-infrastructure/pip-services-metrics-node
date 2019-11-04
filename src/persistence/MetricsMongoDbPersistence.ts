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
import { MetricRecordValueV1 } from '../data/version1/MetricRecordValueV1';

import { TSMap } from 'typescript-map';

import { IdGenerator } from 'pip-services3-commons-node';

export class MetricsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<MetricRecordV1, string>
    implements IMetricsPersistence {
    private readonly TimeHorizons = [
        TimeHorizonV1.Total,
        TimeHorizonV1.Year,
        TimeHorizonV1.Month,
        TimeHorizonV1.Day,
        TimeHorizonV1.Hour,
        TimeHorizonV1.Minute
    ];

    protected _maxPageSize: number = 100;

    constructor() {
        //super('metrics', MetricsMongoDbSchema());
        super('metrics');
    }

    public configure(config: ConfigParams) {
        super.configure(config);

        this._maxPageSize = config.getAsIntegerWithDefault("max_page_size", this._maxPageSize);
    }

    private composeFilter(filterParams: FilterParams): any {
        filterParams = filterParams || new FilterParams();

        let criteria = [];
        let id = filterParams.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let name = filterParams.getAsNullableString("name");
        if (name != null) {
            criteria.push({ name: name });
        }

        let names = filterParams.getAsObject('names');
        if (_.isString(names))
            names = names.split(',');
        if (_.isArray(names))
            criteria.push({ name: { $in: names } });

        let timeHorizon = TimeHorizonConverter.fromString(filterParams.getAsNullableString("time_horizon"));
        if (timeHorizon != TimeHorizonV1.Total) {
            criteria.push({ timeHorizon: timeHorizon });
        }

        let fromRange = TimeRangeComposer.composeFromRangeFromFilter(timeHorizon, filterParams);
        if (fromRange != TimeHorizonV1.Total) {
            criteria.push({ range: { $gte: fromRange } });
        }
        let toRange = TimeRangeComposer.composeToRangeFromFilter(timeHorizon, filterParams);
        if (toRange != TimeHorizonV1.Total) {
            criteria.push({ range: { $lte: toRange } });
        }
        let dimension1 = filterParams.getAsNullableString("dimension1");
        if (dimension1 != null && dimension1 != "*") {
            criteria.push({ dimension1: dimension1 });
        }

        let dimension2 = filterParams.getAsNullableString("dimension2");
        if (dimension2 != null && dimension2 != "*") {
            criteria.push({ dimension2: dimension2 });
        }

        let dimension3 = filterParams.getAsNullableString("dimension3");
        if (dimension3 != null && dimension3 != "*") {
            criteria.push({ dimension3: dimension3 });
        }

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<MetricRecordV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public set(correlationId: string, item: MetricRecordV1, callback?: (err: any, item: MetricRecordV1) => void) {
        
        if (item == null) {
            if (callback) callback(null, null);
            return;
        }

        // Assign unique id
        let newItem: any = _.omit(item, 'id');
        newItem._id = item.id || IdGenerator.nextLong();
        newItem = this.convertFromPublic(newItem);

        let filter = {
            _id: newItem._id
        };

        let options = {
            returnOriginal: false,
            upsert: true
        };
        
        this._collection.findOneAndUpdate(filter, {$set:newItem}, options, (err, result) => {
            if (!err)
                this._logger.trace(correlationId, "Set in %s with id = %s", this._collection, item.id);
           
            if (callback) {
                newItem = result ? this.convertToPublic(result.value) : null;
                callback(err, newItem);
            }
        });
    }

    public updateOne(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1) {
        this.TimeHorizons.forEach(function (timeHorizon) {
            if (timeHorizon <= maxTimeHorizon) {
                let id = MetricRecordIdComposer.composeIdFromUpdate(timeHorizon, update);
                let range = TimeRangeComposer.composeRangeFromUpdate(timeHorizon, update);
                let existItem = this._collection.filter(function (elem, index, arr) {
                    elem.id == id;
                });
                let index = existItem.id || -1;

                let timeIndex = TimeIndexComposer.composeIndexFromUpdate(timeHorizon, update);
                let item: MetricRecordV1;

                if (index < 0) {
                    item = new MetricRecordV1();
                    item.id = id,
                        item.name = update.name,
                        item.timeHorizon = timeHorizon,
                        item.range = range,
                        item.dimension1 = update.dimension1,
                        item.dimension2 = update.dimension2,
                        item.dimension3 = update.dimension3,
                        item.values = new TSMap<string, MetricRecordValueV1>()

                    this._collection.set(item);
                }
                else {
                    item = this._collection[index];
                }

                let value: MetricRecordValueV1 = null;
                if (!item.values.has(timeIndex)) {
                    value = new MetricRecordValueV1();

                    value.count = 0,
                        value.sum = 0,
                        value.min = update.value,
                        value.max = update.value

                    item.values[timeIndex] = value;
                }

                value.count += 1;
                value.sum += update.value;
                value.min = Math.min(value.min, update.value);
                value.max = Math.max(value.max, update.value);
            }
        })

    }

    public updateMany(correlationId: string, updates: Array<MetricUpdateV1>, maxTimeHorizon: TimeHorizonV1) {
        updates.forEach(function (metricUpdate) {
            this.updateOne(correlationId, metricUpdate, maxTimeHorizon)

        });
        this._logger.trace(correlationId, 'Updated $n metrics', updates.length);
    }

    public deleteByFilter(correlationId: string, filter: FilterParams, callback?: (err: any) => void) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), (err: any) => {
            if (err != null) {
                this._logger.trace(correlationId, "Deleted metrics");
            }
            callback(err);
        });

    }

}

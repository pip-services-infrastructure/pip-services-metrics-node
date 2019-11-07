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
import { isUndefined } from 'util';

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

    public updateOne(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1) {
        let item: MetricRecordV1;
        this.TimeHorizons.forEach((timeHorizon) => {
            if (timeHorizon <= maxTimeHorizon) {
                let id = MetricRecordIdComposer.composeIdFromUpdate(timeHorizon, update);
                let range = TimeRangeComposer.composeRangeFromUpdate(timeHorizon, update);
                this.getOneById(correlationId, id, (err, ret) => {
                    item = ret;
                });

                let timeIndex = TimeIndexComposer.composeIndexFromUpdate(timeHorizon, update);

                if (item == null) {
                    item = new MetricRecordV1();
                    item.id = id;
                    item.name = update.name;
                    item.timeHorizon = timeHorizon;
                    item.range = range;
                    item.dimension1 = update.dimension1;
                    item.dimension2 = update.dimension2;
                    item.dimension3 = update.dimension3;
                    item.values = new TSMap<string, MetricRecordValueV1>()
                }

                let value: MetricRecordValueV1;
                if (!item.values.has(timeIndex)) {
                    value = new MetricRecordValueV1();

                    value.count = 0;
                    value.sum = 0;
                    value.min = update.value;
                    value.max = update.value;

                } else {
                    value = item.values.get(timeIndex);
                }

                value.count += 1;
                value.sum += update.value;
                value.min = Math.min(value.min, update.value);
                value.max = Math.max(value.max, update.value);

                item.values.set(timeIndex, value);

                this.set(correlationId, item, (err, ret) => {
                    if (err != null) {
                        this._logger.error(correlationId, err, 'METRIC SET ERR', 'Metric update error');
                    } else {
                        this._logger.trace(correlationId, 'Updated metric');
                    }
                });
            }
        })

    }

    public updateMany(correlationId: string, updates: Array<MetricUpdateV1>, maxTimeHorizon: TimeHorizonV1) {
        updates.forEach((metricUpdate) => {
            this.updateOne(correlationId, metricUpdate, maxTimeHorizon)

        });
        this._logger.trace(correlationId, 'Updated $n metrics', updates.length);
    }

    public deleteByFilter(correlationId: string, filter: FilterParams, callback?: (err: any) => void) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), (err: any) => {
            if (err == null) {
                this._logger.trace(correlationId, "Deleted metrics");
            }
            callback(err);
        });

    }

}

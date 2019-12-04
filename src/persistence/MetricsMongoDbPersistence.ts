let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { MetricUpdateV1 } from '../data/version1/MetricUpdateV1';
import { TimeHorizonV1 } from '../data/version1/TimeHorizonV1';

import { MetricRecord } from './MetricRecord';
import { IMetricsPersistence } from './IMetricsPersistence';
import { TimeHorizonConverter } from './TimeHorizonConverter';
import { TimeRangeComposer } from './TimeRangeComposer';
import { MetricRecordIdComposer } from './MetricRecordIdComposer';
import { TimeIndexComposer } from './TimeIndexComposer';
import { MetricRecordValue } from './MetricRecordValue';

export class MetricsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<MetricRecord, string>
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
        super('metrics');
    }

    public configure(config: ConfigParams) {
        super.configure(config);

        this._maxPageSize = config.getAsIntegerWithDefault("max_page_size", this._maxPageSize);
    }

    private composeFilter(filterParams: FilterParams): any {
        filterParams = filterParams || new FilterParams();

        let criteria = [];

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
        criteria.push({ th: timeHorizon });

        let fromRange = TimeRangeComposer.composeFromRangeFromFilter(timeHorizon, filterParams);
        if (fromRange != TimeHorizonV1.Total) {
            criteria.push({ rng: { $gte: fromRange } });
        }
        let toRange = TimeRangeComposer.composeToRangeFromFilter(timeHorizon, filterParams);
        if (toRange != TimeHorizonV1.Total) {
            criteria.push({ rng: { $lte: toRange } });
        }
        let dimension1 = filterParams.getAsNullableString("dimension1");
        if (dimension1 != null && dimension1 != "*") {
            criteria.push({ d1: dimension1 });
        }

        let dimension2 = filterParams.getAsNullableString("dimension2");
        if (dimension2 != null && dimension2 != "*") {
            criteria.push({ d2: dimension2 });
        }

        let dimension3 = filterParams.getAsNullableString("dimension3");
        if (dimension3 != null && dimension3 != "*") {
            criteria.push({ d3: dimension3 });
        }

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<MetricRecord>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, "name,rng,d1,d2,d3", null, callback);
    }

    public updateOne(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1,
        callback?: (err: any) => void) {
        this.updateMany(correlationId, [update], maxTimeHorizon, callback);
    }

    public updateMany(correlationId: string, updates: MetricUpdateV1[],
        maxTimeHorizon: TimeHorizonV1, callback?: (err: any) => void): void {
        let batch = this._collection.initializeUnorderedBulkOp();
        let opCounter = 0;

        async.each(
            updates, 
            (update, callback) => {
                for (let timeHorizon of this.TimeHorizons) {
                    if (timeHorizon > maxTimeHorizon)
                        continue;

                    let id = MetricRecordIdComposer.composeIdFromUpdate(timeHorizon, update);
                    let range = TimeRangeComposer.composeRangeFromUpdate(timeHorizon, update);
                    let timeIndex = TimeIndexComposer.composeIndexFromUpdate(timeHorizon, update);
                    opCounter += opCounter;

                    // Add to bulk operations
                    batch
                        .find({ _id: id })
                        .upsert()
                        .updateOne({
                            $setOnInsert: {
                                name: update.name,
                                th: timeHorizon,
                                rng: range,
                                d1: update.dimension1,
                                d2: update.dimension2,
                                d3: update.dimension3
                            },
                            $inc: {
                                ["val." + timeIndex + ".cnt"]: 1,
                                ["val." + timeIndex + ".sum"]: update.value
                            },
                            $min: { ["val." + timeIndex + ".min"]: update.value },
                            $max: { ["val." + timeIndex + ".max"]: update.value }
                        });    
                }

                if (opCounter >= 200) {
                    batch.execute((err) => {
                        if (err == null) {
                            opCounter = 0;
                            batch = this._collection.initializeUnorderedBulkOp();                       
                        }
                        callback(err); 
                    });
                } else {
                    callback(null);
                }
            },
            (err) => {
                if (err) {
                    callback(err);
                    null;
                }

                if (opCounter >= 0) {
                    batch.execute((err) => {
                        if (err == null) {
                            this._logger.trace(correlationId, 'Updated $n metrics', updates.length);
                        }
                        if (callback) callback(err);
                    });
                } else {
                    if (callback) callback(null);
                }
            }
        );
    }

    public deleteByFilter(correlationId: string, filter: FilterParams, callback?: (err: any) => void) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }

}

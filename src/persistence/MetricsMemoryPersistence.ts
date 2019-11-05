let _ = require('lodash');
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { MetricRecordV1 } from '../data/version1/MetricRecordV1';
import { MetricRecordValueV1 } from '../data/version1';
import { MetricUpdateV1 } from '../data/version1';
import { TimeRangeComposer } from './TimeRangeComposer';
import { TimeIndexComposer } from './TimeIndexComposer';
import { TimeHorizonConverter } from './TimeHorizonConverter';
import { TimeHorizonV1 } from '../data/version1';
import { ILoader, ISaver } from 'pip-services3-data-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { MetricRecordIdComposer } from './MetricRecordIdComposer';
import { IMetricsPersistence } from './IMetricsPersistence';
import { IReconfigurable } from 'pip-services3-commons-node';
import { TSMap } from 'typescript-map';

export class MetricsMemoryPersistence extends IdentifiableMemoryPersistence<MetricRecordV1, string> implements IReconfigurable, IMetricsPersistence {
    private readonly TimeHorizons = [
        TimeHorizonV1.Total,
        TimeHorizonV1.Year,
        TimeHorizonV1.Month,
        TimeHorizonV1.Day,
        TimeHorizonV1.Hour,
        TimeHorizonV1.Minute
    ];

    protected _maxPageSize: number = 1000;

    constructor();
    constructor(loader: ILoader<MetricRecordV1>, saver: ISaver<MetricRecordV1>)
    constructor(loader?: ILoader<MetricRecordV1>, saver?: ISaver<MetricRecordV1>) {
        super(loader, saver);
    }

    public configure(config: ConfigParams): void {
        this._maxPageSize = config.getAsIntegerWithDefault("max_page_size", this._maxPageSize);
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let id = filter.getAsNullableString('id');
        let name = filter.getAsNullableString('name');
        let names = filter.getAsObject('names');
        if (_.isString(names))
            names = names.split(',');
        if (!_.isArray(names))
            names = null;
        let timeHorizon = TimeHorizonConverter.fromString(filter.getAsNullableString("time_horizon"));
        let fromRange = TimeRangeComposer.composeFromRangeFromFilter(timeHorizon, filter);
        let toRange = TimeRangeComposer.composeToRangeFromFilter(timeHorizon, filter);
        let dimension1 = filter.getAsNullableString("dimension1");
        let dimension2 = filter.getAsNullableString("dimension2");
        let dimension3 = filter.getAsNullableString("dimension3");
        return (item) => {
            if (id != null && item.id != id)
                return false;
            if (name != null && item.name != name)
                return false;
            if (names != null && _.indexOf(names, item.name) < 0)
                return false;
            if (timeHorizon != TimeHorizonV1.Total && item.timeHorizon != timeHorizon)
                return false;
            if (fromRange != TimeHorizonV1.Total && item.range < fromRange)
                return false;
            if (toRange != TimeHorizonV1.Total && item.range > toRange)
                return false;
            if (dimension1 != null && item.dimension1 != dimension1)
                return false;
            if (dimension2 != null && item.dimension2 != dimension2)
                return false;
            if (dimension3 != null && item.dimension3 != dimension3)
                return false;
            return true;
        };
    }

    public getPageByFilter(correlationId: string, filterParams: FilterParams,
        paging: PagingParams, callback: (err: any, page: DataPage<MetricRecordV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filterParams), paging, null, null, callback);
    }

    public updateOne(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1) {
        this.TimeHorizons.forEach(function (timeHorizon) {
            if (timeHorizon <= maxTimeHorizon) {
                let id = MetricRecordIdComposer.composeIdFromUpdate(timeHorizon, update);
                let range = TimeRangeComposer.composeRangeFromUpdate(timeHorizon, update);
                let existItem = this._items.filter(function (elem, index, arr) {
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

                    this._items.set(item);
                }
                else {
                    item = this._items[index];
                }

                let value: MetricRecordValueV1 = null;
                if (!item.values.has(timeIndex)) {
                    value = new MetricRecordValueV1();

                    value.count = 0,
                        value.sum = 0,
                        value.min = update.value,
                        value.max = update.value

                    item.values.set(timeIndex, value);
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

        this.getPageByFilter(correlationId, filter, new PagingParams(), (err: any, page: DataPage<MetricRecordV1>) => {
            if (err != null) {
                this._logger.error(correlationId, err, "Error delete metrics by filter");
                callback(err);
            }
            if (page.data.length > 0) {
                page.data.forEach((item) => {
                    this.deleteById(correlationId, item.id, (err: any, removeMetricRecord: MetricRecordV1) => {
                        this._logger.trace(correlationId, "Deleted %n metrics", page.data.length);
                        callback(err);
                    })
                })
            } else {

                this._logger.trace(correlationId, "Metrics for deleting not found");
            }
        });

    }

}

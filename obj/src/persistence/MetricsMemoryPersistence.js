"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_data_node_1 = require("pip-services3-data-node");
const MetricRecordV1_1 = require("../data/version1/MetricRecordV1");
const version1_1 = require("../data/version1");
const TimeRangeComposer_1 = require("./TimeRangeComposer");
const TimeIndexComposer_1 = require("./TimeIndexComposer");
const TimeHorizonConverter_1 = require("./TimeHorizonConverter");
const version1_2 = require("../data/version1");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const MetricRecordIdComposer_1 = require("./MetricRecordIdComposer");
const typescript_map_1 = require("typescript-map");
class MetricsMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor(loader, saver) {
        super(loader, saver);
        this.TimeHorizons = [
            version1_2.TimeHorizonV1.Total,
            version1_2.TimeHorizonV1.Year,
            version1_2.TimeHorizonV1.Month,
            version1_2.TimeHorizonV1.Day,
            version1_2.TimeHorizonV1.Hour,
            version1_2.TimeHorizonV1.Minute
        ];
        this._maxPageSize = 1000;
    }
    configure(config) {
        this._maxPageSize = config.getAsIntegerWithDefault("max_page_size", this._maxPageSize);
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let id = filter.getAsNullableString('id');
        let name = filter.getAsNullableString('name');
        let names = filter.getAsObject('names');
        if (_.isString(names))
            names = names.split(',');
        if (!_.isArray(names))
            names = null;
        let timeHorizon = TimeHorizonConverter_1.TimeHorizonConverter.fromString(filter.getAsNullableString("time_horizon"));
        let fromRange = TimeRangeComposer_1.TimeRangeComposer.composeFromRangeFromFilter(timeHorizon, filter);
        let toRange = TimeRangeComposer_1.TimeRangeComposer.composeToRangeFromFilter(timeHorizon, filter);
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
            if (timeHorizon != version1_2.TimeHorizonV1.Total && item.timeHorizon != timeHorizon)
                return false;
            if (fromRange != version1_2.TimeHorizonV1.Total && item.range < fromRange)
                return false;
            if (toRange != version1_2.TimeHorizonV1.Total && item.range > toRange)
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
    getPageByFilter(correlationId, filterParams, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filterParams), paging, null, null, callback);
    }
    updateOne(correlationId, update, maxTimeHorizon) {
        this.TimeHorizons.forEach(function (timeHorizon) {
            if (timeHorizon <= maxTimeHorizon) {
                let id = MetricRecordIdComposer_1.MetricRecordIdComposer.composeIdFromUpdate(timeHorizon, update);
                let range = TimeRangeComposer_1.TimeRangeComposer.composeRangeFromUpdate(timeHorizon, update);
                let existItem = this._items.filter(function (elem, index, arr) {
                    elem.id == id;
                });
                let index = existItem.id || -1;
                let timeIndex = TimeIndexComposer_1.TimeIndexComposer.composeIndexFromUpdate(timeHorizon, update);
                let item;
                if (index < 0) {
                    item = new MetricRecordV1_1.MetricRecordV1();
                    item.id = id,
                        item.name = update.name,
                        item.timeHorizon = timeHorizon,
                        item.range = range,
                        item.dimension1 = update.dimension1,
                        item.dimension2 = update.dimension2,
                        item.dimension3 = update.dimension3,
                        item.values = new typescript_map_1.TSMap();
                    this._items.set(item);
                }
                else {
                    item = this._items[index];
                }
                let value = null;
                if (!item.values.has(timeIndex)) {
                    value = new version1_1.MetricRecordValueV1();
                    value.count = 0,
                        value.sum = 0,
                        value.min = update.value,
                        value.max = update.value;
                    item.values.set(timeIndex, value);
                }
                value.count += 1;
                value.sum += update.value;
                value.min = Math.min(value.min, update.value);
                value.max = Math.max(value.max, update.value);
            }
        });
    }
    updateMany(correlationId, updates, maxTimeHorizon) {
        updates.forEach(function (metricUpdate) {
            this.updateOne(correlationId, metricUpdate, maxTimeHorizon);
        });
        this._logger.trace(correlationId, 'Updated $n metrics', updates.length);
    }
    deleteByFilter(correlationId, filter, callback) {
        this.getPageByFilter(correlationId, filter, new pip_services3_commons_node_2.PagingParams(), (err, page) => {
            if (err != null) {
                this._logger.error(correlationId, err, "Error delete metrics by filter");
                callback(err);
            }
            if (page.data.length > 0) {
                page.data.forEach((item) => {
                    this.deleteById(correlationId, item.id, (err, removeMetricRecord) => {
                        this._logger.trace(correlationId, "Deleted %n metrics", page.data.length);
                        callback(err);
                    });
                });
            }
            else {
                this._logger.trace(correlationId, "Metrics for deleting not found");
            }
        });
    }
}
exports.MetricsMemoryPersistence = MetricsMemoryPersistence;
//# sourceMappingURL=MetricsMemoryPersistence.js.map
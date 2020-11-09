"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsMemoryPersistence = void 0;
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
const TimeHorizonV1_1 = require("../data/version1/TimeHorizonV1");
const TimeRangeComposer_1 = require("./TimeRangeComposer");
const TimeIndexComposer_1 = require("./TimeIndexComposer");
const TimeHorizonConverter_1 = require("./TimeHorizonConverter");
const MetricRecordIdComposer_1 = require("./MetricRecordIdComposer");
class MetricsMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this.TimeHorizons = [
            TimeHorizonV1_1.TimeHorizonV1.Total,
            TimeHorizonV1_1.TimeHorizonV1.Year,
            TimeHorizonV1_1.TimeHorizonV1.Month,
            TimeHorizonV1_1.TimeHorizonV1.Day,
            TimeHorizonV1_1.TimeHorizonV1.Hour,
            TimeHorizonV1_1.TimeHorizonV1.Minute
        ];
        this._maxPageSize = 1000;
    }
    configure(config) {
        this._maxPageSize = config.getAsIntegerWithDefault("max_page_size", this._maxPageSize);
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let name = filter.getAsNullableString('name');
        let names = filter.getAsObject('names');
        if (_.isString(names))
            names = names.split(',');
        let timeHorizon = TimeHorizonConverter_1.TimeHorizonConverter.fromString(filter.getAsNullableString("time_horizon"));
        let fromRange = TimeRangeComposer_1.TimeRangeComposer.composeFromRangeFromFilter(timeHorizon, filter);
        let toRange = TimeRangeComposer_1.TimeRangeComposer.composeToRangeFromFilter(timeHorizon, filter);
        let dimension1 = filter.getAsNullableString("dimension1");
        if (dimension1 == "*")
            dimension1 = null;
        let dimension2 = filter.getAsNullableString("dimension2");
        if (dimension2 == "*")
            dimension2 = null;
        let dimension3 = filter.getAsNullableString("dimension3");
        if (dimension3 == "*")
            dimension3 = null;
        return (item) => {
            if (name != null && item.name != name)
                return false;
            if (names != null && _.indexOf(names, item.name) < 0)
                return false;
            if (item.th != timeHorizon)
                return false;
            if (fromRange != TimeHorizonV1_1.TimeHorizonV1.Total && item.rng < fromRange)
                return false;
            if (toRange != TimeHorizonV1_1.TimeHorizonV1.Total && item.rng > toRange)
                return false;
            if (dimension1 != null && item.d1 != dimension1)
                return false;
            if (dimension2 != null && item.d2 != dimension2)
                return false;
            if (dimension3 != null && item.d3 != dimension3)
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    updateOne(correlationId, update, maxTimeHorizon, callback) {
        for (let timeHorizon of this.TimeHorizons) {
            if (timeHorizon > maxTimeHorizon)
                continue;
            let id = MetricRecordIdComposer_1.MetricRecordIdComposer.composeIdFromUpdate(timeHorizon, update);
            let range = TimeRangeComposer_1.TimeRangeComposer.composeRangeFromUpdate(timeHorizon, update);
            let index = _.findIndex(this._items, (item) => item.id == id);
            let timeIndex = TimeIndexComposer_1.TimeIndexComposer.composeIndexFromUpdate(timeHorizon, update);
            let item;
            if (index < 0) {
                item = {
                    id: id,
                    name: update.name,
                    th: timeHorizon,
                    rng: range,
                    d1: update.dimension1,
                    d2: update.dimension2,
                    d3: update.dimension3,
                    val: {}
                };
                this._items.push(item);
            }
            else {
                item = this._items[index];
            }
            let value = item.val[timeIndex];
            if (item.val[timeIndex] == null) {
                value = {
                    cnt: 0,
                    sum: 0,
                    min: update.value,
                    max: update.value
                };
                item.val[timeIndex] = value;
            }
            value.cnt += 1;
            value.sum += update.value;
            value.min = Math.min(value.min, update.value);
            value.max = Math.max(value.max, update.value);
        }
        //this._logger.trace(correlationId, 'Updated metric');
        this.save(correlationId, (err) => {
            if (callback)
                callback(err);
        });
    }
    updateMany(correlationId, updates, maxTimeHorizon, callback) {
        let count = 0;
        async.each(updates, (update, callback) => {
            this.updateOne(correlationId, update, maxTimeHorizon, (err) => {
                if (err == null)
                    count++;
                callback(err);
            });
        }, (err) => {
            this._logger.trace(correlationId, 'Updated $n metrics', count);
            if (callback)
                callback(err);
        });
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
}
exports.MetricsMemoryPersistence = MetricsMemoryPersistence;
//# sourceMappingURL=MetricsMemoryPersistence.js.map
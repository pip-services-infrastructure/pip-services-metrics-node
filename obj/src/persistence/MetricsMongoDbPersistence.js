"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
const TimeHorizonV1_1 = require("../data/version1/TimeHorizonV1");
const TimeHorizonConverter_1 = require("./TimeHorizonConverter");
const TimeRangeComposer_1 = require("./TimeRangeComposer");
const MetricRecordIdComposer_1 = require("./MetricRecordIdComposer");
const TimeIndexComposer_1 = require("./TimeIndexComposer");
class MetricsMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('metrics');
        this.TimeHorizons = [
            TimeHorizonV1_1.TimeHorizonV1.Total,
            TimeHorizonV1_1.TimeHorizonV1.Year,
            TimeHorizonV1_1.TimeHorizonV1.Month,
            TimeHorizonV1_1.TimeHorizonV1.Day,
            TimeHorizonV1_1.TimeHorizonV1.Hour,
            TimeHorizonV1_1.TimeHorizonV1.Minute
        ];
        this._maxPageSize = 100;
        super.ensureIndex({ name: 1, th: 1, rng: -1 });
        super.ensureIndex({ d1: 1 });
        super.ensureIndex({ d2: 1 });
        super.ensureIndex({ d3: 1 });
    }
    configure(config) {
        super.configure(config);
        this._maxPageSize = config.getAsIntegerWithDefault("max_page_size", this._maxPageSize);
    }
    composeFilter(filterParams) {
        filterParams = filterParams || new pip_services3_commons_node_1.FilterParams();
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
        let timeHorizon = TimeHorizonConverter_1.TimeHorizonConverter.fromString(filterParams.getAsNullableString("time_horizon"));
        criteria.push({ th: timeHorizon });
        let fromRange = TimeRangeComposer_1.TimeRangeComposer.composeFromRangeFromFilter(timeHorizon, filterParams);
        if (fromRange != TimeHorizonV1_1.TimeHorizonV1.Total) {
            criteria.push({ rng: { $gte: fromRange } });
        }
        let toRange = TimeRangeComposer_1.TimeRangeComposer.composeToRangeFromFilter(timeHorizon, filterParams);
        if (toRange != TimeHorizonV1_1.TimeHorizonV1.Total) {
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
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, "name,rng,d1,d2,d3", null, callback);
    }
    updateOne(correlationId, update, maxTimeHorizon, callback) {
        this.updateMany(correlationId, [update], maxTimeHorizon, callback);
    }
    updateMany(correlationId, updates, maxTimeHorizon, callback) {
        let batch = this._collection.initializeUnorderedBulkOp();
        let opCounter = 0;
        async.each(updates, (update, callback) => {
            for (let timeHorizon of this.TimeHorizons) {
                if (timeHorizon > maxTimeHorizon)
                    continue;
                let id = MetricRecordIdComposer_1.MetricRecordIdComposer.composeIdFromUpdate(timeHorizon, update);
                let range = TimeRangeComposer_1.TimeRangeComposer.composeRangeFromUpdate(timeHorizon, update);
                let timeIndex = TimeIndexComposer_1.TimeIndexComposer.composeIndexFromUpdate(timeHorizon, update);
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
            }
            else {
                callback(null);
            }
        }, (err) => {
            if (err) {
                callback(err);
                null;
            }
            if (opCounter >= 0) {
                batch.execute((err) => {
                    if (err == null) {
                        this._logger.trace(correlationId, 'Updated %d metrics', updates.length);
                    }
                    if (callback)
                        callback(err);
                });
            }
            else {
                if (callback)
                    callback(null);
            }
        });
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
}
exports.MetricsMongoDbPersistence = MetricsMongoDbPersistence;
//# sourceMappingURL=MetricsMongoDbPersistence.js.map
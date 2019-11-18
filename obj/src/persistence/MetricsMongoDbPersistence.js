"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
const version1_1 = require("../data/version1");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const TimeHorizonConverter_1 = require("./TimeHorizonConverter");
const TimeRangeComposer_1 = require("./TimeRangeComposer");
const MetricRecordIdComposer_1 = require("./MetricRecordIdComposer");
const TimeIndexComposer_1 = require("./TimeIndexComposer");
class MetricsMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        //super('metrics', MetricsMongoDbSchema());
        super('metrics');
        this.TimeHorizons = [
            version1_1.TimeHorizonV1.Total,
            version1_1.TimeHorizonV1.Year,
            version1_1.TimeHorizonV1.Month,
            version1_1.TimeHorizonV1.Day,
            version1_1.TimeHorizonV1.Hour,
            version1_1.TimeHorizonV1.Minute
        ];
        this._maxPageSize = 100;
    }
    configure(config) {
        super.configure(config);
        this._maxPageSize = config.getAsIntegerWithDefault("max_page_size", this._maxPageSize);
    }
    composeFilter(filterParams) {
        filterParams = filterParams || new pip_services3_commons_node_1.FilterParams();
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
        let timeHorizon = TimeHorizonConverter_1.TimeHorizonConverter.fromString(filterParams.getAsNullableString("time_horizon"));
        criteria.push({ timeHorizon: timeHorizon });
        let fromRange = TimeRangeComposer_1.TimeRangeComposer.composeFromRangeFromFilter(timeHorizon, filterParams);
        if (fromRange != version1_1.TimeHorizonV1.Total) {
            criteria.push({ range: { $gte: fromRange } });
        }
        let toRange = TimeRangeComposer_1.TimeRangeComposer.composeToRangeFromFilter(timeHorizon, filterParams);
        if (toRange != version1_1.TimeHorizonV1.Total) {
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
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    updateOne(correlationId, update, maxTimeHorizon) {
        let updates = new Array();
        updates.push(update);
        this.updateMany(correlationId, updates, maxTimeHorizon);
        this._logger.trace(correlationId, 'Updated metric');
    }
    updateMany(correlationId, updates, maxTimeHorizon) {
        let batch = this._collection.initializeUnorderedBulkOp();
        let opCounter = 0;
        for (let update of updates) {
            for (let timeHorizon of this.TimeHorizons) {
                if (timeHorizon <= maxTimeHorizon) {
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
                            timeHorizon: timeHorizon,
                            range: range,
                            dimension1: update.dimension1,
                            dimension2: update.dimension2,
                            dimension3: update.dimension3
                        },
                        $inc: {
                            ["values." + timeIndex + ".count"]: 1,
                            ["values." + timeIndex + ".sum"]: update.value
                        },
                        $min: { ["values." + timeIndex + ".min"]: update.value },
                        $max: { ["values." + timeIndex + ".max"]: update.value }
                    });
                    if (opCounter >= 200) {
                        opCounter = 0;
                        batch.execute((err) => {
                            if (err != null) {
                                this._logger.error(correlationId, err, 'METRIC SET ERR', 'Metric update error');
                            }
                        });
                    }
                }
            }
            if (opCounter >= 0) {
                batch.execute((err) => {
                    if (err != null) {
                        this._logger.error(correlationId, err, 'METRIC SET ERR', 'Metric update error');
                    }
                });
            }
        }
        this._logger.trace(correlationId, 'Updated $n metrics', updates.length);
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), (err) => {
            if (err == null) {
                this._logger.trace(correlationId, "Deleted metrics");
            }
            callback(err);
        });
    }
}
exports.MetricsMongoDbPersistence = MetricsMongoDbPersistence;
//# sourceMappingURL=MetricsMongoDbPersistence.js.map
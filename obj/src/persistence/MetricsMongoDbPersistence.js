"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
const version1_1 = require("../data/version1");
const version1_2 = require("../data/version1");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const TimeHorizonConverter_1 = require("./TimeHorizonConverter");
const TimeRangeComposer_1 = require("./TimeRangeComposer");
const MetricRecordIdComposer_1 = require("./MetricRecordIdComposer");
const TimeIndexComposer_1 = require("./TimeIndexComposer");
const MetricRecordValueV1_1 = require("../data/version1/MetricRecordValueV1");
const typescript_map_1 = require("typescript-map");
class MetricsMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        //super('metrics', MetricsMongoDbSchema());
        super('metrics');
        this.TimeHorizons = [
            version1_2.TimeHorizonV1.Total,
            version1_2.TimeHorizonV1.Year,
            version1_2.TimeHorizonV1.Month,
            version1_2.TimeHorizonV1.Day,
            version1_2.TimeHorizonV1.Hour,
            version1_2.TimeHorizonV1.Minute
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
        if (timeHorizon != version1_2.TimeHorizonV1.Total) {
            criteria.push({ timeHorizon: timeHorizon });
        }
        let fromRange = TimeRangeComposer_1.TimeRangeComposer.composeFromRangeFromFilter(timeHorizon, filterParams);
        if (fromRange != version1_2.TimeHorizonV1.Total) {
            criteria.push({ range: { $gte: fromRange } });
        }
        let toRange = TimeRangeComposer_1.TimeRangeComposer.composeToRangeFromFilter(timeHorizon, filterParams);
        if (toRange != version1_2.TimeHorizonV1.Total) {
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
    /*
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
    
            //this._collection.findOneAndUpdate(filter, {$set:newItem}, options, (err, result) => {
            this._collection.findOneAndReplace(filter, newItem, options, (err, result) => {
                if (!err)
                    this._logger.trace(correlationId, "Set in %s with id = %s", this._collection, item.id);
    
                if (callback) {
                    newItem = result ? this.convertToPublic(result.value) : null;
                    callback(err, newItem);
                }
            });
        }
    */
    updateOne(correlationId, update, maxTimeHorizon) {
        let item;
        this.TimeHorizons.forEach((timeHorizon) => {
            if (timeHorizon <= maxTimeHorizon) {
                let id = MetricRecordIdComposer_1.MetricRecordIdComposer.composeIdFromUpdate(timeHorizon, update);
                let range = TimeRangeComposer_1.TimeRangeComposer.composeRangeFromUpdate(timeHorizon, update);
                this.getOneById(correlationId, id, (err, ret) => {
                    item = ret;
                });
                let timeIndex = TimeIndexComposer_1.TimeIndexComposer.composeIndexFromUpdate(timeHorizon, update);
                if (item == null) {
                    item = new version1_1.MetricRecordV1();
                    item.id = id;
                    item.name = update.name;
                    item.timeHorizon = timeHorizon;
                    item.range = range;
                    item.dimension1 = update.dimension1;
                    item.dimension2 = update.dimension2;
                    item.dimension3 = update.dimension3;
                    item.values = new typescript_map_1.TSMap();
                }
                let value;
                if (!item.values.has(timeIndex)) {
                    value = new MetricRecordValueV1_1.MetricRecordValueV1();
                    value.count = 0;
                    value.sum = 0;
                    value.min = update.value;
                    value.max = update.value;
                }
                else {
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
                    }
                    else {
                        this._logger.trace(correlationId, 'Updated metric');
                    }
                });
            }
        });
    }
    updateMany(correlationId, updates, maxTimeHorizon) {
        updates.forEach((metricUpdate) => {
            this.updateOne(correlationId, metricUpdate, maxTimeHorizon);
        });
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
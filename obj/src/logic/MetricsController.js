"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const MetricValueV1_1 = require("../data/version1/MetricValueV1");
const TimeHorizonConverter_1 = require("../persistence/TimeHorizonConverter");
const TimeIndexComposer_1 = require("../persistence/TimeIndexComposer");
const TimeParser_1 = require("../persistence/TimeParser");
const MetricsCommandSet_1 = require("./MetricsCommandSet");
class MetricsController {
    constructor() {
        this._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("dependencies.persistence", "pip-services-metrics:persistence:*:*:1.0");
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(this._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired("persistence");
    }
    getCommandSet() {
        if (this._commandSet == null) {
            this._commandSet = new MetricsCommandSet_1.MetricsCommandSet(this);
        }
        return this._commandSet;
    }
    getMetricDefinitionsWithName(correlationId, name, callback) {
        let filter = pip_services3_commons_node_3.FilterParams.fromTuples("name", name, "time_horizon", 0);
        let take = 500;
        let paging = new pip_services3_commons_node_4.PagingParams(0, take);
        let definitions = {};
        let reading = true;
        async.whilst(() => { return reading; }, (callback) => {
            this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
                if (err) {
                    callback(err);
                    return;
                }
                for (let record of page.data) {
                    let definition = definitions[record.name];
                    if (definition == null) {
                        definition = {
                            name: record.name,
                            dimension1: [],
                            dimension2: [],
                            dimension3: []
                        };
                        definitions[record.name] = definition;
                    }
                    if (record.d1 != null && _.indexOf(definition.dimension1, record.d1) < 0) {
                        definition.dimension1.push(record.d1);
                    }
                    if (record.d2 != null && _.indexOf(definition.dimension2, record.d2) < 0) {
                        definition.dimension2.push(record.d2);
                    }
                    if (record.d3 != null && _.indexOf(definition.dimension3, record.d3) < 0) {
                        definition.dimension3.push(record.d3);
                    }
                }
                if (page.data.length > 0)
                    paging.skip += take;
                else
                    reading = false;
                callback(null);
            });
        }, (err) => {
            let values = _.values(definitions);
            callback(err, values);
        });
    }
    getMetricDefinitions(correlationId, callback) {
        return this.getMetricDefinitionsWithName(correlationId, null, callback);
    }
    getMetricDefinitionByName(correlationId, name, callback) {
        this.getMetricDefinitionsWithName(correlationId, name, (err, items) => {
            callback(err, items.length > 0 ? items[0] : null);
        });
    }
    getMetricsByFilter(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            let timeHorizon = TimeHorizonConverter_1.TimeHorizonConverter.fromString(filter.getAsNullableString("time_horizon"));
            let fromIndex = TimeIndexComposer_1.TimeIndexComposer.composeFromIndexFromFilter(timeHorizon, filter);
            let toIndex = TimeIndexComposer_1.TimeIndexComposer.composeToIndexFromFilter(timeHorizon, filter);
            // Convert records into value sets
            let sets = {};
            for (let record of page.data) {
                // Generate index
                let id = record.name + "_" + (record.d1 || "")
                    + "_" + (record.d2 || "")
                    + "_" + (record.d3 || "");
                // Get or create value set
                let set = sets[id];
                if (set == null) {
                    set = {
                        name: record.name,
                        time_horizon: record.th,
                        dimension1: record.d1,
                        dimension2: record.d2,
                        dimension3: record.d3,
                        values: []
                    };
                    sets[id] = set;
                }
                for (let key in record.val) {
                    if (key < fromIndex || key > toIndex)
                        continue;
                    let value = new MetricValueV1_1.MetricValueV1();
                    TimeParser_1.TimeParser.parseTime(key, timeHorizon, value);
                    value.count = record.val[key].cnt;
                    value.sum = record.val[key].sum;
                    value.min = record.val[key].min;
                    value.max = record.val[key].max;
                    set.values.push(value);
                }
                ;
            }
            let total = page.total;
            let values = _.values(sets);
            callback(err, new pip_services3_commons_node_5.DataPage(values, total));
        });
    }
    updateMetric(correlationId, update, maxTimeHorizon, callback) {
        this._persistence.updateOne(correlationId, update, maxTimeHorizon, callback);
    }
    updateMetrics(correlationId, updates, maxTimeHorizon, callback) {
        this._persistence.updateMany(correlationId, updates, maxTimeHorizon, callback);
    }
}
exports.MetricsController = MetricsController;
//# sourceMappingURL=MetricsController.js.map
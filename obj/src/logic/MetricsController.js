"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const MetricsCommandSet_1 = require("./MetricsCommandSet");
const version1_1 = require("../data/version1");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const version1_2 = require("../data/version1");
const typescript_map_1 = require("typescript-map");
const util_1 = require("util");
const persistence_1 = require("../persistence");
const persistence_2 = require("../persistence");
const MetricValueSetV1_1 = require("../data/version1/MetricValueSetV1");
const MetricValueV1_1 = require("../data/version1/MetricValueV1");
const TimeParser_1 = require("../persistence/TimeParser");
class MetricsController {
    constructor() {
        this._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("dependencies.persistence", "metrics:persistence:*:*:1.0");
        this.component = version1_1.MetricsConstants.MetricsController;
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(this._defaultConfig);
    }
    setReferences(references) {
        this._persistence = references.getOneRequired(new pip_services3_commons_node_3.Descriptor('metrics', 'persistence', '*', '*', '1.0'));
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    getCommandSet() {
        if (this._commandSet == null) {
            this._commandSet = new MetricsCommandSet_1.MetricsCommandSet(this);
        }
        return this._commandSet;
    }
    getMetricDefinitionsName(correlationId, name, callback) {
        var filter = pip_services3_commons_node_4.FilterParams.fromTuples("name", name, "time_horizon", 0);
        var take = 500;
        var paging = new pip_services3_commons_node_5.PagingParams(0, take);
        var definitions = new typescript_map_1.TSMap();
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            let definition;
            page.data.forEach(function (record, index, arr) {
                definition = definitions.get(record.name);
                if (util_1.isUndefined(definition)) {
                    definition = new version1_2.MetricDefinitionV1();
                    definition.name = record.name,
                        definition.dimension1 = new Array(),
                        definition.dimension2 = new Array(),
                        definition.dimension3 = new Array();
                    definitions[record.name] = definition;
                }
                if (record.dimension1 != null && !(definition.dimension1.indexOf(record.dimension1) > 0))
                    definition.dimension1.push(record.dimension1);
                if (record.dimension2 != null && !(definition.dimension2.indexOf(record.dimension2) > 0))
                    definition.dimension2.push(record.dimension2);
                if (record.dimension3 != null && !(definition.dimension3.indexOf(record.dimension3) > 0))
                    definition.dimension3.push(record.dimension3);
            });
            callback(err, definitions.values());
        });
    }
    getMetricDefinitions(correlationId, callback) {
        return this.getMetricDefinitionsName(correlationId, null, callback);
    }
    getMetricDefinitionByName(correlationId, name, callback) {
        this.getMetricDefinitionsName(correlationId, name, (err, items) => {
            callback(err, items.length > 0 ? items[0] : null);
        });
    }
    updateMetric(correlationId, update, maxTimeHorizon) {
        this._persistence.updateOne(correlationId, update, maxTimeHorizon);
    }
    updateMetrics(correlationId, updates, maxTimeHorizon) {
        this._persistence.updateMany(correlationId, updates, maxTimeHorizon);
    }
    getMetricsByFilter(correlationId, filter, paging, callback) {
        var timeHorizon = persistence_1.TimeHorizonConverter.fromString(filter.getAsNullableString("time_horizon"));
        var fromIndex = persistence_2.TimeIndexComposer.composeFromIndexFromFilter(timeHorizon, filter);
        var toIndex = persistence_2.TimeIndexComposer.composeToIndexFromFilter(timeHorizon, filter);
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            // Convert records into value sets
            let sets = new typescript_map_1.TSMap();
            page.data.forEach(function (record, index, arr) {
                // Generate index
                let id = record.name + "_" + record.dimension1
                    + "_" + record.dimension2
                    + "_" + record.dimension3;
                // Get or create value set
                let set;
                set = sets.get(id);
                if (!util_1.isUndefined(set)) {
                    set = new MetricValueSetV1_1.MetricValueSetV1();
                    set.name = record.name;
                    set.timeHorizon = record.timeHorizon,
                        set.dimension1 = record.dimension1,
                        set.dimension2 = record.dimension2,
                        set.dimension3 = record.dimension3,
                        set.values = new Array();
                    sets[id] = set;
                }
                record.values.forEach(function (entry, key, arr) {
                    if (key.localeCompare(fromIndex) < 0 || key.localeCompare(toIndex) > 0)
                        return;
                    var value = new MetricValueV1_1.MetricValueV1();
                    TimeParser_1.TimeParser.parseTime(key, timeHorizon, value);
                    value.count = entry.count;
                    value.sum = entry.sum;
                    value.min = entry.min;
                    value.max = entry.max;
                    set.values.push(value);
                });
            });
            callback(err, new pip_services3_commons_node_6.DataPage(sets.values(), page.total));
        });
    }
}
exports.MetricsController = MetricsController;
//# sourceMappingURL=MetricsController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsCommandSet = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const pip_services3_commons_node_9 = require("pip-services3-commons-node");
const MetricUpdateV1Schema_1 = require("../data/version1/MetricUpdateV1Schema");
const TimeHorizonV1_1 = require("../data/version1/TimeHorizonV1");
class MetricsCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(controller) {
        super();
        this._controller = controller;
        this.addCommand(this.makeGetMetricDefinitionsCommand());
        this.addCommand(this.makeGetMetricDefinitionByNameCommand());
        this.addCommand(this.makeGetMetricsByFilterCommand());
        this.addCommand(this.makeUpdateMetricCommand());
        this.addCommand(this.makeUpdateMetricsCommand());
    }
    makeGetMetricDefinitionsCommand() {
        return new pip_services3_commons_node_2.Command("get_metric_definitions", new pip_services3_commons_node_3.ObjectSchema(), (correlationId, args, callback) => {
            this._controller.getMetricDefinitions(correlationId, callback);
        });
    }
    makeGetMetricDefinitionByNameCommand() {
        return new pip_services3_commons_node_2.Command("get_metric_definition_by_name", new pip_services3_commons_node_3.ObjectSchema()
            .withOptionalProperty("name", pip_services3_commons_node_8.TypeCode.String), (correlationId, args, callback) => {
            let name = args.getAsString("name");
            this._controller.getMetricDefinitionByName(correlationId, name, callback);
        });
    }
    makeGetMetricsByFilterCommand() {
        return new pip_services3_commons_node_2.Command("get_metrics_by_filter", new pip_services3_commons_node_3.ObjectSchema(true)
            .withOptionalProperty("filter", new pip_services3_commons_node_4.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services3_commons_node_5.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_6.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_7.PagingParams.fromValue(args.get("paging"));
            this._controller.getMetricsByFilter(correlationId, filter, paging, callback);
        });
    }
    makeUpdateMetricCommand() {
        return new pip_services3_commons_node_2.Command("update_metric", new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty("update", new MetricUpdateV1Schema_1.MetricUpdateV1Schema())
            .withOptionalProperty("max_time_horizon", pip_services3_commons_node_8.TypeCode.Long), (correlationId, args, callback) => {
            let update = args.getAsObject("update");
            let maxTimeHorizon = args.getAsIntegerWithDefault("max_time_horizon", TimeHorizonV1_1.TimeHorizonV1.Hour);
            this._controller.updateMetric(correlationId, update, maxTimeHorizon, (err) => {
                callback(err, null);
            });
        });
    }
    makeUpdateMetricsCommand() {
        return new pip_services3_commons_node_2.Command("update_metrics", new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty("updates", new pip_services3_commons_node_9.ArraySchema(new MetricUpdateV1Schema_1.MetricUpdateV1Schema()))
            .withOptionalProperty("max_time_horizon", pip_services3_commons_node_8.TypeCode.Long), (correlationId, args, callback) => {
            let updates = args.getAsArray("updates");
            let maxTimeHorizon = args.getAsIntegerWithDefault("max_time_horizon", TimeHorizonV1_1.TimeHorizonV1.Hour);
            this._controller.updateMetrics(correlationId, updates, maxTimeHorizon, (err) => {
                callback(err, null);
            });
        });
    }
}
exports.MetricsCommandSet = MetricsCommandSet;
//# sourceMappingURL=MetricsCommandSet.js.map
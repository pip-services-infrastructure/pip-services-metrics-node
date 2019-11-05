"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class MetricsHttpClientV1 extends pip_services3_rpc_node_1.CommandableHttpClient {
    constructor() {
        super("v1/metrics");
    }
    getMetricDefinitions(correlationId, callback) {
        this.callCommand("get_metric_definitions", correlationId, {}, callback);
    }
    getMetricDefinitionByName(correlationId, name, callback) {
        this.callCommand("get_metric_definition_by_name", correlationId, {
            name: name
        }, callback);
    }
    getMetricsByFilter(correlationId, filter, paging, callback) {
        this.callCommand("get_metrics_by_filter", correlationId, {
            filter: filter || new pip_services3_commons_node_1.FilterParams(),
            paging: paging || new pip_services3_commons_node_2.PagingParams()
        }, callback);
    }
    updateMetric(correlationId, update, maxTimeHorizon) {
        this.callCommand("update_metric", correlationId, {
            update: update,
            max_time_horizon: maxTimeHorizon
        }, null);
    }
    updateMetrics(correlationId, updates, maxTimeHorizon) {
        this.callCommand("update_metrics", correlationId, {
            updates: updates,
            max_time_horizon: maxTimeHorizon
        }, null);
    }
}
exports.MetricsHttpClientV1 = MetricsHttpClientV1;
//# sourceMappingURL=MetricsHttpClientV1.js.map
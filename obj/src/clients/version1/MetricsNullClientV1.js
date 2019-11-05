"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MetricsNullClientV1 {
    getMetricDefinitions(correlationId, callback) {
        callback(null, null);
    }
    getMetricDefinitionByName(correlationId, name, callback) {
        callback(null, null);
    }
    getMetricsByFilter(correlationId, filter, paging, callback) {
        callback(null, null);
    }
    updateMetric(correlationId, update, maxTimeHorizon) {
    }
    updateMetrics(correlationId, updates, maxTimeHorizon) {
    }
}
exports.MetricsNullClientV1 = MetricsNullClientV1;
//# sourceMappingURL=MetricsNullClientV1.js.map
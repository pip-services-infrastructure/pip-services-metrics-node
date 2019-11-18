"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_benchmark_node_1 = require("pip-benchmark-node");
const MetricsBenchmark_1 = require("./MetricsBenchmark");
let async = require('async');
class MetricsBenchmarkSuite extends pip_benchmark_node_1.BenchmarkSuite {
    constructor() {
        super("Metrics.Client", "Measures performance of Metrics client");
        this.addParameter(new pip_benchmark_node_1.Parameter("Initialize", "Initialize database", "false"));
        this.addParameter(new pip_benchmark_node_1.Parameter("StartTime", "Initialization start time", "2017-01-01T00:00:00Z"));
        this.addParameter(new pip_benchmark_node_1.Parameter("EndTime", "Initialization end time", "2018-09-01T00:00:00Z"));
        this.addParameter(new pip_benchmark_node_1.Parameter("ConnectionProtocol", "Connection protocol", "http"));
        this.addParameter(new pip_benchmark_node_1.Parameter("ConnectionHost", "Connection service host", "localhost"));
        this.addParameter(new pip_benchmark_node_1.Parameter("ConnectionPort", "Connection service port", "8080"));
        //this.createBenchmark("UpdateMetric", "Measures performance of updating metrics", this.BenchmarkUpdateMetric);
        this.addBenchmark(new MetricsBenchmark_1.MetricsBenchmark());
        //this.createBenchmark("ReadMultipleMetrics", "Measures performance of reading metric with multiple dimensions", this.BenchmarkReadMultipleMetrics);
    }
}
exports.MetricsBenchmarkSuite = MetricsBenchmarkSuite;
//# sourceMappingURL=MetricsBenchmarkSuite.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_benchmark_node_2 = require("pip-benchmark-node");
const UpdateMetricsBenchmark_1 = require("./UpdateMetricsBenchmark");
class MetricsBenchmarkSuite extends pip_benchmark_node_1.BenchmarkSuite {
    constructor() {
        super("Metrics", "Measures performance of Metrics components");
        this.addParameter(new pip_benchmark_node_2.Parameter('InitialRecordNumber', 'Number of records at start', '0'));
        this.addParameter(new pip_benchmark_node_2.Parameter('MetricNumber', 'Number of metrics', '100'));
        this.addParameter(new pip_benchmark_node_2.Parameter('DimensionNumber', 'Number of dimensions', '10'));
        this.addParameter(new pip_benchmark_node_2.Parameter('UpdateNumber', 'Number of updates', '10'));
        this.addParameter(new pip_benchmark_node_2.Parameter('MaxTimeHorizon', 'Maximum time horizon', '4'));
        this.addParameter(new pip_benchmark_node_2.Parameter('StartTime', 'Simulation start time', '2016-01-01T00:00:00.000Z'));
        this.addParameter(new pip_benchmark_node_2.Parameter('MongoUri', 'MongoDB URI', null));
        this.addParameter(new pip_benchmark_node_2.Parameter('MongoHost', 'MongoDB Hostname', 'localhost'));
        this.addParameter(new pip_benchmark_node_2.Parameter('MongoPort', 'MongoDB Port', '27017'));
        this.addParameter(new pip_benchmark_node_2.Parameter('MongoDb', 'MongoDB Database', 'benchmark'));
        //this.createBenchmark("UpdateMetric", "Measures performance of updating metrics", this.BenchmarkUpdateMetric);
        this.addBenchmark(new UpdateMetricsBenchmark_1.UpdateMetricsBenchmark());
        //this.createBenchmark("ReadMultipleMetrics", "Measures performance of reading metric with multiple dimensions", this.BenchmarkReadMultipleMetrics);
    }
}
exports.MetricsBenchmarkSuite = MetricsBenchmarkSuite;
//# sourceMappingURL=MetricsBenchmarkSuite.js.map
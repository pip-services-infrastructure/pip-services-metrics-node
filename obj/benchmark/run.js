"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let process = require('process');
let async = require('async');
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_benchmark_node_2 = require("pip-benchmark-node");
const pip_benchmark_node_3 = require("pip-benchmark-node");
const pip_benchmark_node_4 = require("pip-benchmark-node");
const MetricsBenchmarkSuite_1 = require("./MetricsBenchmarkSuite");
let runner = new pip_benchmark_node_1.BenchmarkRunner();
pip_benchmark_node_2.ConsoleEventPrinter.attach(runner);
let suite = new MetricsBenchmarkSuite_1.MetricsBenchmarkSuite();
runner.benchmarks.addSuite(suite);
runner.parameters.set({
    "Metrics.Client.Initialize": true,
    "Metrics.Client.StartTime": "2018-01-01T00:00:00Z",
    "Metrics.Client.EndTime": "2018-01-01T01:00:00Z",
    "Metrics.Client.ConnectionProtocol": process.env["METRICS_SERVICE_PROTO"] || "http",
    "Metrics.Client.ConnectionHost": process.env["METRICS_SERVICE_HOST"] || "localhost",
    "Metrics.Client.ConnectionPort": process.env["METRICS_SERVICE_PORT"] || "8080"
});
runner.configuration.measurementType = pip_benchmark_node_3.MeasurementType.Peak;
runner.configuration.executionType = pip_benchmark_node_4.ExecutionType.Sequential;
runner.configuration.duration = 10 * 24 * 3600;
//runner.configuration.numberOfThreads = 5;
//runner.benchmarks.selectByName(["Metrics.Client.UpdateMetric"]);
runner.benchmarks.selectByName(["Metrics.Client.ReadSingleMetric"]);
//runner.benchmarks.selectByName(["Metrics.Client.ReadMultipleMetrics"]);
runner.run((err) => {
    if (err)
        console.error(err);
});
// Log uncaught exceptions
process.on('uncaughtException', (ex) => {
    console.error(ex);
    console.error("Process is terminated");
    process.exit(1);
});
// Gracefully shutdown
process.on('exit', function () {
    runner.stop();
    //console.log("Goodbye!");
});
//# sourceMappingURL=run.js.map
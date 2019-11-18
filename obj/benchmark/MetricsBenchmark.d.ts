import { Benchmark } from "pip-benchmark-node";
export declare class MetricsBenchmark extends Benchmark {
    private _client;
    private _startTime;
    private _endTime;
    private static RestConfig;
    constructor();
    SetUp(): void;
    private PickRandom;
    private SendUpdate;
    private AddUpdate;
    private AddUpdates;
    private SendRequest;
    BenchmarkReadSingleMetric(): void;
    BenchmarkReadMultipleMetrics(): void;
    BenchmarkUpdateMetric(): void;
    execute(callback: (err: any) => void): void;
}

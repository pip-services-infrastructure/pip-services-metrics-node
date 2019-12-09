import { BenchmarkSuite } from 'pip-benchmark-node';
import { Parameter } from 'pip-benchmark-node';

import { UpdateMetricsBenchmark } from './UpdateMetricsBenchmark';

export class MetricsBenchmarkSuite extends BenchmarkSuite {

    public constructor() {
        super("Metrics", "Measures performance of Metrics components")

        this.addParameter(new Parameter('InitialRecordNumber', 'Number of records at start', '0'));
        this.addParameter(new Parameter('MetricNumber', 'Number of metrics', '100'));
        this.addParameter(new Parameter('DimensionNumber', 'Number of dimensions', '10'));
        this.addParameter(new Parameter('UpdateNumber', 'Number of updates', '10'));
        this.addParameter(new Parameter('MaxTimeHorizon', 'Maximum time horizon', '4'));
        this.addParameter(new Parameter('StartTime', 'Simulation start time', '2016-01-01T00:00:00.000Z'));

        this.addParameter(new Parameter('MongoUri', 'MongoDB URI', null));
        this.addParameter(new Parameter('MongoHost', 'MongoDB Hostname', 'localhost'));
        this.addParameter(new Parameter('MongoPort', 'MongoDB Port', '27017'));
        this.addParameter(new Parameter('MongoDb', 'MongoDB Database', 'benchmark'));

        //this.createBenchmark("UpdateMetric", "Measures performance of updating metrics", this.BenchmarkUpdateMetric);
        this.addBenchmark(new UpdateMetricsBenchmark());
        //this.createBenchmark("ReadMultipleMetrics", "Measures performance of reading metric with multiple dimensions", this.BenchmarkReadMultipleMetrics);
    }

}
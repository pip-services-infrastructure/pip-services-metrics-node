// import { BenchmarkSuite, Parameter } from 'pip-benchmark-node';

// import { ConfigParams, DateTimeConverter, RandomInteger, RandomFloat, RandomArray, RandomBoolean, FilterParams, PagingParams } from 'pip-services3-commons-node';
// import { IMetricsClientV1 } from '../src/clients/version1/IMetricsClientV1';
// import { MetricsHttpClientV1 } from '../src/clients/version1/MetricsHttpClientV1';
// import { Affiliates } from './Affiliates';
// import { Msos } from './Msos';
// import { Requests } from './Requests';
// import { Responses } from './Responses';
// import { Services } from './Services';
// import { Errors } from './Errors';
// import { StatusCodes } from './StatusCodes';
// import { MetricUpdateV1 } from '../src/data/version1/MetricUpdateV1';
// import { TimeHorizonV1 } from '../src';
// import { Metrics } from './Metrics';
// import { TimeHorizons } from './TimeHorizons';
// import { Reference } from './Reference';
// import { MetricsBenchmark } from './MetricsBenchmark';

// let async = require('async');

// export class MetricsBenchmarkSuite extends BenchmarkSuite {

//     public constructor() {
//         super("Metrics.Client", "Measures performance of Metrics client")

//         this.addParameter(new Parameter("Initialize", "Initialize database", "false"));
//         this.addParameter(new Parameter("StartTime", "Initialization start time", "2017-01-01T00:00:00Z"));
//         this.addParameter(new Parameter("EndTime", "Initialization end time", "2018-09-01T00:00:00Z"));
//         this.addParameter(new Parameter("ConnectionProtocol", "Connection protocol", "http"));
//         this.addParameter(new Parameter("ConnectionHost", "Connection service host", "localhost"));
//         this.addParameter(new Parameter("ConnectionPort", "Connection service port", "8080"));

//         //this.createBenchmark("UpdateMetric", "Measures performance of updating metrics", this.BenchmarkUpdateMetric);
//         this.addBenchmark(new MetricsBenchmark());
//         //this.createBenchmark("ReadMultipleMetrics", "Measures performance of reading metric with multiple dimensions", this.BenchmarkReadMultipleMetrics);
//     }

// }
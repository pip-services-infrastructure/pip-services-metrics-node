// import { Benchmark } from "pip-benchmark-node";
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
// let async = require('async');
// export class MetricsBenchmark extends Benchmark {
//     private _client: IMetricsClientV1;
//     private _startTime: Date = new Date(2017, 1, 1);
//     private _endTime: Date = new Date(2018, 8, 1);
//     private static RestConfig: ConfigParams = ConfigParams.fromTuples(
//         "connection.protocol", "http", // Environment.GetEnvironmentVariable("METRICS_SERVICE_PROTOCOL"),
//         "connection.host", "localhost", // Environment.GetEnvironmentVariable("METRICS_SERVICE_HOST"),
//         "connection.port", 8080 //  Environment.GetEnvironmentVariable("METRICS_SERVICE_PORT")
//     );
//     public constructor() {
//         super("ReadSingleMetric", "Measures performance of Metrics client")
//     }
//     public SetUp(): void {
//         var restConfig = ConfigParams.fromTuples(
//             "connection.protocol", context.arguments["ConnectionProtocol"].AsString,
//             "connection.host", context.arguments["ConnectionHost"].AsString,
//             "connection.port", context.arguments["ConnectionPort"].AsString
//         );
//         var restClient = new MetricsHttpClientV1();
//         restClient.configure(restConfig);
//         restClient.open("benchmark");
//         this._client = restClient;
//         //_client = new MetricsNullClientV1();
//         this._startTime = DateTimeConverter.toDateTime(context.arguments["StartTime"].AsString);
//         this._endTime = DateTimeConverter.toDateTime(context.arguments["EndTime"].AsString);
//         var init = context.arguments["Initialize"].AsBoolean;
//         var time: Date = this._startTime;
//         while (init && time < this._endTime) {
//             var totalCount = 100 * 10;
//             var count = 0;
//             var startTime = new Date();
//             //context.sendMessage($"Generating {totalCount} metrics for {time}");
//             for (var affiliate of Affiliates.All) //PickRandom(Affiliates.All, 100))
//             {
//                 //foreach (var mso in Msos.All) //PickRandom(Msos.All, 10))
//                 for (var index = 0; index < Msos.All.length; index += 5) {
//                     //SendUpdate(time, mso, affiliate);
//                     async.parallel([
//                         () => { if (index < Msos.All.length) this.SendUpdate(time, Msos.All[index], affiliate); },
//                         () => { if (index + 1 < Msos.All.length) this.SendUpdate(time, Msos.All[index + 1], affiliate); },
//                         () => { if (index + 2 < Msos.All.length) this.SendUpdate(time, Msos.All[index + 2], affiliate); },
//                         () => { if (index + 3 < Msos.All.length) this.SendUpdate(time, Msos.All[index + 3], affiliate); },
//                         () => { if (index + 4 < Msos.All.length) this.SendUpdate(time, Msos.All[index + 4], affiliate); }
//                     ]);
//                     count += 5;
//                     let percent: number;
//                     if (count % 100 == 0) {
//                         percent = count / totalCount;
//                         this.context.sendMessage("Processed " + percent + " metrics");
//                     }
//                 }
//             }
//             time = new Date(time.valueOf() + 1000 * 60 * 60);
//             var elapsedTime = new Date(new Date().valueOf() - startTime.valueOf());
//             this.context.sendMessage("Elapsed time " + elapsedTime.getSeconds() + " seconds");
//         }
//     }
//     private PickRandom(references: Reference[], count: number): Array<Reference> {
//         var result = new Array<Reference>();
//         while (result.length < count) {
//             var reference = RandomArray.pick(references);
//             let index = result.findIndex((val, i, arr) => {
//                 return reference.id == val.id;
//             });
//             if (index >= 0)
//                 result.push(reference);
//         }
//         return result;
//     }
//     private SendUpdate(time: Date, mso: Reference, affiliate: Reference): void {
//         var updates = new Array<MetricUpdateV1>();
//         var queries = RandomInteger.nextInteger(100);
//         var errors = queries * 100 / RandomInteger.nextInteger(3, 25);
//         // Generate requests
//         this.AddUpdate(updates, time, "req", mso, affiliate, "all", queries);
//         this.AddUpdates(updates, time, "req", mso, affiliate, Requests.All, queries);
//         // Generate responses
//         this.AddUpdates(updates, time, "res", mso, affiliate, Responses.All, queries);
//         // Generate services
//         this.AddUpdates(updates, time, "srv", mso, affiliate, Services.All, queries - errors);
//         // Generate errors
//         this.AddUpdates(updates, time, "err", mso, affiliate, Errors.All, errors);
//         // Generate statuses
//         this.AddUpdates(updates, time, "code", mso, affiliate, StatusCodes.All, errors);
//         // Send updates
//         try {
//             this._client.updateMetrics("benchmark", updates, TimeHorizonV1.Hour);
//         }
//         catch (ex) {
//             this.context.sendMessage("Failed to write to DB: " + ex.Message);
//         }
//     }
//     private AddUpdate(updates: Array<MetricUpdateV1>, time: Date, name: string,
//         dim1: Reference, dim2: Reference, dim3: string, value: number): void {
//         var update1 = <MetricUpdateV1>
//             {
//                 name: name,
//                 year: time.getFullYear(),
//                 month: time.getMonth(),
//                 day: time.getDay(),
//                 hour: time.getHours(),
//                 minute: time.getMinutes(),
//                 dimension1: dim1.id,
//                 dimension2: dim2.id,
//                 dimension3: dim3,
//                 value: value
//             };
//         updates.push(update1);
//         var update2 = <MetricUpdateV1>
//             {
//                 name: name,
//                 year: time.getFullYear(),
//                 month: time.getMonth(),
//                 day: time.getDay(),
//                 hour: time.getHours(),
//                 minute: time.getMinutes(),
//                 dimension1: "0",
//                 dimension2: dim2.id,
//                 dimension3: dim3,
//                 value: value
//             };
//         updates.push(update2);
//         var update3 = <MetricUpdateV1>
//             {
//                 name: name,
//                 year: time.getFullYear(),
//                 month: time.getMonth(),
//                 day: time.getDay(),
//                 hour: time.getHours(),
//                 minute: time.getMinutes(),
//                 dimension1: dim1.id,
//                 dimension2: "0",
//                 dimension3: dim3,
//                 value: value
//             };
//         updates.push(update3);
//         var update4 = <MetricUpdateV1>
//             {
//                 name: name,
//                 year: time.getFullYear(),
//                 month: time.getMonth(),
//                 day: time.getDay(),
//                 hour: time.getHours(),
//                 minute: time.getMinutes(),
//                 dimension1: "0",
//                 dimension2: "0",
//                 dimension3: dim3,
//                 value: value
//             };
//         updates.push(update4);
//     }
//     private AddUpdates(updates: Array<MetricUpdateV1>, time: Date, name: string,
//         dim1: Reference, dim2: Reference, dim3s: Array<Reference>, value: number): void {
//         var proportions = dim3s.length;
//         let proportionSum = 0;
//         for (var index = 0; index < dim3s.length; index++) {
//             var proportion = RandomFloat.nextFloat(100);
//             proportions[index] = proportion;
//             proportionSum += proportion;
//         }
//         for (var index = 0; index < dim3s.length; index++) {
//             this.AddUpdate(updates, time, name, dim1, dim2, dim3s[index].id, (value * proportions[index] / proportionSum));
//         }
//     }
//     private SendRequest(incomplete: boolean): void {
//         var name = RandomArray.pick(Metrics.All);
//         var timeHorizon = RandomArray.pick(TimeHorizons.All);
//         var hours = new Date(this._endTime.valueOf() - this._startTime.valueOf()).getHours();
//         var time = new Date(this._startTime.valueOf() + RandomInteger.nextInteger(hours) * 1000 * 60);
//         var dim1 = RandomArray.pick(Msos.All).id;
//         var dim2 = RandomArray.pick(Affiliates.All).id;
//         var dim3 = "";
//         if (name == "req")
//             dim3 = RandomArray.pick(Requests.All).id;
//         else if (name == "res")
//             dim3 = RandomArray.pick(Responses.All).id;
//         else if (name == "err")
//             dim3 = RandomArray.pick(Errors.All).id;
//         else if (name == "code")
//             dim3 = RandomArray.pick(StatusCodes.All).id;
//         else if (name == "srv")
//             dim3 = RandomArray.pick(Services.All).id;
//         if (incomplete) {
//             if (RandomBoolean.chance(1, 3))
//                 dim1 = null;
//             else if (RandomBoolean.chance(1, 2))
//                 dim2 = null;
//             else
//                 dim3 = null;
//         }
//         var filter = FilterParams.fromTuples(
//             "name", name,
//             "time_horizon", timeHorizon,
//             "from_year", time.getFullYear(),
//             "from_month", time.getMonth(),
//             "from_day", time.getDay(),
//             "from_hour", time.getHours(),
//             "from_minute", time.getMinutes(),
//             "to_year", time.getFullYear(),
//             "to_month", time.getMonth(),
//             "to_day", time.getDay(),
//             "to_hour", time.getHours(),
//             "to_minute", time.getMinutes(),
//             "dimension4", null
//         );
//         if (!dim1)
//             filter.setAsObject("dimension1", dim1);
//         if (!dim2)
//             filter.setAsObject("dimension2", dim2);
//         if (!dim3)
//             filter.setAsObject("dimension3", dim3);
//         this._client.getMetricsByFilter("benchmark", filter, new PagingParams(), (err, page) => {
//         });
//     }
//     public BenchmarkReadSingleMetric(): void {
//         this.SendRequest(false);
//     }
//     public BenchmarkReadMultipleMetrics(): void {
//         this.SendRequest(true);
//     }
//     public BenchmarkUpdateMetric(): void {
//         var mso = RandomArray.pick(Msos.All);
//         var affiliate = RandomArray.pick(Affiliates.All);
//         var hours = new Date(this._endTime.valueOf() - this._startTime.valueOf()).getHours();
//         var time = new Date(this._startTime.valueOf() + RandomInteger.nextInteger(hours) * 1000 * 60);
//         this.SendUpdate(time, mso, affiliate);
//     }
//     public execute(callback: (err: any) => void): void {
//         this.BenchmarkReadSingleMetric();
//         callback(null);
//     }
// }
//# sourceMappingURL=MetricsBenchmark.js.map
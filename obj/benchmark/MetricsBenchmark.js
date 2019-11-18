"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const MetricsHttpClientV1_1 = require("../src/clients/version1/MetricsHttpClientV1");
const Affiliates_1 = require("./Affiliates");
const Msos_1 = require("./Msos");
const Requests_1 = require("./Requests");
const Responses_1 = require("./Responses");
const Services_1 = require("./Services");
const Errors_1 = require("./Errors");
const StatusCodes_1 = require("./StatusCodes");
const src_1 = require("../src");
const Metrics_1 = require("./Metrics");
const TimeHorizons_1 = require("./TimeHorizons");
let async = require('async');
class MetricsBenchmark extends pip_benchmark_node_1.Benchmark {
    constructor() {
        super("ReadSingleMetric", "Measures performance of Metrics client");
        this._startTime = new Date(2017, 1, 1);
        this._endTime = new Date(2018, 8, 1);
    }
    SetUp() {
        var restConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("connection.protocol", context.arguments["ConnectionProtocol"].AsString, "connection.host", context.arguments["ConnectionHost"].AsString, "connection.port", context.arguments["ConnectionPort"].AsString);
        var restClient = new MetricsHttpClientV1_1.MetricsHttpClientV1();
        restClient.configure(restConfig);
        restClient.open("benchmark");
        this._client = restClient;
        //_client = new MetricsNullClientV1();
        this._startTime = pip_services3_commons_node_1.DateTimeConverter.toDateTime(context.arguments["StartTime"].AsString);
        this._endTime = pip_services3_commons_node_1.DateTimeConverter.toDateTime(context.arguments["EndTime"].AsString);
        var init = context.arguments["Initialize"].AsBoolean;
        var time = this._startTime;
        while (init && time < this._endTime) {
            var totalCount = 100 * 10;
            var count = 0;
            var startTime = new Date();
            //context.sendMessage($"Generating {totalCount} metrics for {time}");
            for (var affiliate of Affiliates_1.Affiliates.All) //PickRandom(Affiliates.All, 100))
             {
                //foreach (var mso in Msos.All) //PickRandom(Msos.All, 10))
                for (var index = 0; index < Msos_1.Msos.All.length; index += 5) {
                    //SendUpdate(time, mso, affiliate);
                    async.parallel([
                        () => { if (index < Msos_1.Msos.All.length)
                            this.SendUpdate(time, Msos_1.Msos.All[index], affiliate); },
                        () => { if (index + 1 < Msos_1.Msos.All.length)
                            this.SendUpdate(time, Msos_1.Msos.All[index + 1], affiliate); },
                        () => { if (index + 2 < Msos_1.Msos.All.length)
                            this.SendUpdate(time, Msos_1.Msos.All[index + 2], affiliate); },
                        () => { if (index + 3 < Msos_1.Msos.All.length)
                            this.SendUpdate(time, Msos_1.Msos.All[index + 3], affiliate); },
                        () => { if (index + 4 < Msos_1.Msos.All.length)
                            this.SendUpdate(time, Msos_1.Msos.All[index + 4], affiliate); }
                    ]);
                    count += 5;
                    let percent;
                    if (count % 100 == 0) {
                        percent = count / totalCount;
                        this.context.sendMessage("Processed " + percent + " metrics");
                    }
                }
            }
            time = new Date(time.valueOf() + 1000 * 60 * 60);
            var elapsedTime = new Date(new Date().valueOf() - startTime.valueOf());
            this.context.sendMessage("Elapsed time " + elapsedTime.getSeconds() + " seconds");
        }
    }
    PickRandom(references, count) {
        var result = new Array();
        while (result.length < count) {
            var reference = pip_services3_commons_node_1.RandomArray.pick(references);
            let index = result.findIndex((val, i, arr) => {
                return reference.id == val.id;
            });
            if (index >= 0)
                result.push(reference);
        }
        return result;
    }
    SendUpdate(time, mso, affiliate) {
        var updates = new Array();
        var queries = pip_services3_commons_node_1.RandomInteger.nextInteger(100);
        var errors = queries * 100 / pip_services3_commons_node_1.RandomInteger.nextInteger(3, 25);
        // Generate requests
        this.AddUpdate(updates, time, "req", mso, affiliate, "all", queries);
        this.AddUpdates(updates, time, "req", mso, affiliate, Requests_1.Requests.All, queries);
        // Generate responses
        this.AddUpdates(updates, time, "res", mso, affiliate, Responses_1.Responses.All, queries);
        // Generate services
        this.AddUpdates(updates, time, "srv", mso, affiliate, Services_1.Services.All, queries - errors);
        // Generate errors
        this.AddUpdates(updates, time, "err", mso, affiliate, Errors_1.Errors.All, errors);
        // Generate statuses
        this.AddUpdates(updates, time, "code", mso, affiliate, StatusCodes_1.StatusCodes.All, errors);
        // Send updates
        try {
            this._client.updateMetrics("benchmark", updates, src_1.TimeHorizonV1.Hour);
        }
        catch (ex) {
            this.context.sendMessage("Failed to write to DB: " + ex.Message);
        }
    }
    AddUpdate(updates, time, name, dim1, dim2, dim3, value) {
        var update1 = {
            name: name,
            year: time.getFullYear(),
            month: time.getMonth(),
            day: time.getDay(),
            hour: time.getHours(),
            minute: time.getMinutes(),
            dimension1: dim1.id,
            dimension2: dim2.id,
            dimension3: dim3,
            value: value
        };
        updates.push(update1);
        var update2 = {
            name: name,
            year: time.getFullYear(),
            month: time.getMonth(),
            day: time.getDay(),
            hour: time.getHours(),
            minute: time.getMinutes(),
            dimension1: "0",
            dimension2: dim2.id,
            dimension3: dim3,
            value: value
        };
        updates.push(update2);
        var update3 = {
            name: name,
            year: time.getFullYear(),
            month: time.getMonth(),
            day: time.getDay(),
            hour: time.getHours(),
            minute: time.getMinutes(),
            dimension1: dim1.id,
            dimension2: "0",
            dimension3: dim3,
            value: value
        };
        updates.push(update3);
        var update4 = {
            name: name,
            year: time.getFullYear(),
            month: time.getMonth(),
            day: time.getDay(),
            hour: time.getHours(),
            minute: time.getMinutes(),
            dimension1: "0",
            dimension2: "0",
            dimension3: dim3,
            value: value
        };
        updates.push(update4);
    }
    AddUpdates(updates, time, name, dim1, dim2, dim3s, value) {
        var proportions = dim3s.length;
        let proportionSum = 0;
        for (var index = 0; index < dim3s.length; index++) {
            var proportion = pip_services3_commons_node_1.RandomFloat.nextFloat(100);
            proportions[index] = proportion;
            proportionSum += proportion;
        }
        for (var index = 0; index < dim3s.length; index++) {
            this.AddUpdate(updates, time, name, dim1, dim2, dim3s[index].id, (value * proportions[index] / proportionSum));
        }
    }
    SendRequest(incomplete) {
        var name = pip_services3_commons_node_1.RandomArray.pick(Metrics_1.Metrics.All);
        var timeHorizon = pip_services3_commons_node_1.RandomArray.pick(TimeHorizons_1.TimeHorizons.All);
        var hours = new Date(this._endTime.valueOf() - this._startTime.valueOf()).getHours();
        var time = new Date(this._startTime.valueOf() + pip_services3_commons_node_1.RandomInteger.nextInteger(hours) * 1000 * 60);
        var dim1 = pip_services3_commons_node_1.RandomArray.pick(Msos_1.Msos.All).id;
        var dim2 = pip_services3_commons_node_1.RandomArray.pick(Affiliates_1.Affiliates.All).id;
        var dim3 = "";
        if (name == "req")
            dim3 = pip_services3_commons_node_1.RandomArray.pick(Requests_1.Requests.All).id;
        else if (name == "res")
            dim3 = pip_services3_commons_node_1.RandomArray.pick(Responses_1.Responses.All).id;
        else if (name == "err")
            dim3 = pip_services3_commons_node_1.RandomArray.pick(Errors_1.Errors.All).id;
        else if (name == "code")
            dim3 = pip_services3_commons_node_1.RandomArray.pick(StatusCodes_1.StatusCodes.All).id;
        else if (name == "srv")
            dim3 = pip_services3_commons_node_1.RandomArray.pick(Services_1.Services.All).id;
        if (incomplete) {
            if (pip_services3_commons_node_1.RandomBoolean.chance(1, 3))
                dim1 = null;
            else if (pip_services3_commons_node_1.RandomBoolean.chance(1, 2))
                dim2 = null;
            else
                dim3 = null;
        }
        var filter = pip_services3_commons_node_1.FilterParams.fromTuples("name", name, "time_horizon", timeHorizon, "from_year", time.getFullYear(), "from_month", time.getMonth(), "from_day", time.getDay(), "from_hour", time.getHours(), "from_minute", time.getMinutes(), "to_year", time.getFullYear(), "to_month", time.getMonth(), "to_day", time.getDay(), "to_hour", time.getHours(), "to_minute", time.getMinutes(), "dimension4", null);
        if (!dim1)
            filter.setAsObject("dimension1", dim1);
        if (!dim2)
            filter.setAsObject("dimension2", dim2);
        if (!dim3)
            filter.setAsObject("dimension3", dim3);
        this._client.getMetricsByFilter("benchmark", filter, new pip_services3_commons_node_1.PagingParams(), (err, page) => {
        });
    }
    BenchmarkReadSingleMetric() {
        this.SendRequest(false);
    }
    BenchmarkReadMultipleMetrics() {
        this.SendRequest(true);
    }
    BenchmarkUpdateMetric() {
        var mso = pip_services3_commons_node_1.RandomArray.pick(Msos_1.Msos.All);
        var affiliate = pip_services3_commons_node_1.RandomArray.pick(Affiliates_1.Affiliates.All);
        var hours = new Date(this._endTime.valueOf() - this._startTime.valueOf()).getHours();
        var time = new Date(this._startTime.valueOf() + pip_services3_commons_node_1.RandomInteger.nextInteger(hours) * 1000 * 60);
        this.SendUpdate(time, mso, affiliate);
    }
    execute(callback) {
        this.BenchmarkReadSingleMetric();
        callback(null);
    }
}
exports.MetricsBenchmark = MetricsBenchmark;
MetricsBenchmark.RestConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("connection.protocol", "http", // Environment.GetEnvironmentVariable("METRICS_SERVICE_PROTOCOL"),
"connection.host", "localhost", // Environment.GetEnvironmentVariable("METRICS_SERVICE_HOST"),
"connection.port", 8080 //  Environment.GetEnvironmentVariable("METRICS_SERVICE_PORT")
);
//# sourceMappingURL=MetricsBenchmark.js.map
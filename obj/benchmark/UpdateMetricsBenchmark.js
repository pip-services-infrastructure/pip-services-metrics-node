"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const MetricsMongoDbPersistence_1 = require("../src/persistence/MetricsMongoDbPersistence");
const MetricsController_1 = require("../src/logic/MetricsController");
class UpdateMetricsBenchmark extends pip_benchmark_node_1.Benchmark {
    constructor() {
        super("UpdateMetricsBenchmark", "Measures performance of updating metrics in MongoDB database");
    }
    setUp(callback) {
        this._initialRecordNumber = this.context.parameters.InitialRecordNumber.getAsInteger();
        this._metricNumber = this.context.parameters.MetricNumber.getAsInteger();
        this._dimensionNumber = this.context.parameters.DimensionNumber.getAsInteger();
        this._updateNumber = this.context.parameters.UpdateNumber.getAsInteger();
        this._maxTimeHorizon = this.context.parameters.MaxTimeHorizon.getAsInteger();
        this._startTime = pip_services3_commons_node_1.DateTimeConverter.toDateTime(this.context.parameters.StartTime.getAsString());
        this._time = this._startTime;
        let mongoUri = this.context.parameters.MongoUri.getAsString();
        let mongoHost = this.context.parameters.MongoHost.getAsString();
        let mongoPort = this.context.parameters.MongoPort.getAsInteger();
        let mongoDb = this.context.parameters.MongoDb.getAsString();
        this._persistence = new MetricsMongoDbPersistence_1.MetricsMongoDbPersistence();
        this._persistence.configure(pip_services3_commons_node_2.ConfigParams.fromTuples('connection.uri', mongoUri, 'connection.host', mongoHost, 'connection.port', mongoPort, 'connection.database', mongoDb));
        this._controller = new MetricsController_1.MetricsController();
        this._controller.configure(pip_services3_commons_node_2.ConfigParams.fromTuples('options.interval', 5 // Set interval to 5 mins
        ));
        let references = pip_services3_commons_node_4.References.fromTuples(new pip_services3_commons_node_3.Descriptor('pip-services-metrics', 'persistence', 'mongodb', 'default', '1.0'), this._persistence, new pip_services3_commons_node_3.Descriptor('pip-services-metrics', 'controller', 'default', 'default', '1.0'), this._controller);
        this._controller.setReferences(references);
        this._persistence.open(null, (err) => {
            if (err == null)
                this.context.sendMessage('Connected to mongodb database');
            callback(err);
        });
    }
    tearDown(callback) {
        this._persistence.close(null, (err) => {
            this.context.sendMessage('Disconnected from mongodb database');
            callback(err);
        });
        this._persistence = null;
        this._controller = null;
    }
    getRandomMetric() {
        return "metric" + Math.trunc(Math.random() * this._metricNumber + 1);
    }
    getRandomDimension() {
        return "dim" + Math.trunc(Math.random() * this._dimensionNumber + 1);
    }
    getRandomUpdate() {
        return {
            name: this.getRandomMetric(),
            year: this._time.getFullYear(),
            month: this._time.getMonth(),
            day: this._time.getDate(),
            hour: this._time.getHours(),
            minute: this._time.getMinutes(),
            dimension1: this.getRandomDimension(),
            dimension2: this.getRandomDimension(),
            dimension3: this.getRandomDimension(),
            value: Math.random() * 100
        };
    }
    getRandomUpdates() {
        let updates = [];
        for (let i = 0; i < this._updateNumber; i++)
            updates[i] = this.getRandomUpdate();
        return updates;
    }
    execute(callback) {
        let updates = this.getRandomUpdates();
        this._controller.updateMetrics(null, updates, this._maxTimeHorizon, callback);
    }
}
exports.UpdateMetricsBenchmark = UpdateMetricsBenchmark;
//# sourceMappingURL=UpdateMetricsBenchmark.js.map
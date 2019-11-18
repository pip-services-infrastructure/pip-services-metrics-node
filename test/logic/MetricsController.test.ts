let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { MetricsMemoryPersistence } from '../../src/persistence/MetricsMemoryPersistence';
import { MetricsController } from '../../src/logic/MetricsController';
import { MetricUpdateV1 } from '../../src/data/version1/MetricUpdateV1';
import { TimeHorizonV1 } from '../../src/data/version1/TimeHorizonV1';
import { MetricValueSetV1 } from '../../src/data/version1/MetricValueSetV1';
import { MetricDefinitionV1 } from '../../src/data/version1/MetricDefinitionV1';

suite('MetricsControllerTest', () => {
    let persistence: MetricsMemoryPersistence;
    let controller: MetricsController;

    setup((done) => {
        persistence = new MetricsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new MetricsController();
        controller.configure(new ConfigParams());

        let references = References.fromTuples(
            new Descriptor('pip-services-metrics', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-metrics', 'controller', 'default', 'default', '1.0'), controller
        );

        controller.setReferences(references);

        persistence.open(null, done);
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('TestMetrics', (done) => {

        async.series([
            // Update metric once
            (callback) => {
                let metric1 = new MetricUpdateV1();

                metric1.name = "metric1";
                metric1.dimension1 = "A";
                metric1.dimension2 = "B";
                metric1.dimension3 = null;
                metric1.year = 2018;
                metric1.month = 8;
                metric1.day = 26;
                metric1.hour = 12;
                metric1.value = 123;
                controller.updateMetric(null, metric1, TimeHorizonV1.Hour);

                // Update metric second time
                let metric2 = new MetricUpdateV1();

                metric2.name = "metric1";
                metric2.dimension1 = "A";
                metric2.dimension2 = "B";
                metric2.dimension3 = null;
                metric2.year = 2018;
                metric2.month = 8;
                metric2.day = 26;
                metric2.hour = 13;
                metric2.value = 321;

                let metricsUpdate = new Array<MetricUpdateV1>();
                metricsUpdate.push(metric2);
                controller.updateMetrics(null, metricsUpdate, TimeHorizonV1.Hour);
                callback();
            },
            (callback) => {
                // Get total metric
                controller.getMetricsByFilter(null,
                    FilterParams.fromTuples("name", "metric1"),
                    new PagingParams(), (err, page) => {

                        assert.isObject(page);
                        assert.equal(1, page.data.length);
                        let set: MetricValueSetV1;
                        set = page.data[0];
                        assert.equal("metric1", set.name);
                        assert.equal(TimeHorizonV1.Total, set.timeHorizon);
                        assert.equal("A", set.dimension1);
                        assert.equal("B", set.dimension2);
                        assert.isNull(set.dimension3);
                        assert.equal(1, set.values.length); 
                        let value = set.values[0];
                        assert.equal(444, value.sum);
                        assert.equal(123, value.min);
                        assert.equal(321, value.max);
                        assert.equal(2, value.count);

                        callback(err);
                    });
            },
            (callback) => {
                // Get hour metric
                let set: MetricValueSetV1;
                controller.getMetricsByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric1",
                        "time_horizon", "hour",
                        "from_year", 2018,
                        "from_month", 8,
                        "from_day", 26,
                        "from_hour", 0,
                        "to_year", 2018,
                        "to_month", 8,
                        "to_day", 26,
                        "to_hour", 23
                    ), new PagingParams(), (err, page) => {

                        assert.equal(1, page.data.length);
                        set = page.data[0];
                        assert.equal("metric1", set.name);
                        assert.equal(TimeHorizonV1.Hour, set.timeHorizon);
                        assert.equal("A", set.dimension1);
                        assert.equal("B", set.dimension2);
                        assert.isNull(set.dimension3);

                        assert.equal(2, set.values.length);
                        let value = set.values[0];
                        assert.equal(2018, value.year);
                        assert.equal(8, value.month);
                        assert.equal(26, value.day);
                        assert.equal(12, value.hour);
                        assert.equal(123, value.sum);
                        assert.equal(123, value.min);
                        assert.equal(123, value.max);
                        assert.equal(1, value.count);

                        value = set.values[1];
                        assert.equal(2018, value.year);
                        assert.equal(8, value.month);
                        assert.equal(26, value.day);
                        assert.equal(13, value.hour);
                        assert.equal(321, value.sum);
                        assert.equal(321, value.min);
                        assert.equal(321, value.max);
                        assert.equal(1, value.count);
                        callback(err);
                    });
            }

        ], done);
    });

    test('TestDefinitions', (done) => {

        async.series([
            // Update metric once
            (callback) => {
                let metric1 = new MetricUpdateV1();

                metric1.name = "metric2";
                metric1.dimension1 = "A";
                metric1.dimension2 = "B";
                metric1.dimension3 = null;
                metric1.year = 2018;
                metric1.month = 8;
                metric1.day = 26;
                metric1.hour = 12;
                metric1.value = 123;

                let metric2 = new MetricUpdateV1()

                metric2.name = "metric2";
                metric2.dimension1 = "A";
                metric2.dimension2 = "C";
                metric2.dimension3 = null;
                metric2.year = 2018;
                metric2.month = 8;
                metric2.day = 26;
                metric2.hour = 13;
                metric2.value = 321;

                let updateMetrics = new Array<MetricUpdateV1>();
                updateMetrics.push(metric1, metric2);
        
                // Update metric second time
                 controller.updateMetrics(null, updateMetrics, TimeHorizonV1.Hour);
                callback();
            },
            (callback) => {
                // Get all definitions
                 controller.getMetricDefinitions(null, (err, definitions) => {
                    assert.equal(1, definitions.length);
                    var definition:MetricDefinitionV1;
                    definition = definitions[0];
                    assert.equal("metric2", definition.name);
                    assert.equal(1,definition.dimension1.length);
                    assert.equal("A", definition.dimension1[0]);
                    assert.equal(2, definition.dimension2.length);
                    assert.equal("B", definition.dimension2[0]);
                    assert.equal("C", definition.dimension2[1]);
                    assert.empty(definition.dimension3);
                    callback(err);

                });
            },
            (callback) => {
                // Get a single definition
                 controller.getMetricDefinitionByName(null, "metric2", (err, definition)=>{
                    assert.equal("metric2", definition.name);
                    callback(err);
                });
                
            }

        ], done);
    });

});
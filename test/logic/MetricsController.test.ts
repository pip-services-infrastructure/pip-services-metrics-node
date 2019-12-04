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
                controller.updateMetric(
                    null,
                    <MetricUpdateV1> {
                        name: "metric1",
                        dimension1: "A",
                        dimension2: "B",
                        dimension3: null,
                        year: 2018,
                        month: 8,
                        day: 26,
                        hour: 12,
                        value: 123
                    },
                    TimeHorizonV1.Hour,
                    callback
                );
            },
            // Update metric second time
            (callback) => {
                controller.updateMetrics(
                    null,
                    [
                        <MetricUpdateV1> {
                            name: "metric1",
                            dimension1: "A",
                            dimension2: "B",
                            dimension3: null,
                            year: 2018,
                            month: 8,
                            day: 26,
                            hour: 13,
                            value: 321
                        }        
                    ],
                    TimeHorizonV1.Hour,
                    callback
                );
            },
            // Get total metric
            (callback) => {
                controller.getMetricsByFilter(null,
                    FilterParams.fromTuples("name", "metric1"),
                    new PagingParams(),
                    (err, page) => {
                        assert.isObject(page);
                        assert.equal(1, page.data.length);

                        let set: MetricValueSetV1;
                        set = page.data[0];
                        assert.equal("metric1", set.name);
                        assert.equal(TimeHorizonV1.Total, set.time_horizon);
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
                    }
                );
            },
            // Get hour metric
            (callback) => {
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
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.equal(1, page.data.length);
                        set = page.data[0];
                        assert.equal("metric1", set.name);
                        assert.equal(TimeHorizonV1.Hour, set.time_horizon);
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
                    }
                );
            }

        ], done);
    });

    test('TestDefinitions', (done) => {
        async.series([
            // Update metric once
            (callback) => {        
                // Update metric second time
                controller.updateMetrics(
                    null,
                    [
                        <MetricUpdateV1> {
                            name: "metric2",
                            dimension1: "A",
                            dimension2: "B",
                            dimension3: null,
                            year: 2018,
                            month: 8,
                            day: 26,
                            hour: 12,
                            value: 123    
                        },
                        <MetricUpdateV1> {
                            name: "metric2",
                            dimension1: "A",
                            dimension2: "C",
                            dimension3: null,
                            year: 2018,
                            month: 8,
                            day: 26,
                            hour: 13,
                            value: 321
                        }                
                    ],
                    TimeHorizonV1.Hour,
                    callback
                );
            },
            (callback) => {
                // Get all definitions
                 controller.getMetricDefinitions(
                     null, 
                     (err, definitions) => {
                        assert.equal(1, definitions.length);

                        let definition: MetricDefinitionV1 = definitions[0];
                        assert.equal("metric2", definition.name);
                        assert.equal(1,definition.dimension1.length);
                        assert.equal("A", definition.dimension1[0]);
                        assert.equal(2, definition.dimension2.length);
                        assert.equal("B", definition.dimension2[0]);
                        assert.equal("C", definition.dimension2[1]);
                        assert.empty(definition.dimension3);

                        callback(err);
                    }
                );
            },
            (callback) => {
                // Get a single definition
                 controller.getMetricDefinitionByName(
                     null,
                     "metric2",
                     (err, definition) => {
                        assert.equal("metric2", definition.name);
                        callback(err);
                    }
                );                
            }

        ], done);
    });

});
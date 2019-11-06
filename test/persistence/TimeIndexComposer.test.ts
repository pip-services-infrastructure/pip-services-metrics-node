let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { TimeIndexComposer } from '../../src/persistence/TimeIndexComposer';
import { TimeHorizonV1 } from '../../src/data/version1/TimeHorizonV1';
import { MetricUpdateV1 } from '../../src/data/version1/MetricUpdateV1';
import { FilterParams } from 'pip-services3-commons-node';

suite('TimeIndexComposerTest', () => {

    setup((done) => {
        done();
    });

    teardown((done) => {
        done();
    });

    test('TestComposeIndex', (done) => {
        let index;
        async.series([

            (callback) => {
                index = TimeIndexComposer.composeIndex(TimeHorizonV1.Total, 2018, 8, 26, 14, 33);
                assert.equal("total", index);

                index = TimeIndexComposer.composeIndex(TimeHorizonV1.Year, 2018, 8, 26, 14, 33);
                assert.equal("2018", index);

                index = TimeIndexComposer.composeIndex(TimeHorizonV1.Month, 2018, 8, 26, 14, 33);
                assert.equal("201808", index);

                index = TimeIndexComposer.composeIndex(TimeHorizonV1.Day, 2018, 8, 26, 14, 33);
                assert.equal("20180826", index);

                index = TimeIndexComposer.composeIndex(TimeHorizonV1.Hour, 2018, 8, 26, 14, 33);
                assert.equal("2018082614", index);

                index = TimeIndexComposer.composeIndex(TimeHorizonV1.Minute, 2018, 8, 26, 14, 33);
                assert.equal("201808261433", index);
                callback();
            }
        ], done);
    });

    test('TestComposeIndexFromUpdate', (done) => {
        let index;

        async.series([

            (callback) => {
                let update = new MetricUpdateV1();

                update.name = "test";
                update.year = 2018;
                update.month = 8;
                update.day = 26;
                update.hour = 14;
                update.minute = 30;
                update.value = 123;

                index = TimeIndexComposer.composeIndexFromUpdate(TimeHorizonV1.Total, update);
                assert.equal("total", index);

                index = TimeIndexComposer.composeIndexFromUpdate(TimeHorizonV1.Minute, update);
                assert.equal("201808261430", index);
                callback();
            }
        ], done);
    });

    test('TestComposeFromIndexFromFilter', (done) => {
        let index;

        async.series([

            (callback) => {
                var filter = FilterParams.fromTuples(
                    "name", "test",
                    "time_horizon", "total"
                );
                index = TimeIndexComposer.composeFromIndexFromFilter(TimeHorizonV1.Total, filter);
                assert.equal("total", index);
    
                filter = FilterParams.fromTuples(
                    "name", "test",
                    "time_horizon", "hour",
                    "from_year", 2018,
                    "from_month", 8,
                    "from_day", 26,
                    "from_hour", 14,
                    "from_minute", 30
                );
                index = TimeIndexComposer.composeFromIndexFromFilter(TimeHorizonV1.Minute, filter);
                assert.equal("201808261430", index);
                callback();
            }
        ], done);
    });

    test('TestComposeToIndexFromFilter', (done) => {
        let index;

        async.series([

            (callback) => {
                var filter = FilterParams.fromTuples(
                    "name", "test",
                    "time_horizon", "total"
                );
                index = TimeIndexComposer.composeToIndexFromFilter(TimeHorizonV1.Total, filter);
                assert.equal("total", index);
    
                filter = FilterParams.fromTuples(
                    "name", "test",
                    "time_horizon", "hour",
                    "to_year", 2018,
                    "to_month", 8,
                    "to_day", 26,
                    "to_hour", 14,
                    "to_minute", 30
                );
                index = TimeIndexComposer.composeToIndexFromFilter(TimeHorizonV1.Minute, filter);
                assert.equal("201808261430", index);
                callback();
            }
        ], done);
    });
});

let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { TimeRangeComposer } from '../../src/persistence/TimeRangeComposer';
import { TimeHorizonV1 } from '../../src/data/version1/TimeHorizonV1';
import { MetricUpdateV1 } from '../../src/data/version1/MetricUpdateV1';
import { FilterParams } from 'pip-services3-commons-node';

suite('TimeRangeComposerTest', () => {

    setup((done) => {
        done();
    });

    teardown((done) => {
        done();
    });

    test('TestComposeRange', (done) => {
        let range;

        async.series([

            (callback) => {
                range = TimeRangeComposer.composeRange(TimeHorizonV1.Total, 2018, 8, 26, 14, 33);
                assert.equal(0, range);

                range = TimeRangeComposer.composeRange(TimeHorizonV1.Year, 2018, 8, 26, 14, 33);
                assert.equal(0, range);

                range = TimeRangeComposer.composeRange(TimeHorizonV1.Month, 2018, 8, 26, 14, 33);
                assert.equal(2018, range);

                range = TimeRangeComposer.composeRange(TimeHorizonV1.Day, 2018, 8, 26, 14, 33);
                assert.equal(2018, range);

                range = TimeRangeComposer.composeRange(TimeHorizonV1.Hour, 2018, 8, 26, 14, 33);
                assert.equal(201808, range);

                range = TimeRangeComposer.composeRange(TimeHorizonV1.Minute, 2018, 8, 26, 14, 33);
                assert.equal(201808, range);
                callback();
            }
        ], done);
    });

    test('TestComposeRangeFromUpdate', (done) => {
        let range;

        async.series([

            (callback) => {
                var update = new MetricUpdateV1();
                update.name = "test";
                update.year = 2018;
                update.month = 8;
                update.day = 26;
                update.hour = 14;
                update.minute = 33;
                update.value = 123;

                range = TimeRangeComposer.composeRangeFromUpdate(TimeHorizonV1.Total, update);
                assert.equal(0, range);

                range = TimeRangeComposer.composeRangeFromUpdate(TimeHorizonV1.Hour, update);
                assert.equal(201808, range);
                callback();
            }
        ], done);
    });

    test('TestComposeFromRangeFromFilter', (done) => {
        let range;

        async.series([

            (callback) => {
                let filter = FilterParams.fromTuples(
                    "name", "test",
                    "time_horizon", "total"
                );
                var range = TimeRangeComposer.composeFromRangeFromFilter(TimeHorizonV1.Total, filter);
                assert.equal(0, range);
    
                filter = FilterParams.fromTuples(
                    "name", "test",
                    "time_horizon", "hour",
                    "from_year", 2018,
                    "from_month", 8,
                    "from_day", 26,
                    "from_hour", 14,
                    "from_minute", 33
                );
                range = TimeRangeComposer.composeFromRangeFromFilter(TimeHorizonV1.Minute, filter);
                assert.equal(201808, range);
                callback();
            }
        ], done);
    });

    test('TestComposeToRangeFromFilter', (done) => {
        let range;

        async.series([

            (callback) => {
                let filter = FilterParams.fromTuples(
                    "name", "test",
                    "time_horizon", "total"
                );
                var range = TimeRangeComposer.composeToRangeFromFilter(TimeHorizonV1.Total, filter);
                assert.equal(0, range);
    
                filter = FilterParams.fromTuples(
                    "name", "test",
                    "time_horizon", "hour",
                    "to_year", 2018,
                    "to_month", 8,
                    "to_day", 26,
                    "to_hour", 14,
                    "to_minute", 33
                );
                range = TimeRangeComposer.composeToRangeFromFilter(TimeHorizonV1.Minute, filter);
                assert.equal(201808, range);
                callback();
            }
        ], done);
    });
});

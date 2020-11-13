let _ = require('lodash');
let assert = require('chai').assert;

import { TimeRangeComposer } from '../../src/persistence/TimeRangeComposer';
import { TimeHorizonV1 } from '../../src/data/version1/TimeHorizonV1';
import { MetricUpdateV1 } from '../../src/data/version1/MetricUpdateV1';
import { FilterParams } from 'pip-services3-commons-node';

suite('TimeRangeComposerTest', () => {

    test('TestComposeRange', () => {
        let range = TimeRangeComposer.composeRange(TimeHorizonV1.Total, 2018, 8, 26, 14, 33);
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
    });

    test('TestComposeRangeFromUpdate', () => {
        let update: MetricUpdateV1 = {
            name: "test",
            year: 2018,
            month: 8,
            day: 26,
            hour: 14,
            minute: 33,
            value: 123
        }

        let range = TimeRangeComposer.composeRangeFromUpdate(TimeHorizonV1.Total, update);
        assert.equal(0, range);

        range = TimeRangeComposer.composeRangeFromUpdate(TimeHorizonV1.Hour, update);
        assert.equal(201808, range);
    });

    test('TestComposeFromRangeFromFilter', () => {
        let filter = FilterParams.fromTuples(
            "name", "test",
            "time_horizon", "total"
        );
        let range = TimeRangeComposer.composeFromRangeFromFilter(TimeHorizonV1.Total, filter);
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

        filter = FilterParams.fromTuples(
            "name", "test",
            "time_horizon", "hour",
            "from_time", "2018-08-26T14:33:00Z"
        );
        range = TimeRangeComposer.composeFromRangeFromFilter(TimeHorizonV1.Minute, filter);
        assert.equal(201808, range);
    });

    test('TestComposeToRangeFromFilter', () => {
        let filter = FilterParams.fromTuples(
            "name", "test",
            "time_horizon", "total"
        );
        let range = TimeRangeComposer.composeToRangeFromFilter(TimeHorizonV1.Total, filter);
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

        filter = FilterParams.fromTuples(
            "name", "test",
            "time_horizon", "hour",
            "to_time", "2018-08-26T14:33:00Z"
        );
        range = TimeRangeComposer.composeToRangeFromFilter(TimeHorizonV1.Minute, filter);
        assert.equal(201808, range);
    });
});

let assert = require('chai').assert;

import { TimeHorizonV1 } from '../../src/data/version1/TimeHorizonV1';
import { MetricValueV1 } from '../../src/data/version1/MetricValueV1';
import { TimeParser } from '../../src/persistence/TimeParser';

suite('TimeParserTest', () => {

    test('TestParsedTime', () => {
        // Try to get deleted beacon
        let value = new MetricValueV1();

        TimeParser.parseTime("total", TimeHorizonV1.Total, value);
            assert.isUndefined(value.year);
            assert.isUndefined(value.month);
            assert.isUndefined(value.day);
            assert.isUndefined(value.hour);
            assert.isUndefined(value.minute);
        
        TimeParser.parseTime("2018", TimeHorizonV1.Year, value);
            assert.equal(2018, value.year);
            assert.isUndefined(value.month);
            assert.isUndefined(value.day);
            assert.isUndefined(value.hour);
            assert.isUndefined(value.minute);
        
        TimeParser.parseTime("201808", TimeHorizonV1.Month, value);
            assert.equal(2018, value.year);
            assert.equal(8, value.month);
            assert.isUndefined(value.day);
            assert.isUndefined(value.hour);
            assert.isUndefined(value.minute);
        
        TimeParser.parseTime("20180826", TimeHorizonV1.Day, value);
            assert.equal(2018, value.year);
            assert.equal(8, value.month);
            assert.equal(26, value.day);
            assert.isUndefined(value.hour);
            assert.isUndefined(value.minute);

        TimeParser.parseTime("2018082614", TimeHorizonV1.Hour, value);
            assert.equal(2018, value.year);
            assert.equal(8, value.month);
            assert.equal(26, value.day);
            assert.equal(14, value.hour);
            assert.isUndefined(value.minute);
    
        TimeParser.parseTime("201808261430", TimeHorizonV1.Minute, value);
            assert.equal(2018, value.year);
            assert.equal(8, value.month);
            assert.equal(26, value.day);
            assert.equal(14, value.hour);
            assert.equal(30, value.minute);
    });

});
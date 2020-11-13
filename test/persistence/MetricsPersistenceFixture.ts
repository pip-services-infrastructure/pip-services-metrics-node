let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { IMetricsPersistence } from '../../src/persistence/IMetricsPersistence';
import { MetricUpdateV1 } from '../../src/data/version1/MetricUpdateV1';
import { TimeHorizonV1 } from '../../src/data/version1/TimeHorizonV1';

export class MetricsPersistenceFixture {
    private _persistence: IMetricsPersistence;

    public constructor(persistence: IMetricsPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    public testSimpleMetrics(done) {
        async.series([
            (callback) => {
                // Update metric once
                this._persistence.updateOne(
                    null,
                    <MetricUpdateV1>
                    {
                        name: "metric2",
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
            (callback) => {
                // Update metric second time
                this._persistence.updateMany(
                    null,
                    [                   
                        <MetricUpdateV1>
                        {
                            name: "metric2",
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
                // Update metric second time
                this._persistence.updateMany(
                    null,
                    [                   
                        <MetricUpdateV1>
                        {
                            name: "metric2",
                            year: 2018,
                            month: 2,
                            day: 26,
                            hour: 13,
                            value: 1
                        }
                    ],
                    TimeHorizonV1.Hour,
                    callback
                );
            },
            (callback) => {
                // Get total metric
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric2",
                        "time_horizon", "total"
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNotNull(page);
                        assert.equal(1, page.data.length); 
                        let record = page.data[0];
                        assert.equal(445, record.val["total"].sum);
                        assert.equal(1, record.val["total"].min);
                        assert.equal(321, record.val["total"].max);
                        assert.equal(3, record.val["total"].cnt);
                        callback(err);
                    }
                );
            },
            (callback) => {
                // Get year metric
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric2",
                        "time_horizon", "year",
                        "from_year", 2018,
                        "to_year", 2018
                    ),
                    new PagingParams(), (err, page) => {
                        let record = page.data[0];
                        assert.equal(445, record.val["2018"].sum);
                        assert.equal(1, record.val["2018"].min);
                        assert.equal(321, record.val["2018"].max);
                        assert.equal(3, record.val["2018"].cnt);
                        callback(err);
                    }
                );
            },
            (callback) => {
                // Get month metric
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric2",
                        "time_horizon", "month",
                        "from_year", 2018,
                        "from_month", 1,
                        "to_year", 2018,
                        "to_month", 12
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.equal(1, page.data.length);
                        let record = page.data[0];
                        assert.equal(1, record.val["201802"].sum);
                        assert.equal(1, record.val["201802"].min);
                        assert.equal(1, record.val["201802"].max);
                        assert.equal(1, record.val["201802"].cnt);

                        assert.equal(444, record.val["201808"].sum);
                        assert.equal(123, record.val["201808"].min);
                        assert.equal(321, record.val["201808"].max);
                        assert.equal(2, record.val["201808"].cnt);
                        callback(err);
                    }
                );
            },
            (callback) => {
                // Get day metric
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric2",
                        "time_horizon", "day",
                        "from_year", 2018,
                        "from_month", 1,
                        "from_day", 26,
                        "to_year", 2018,
                        "to_month", 12,
                        "to_day", 26
                    ),
                    new PagingParams, (err, page) => {
                        assert.equal(1, page.data.length);
                        let record = page.data[0];
                        assert.equal(1, record.val["20180226"].sum);
                        assert.equal(1, record.val["20180226"].min);
                        assert.equal(1, record.val["20180226"].max);
                        assert.equal(1, record.val["20180226"].cnt);

                        assert.equal(444, record.val["20180826"].sum);
                        assert.equal(123, record.val["20180826"].min);
                        assert.equal(321, record.val["20180826"].max);
                        assert.equal(2, record.val["20180826"].cnt);
                        callback(err);
                    }
                );
            },
            (callback) => {
                // Get hour metric
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric2",
                        "time_horizon", "hour",
                        "from_year", 2018,
                        "from_month", 1,
                        "from_day", 26,
                        "from_hour", 0,
                        "to_year", 2018,
                        "to_month", 12,
                        "to_day", 26,
                        "to_hour", 23
                    ),
                    new PagingParams, (err, page) => {
                        assert.equal(2, page.data.length);
                        let record = page.data[0];
                        assert.equal(123, record.val["2018082612"].sum);
                        assert.equal(123, record.val["2018082612"].min);
                        assert.equal(123, record.val["2018082612"].max);
                        assert.equal(1, record.val["2018082612"].cnt);

                        assert.equal(321, record.val["2018082613"].sum);
                        assert.equal(321, record.val["2018082613"].min);
                        assert.equal(321, record.val["2018082613"].max);
                        assert.equal(1, record.val["2018082613"].cnt);

                        record = page.data[1];
                        assert.equal(1, record.val["2018022613"].sum);
                        assert.equal(1, record.val["2018022613"].min);
                        assert.equal(1, record.val["2018022613"].max);
                        assert.equal(1, record.val["2018022613"].cnt);

                        callback(err);
                    }
                );
            },
            (callback) => {
                // Get hour metric
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric2",
                        "time_horizon", "hour",
                        "from_time", "2018-01-26T00:00:00Z",
                        "to_time", "2018-12-26T23:00:00Z"
                    ),
                    new PagingParams, (err, page) => {
                        assert.equal(2, page.data.length);
                        let record = page.data[0];
                        assert.equal(123, record.val["2018082612"].sum);
                        assert.equal(123, record.val["2018082612"].min);
                        assert.equal(123, record.val["2018082612"].max);
                        assert.equal(1, record.val["2018082612"].cnt);

                        assert.equal(321, record.val["2018082613"].sum);
                        assert.equal(321, record.val["2018082613"].min);
                        assert.equal(321, record.val["2018082613"].max);
                        assert.equal(1, record.val["2018082613"].cnt);

                        record = page.data[1];
                        assert.equal(1, record.val["2018022613"].sum);
                        assert.equal(1, record.val["2018022613"].min);
                        assert.equal(1, record.val["2018022613"].max);
                        assert.equal(1, record.val["2018022613"].cnt);

                        callback(err);
                    }
                );
            }], done);
    }

    public testMetricWithDimensions(done) {
        async.series([
            (callback) => {
                this._persistence.updateOne(
                    null,
                    <MetricUpdateV1>
                    {
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
            (callback) => {
                this._persistence.updateMany(
                    null,
                    [
                        <MetricUpdateV1>
                        {
                            name: "metric1",
                            dimension1: "A",
                            dimension2: "C",
                            dimension3: null,
                            year: 2018,
                            month: 8,
                            day: 26,
                            hour: 12,
                            value: 321
                        }
                    ],
                    TimeHorizonV1.Hour,
                    callback
                );
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric1"
                    ),
                    new PagingParams, 
                    (err, page) => {
                        assert.isNotNull(page);
                        assert.equal(2, page.data.length);
                        callback(err)
                    }
                );
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric1",
                        "dimension1", "A"
                    ),
                    new PagingParams, 
                    (err, page) => {
                        assert.isNotNull(page);
                        assert.equal(2, page.data.length);
                        callback(err);
                    }
                );
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric1",
                        "dimension1", "A",
                        "dimension2", "B"
                    ),
                    new PagingParams(), 
                    (err, page) => {
                        assert.isNotNull(page);
                        assert.equal(1, page.data.length);
                        callback(err);
                    }
                );
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric1",
                        "dimension1", null,
                        "dimension2", null,
                        "dimension3", null
                    ),
                    new PagingParams, 
                    (err, page) => {
                        assert.isNotNull(page);
                        assert.equal(2, page.data.length);
                        callback(err);
                    }
                );

            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric1",
                        "dimension1", "na",
                        "dimension2", "na",
                        "dimension3", "na"
                    ),
                    new PagingParams,
                    (err, page) => {
                        assert.isNotNull(page);
                        assert.isEmpty(page.data);
                        callback(err);
                    }
                );
            }
        ], done);
    }

    public testGetMultipleMetrics(done) {
        async.series([
            (callback) => {
                // Update metrics
                this._persistence.updateMany(
                    null,
                    [
                        <MetricUpdateV1>
                        {
                            name: "metric.1",
                            year: 2018,
                            month: 1,
                            day: 1,
                            hour: 1,
                            value: 123
                        },
                        <MetricUpdateV1>
                        {
                            name: "metric.2",
                            year: 2018,
                            month: 2,
                            day: 2,
                            hour: 2,
                            value: 456
                        },
                        <MetricUpdateV1>
                        {
                            name: "metric.3",
                            year: 2018,
                            month: 3,
                            day: 3,
                            hour: 3,
                            value: 789
                        }                        
                    ],
                    TimeHorizonV1.Hour
                );
                callback(null);
            },
            (callback) => {
                // Delay, because update many can be async
                setTimeout(callback, 1000);
            },
            (callback) => {
                // Get total metric
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "names", "metric.1,metric.2"
                    ),
                    new PagingParams(), 
                    (err, page) => {
                        assert.isNotNull(page);
                        assert.equal(2, page.data.length);
                        callback(err);
                    }
                );
            }

        ], done);
    }


}

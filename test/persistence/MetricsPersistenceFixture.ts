let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { MetricRecordV1 } from '../../src/data/version1/MetricRecordV1';
import { IMetricsPersistence } from '../../src/persistence/IMetricsPersistence';
import { TimeHorizonV1 } from '../../src/data/version1/TimeHorizonV1'
import { MetricRecordValueV1 } from '../../src/data/version1/MetricRecordValueV1'

import { MetricUpdateV1 } from '../../src';

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
                    TimeHorizonV1.Hour
                );
                callback(null);
            },
            (callback) => {
                // Update metric second time
                let updates = new Array<MetricUpdateV1>();
                updates.push(
                    <MetricUpdateV1>
                    {
                        name: "metric2",
                        year: 2018,
                        month: 8,
                        day: 26,
                        hour: 13,
                        value: 321
                    });
                this._persistence.updateMany(
                    null,
                    updates,
                    TimeHorizonV1.Hour
                );
                callback(null);
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
                        assert.equal(444, record.values["total"].sum);
                        assert.equal(123, record.values["total"].min);
                        assert.equal(321, record.values["total"].max);
                        assert.equal(2, record.values["total"].count);
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
                        assert.equal(444, record.values["2018"].sum);
                        assert.equal(123, record.values["2018"].min);
                        assert.equal(321, record.values["2018"].max);
                        assert.equal(2, record.values["2018"].count);
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
                        "from_month", 8,
                        "to_year", 2018,
                        "to_month", 8
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.equal(1, page.data.length);
                        let record = page.data[0];
                        assert.equal(444, record.values["201808"].sum);
                        assert.equal(123, record.values["201808"].min);
                        assert.equal(321, record.values["201808"].max);
                        assert.equal(2, record.values["201808"].count);
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
                        "from_month", 8,
                        "from_day", 26,
                        "to_year", 2018,
                        "to_month", 8,
                        "to_day", 26
                    ),
                    new PagingParams, (err, page) => {
                        assert.equal(1, page.data.length);
                        let record = page.data[0];
                        assert.equal(444, record.values["20180826"].sum);
                        assert.equal(123, record.values["20180826"].min);
                        assert.equal(321, record.values["20180826"].max);
                        assert.equal(2, record.values["20180826"].count);
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
                        "from_month", 8,
                        "from_day", 26,
                        "from_hour", 0,
                        "to_year", 2018,
                        "to_month", 8,
                        "to_day", 26,
                        "to_hour", 23
                    ),
                    new PagingParams, (err, page) => {
                        assert.equal(1, page.data.length);
                        let record = page.data[0];
                        assert.equal(123, record.values["2018082612"].sum);
                        assert.equal(123, record.values["2018082612"].min);
                        assert.equal(123, record.values["2018082612"].max);
                        assert.equal(1, record.values["2018082612"].count);

                        assert.equal(321, record.values["2018082613"].sum);
                        assert.equal(321, record.values["2018082613"].min);
                        assert.equal(321, record.values["2018082613"].max);
                        assert.equal(1, record.values["2018082613"].count);
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
                    TimeHorizonV1.Hour
                );
                callback(null);
            },
            (callback) => {
                let updates = new Array<MetricUpdateV1>();
                updates.push(<MetricUpdateV1>
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
                    });
                this._persistence.updateMany(
                    null,
                    updates,
                    TimeHorizonV1.Hour
                );
                callback(null);
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "name", "metric1"
                    ),
                    new PagingParams, (err, page) => {
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
                    new PagingParams, (err, page) => {
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
                    new PagingParams(), (err, page) => {
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
                    new PagingParams, (err, page) => {
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
                    new PagingParams, (err, page) => {
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
                let updates = new Array<MetricUpdateV1>();
                updates.push(<MetricUpdateV1>
                    {
                        name: "metric.1",
                        year: 2018,
                        month: 1,
                        day: 1,
                        hour: 1,
                        value: 123
                    });

                updates.push(<MetricUpdateV1>
                    {
                        name: "metric.2",
                        year: 2018,
                        month: 2,
                        day: 2,
                        hour: 2,
                        value: 456
                    });

                updates.push(<MetricUpdateV1>
                    {
                        name: "metric.3",
                        year: 2018,
                        month: 3,
                        day: 3,
                        hour: 3,
                        value: 789
                    });

                this._persistence.updateMany(
                    null,
                    updates,
                    TimeHorizonV1.Hour
                );
                callback(null);
            },
            (callback) => {

                // Get total metric
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "names", "metric.1,metric.2"
                    ),
                    new PagingParams(), (err, page) => {
                        assert.isNotNull(page);
                        assert.equal(2, page.data.length);
                        callback(err);
                    }
                );

            }

        ], done);
    }


}

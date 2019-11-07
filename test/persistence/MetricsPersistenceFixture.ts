let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { MetricRecordV1 } from '../../src/data/version1/MetricRecordV1';
import { IMetricsPersistence } from '../../src/persistence/IMetricsPersistence';
import { TimeHorizonV1 } from '../../src/data/version1/TimeHorizonV1'
import { MetricRecordValueV1 } from '../../src/data/version1/MetricRecordValueV1'

import { TSMap } from 'typescript-map';

const METRICVALUE1: MetricRecordValueV1 = {
     count: 1,
     sum: 100,
     max: 100,
     min: 0
}

const METRIC1: MetricRecordV1 = {
    id: '1',
    name: 'Metric_1',
    timeHorizon: TimeHorizonV1.Day,
    range: 2019,
    dimension1: 'dim1',
    dimension2: 'dim2',
    dimension3: 'dim3',
    values: new TSMap<string, MetricRecordValueV1>().set('value', METRICVALUE1)
};
const METRIC2: MetricRecordV1 = {
    id: '2',
    name: 'Metric_2',
    timeHorizon: TimeHorizonV1.Hour,
    range: 24,
    dimension1: 'dim1',
    dimension2: 'dim2',
    dimension3: 'dim3',
    values: new TSMap<string, MetricRecordValueV1>().set('value', METRICVALUE1)
};
const METRIC3: MetricRecordV1 = {
    id: '3',
    name: 'Metric_3',
    timeHorizon: TimeHorizonV1.Month,
    range: 6,
    dimension1: 'dim1',
    dimension2: 'dim2',
    dimension3: 'dim3',
    values: new TSMap<string, MetricRecordValueV1>().set('value', METRICVALUE1)
};

export class MetricsPersistenceFixture {
    private _persistence: IMetricsPersistence;

    public constructor(persistence: IMetricsPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testSetMetrics(done) {
        async.series([
            // Create the first metric
            (callback) => {
                this._persistence.set(
                    null,
                    METRIC1,
                    (err, metric) => {
                        assert.isNull(err);
                        assert.isObject(metric);
                        assert.equal(METRIC1.id, metric.id);
                        assert.equal(METRIC1.name, metric.name);
                        assert.equal(METRIC1.timeHorizon, metric.timeHorizon);
                        assert.equal(METRIC1.range, metric.range);
                        assert.equal(METRIC1.dimension1, metric.dimension1);
                        assert.equal(METRIC1.dimension2, metric.dimension2);
                        assert.equal(METRIC1.dimension3, metric.dimension3);
                        assert.isNotNull(metric.values);

                        callback();
                    }
                );
            },
            // Create the second metric
            (callback) => {
                this._persistence.set(
                    null,
                    METRIC2,
                    (err, metric) => {
                        assert.isNull(err);
                        assert.isObject(metric);
                        assert.equal(METRIC2.id, metric.id);
                        assert.equal(METRIC2.name, metric.name);
                        assert.equal(METRIC2.timeHorizon, metric.timeHorizon);
                        assert.equal(METRIC2.range, metric.range);
                        assert.equal(METRIC2.dimension1, metric.dimension1);
                        assert.equal(METRIC2.dimension2, metric.dimension2);
                        assert.equal(METRIC2.dimension3, metric.dimension3);
                        assert.isNotNull(metric.values);

                        callback();
                    }
                );
            },
            // Create the third metric
            (callback) => {
                this._persistence.set(
                    null,
                    METRIC3,
                    (err, metric) => {
                        assert.isNull(err);
                        assert.isObject(metric);
                        assert.equal(METRIC3.id, metric.id);
                        assert.equal(METRIC3.name, metric.name);
                        assert.equal(METRIC3.timeHorizon, metric.timeHorizon);
                        assert.equal(METRIC3.range, metric.range);
                        assert.equal(METRIC3.dimension1, metric.dimension1);
                        assert.equal(METRIC3.dimension2, metric.dimension2);
                        assert.equal(METRIC3.dimension3, metric.dimension3);
                        assert.isNotNull(metric.values);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testCrudOperations(done) {
        let metric1: MetricRecordV1;

        async.series([
            // Create items
            (callback) => {
                this.testSetMetrics(callback);
            },
            // Get all metrics
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);
                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        metric1 = page.data[0];

                        callback();
                    }
                )
            },
            /*
            // Update the metric
            (callback) => {
                metric1.label = 'ABC';

                this._persistence.updateOne(
                    null,
                    metric1,
                    (err, metric) => {
                        assert.isNull(err);

                        assert.isObject(metric);
                        assert.equal(metric1.id, metric.id);
                        assert.equal('ABC', metric.label);

                        callback();
                    }
                )
            },
*/
            // Delete the metric
            (callback) => {
                this._persistence.deleteByFilter(
                    null,
                    FilterParams.fromTuples(
                        'name','Metric_2'
                    ),
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                )
            },
            // Try to get deleted metric
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'name','Metric_2'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);
                        assert.isObject(page);
                        assert.lengthOf(page.data, 0);
                        callback();
                    }
                )
            }
            
        ], done);
    }

    public testGetWithFilters(done) {
        async.series([
            // Create items
            (callback) => {
                this.testSetMetrics(callback);
            },
            // Filter by name
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'name', 'Metric_1'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);
                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                )
            },
            // Filter by names
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'names', 'Metric_2,Metric_3'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                )
            },
            // Filter by dimension2
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'dimension2', 'dim2'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 3);

                        callback();
                    }
                )
            },
            // Filter by time_horizon
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'time_horizon', TimeHorizonV1.Day
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                )
            },
        ], done);
    }
}

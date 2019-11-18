import { ConfigParams } from 'pip-services3-commons-node';

import { MetricsFilePersistence } from '../../src/persistence/MetricsFilePersistence';
import { MetricsPersistenceFixture } from './MetricsPersistenceFixture';

suite('MetricsFilePersistence', () => {
    let persistence: MetricsFilePersistence;
    let fixture: MetricsPersistenceFixture;

    setup((done) => {
        persistence = new MetricsFilePersistence('data/metrics.test.json');
        persistence.configure(new ConfigParams());

        fixture = new MetricsPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('Simple Metrics', (done) => {
        fixture.testSimpleMetrics(done);
    });

    test('Metric With Dimensions', (done) => {
        fixture.testMetricWithDimensions(done);
    });

    test('Get Multiple Metrics', (done) => {
        fixture.testGetMultipleMetrics(done);
    });

});
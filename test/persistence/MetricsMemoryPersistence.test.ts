import { ConfigParams } from 'pip-services3-commons-node';

import { MetricsMemoryPersistence } from '../../src/persistence/MetricsMemoryPersistence';
import { MetricsPersistenceFixture } from './MetricsPersistenceFixture';

suite('MetricsMemoryPersistence', () => {
    let persistence: MetricsMemoryPersistence;
    let fixture: MetricsPersistenceFixture;

    setup((done) => {
        persistence = new MetricsMemoryPersistence();
        persistence.configure(new ConfigParams());

        fixture = new MetricsPersistenceFixture(persistence);

        persistence.open(null, done);
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilters(done);
    });

});
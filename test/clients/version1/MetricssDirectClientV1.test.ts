
import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { MetricsClientV1Fixture } from './MetricsClientV1Fixture';
import { MetricsMemoryPersistence } from '../../../src/persistence/MetricsMemoryPersistence';
import { MetricsController } from '../../../src/logic';
import { MetricsDirectClientV1 } from '../../../src/clients';
import { MetricsMongoDbPersistence } from '../../../src/persistence/MetricsMongoDbPersistence';

suite('MetricsDirectClientV1', () => {
    //let persistence: MetricsMemoryPersistence;
    let persistence: MetricsMongoDbPersistence;
    let controller: MetricsController;
    let client: MetricsDirectClientV1;
    let fixture: MetricsClientV1Fixture;

    let mongoUri = process.env['MONGO_SERVICE_URI'];
    let mongoHost = process.env['MONGO_SERVICE_HOST'] || 'localhost';
    let mongoPort = process.env['MONGO_SERVICE_PORT'] || 27017;
    let mongoDatabase = process.env['MONGO_SERVICE_DB'] || 'test';

    // Exit if mongo connection is not set
    if (mongoUri == '' && mongoHost == '')
        return;

    setup((done) => {
        //persistence = new MetricsMemoryPersistence();
        persistence = new MetricsMongoDbPersistence();
        //persistence.configure(new ConfigParams());
        persistence.configure(ConfigParams.fromTuples(
            'connection.uri', mongoUri,
            'connection.host', mongoHost,
            'connection.port', mongoPort,
            'connection.database', mongoDatabase
        ));

        controller = new MetricsController();
        controller.configure(new ConfigParams());

        client = new MetricsDirectClientV1();

        let references = References.fromTuples(
            new Descriptor('metrics', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('metrics', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('metrics', 'client', 'direct', 'default', '1.0'), client
        );

        controller.setReferences(references);
        client.setReferences(references);

        fixture = new MetricsClientV1Fixture(client);

        persistence.open(null, done);
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('Metrics CRUD Operations', (done) => {
        fixture.testMetrics(done);
    });

    test('Mestrics definitions', (done) => {
        fixture.testDefinitions(done);
    });
});
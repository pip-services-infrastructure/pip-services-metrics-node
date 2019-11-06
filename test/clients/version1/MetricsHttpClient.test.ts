import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { MetricsMemoryPersistence } from '../../../src/persistence/MetricsMemoryPersistence';
import { MetricsController } from '../../../src/logic/MetricsController';
import { MetricsHttpServiceV1 } from '../../../src/services/version1/MetricsHttpServiceV1';
import { MetricsHttpClientV1 } from '../../../src/clients/version1/MetricsHttpClientV1';
import { MetricsClientV1Fixture } from './MetricsClientV1Fixture';

suite('MetricsHttpClientV1', () => {
    let persistence: MetricsMemoryPersistence;
    let controller: MetricsController;
    let service: MetricsHttpServiceV1;
    let client: MetricsHttpClientV1;
    let fixture: MetricsClientV1Fixture;

    setup((done) => {
        persistence = new MetricsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new MetricsController();
        controller.configure(new ConfigParams());

        let httpConfig = ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 3000,
            'connection.host', 'localhost'
        );

        service = new MetricsHttpServiceV1();
        service.configure(httpConfig);

        client = new MetricsHttpClientV1();
        client.configure(httpConfig);

        let references = References.fromTuples(
            new Descriptor('metrics', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('metrics', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('metrics', 'service', 'http', 'default', '1.0'), service,
            new Descriptor('metrics', 'client', 'http', 'default', '1.0'), client
        );
        controller.setReferences(references);
        service.setReferences(references);
        client.setReferences(references);

        fixture = new MetricsClientV1Fixture(client);

        persistence.open(null, (err) => {
            //console.dir("MetricsHttpClientV1:Persistence:Open");
            if (err) {
                done(err);
                return;
            }

            service.open(null, (err) => {
                //console.dir("MetricsHttpClientV1:Service:Open");
                if (err) {
                    done(err);
                    return;
                }

                client.open(null, done);
            });
        });
    });

    teardown((done) => {
        client.close(null, (err) => {
            service.close(null, (err) => {
                persistence.close(null, done);
            });    
        });
    });

    test('Metrics CRUD Operations', (done) => {
        fixture.testMetrics(done);
    });

    test('Metrics definitions', (done) => {
        fixture.testDefinitions(done);
    });

});
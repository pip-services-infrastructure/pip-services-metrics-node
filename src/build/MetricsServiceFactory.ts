import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { MetricsMemoryPersistence } from '../persistence/MetricsMemoryPersistence';
import { MetricsFilePersistence } from '../persistence/MetricsFilePersistence';
import { MetricsMongoDbPersistence } from '../persistence/MetricsMongoDbPersistence';
import { MetricsController } from '../logic/MetricsController';
import { MetricsHttpServiceV1 } from '../services/version1/MetricsHttpServiceV1';

export class MetricsServiceFactory extends Factory {
    public Descriptor: Descriptor = new Descriptor("pip-services-metrics", "factory", "service", "default", "1.0");
    public MemoryPersistenceDescriptor: Descriptor = new Descriptor("pip-services-metrics", "persistence", "memory", "*", "1.0");
    public FilePersistenceDescriptor: Descriptor = new Descriptor("pip-services-metrics", "persistence", "file", "*", "1.0");
    public MongoDbPersistenceDescriptor: Descriptor = new Descriptor("pip-services-metrics", "persistence", "mongodb", "*", "1.0");
    public ControllerDescriptor: Descriptor = new Descriptor("pip-services-metrics", "controller", "default", "*", "1.0");
    public HttpServiceDescriptor: Descriptor = new Descriptor("pip-services-metrics", "service", "http", "*", "1.0");

    public constructor() {
        super();
        this.registerAsType(this.MemoryPersistenceDescriptor, MetricsMemoryPersistence);
        this.registerAsType(this.FilePersistenceDescriptor, MetricsFilePersistence);
        this.registerAsType(this.MongoDbPersistenceDescriptor, MetricsMongoDbPersistence);
        this.registerAsType(this.ControllerDescriptor, MetricsController);
        this.registerAsType(this.HttpServiceDescriptor, MetricsHttpServiceV1);
    }
}


import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
export declare class MetricsServiceFactory extends Factory {
    Descriptor: Descriptor;
    MemoryPersistenceDescriptor: Descriptor;
    FilePersistenceDescriptor: Descriptor;
    MongoDbPersistenceDescriptor: Descriptor;
    ControllerDescriptor: Descriptor;
    HttpServiceDescriptor: Descriptor;
    constructor();
}

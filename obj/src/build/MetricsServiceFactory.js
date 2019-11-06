"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const MetricsMemoryPersistence_1 = require("../persistence/MetricsMemoryPersistence");
const MetricsFilePersistence_1 = require("../persistence/MetricsFilePersistence");
const MetricsMongoDbPersistence_1 = require("../persistence/MetricsMongoDbPersistence");
const MetricsController_1 = require("../logic/MetricsController");
const MetricsHttpServiceV1_1 = require("../services/version1/MetricsHttpServiceV1");
class MetricsServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.Descriptor = new pip_services3_commons_node_1.Descriptor("metrics", "factory", "service", "default", "1.0");
        this.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("metrics", "persistence", "memory", "*", "1.0");
        this.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("metrics", "persistence", "file", "*", "1.0");
        this.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("metrics", "persistence", "mongodb", "*", "1.0");
        this.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("metrics", "controller", "default", "*", "1.0");
        this.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("metrics", "service", "http", "*", "1.0");
        this.registerAsType(this.MemoryPersistenceDescriptor, typeof (MetricsMemoryPersistence_1.MetricsMemoryPersistence));
        this.registerAsType(this.FilePersistenceDescriptor, typeof (MetricsFilePersistence_1.MetricsFilePersistence));
        this.registerAsType(this.MongoDbPersistenceDescriptor, typeof (MetricsMongoDbPersistence_1.MetricsMongoDbPersistence));
        this.registerAsType(this.ControllerDescriptor, typeof (MetricsController_1.MetricsController));
        this.registerAsType(this.HttpServiceDescriptor, typeof (MetricsHttpServiceV1_1.MetricsHttpServiceV1));
    }
}
exports.MetricsServiceFactory = MetricsServiceFactory;
//# sourceMappingURL=MetricsServiceFactory.js.map
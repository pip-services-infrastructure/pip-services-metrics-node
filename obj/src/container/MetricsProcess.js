"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const MetricsServiceFactory_1 = require("../build/MetricsServiceFactory");
class MetricsProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("metrics", "Analytical metrics microservice");
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory());
        //this._factories.add(new DefaultAzureFactory());
        this._factories.add(new MetricsServiceFactory_1.MetricsServiceFactory());
    }
}
exports.MetricsProcess = MetricsProcess;
//# sourceMappingURL=MetricsProcess.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class MetricsHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super("v1/metrics");
        this._dependencyResolver.put("controller", new pip_services3_commons_node_1.Descriptor("metrics", "controller", "default", "*", "1.0"));
    }
}
exports.MetricsHttpServiceV1 = MetricsHttpServiceV1;
//# sourceMappingURL=MetricsHttpServiceV1.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class MetricUpdateV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty("name", pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty("year", pip_services3_commons_node_2.TypeCode.Integer);
        this.withRequiredProperty("month", pip_services3_commons_node_2.TypeCode.Integer);
        this.withRequiredProperty("day", pip_services3_commons_node_2.TypeCode.Integer);
        this.withRequiredProperty("hour", pip_services3_commons_node_2.TypeCode.Integer);
        this.withOptionalProperty("minute", pip_services3_commons_node_2.TypeCode.Integer);
        this.withOptionalProperty("dimension1", pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty("dimension2", pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty("dimension3", pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty("value", pip_services3_commons_node_2.TypeCode.Float);
    }
}
exports.MetricUpdateV1Schema = MetricUpdateV1Schema;
//# sourceMappingURL=MetricUpdateV1Schema.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const version1_1 = require("../data/version1");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class TimeHorizonConverter {
    static fromString(value) {
        if (value == null || value == '')
            return version1_1.TimeHorizonV1.Total;
        value = value.toLowerCase(); //toLowerInvariant();
        if (value == "total")
            return version1_1.TimeHorizonV1.Total;
        if (value == "year" || value == "yearly")
            return version1_1.TimeHorizonV1.Year;
        if (value == "month" || value == "monthly")
            return version1_1.TimeHorizonV1.Month;
        if (value == "day" || value == "daily")
            return version1_1.TimeHorizonV1.Day;
        if (value == "hour" || value == "hourly")
            return version1_1.TimeHorizonV1.Hour;
        var code = pip_services3_commons_node_1.IntegerConverter.toIntegerWithDefault(value, version1_1.TimeHorizonV1.Total);
        return code;
    }
}
exports.TimeHorizonConverter = TimeHorizonConverter;
//# sourceMappingURL=TimeHorizonConverter.js.map
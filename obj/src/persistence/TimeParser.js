"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version1_1 = require("../data/version1");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class TimeParser {
    static parseTime(token, timeHorizon, value) {
        if (timeHorizon == version1_1.TimeHorizonV1.Total) {
            return;
        }
        if (token.length >= 4) {
            value.year = pip_services3_commons_node_1.IntegerConverter.toInteger(token.substring(0, 4));
        }
        if (token.length >= 6) {
            value.month = pip_services3_commons_node_1.IntegerConverter.toInteger(token.substring(4, 2));
        }
        if (token.length >= 8) {
            value.day = pip_services3_commons_node_1.IntegerConverter.toInteger(token.substring(6, 2));
        }
        if (token.length >= 10) {
            value.hour = pip_services3_commons_node_1.IntegerConverter.toInteger(token.substring(8, 2));
        }
        if (token.length >= 12) {
            value.minute = pip_services3_commons_node_1.IntegerConverter.toInteger(token.substring(10, 2));
        }
    }
}
exports.TimeParser = TimeParser;
//# sourceMappingURL=TimeParser.js.map
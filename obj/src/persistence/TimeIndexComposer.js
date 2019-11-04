"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version1_1 = require("../data/version1");
class TimeIndexComposer {
    static composeIndex(timeHorizon, year, month, day, hour, minute) {
        switch (timeHorizon) {
            case version1_1.TimeHorizonV1.Total:
                return "total";
            case version1_1.TimeHorizonV1.Year:
                return year.toString();
            case version1_1.TimeHorizonV1.Month:
                return (year * 100 + month).toString();
            case version1_1.TimeHorizonV1.Day:
                return (year * 10000 + month * 100 + day).toString();
            case version1_1.TimeHorizonV1.Hour:
                return (year * 1000000 + month * 10000 + day * 100 + hour).toString();
            case version1_1.TimeHorizonV1.Minute:
                minute = (minute / 15) * 15;
                return (year * 100000000 + month * 1000000 + day * 10000 + hour * 100 + minute).toString();
            default:
                return "";
        }
    }
    static composeIndexFromUpdate(timeHorizon, update) {
        return this.composeIndex(timeHorizon, update.year, update.month, update.day, update.hour, update.minute);
    }
    static composeFromIndexFromFilter(timeHorizon, filter) {
        // Define from time
        var time = filter.getAsDateTime("from_time");
        var year = filter.getAsIntegerWithDefault("from_year", time.getFullYear());
        var month = filter.getAsIntegerWithDefault("from_month", time.getMonth());
        var day = filter.getAsIntegerWithDefault("from_day", time.getDay());
        var hour = filter.getAsIntegerWithDefault("from_hour", time.getHours());
        var minute = filter.getAsIntegerWithDefault("from_minute", time.getMinutes());
        return this.composeIndex(timeHorizon, year, month, day, hour, minute);
    }
    static composeToIndexFromFilter(timeHorizon, filter) {
        // Define to time
        var time = filter.getAsDateTime("to_time");
        var year = filter.getAsIntegerWithDefault("to_year", time.getFullYear());
        var month = filter.getAsIntegerWithDefault("to_month", time.getMonth());
        var day = filter.getAsIntegerWithDefault("to_day", time.getDay());
        var hour = filter.getAsIntegerWithDefault("to_hour", time.getHours());
        var minute = filter.getAsIntegerWithDefault("to_minute", time.getMinutes());
        return this.composeIndex(timeHorizon, year, month, day, hour, minute);
    }
}
exports.TimeIndexComposer = TimeIndexComposer;
//# sourceMappingURL=TimeIndexComposer.js.map
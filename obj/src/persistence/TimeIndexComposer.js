"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeIndexComposer = void 0;
const version1_1 = require("../data/version1");
class TimeIndexComposer {
    static composeIndex(timeHorizon, year, month, day, hour, minute) {
        switch (timeHorizon) {
            case version1_1.TimeHorizonV1.Total:
                return "total";
            case version1_1.TimeHorizonV1.Year:
                return "" + year;
            case version1_1.TimeHorizonV1.Month:
                return "" + (year * 100 + month);
            case version1_1.TimeHorizonV1.Day:
                return "" + (year * 10000 + month * 100 + day);
            case version1_1.TimeHorizonV1.Hour:
                return "" + (year * 1000000 + month * 10000 + day * 100 + hour);
            case version1_1.TimeHorizonV1.Minute:
                minute = (minute / 15) * 15;
                return "" + (year * 100000000 + month * 1000000 + day * 10000 + hour * 100 + minute);
            default:
                return "";
        }
    }
    static composeIndexFromUpdate(timeHorizon, update) {
        return this.composeIndex(timeHorizon, update.year, update.month, update.day, update.hour, update.minute);
    }
    static composeFromIndexFromFilter(timeHorizon, filter) {
        // Define from time
        let time = filter.getAsDateTime("from_time");
        let year = filter.getAsIntegerWithDefault("from_year", time.getUTCFullYear());
        let month = filter.getAsIntegerWithDefault("from_month", time.getUTCMonth() + 1);
        let day = filter.getAsIntegerWithDefault("from_day", time.getUTCDate());
        let hour = filter.getAsIntegerWithDefault("from_hour", time.getUTCHours());
        let minute = filter.getAsIntegerWithDefault("from_minute", time.getUTCMinutes());
        return this.composeIndex(timeHorizon, year, month, day, hour, minute);
    }
    static composeToIndexFromFilter(timeHorizon, filter) {
        // Define to time
        let time = filter.getAsDateTime("to_time");
        let year = filter.getAsIntegerWithDefault("to_year", time.getUTCFullYear());
        let month = filter.getAsIntegerWithDefault("to_month", time.getUTCMonth() + 1);
        let day = filter.getAsIntegerWithDefault("to_day", time.getUTCDate());
        let hour = filter.getAsIntegerWithDefault("to_hour", time.getUTCHours());
        let minute = filter.getAsIntegerWithDefault("to_minute", time.getUTCMinutes());
        return this.composeIndex(timeHorizon, year, month, day, hour, minute);
    }
}
exports.TimeIndexComposer = TimeIndexComposer;
//# sourceMappingURL=TimeIndexComposer.js.map
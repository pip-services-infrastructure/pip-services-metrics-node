"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TimeHorizonV1_1 = require("../data/version1/TimeHorizonV1");
class TimeRangeComposer {
    static composeRange(timeHorizon, year, month, day, hour, minute) {
        switch (timeHorizon) {
            case TimeHorizonV1_1.TimeHorizonV1.Total:
                return 0;
            case TimeHorizonV1_1.TimeHorizonV1.Year:
                return 0;
            case TimeHorizonV1_1.TimeHorizonV1.Month:
                return year;
            case TimeHorizonV1_1.TimeHorizonV1.Day:
                return year;
            case TimeHorizonV1_1.TimeHorizonV1.Hour:
                return year * 100 + month;
            case TimeHorizonV1_1.TimeHorizonV1.Minute:
                return year * 100 + month;
            default:
                return 0;
        }
    }
    static composeRangeFromUpdate(timeHorizon, update) {
        return this.composeRange(timeHorizon, update.year, update.month, update.day, update.hour, update.minute);
    }
    static composeFromRangeFromFilter(timeHorizon, filter) {
        // Define from time
        let time = filter.getAsDateTime("from_time");
        let year = filter.getAsIntegerWithDefault("from_year", time.getFullYear());
        let month = filter.getAsIntegerWithDefault("from_month", time.getMonth());
        let day = filter.getAsIntegerWithDefault("from_day", time.getDay());
        let hour = filter.getAsIntegerWithDefault("from_hour", time.getHours());
        let minute = filter.getAsIntegerWithDefault("from_minute", time.getMinutes());
        return this.composeRange(timeHorizon, year, month, day, hour, minute);
    }
    static composeToRangeFromFilter(timeHorizon, filter) {
        // Define to time
        let time = filter.getAsDateTime("to_time");
        let year = filter.getAsIntegerWithDefault("to_year", time.getFullYear());
        let month = filter.getAsIntegerWithDefault("to_month", time.getMonth());
        let day = filter.getAsIntegerWithDefault("to_day", time.getDay());
        let hour = filter.getAsIntegerWithDefault("to_hour", time.getHours());
        let minute = filter.getAsIntegerWithDefault("to_minute", time.getMinutes());
        return this.composeRange(timeHorizon, year, month, day, hour, minute);
    }
}
exports.TimeRangeComposer = TimeRangeComposer;
//# sourceMappingURL=TimeRangeComposer.js.map
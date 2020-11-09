"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricRecordIdComposer = void 0;
const version1_1 = require("../data/version1");
const TimeRangeComposer_1 = require("./TimeRangeComposer");
class MetricRecordIdComposer {
    static composeTime(timeHorizon, year, month, day, hour, minute) {
        let range = TimeRangeComposer_1.TimeRangeComposer.composeRange(timeHorizon, year, month, day, hour, minute);
        switch (timeHorizon) {
            case version1_1.TimeHorizonV1.Total:
                return "T";
            case version1_1.TimeHorizonV1.Year:
                return "Y";
            case version1_1.TimeHorizonV1.Month:
                return "M" + range;
            case version1_1.TimeHorizonV1.Day:
                return "D" + range;
            case version1_1.TimeHorizonV1.Hour:
                return "H" + range;
            case version1_1.TimeHorizonV1.Minute:
                return "Q" + range;
        }
        return "X";
    }
    static composeId(name, timeHorizon, dimension1, dimension2, dimension3, year, month, day, hour, minute) {
        return name
            + "_" + this.composeTime(timeHorizon, year, month, day, hour, minute)
            + "_" + (dimension1 || "")
            + "_" + (dimension2 || "")
            + "_" + (dimension3 || "");
    }
    static composeIdFromUpdate(timeHorizon, update) {
        return this.composeId(update.name, timeHorizon, update.dimension1, update.dimension2, update.dimension3, update.year, update.month, update.day, update.hour, update.minute);
    }
}
exports.MetricRecordIdComposer = MetricRecordIdComposer;
//# sourceMappingURL=MetricRecordIdComposer.js.map

import { TimeHorizonV1 } from '../data/version1/TimeHorizonV1';
import { MetricUpdateV1 } from '../data/version1/MetricUpdateV1';
import { FilterParams } from 'pip-services3-commons-node';

export class TimeRangeComposer {
    public static composeRange(timeHorizon: TimeHorizonV1, year: number, month: number, day: number, hour: number, minute: number): number {
        switch (timeHorizon) {
            case TimeHorizonV1.Total:
                return 0;
            case TimeHorizonV1.Year:
                return 0;
            case TimeHorizonV1.Month:
                return year;
            case TimeHorizonV1.Day:
                return year;
            case TimeHorizonV1.Hour:
                return year * 100 + month;
            case TimeHorizonV1.Minute:
                return year * 100 + month;
            default:
                return 0;
        }
    }

    public static composeRangeFromUpdate(timeHorizon: TimeHorizonV1, update: MetricUpdateV1): number {
        return this.composeRange(timeHorizon, update.year, update.month, update.day, update.hour, update.minute);
    }

    public static composeFromRangeFromFilter(timeHorizon: TimeHorizonV1, filter: FilterParams): number {
        // Define from time
        var time = filter.getAsDateTime("from_time");
        var year = filter.getAsIntegerWithDefault("from_year", time.getFullYear());
        var month = filter.getAsIntegerWithDefault("from_month", time.getMonth());
        var day = filter.getAsIntegerWithDefault("from_day", time.getDay());
        var hour = filter.getAsIntegerWithDefault("from_hour", time.getHours());
        var minute = filter.getAsIntegerWithDefault("from_minute", time.getMinutes());

        return this.composeRange(timeHorizon, year, month, day, hour, minute);
    }

    public static composeToRangeFromFilter(timeHorizon: TimeHorizonV1, filter: FilterParams): number {
        // Define to time
        var time = filter.getAsDateTime("to_time");
        var year = filter.getAsIntegerWithDefault("to_year", time.getFullYear());
        var month = filter.getAsIntegerWithDefault("to_month", time.getMonth());
        var day = filter.getAsIntegerWithDefault("to_day", time.getDay());
        var hour = filter.getAsIntegerWithDefault("to_hour", time.getHours());
        var minute = filter.getAsIntegerWithDefault("to_minute", time.getMinutes());

        return this.composeRange(timeHorizon, year, month, day, hour, minute);
    }
}


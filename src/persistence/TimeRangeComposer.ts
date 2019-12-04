import { FilterParams } from 'pip-services3-commons-node';

import { TimeHorizonV1 } from '../data/version1/TimeHorizonV1';
import { MetricUpdateV1 } from '../data/version1/MetricUpdateV1';

export class TimeRangeComposer {

    public static composeRange(timeHorizon: number,
        year: number, month: number, day: number, hour: number, minute: number): number {
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

    public static composeRangeFromUpdate(timeHorizon: number, update: MetricUpdateV1): number {
        return this.composeRange(timeHorizon, update.year, update.month, update.day, update.hour, update.minute);
    }

    public static composeFromRangeFromFilter(timeHorizon: number, filter: FilterParams): number {
        // Define from time
        let time = filter.getAsDateTime("from_time");
        let year = filter.getAsIntegerWithDefault("from_year", time.getFullYear());
        let month = filter.getAsIntegerWithDefault("from_month", time.getMonth());
        let day = filter.getAsIntegerWithDefault("from_day", time.getDay());
        let hour = filter.getAsIntegerWithDefault("from_hour", time.getHours());
        let minute = filter.getAsIntegerWithDefault("from_minute", time.getMinutes());

        return this.composeRange(timeHorizon, year, month, day, hour, minute);
    }

    public static composeToRangeFromFilter(timeHorizon: number, filter: FilterParams): number {
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


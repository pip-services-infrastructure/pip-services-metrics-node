import { FilterParams } from 'pip-services3-commons-node';

import { TimeHorizonV1 } from '../data/version1';
import { MetricUpdateV1 } from '../data/version1';

export class TimeIndexComposer {

    public static composeIndex(timeHorizon: number, year: number, month: number,
        day: number, hour: number, minute: number): string {
        switch (timeHorizon) {
            case TimeHorizonV1.Total:
                return "total";
            case TimeHorizonV1.Year:
                return "" + year;
            case TimeHorizonV1.Month:
                return "" + (year * 100 + month);
            case TimeHorizonV1.Day:
                return "" + (year * 10000 + month * 100 + day);
            case TimeHorizonV1.Hour:
                return "" + (year * 1000000 + month * 10000 + day * 100 + hour);
            case TimeHorizonV1.Minute:
                minute = (minute / 15) * 15;
                return "" + (year * 100000000 + month * 1000000 + day * 10000 + hour * 100 + minute);
            default:
                return "";
        }
    }

    public static composeIndexFromUpdate(timeHorizon: number, update: MetricUpdateV1): string {
        return this.composeIndex(timeHorizon, update.year, update.month, update.day, update.hour, update.minute);
    }

    public static composeFromIndexFromFilter(timeHorizon: number, filter: FilterParams): string {
        // Define from time
        let time = filter.getAsDateTime("from_time");
        let year = filter.getAsIntegerWithDefault("from_year", time.getUTCFullYear());
        let month = filter.getAsIntegerWithDefault("from_month", time.getUTCMonth() + 1);
        let day = filter.getAsIntegerWithDefault("from_day", time.getUTCDate());
        let hour = filter.getAsIntegerWithDefault("from_hour", time.getUTCHours());
        let minute = filter.getAsIntegerWithDefault("from_minute", time.getUTCMinutes());

        return this.composeIndex(timeHorizon, year, month, day, hour, minute);
    }

    public static composeToIndexFromFilter(timeHorizon: number, filter: FilterParams): string {
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

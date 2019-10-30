
import { TimeHorizonV1 } from '../data/version1';
import { MetricUpdateV1 } from '../data/version1';
import { FilterParams } from 'pip-services3-commons-node';

    export class TimeIndexComposer
    {
        public static  composeIndex(timeHorizon:TimeHorizonV1, year:number, month:number, 
            day:number, hour:number, minute:number):string
        {
            switch (timeHorizon)
            {
                case TimeHorizonV1.Total:
                    return "total";
                case TimeHorizonV1.Year:
                    return year.toString();
                case TimeHorizonV1.Month:
                    return (year * 100 + month).toString();
                case TimeHorizonV1.Day:
                    return (year * 10000 + month * 100 + day).toString();
                case TimeHorizonV1.Hour:
                    return (year * 1000000 + month * 10000 + day * 100 + hour).toString();
                case TimeHorizonV1.Minute:
                    minute = (minute / 15) * 15;
                    return (year * 100000000 + month * 1000000 + day * 10000 + hour * 100 + minute).toString();
                default:
                    return "";
            }
        }

        public static  composeIndexFromUpdate( timeHorizon:TimeHorizonV1, update:MetricUpdateV1):string
        {
            return this.composeIndex(timeHorizon, update.year, update.month, update.day, update.hour, update.minute);
        }

        public static composeFromIndexFromFilter(timeHorizon:TimeHorizonV1, filter:FilterParams):string
        {
            // Define from time
            var time = filter.getAsDateTime("from_time");
            var year = filter.getAsIntegerWithDefault("from_year", time.getFullYear());
            var month = filter.getAsIntegerWithDefault("from_month", time.getMonth());
            var day = filter.getAsIntegerWithDefault("from_day", time.getDay());
            var hour = filter.getAsIntegerWithDefault("from_hour", time.getHours());
            var minute = filter.getAsIntegerWithDefault("from_minute", time.getMinutes());

            return this.composeIndex(timeHorizon, year, month, day, hour, minute);
        }

        public static composeToIndexFromFilter(timeHorizon:TimeHorizonV1, filter:FilterParams):string
        {
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


let _ = require('lodash');
import { TimeHorizonV1 } from '../data/version1';
import { IntegerConverter } from 'pip-services3-commons-node';

    export class TimeHorizonConverter
    {
        public static fromString(value:string):TimeHorizonV1
        {
            if (_.isNullOrEmpty(value))
                return TimeHorizonV1.Total;

            value = value.toLowerCase();//toLowerInvariant();

            if (value == "total")
                return TimeHorizonV1.Total;
            if (value == "year" || value == "yearly")
                return TimeHorizonV1.Year;
            if (value == "month" || value == "monthly")
                return TimeHorizonV1.Month;
            if (value == "day" || value == "daily")
                return TimeHorizonV1.Day;
            if (value == "hour" || value == "hourly")
                return TimeHorizonV1.Hour;

            var code:TimeHorizonV1 = IntegerConverter.toIntegerWithDefault(value, TimeHorizonV1.Total);
            return code;
        }
    }

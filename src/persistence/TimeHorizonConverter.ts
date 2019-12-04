let _ = require('lodash');

import { IntegerConverter } from 'pip-services3-commons-node';

import { TimeHorizonV1 } from '../data/version1/TimeHorizonV1';

export class TimeHorizonConverter {

    public static fromString(value: string): number {
        if (value == null || value == '')
            return TimeHorizonV1.Total;

        value = value.toLowerCase();

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

        let code = IntegerConverter.toIntegerWithDefault(value, TimeHorizonV1.Total);
        return code;
    }

}

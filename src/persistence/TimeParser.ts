import { TimeHorizonV1 } from '../data/version1';
import { MetricValueV1 } from '../data/version1';
import { IntegerConverter } from 'pip-services3-commons-node';

export class TimeParser {
    public static parseTime(token: string, timeHorizon: TimeHorizonV1, value: MetricValueV1) {
        if (timeHorizon == TimeHorizonV1.Total) {
            return;
        }
        if (token.length >= 4) {
            value.year = IntegerConverter.toInteger(token.substr(0, 4));
        }
        if (token.length >= 6) {
            value.month = IntegerConverter.toInteger(token.substr(4, 2));
        }
        if (token.length >= 8) {
            value.day = IntegerConverter.toInteger(token.substr(6, 2));
        }
        if (token.length >= 10) {
            value.hour = IntegerConverter.toInteger(token.substr(8, 2));
        }
        if (token.length >= 12) {
            value.minute = IntegerConverter.toInteger(token.substr(10, 2));
        }
    }
}
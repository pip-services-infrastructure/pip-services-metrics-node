import { TimeHorizonV1 } from '../data/version1';
import { MetricValueV1 } from '../data/version1';
export declare class TimeParser {
    static parseTime(token: string, timeHorizon: TimeHorizonV1, value: MetricValueV1): number;
}

import { TimeHorizonV1 } from '../data/version1/TimeHorizonV1';
import { MetricUpdateV1 } from '../data/version1/MetricUpdateV1';
import { FilterParams } from 'pip-services3-commons-node';
export declare class TimeRangeComposer {
    static composeRange(timeHorizon: TimeHorizonV1, year: number, month: number, day: number, hour: number, minute: number): number;
    static composeRangeFromUpdate(timeHorizon: TimeHorizonV1, update: MetricUpdateV1): number;
    static composeFromRangeFromFilter(timeHorizon: TimeHorizonV1, filter: FilterParams): number;
    static composeToRangeFromFilter(timeHorizon: TimeHorizonV1, filter: FilterParams): number;
}

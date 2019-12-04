import { FilterParams } from 'pip-services3-commons-node';
import { MetricUpdateV1 } from '../data/version1/MetricUpdateV1';
export declare class TimeRangeComposer {
    static composeRange(timeHorizon: number, year: number, month: number, day: number, hour: number, minute: number): number;
    static composeRangeFromUpdate(timeHorizon: number, update: MetricUpdateV1): number;
    static composeFromRangeFromFilter(timeHorizon: number, filter: FilterParams): number;
    static composeToRangeFromFilter(timeHorizon: number, filter: FilterParams): number;
}

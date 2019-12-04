import { FilterParams } from 'pip-services3-commons-node';
import { MetricUpdateV1 } from '../data/version1';
export declare class TimeIndexComposer {
    static composeIndex(timeHorizon: number, year: number, month: number, day: number, hour: number, minute: number): string;
    static composeIndexFromUpdate(timeHorizon: number, update: MetricUpdateV1): string;
    static composeFromIndexFromFilter(timeHorizon: number, filter: FilterParams): string;
    static composeToIndexFromFilter(timeHorizon: number, filter: FilterParams): string;
}

import { TimeHorizonV1 } from '../data/version1';
import { MetricUpdateV1 } from '../data/version1';
import { FilterParams } from 'pip-services3-commons-node';
export declare class TimeIndexComposer {
    static composeIndex(timeHorizon: TimeHorizonV1, year: number, month: number, day: number, hour: number, minute: number): string;
    static composeIndexFromUpdate(timeHorizon: TimeHorizonV1, update: MetricUpdateV1): string;
    static composeFromIndexFromFilter(timeHorizon: TimeHorizonV1, filter: FilterParams): string;
    static composeToIndexFromFilter(timeHorizon: TimeHorizonV1, filter: FilterParams): string;
}

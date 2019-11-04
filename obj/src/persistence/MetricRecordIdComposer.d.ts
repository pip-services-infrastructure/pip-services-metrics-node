import { TimeHorizonV1 } from '../data/version1';
import { MetricUpdateV1 } from '../data/version1';
export declare class MetricRecordIdComposer {
    private static composeTime;
    static composeId(name: string, timeHorizon: TimeHorizonV1, dimension1: string, dimension2: string, dimension3: string, year: number, month: number, day: number, hour: number, minute: number): string;
    static composeIdFromUpdate(timeHorizon: TimeHorizonV1, update: MetricUpdateV1): string;
}

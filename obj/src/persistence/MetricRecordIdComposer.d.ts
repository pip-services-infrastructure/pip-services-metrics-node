import { MetricUpdateV1 } from '../data/version1';
export declare class MetricRecordIdComposer {
    private static composeTime;
    static composeId(name: string, timeHorizon: number, dimension1: string, dimension2: string, dimension3: string, year: number, month: number, day: number, hour: number, minute: number): string;
    static composeIdFromUpdate(timeHorizon: number, update: MetricUpdateV1): string;
}

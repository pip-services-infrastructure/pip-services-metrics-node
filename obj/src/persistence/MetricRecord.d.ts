import { MetricRecordValue } from './MetricRecordValue';
export declare class MetricRecordValueMap {
    [key: string]: MetricRecordValue;
}
export declare class MetricRecord {
    id: string;
    name: string;
    th: number;
    rng: number;
    d1: string;
    d2: string;
    d3: string;
    val: MetricRecordValueMap;
}

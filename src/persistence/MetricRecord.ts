import { MetricRecordValue } from './MetricRecordValue';

export class MetricRecordValueMap {
    [key: string]: MetricRecordValue;
}

export class MetricRecord {
    public id: string;
    public name: string;
    public th: number;
    public rng: number;
    public d1: string;
    public d2: string;
    public d3: string;
    public val: MetricRecordValueMap;
}

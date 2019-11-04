import { MetricRecordValueV1 } from './MetricRecordValueV1';
import { TSMap } from 'typescript-map';
export declare class MetricRecordV1 {
    id: string;
    name: string;
    timeHorizon: number;
    range: number;
    dimension1: string;
    dimension2: string;
    dimension3: string;
    values: TSMap<string, MetricRecordValueV1>;
}

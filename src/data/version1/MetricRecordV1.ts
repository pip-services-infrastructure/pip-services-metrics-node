
import { MetricRecordValueV1 } from './MetricRecordValueV1'
import { TSMap } from 'typescript-map';

export class MetricRecordV1 {
    public id: string;
    public name: string;
    public timeHorizon: number;
    public range: number;
    public dimension1: string;
    public dimension2: string;
    public dimension3: string;
    public values: TSMap<string, MetricRecordValueV1>;
}

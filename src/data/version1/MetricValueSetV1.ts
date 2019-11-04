
import { MetricValueV1 } from './MetricValueV1';
import { TimeHorizonV1 } from './TimeHorizonV1';

export class MetricValueSetV1 {
    public name: string;
    public timeHorizon: TimeHorizonV1;
    public dimension1: string;
    public dimension2: string;
    public dimension3: string;
    public values: Array<MetricValueV1>;
}
import { MetricValueV1 } from './MetricValueV1';
import { TimeHorizonV1 } from './TimeHorizonV1';
export declare class MetricValueSetV1 {
    name: string;
    timeHorizon: TimeHorizonV1;
    dimension1: string;
    dimension2: string;
    dimension3: string;
    values: Array<MetricValueV1>;
}

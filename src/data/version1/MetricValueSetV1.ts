
import {MetricValueV1} from './MetricValueV1';
import {TimeHorizonV1} from './TimeHorizonV1';

export class MetricValueSetV1
{ 
    public name:string;
    public TimeHorizon:TimeHorizonV1;
    public Dimension1:string;
    public Dimension2:string;
    public Dimension3:string;
    public Values:Array<MetricValueV1>;
}
import { CommandSet } from 'pip-services3-commons-node';
import { IMetricsController } from './IMetricsController';
export declare class MetricsCommandSet extends CommandSet {
    private _controller;
    constructor(controller: IMetricsController);
    private makeGetMetricDefinitionsCommand;
    private makeGetMetricDefinitionByNameCommand;
    private makeGetMetricsByFilterCommand;
    private makeUpdateMetricCommand;
    private makeUpdateMetricsCommand;
}

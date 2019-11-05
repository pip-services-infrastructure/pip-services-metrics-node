import { ConfigParams } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { MetricDefinitionV1 } from '../data/version1';
import { MetricUpdateV1 } from '../data/version1';
import { TimeHorizonV1 } from '../data/version1';
import { IMetricsController } from './IMetricsController';
import { MetricValueSetV1 } from '../data/version1/MetricValueSetV1';
export declare class MetricsController implements ICommandable, IMetricsController, IConfigurable, IReferenceable {
    private _defaultConfig;
    private _persistence;
    private _commandSet;
    private _dependencyResolver;
    component: string;
    constructor();
    setReferences(references: IReferences): void;
    configure(config: ConfigParams): void;
    getCommandSet(): CommandSet;
    private getMetricDefinitionsName;
    getMetricDefinitions(correlationId: string, callback: (err: any, items: Array<MetricDefinitionV1>) => void): void;
    getMetricDefinitionByName(correlationId: string, name: string, callback: (err: any, item: MetricDefinitionV1) => void): void;
    updateMetric(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1): void;
    updateMetrics(correlationId: string, updates: MetricUpdateV1[], maxTimeHorizon: TimeHorizonV1): void;
    getMetricsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricValueSetV1>) => void): void;
}

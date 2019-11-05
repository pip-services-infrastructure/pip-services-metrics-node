import { MetricDefinitionV1 } from '../../data/version1';
import { TimeHorizonV1 } from '../../data/version1';
import { MetricUpdateV1 } from '../../data/version1';
import { MetricValueSetV1 } from '../../data/version1';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
export interface IMetricsClientV1 {
    getMetricDefinitions(correlationId: string, callback: (err: any, items: Array<MetricDefinitionV1>) => void): void;
    getMetricDefinitionByName(correlationId: string, name: string, callback: (err: any, item: MetricDefinitionV1) => void): void;
    getMetricsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricValueSetV1>) => void): void;
    updateMetric(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1): void;
    updateMetrics(correlationId: string, updates: MetricUpdateV1[], maxTimeHorizon: TimeHorizonV1): void;
}

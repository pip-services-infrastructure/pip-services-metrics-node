
import { IMetricsClientV1 } from './IMetricsClientV1';
import { MetricDefinitionV1 } from '../../data/version1/MetricDefinitionV1';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { MetricUpdateV1 } from '../../data/version1/MetricUpdateV1';
import { TimeHorizonV1 } from '../../data/version1/TimeHorizonV1';
import { DataPage } from 'pip-services3-commons-node';
import { MetricValueSetV1 } from '../../data/version1/MetricValueSetV1';

export class MetricsNullClientV1
    implements IMetricsClientV1 {
    public getMetricDefinitions(correlationId: string, callback: (err: any, items: Array<MetricDefinitionV1>) => void) {
        callback(null, null);
    }

    public getMetricDefinitionByName(correlationId: string, name: string, callback: (err: any, item: MetricDefinitionV1) => void) {
        callback(null, null);
    }

    public getMetricsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricValueSetV1>) => void) {
        callback(null, null);
    }

    public updateMetric(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1) {

    }

    public updateMetrics(correlationId: string, updates: MetricUpdateV1[], maxTimeHorizon: TimeHorizonV1) {

    }
}


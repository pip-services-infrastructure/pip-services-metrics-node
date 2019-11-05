import { MetricDefinitionV1 } from '../../data/version1';
import { TimeHorizonV1 } from '../../data/version1';
import { MetricUpdateV1 } from '../../data/version1';
import { MetricValueSetV1 } from '../../data/version1';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

/// The client interface of Enterprise.Metrics service.</summary>
export interface IMetricsClientV1 {

    /// Gets the metric definitions.
    /// <param name="correlationId">The correlation identifier.</param>
    getMetricDefinitions(correlationId: string, callback: (err: any, items: Array<MetricDefinitionV1>) => void): void;

    /// <summary>Gets the metric definition by name .</summary>
    /// <param name="correlationId">The correlation identifier.</param>
    /// <param name="name">The name.</param>
    getMetricDefinitionByName(correlationId: string, name: string, callback: (err: any, item: MetricDefinitionV1) => void): void;

    /// <summary>Gets the metrics by filter asynchronous.</summary>
    /// <param name="correlationId">The correlation identifier.</param>
    /// <param name="filter">The filter.</param>
    /// <param name="paging">The paging.</param>
    getMetricsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricValueSetV1>) => void): void;

    /// <summary>Updates the metric asynchronous.</summary>
    /// <param name="correlationId">The correlation identifier.</param>
    /// <param name="update">The update.</param>
    /// <param name="maxTimeHorizon">The maximum time horizon.</param>
    updateMetric(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1): void;

    /// <summary>Updates the metrics asynchronous.</summary>
    /// <param name="correlationId">The correlation identifier.</param>
    /// <param name="updates">The updates.</param>
    /// <param name="maxTimeHorizon">The maximum time horizon.</param>
    updateMetrics(correlationId: string, updates: MetricUpdateV1[], maxTimeHorizon: TimeHorizonV1): void;
}

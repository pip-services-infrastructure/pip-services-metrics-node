import { DirectClient } from 'pip-services3-rpc-node';
import { IMetricsClientV1 } from './IMetricsClientV1';
import { IMetricsController } from '../../logic/IMetricsController';
import { Descriptor } from 'pip-services3-commons-node';
import { MetricDefinitionV1 } from '../../data/version1/MetricDefinitionV1';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { MetricUpdateV1 } from '../../data/version1/MetricUpdateV1';
import { TimeHorizonV1 } from '../../data/version1/TimeHorizonV1';
import { DataPage } from 'pip-services3-commons-node';
import { MetricValueSetV1 } from '../../data/version1/MetricValueSetV1';

export class MetricsDirectClientV1
    extends DirectClient<IMetricsController>
    implements IMetricsClientV1 {
    public constructor() {
        super();
        this._dependencyResolver.put("controller", new Descriptor("metrics", "controller", "*", "*", "*"));
    }

    public getMetricDefinitions(correlationId: string, callback: (err: any, items: Array<MetricDefinitionV1>) => void) {
        let timing = this.instrument(correlationId, 'metrics.get_metric_definitions');
        this._controller.getMetricDefinitions(correlationId, (err, items) => {
            timing.endTiming();
            callback(err, items);
        });

    }

    public getMetricDefinitionByName(correlationId: string, name: string, callback: (err: any, item: MetricDefinitionV1) => void) {
        let timing = this.instrument(correlationId, 'metrics.get_metric_definition_by_name');
        this._controller.getMetricDefinitionByName(correlationId, name, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }

    public getMetricsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricValueSetV1>) => void) {
        filter = filter || new FilterParams();
        paging = paging || new PagingParams();

        let timing = this.instrument(correlationId, 'metrics.get_metrics_by_filter');
        this._controller.getMetricsByFilter(correlationId, filter, paging, (err, page) => {
            timing.endTiming();
            callback(err, page);
        });
    }

    public updateMetric(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1) {
        let timing = this.instrument(correlationId, 'metrics.update_metric');
        this._controller.updateMetric(correlationId, update, maxTimeHorizon);
        timing.endTiming();
    }

    public updateMetrics(correlationId: string, updates: MetricUpdateV1[], maxTimeHorizon: TimeHorizonV1) {
        let timing = this.instrument(correlationId, 'metrics.update_metrics');
        this._controller.updateMetrics(correlationId, updates, maxTimeHorizon);
        timing.endTiming();
    }
}


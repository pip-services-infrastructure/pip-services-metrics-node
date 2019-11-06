import { CommandableHttpClient } from 'pip-services3-rpc-node'
import { IMetricsClientV1 } from './IMetricsClientV1';
import { MetricDefinitionV1 } from '../../data/version1/MetricDefinitionV1';
import { MetricValueSetV1 } from '../../data/version1/MetricValueSetV1'
import { MetricUpdateV1 } from '../../data/version1/MetricUpdateV1'
import { TimeHorizonV1 } from '../../data/version1/TimeHorizonV1'

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

    export class MetricsHttpClientV1 
    extends CommandableHttpClient 
    implements IMetricsClientV1
    {
         constructor(){
            super("v1/metrics");
         }

        public getMetricDefinitions(correlationId: string, callback: (err: any, items: Array<MetricDefinitionV1>) => void)
        {
            this.callCommand(
                "get_metric_definitions",
                correlationId,
                {}, 
                callback
            );
        }

        public getMetricDefinitionByName(correlationId: string, name: string, callback: (err: any, item: MetricDefinitionV1) => void)
        {
            this.callCommand(
                "get_metric_definition_by_name",
                correlationId,
                { 
                    name:name 
                }, 
                callback
            );
        }

        public getMetricsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricValueSetV1>) => void)
        {
            this.callCommand(
                "get_metrics_by_filter",
                correlationId,
                {
                    filter: filter || new FilterParams(),
                    paging: paging || new PagingParams()
                }, 
                callback
            );
        }

        public updateMetric(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1)
        {
            this.callCommand(
                "update_metric",
                correlationId,
                {
                    update:update,
                    max_time_horizon:maxTimeHorizon
                }, 
                null
            );              
        }

        public updateMetrics(correlationId: string, updates: MetricUpdateV1[], maxTimeHorizon: TimeHorizonV1)
        {
            this.callCommand(
                "update_metrics",
                correlationId,
                {
                    updates: updates,
                    max_time_horizon : maxTimeHorizon
                }, 
                null
            );              
        }

    }

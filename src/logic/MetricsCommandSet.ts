import { CommandSet, DataPage } from 'pip-services3-commons-node';
import { IMetricsController } from './IMetricsController';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node'
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { MetricUpdateV1Schema } from '../data/version1/MetricUpdateV1Schema';
import { TimeHorizonV1 } from '../data/version1/TimeHorizonV1';
import { ArraySchema } from 'pip-services3-commons-node';
import { MetricDefinitionV1,} from '../data';
import { MetricValueSetV1 } from '../data';
import { MetricUpdateV1 } from '../data';
import { Parameters } from 'pip-services3-commons-node';

export class MetricsCommandSet extends CommandSet {
    private _controller: IMetricsController;

    constructor(controller: IMetricsController) {

        super();
        this._controller = controller;

        this.addCommand(this.makeGetMetricDefinitionsCommand());
        this.addCommand(this.makeGetMetricDefinitionByNameCommand());
        this.addCommand(this.makeGetMetricsByFilterCommand());
        this.addCommand(this.makeUpdateMetricCommand());
        this.addCommand(this.makeUpdateMetricsCommand());
    }

    private makeGetMetricDefinitionsCommand(): ICommand {
        return new Command(
            "get_metric_definitions",
            new ObjectSchema(),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                this._controller.getMetricDefinitions(correlationId, callback);
            });
    }

    private makeGetMetricDefinitionByNameCommand(): ICommand {
        return new Command(
            "get_metric_definition_by_name",
            new ObjectSchema()
                .withOptionalProperty("name", TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let name = args.getAsString("name");
                this._controller.getMetricDefinitionByName(correlationId, name, callback);
            });
    }

    private makeGetMetricsByFilterCommand(): ICommand {
        return new Command(
            "get_metrics_by_filter",
            new ObjectSchema(true)
                .withOptionalProperty("filter", new FilterParamsSchema())
                .withOptionalProperty("paging", new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._controller.getMetricsByFilter(correlationId, filter, paging, callback);
            });
    }

    private makeUpdateMetricCommand(): ICommand {
        return new Command(
            "update_metric",
            new ObjectSchema(true)
                .withRequiredProperty("update", new MetricUpdateV1Schema())
                .withOptionalProperty("max_time_horizon", TypeCode.Long),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                var update = args.getAsObject("update");
                var maxTimeHorizon = args.getAsIntegerWithDefault("max_time_horizon", TimeHorizonV1.Hour);
                this._controller.updateMetric(correlationId, update, maxTimeHorizon);
            });
    }

    private makeUpdateMetricsCommand(): ICommand {
        return new Command(
            "update_metrics",
            new ObjectSchema(true)
                .withRequiredProperty("updates", new ArraySchema(new MetricUpdateV1Schema()))
                .withOptionalProperty("max_time_horizon", TypeCode.Long),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                var updates = args.getAsArray("updates");
                var maxTimeHorizon = args.getAsIntegerWithDefault("max_time_horizon", TimeHorizonV1.Hour);
                this._controller.updateMetrics(correlationId, updates, maxTimeHorizon);
                return null;
            });
    }
}


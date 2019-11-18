﻿
import { ConfigParams } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node'
import { DependencyResolver } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { MetricsCommandSet } from './MetricsCommandSet';
import { IMetricsPersistence } from '../persistence';
import { MetricsConstants } from '../data/version1'
import { Descriptor } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { MetricDefinitionV1 } from '../data/version1';
import { isUndefined } from 'util';
import { TimeHorizonConverter } from '../persistence';
import { TimeIndexComposer } from '../persistence';
import { MetricUpdateV1 } from '../data/version1';
import { TimeHorizonV1 } from '../data/version1';
import { IMetricsController } from './IMetricsController';
import { MetricValueSetV1 } from '../data/version1/MetricValueSetV1';
import { MetricValueV1 } from '../data/version1/MetricValueV1';
import { TimeParser } from '../persistence/TimeParser';

export class MetricsController
    implements ICommandable, IMetricsController, IConfigurable, IReferenceable {

    private _defaultConfig: ConfigParams = ConfigParams.fromTuples("dependencies.persistence", "pip-services-metrics:persistence:*:*:1.0");

    private _persistence: IMetricsPersistence;
    private _commandSet: MetricsCommandSet;
    private _dependencyResolver: DependencyResolver;

    public component: string = MetricsConstants.MetricsController;

    constructor() {
        this._dependencyResolver = new DependencyResolver(this._defaultConfig);
    }

    public setReferences(references: IReferences): void {
        this._persistence = references.getOneRequired<IMetricsPersistence>(
            new Descriptor('pip-services-metrics', 'persistence', '*', '*', '1.0')
        );
    }

    public configure(config: ConfigParams): void {
        //this._dependencyResolver.configure(config);
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null) {
            this._commandSet = new MetricsCommandSet(this);
        }
        return this._commandSet;
    }

    private getMetricDefinitionsName(correlationId: string, name: string, callback: (err: any, items: Array<MetricDefinitionV1>) => void) {
        var filter = FilterParams.fromTuples(
            "name", name,
            "time_horizon", 0
        );

        let take = 500;
        let paging = new PagingParams(0, take);
        let error: any = null;
        let count: number;

        let definitions = new Map<string, MetricDefinitionV1>();
        while (true) {
            this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
                let definition: MetricDefinitionV1;
                count = page.data.length;
                page.data.forEach((record, index, arr) => {
                    definition = definitions.get(record.name);
                    if (isUndefined(definition)) {
                        definition = new MetricDefinitionV1();
                        definition.name = record.name;
                        definition.dimension1 = new Array<string>();
                        definition.dimension2 = new Array<string>();
                        definition.dimension3 = new Array<string>();
                    }

                    if (record.dimension1 != null && !(definition.dimension1.indexOf(record.dimension1) >= 0)) {
                        definition.dimension1.push(record.dimension1);
                    }
                    if (record.dimension2 != null && !(definition.dimension2.indexOf(record.dimension2) >= 0)) {
                        definition.dimension2.push(record.dimension2);
                    }
                    if (record.dimension3 != null && !(definition.dimension3.indexOf(record.dimension3) >= 0)) {
                        definition.dimension3.push(record.dimension3);
                    }
                    definitions.set(record.name, definition);
                });
                error = err;
            });
            if (error) break;

            if (count > 0)
                paging.skip += take;
            else
                break;

        }
        callback(error, Array.from(definitions.values()));
    }

    public getMetricDefinitions(correlationId: string, callback: (err: any, items: Array<MetricDefinitionV1>) => void) {
        return this.getMetricDefinitionsName(correlationId, null, callback);
    }

    public getMetricDefinitionByName(correlationId: string, name: string, callback: (err: any, item: MetricDefinitionV1) => void) {
        this.getMetricDefinitionsName(correlationId, name, (err, items) => {
            callback(err, items.length > 0 ? items[0] : null);
        });
    }

    public updateMetric(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1) {
        this._persistence.updateOne(correlationId, update, maxTimeHorizon);
    }

    public updateMetrics(correlationId: string, updates: MetricUpdateV1[], maxTimeHorizon: TimeHorizonV1) {
        this._persistence.updateMany(correlationId, updates, maxTimeHorizon);
    }

    public getMetricsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricValueSetV1>) => void) {
        var timeHorizon = TimeHorizonConverter.fromString(filter.getAsNullableString("time_horizon"));
        var fromIndex = TimeIndexComposer.composeFromIndexFromFilter(timeHorizon, filter);
        var toIndex = TimeIndexComposer.composeToIndexFromFilter(timeHorizon, filter);
        // Convert records into value sets
        let sets = new Map<string, MetricValueSetV1>();

        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {

            for (let record of page.data) {
                // Generate index
                let id = record.name + "_" + record.dimension1
                    + "_" + record.dimension2
                    + "_" + record.dimension3;

                // Get or create value set
                let set: MetricValueSetV1;
                set = sets.get(id);
                if (isUndefined(set)) {
                    set = new MetricValueSetV1();
                    set.name = record.name;
                    set.timeHorizon = record.timeHorizon;
                    set.dimension1 = record.dimension1;
                    set.dimension2 = record.dimension2;
                    set.dimension3 = record.dimension3;
                    set.values = new Array<MetricValueV1>()
                    sets.set(id, set);
                }

                for (let key in record.values) {
                    if (key.localeCompare(fromIndex) < 0 || key.localeCompare(toIndex) > 0)
                        return;

                    var value = new MetricValueV1();
                    TimeParser.parseTime(key, timeHorizon, value);
                    value.count = record.values[key].count;
                    value.sum = record.values[key].sum;
                    value.min = record.values[key].min;
                    value.max = record.values[key].max;
                    set.values.push(value);

                };
            }
            callback(err, new DataPage<MetricValueSetV1>(Array.from(sets.values()), page.total));
        });
    }
}
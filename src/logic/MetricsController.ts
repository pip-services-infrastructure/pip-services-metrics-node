let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node'
import { DependencyResolver } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { MetricDefinitionV1 } from '../data/version1/MetricDefinitionV1';
import { MetricUpdateV1 } from '../data/version1/MetricUpdateV1';
import { MetricValueSetV1 } from '../data/version1/MetricValueSetV1';
import { MetricValueV1 } from '../data/version1/MetricValueV1';
import { IMetricsPersistence } from '../persistence/IMetricsPersistence';
import { TimeHorizonConverter } from '../persistence/TimeHorizonConverter';
import { TimeIndexComposer } from '../persistence/TimeIndexComposer';
import { TimeParser } from '../persistence/TimeParser';

import { MetricsCommandSet } from './MetricsCommandSet';
import { IMetricsController } from './IMetricsController';

export class MetricsController
    implements ICommandable, IMetricsController, IConfigurable, IReferenceable {

    private _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "dependencies.persistence", "pip-services-metrics:persistence:*:*:1.0"
    );

    private _persistence: IMetricsPersistence;
    private _commandSet: MetricsCommandSet;
    private _dependencyResolver: DependencyResolver;

    constructor() {
        this._dependencyResolver = new DependencyResolver(this._defaultConfig);
    }

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);

        this._persistence = this._dependencyResolver.getOneRequired<IMetricsPersistence>("persistence");
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null) {
            this._commandSet = new MetricsCommandSet(this);
        }
        return this._commandSet;
    }

    private getMetricDefinitionsWithName(correlationId: string, name: string,
        callback: (err: any, items: MetricDefinitionV1[]) => void) {

        let filter = FilterParams.fromTuples(
            "name", name,
            "time_horizon", 0
        );

        let take = 500;
        let paging = new PagingParams(0, take);

        let definitions = {};
        let reading: boolean = true;

        async.whilst(
            () =>  { return reading; },
            (callback) => {
                this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    for (let record of page.data) {
                        let definition: MetricDefinitionV1 = definitions[record.name];
                        if (definition == null) {
                            definition = {
                                name: record.name,
                                dimension1: [],
                                dimension2: [],
                                dimension3: []
                            };

                            definitions[record.name] = definition;
                        }

                        if (record.d1 != null && _.indexOf(definition.dimension1, record.d1) < 0) {
                            definition.dimension1.push(record.d1);
                        }
                        if (record.d2 != null && _.indexOf(definition.dimension2, record.d2) < 0) {
                            definition.dimension2.push(record.d2);
                        }
                        if (record.d3 != null && _.indexOf(definition.dimension3, record.d3) < 0) {
                            definition.dimension3.push(record.d3);
                        }
                    }

                    if (page.data.length > 0)
                        paging.skip += take;
                    else
                        reading = false;

                    callback(null);    
                });
            },
            (err) => {
                let values = _.values(definitions);
                callback(err, values);
            }
        );
    }

    public getMetricDefinitions(correlationId: string,
        callback: (err: any, items: MetricDefinitionV1[]) => void) {
        return this.getMetricDefinitionsWithName(correlationId, null, callback);
    }

    public getMetricDefinitionByName(correlationId: string, name: string,
        callback: (err: any, item: MetricDefinitionV1) => void) {
        this.getMetricDefinitionsWithName(correlationId, name, (err, items) => {
            callback(err, items.length > 0 ? items[0] : null);
        });
    }

    public getMetricsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricValueSetV1>) => void) {
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            let timeHorizon = TimeHorizonConverter.fromString(filter.getAsNullableString("time_horizon"));
            let fromIndex = TimeIndexComposer.composeFromIndexFromFilter(timeHorizon, filter);
            let toIndex = TimeIndexComposer.composeToIndexFromFilter(timeHorizon, filter);
    
            // Convert records into value sets
            let sets = {};
    
            for (let record of page.data) {
                // Generate index
                let id = record.name + "_" + (record.d1 || "")
                    + "_" + (record.d2 || "")
                    + "_" + (record.d3 || "");

                // Get or create value set
                let set: MetricValueSetV1 = sets[id];
                if (set == null) {
                    set = {
                        name: record.name,
                        time_horizon: record.th,
                        dimension1: record.d1,
                        dimension2: record.d2,
                        dimension3: record.d3,
                        values: []
                    }
                    sets[id] = set;
                }

                for (let key in record.val) {
                    if (key < fromIndex || key > toIndex)
                        return;

                    let value = new MetricValueV1();
                    TimeParser.parseTime(key, timeHorizon, value);
                    value.count = record.val[key].cnt;
                    value.sum = record.val[key].sum;
                    value.min = record.val[key].min;
                    value.max = record.val[key].max;

                    set.values.push(value);
                };
            }

            let total = page.total;
            let values = _.values(sets);

            callback(err, new DataPage<MetricValueSetV1>(values, total));
        });
    }

    public updateMetric(correlationId: string, update: MetricUpdateV1,
        maxTimeHorizon: number, callback: (err: any) => void) {
        this._persistence.updateOne(correlationId, update, maxTimeHorizon, callback);
    }

    public updateMetrics(correlationId: string, updates: MetricUpdateV1[],
        maxTimeHorizon: number, callback: (err: any) => void) {
        this._persistence.updateMany(correlationId, updates, maxTimeHorizon, callback);
    }

}
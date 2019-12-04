import { ConfigParams } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IReconfigurable } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { MetricUpdateV1 } from '../data/version1/MetricUpdateV1';
import { MetricRecord } from './MetricRecord';
import { IMetricsPersistence } from './IMetricsPersistence';
export declare class MetricsMemoryPersistence extends IdentifiableMemoryPersistence<MetricRecord, string> implements IReconfigurable, IMetricsPersistence {
    private readonly TimeHorizons;
    protected _maxPageSize: number;
    constructor();
    configure(config: ConfigParams): void;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricRecord>) => void): void;
    updateOne(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: number, callback?: (err: any) => void): void;
    updateMany(correlationId: string, updates: MetricUpdateV1[], maxTimeHorizon: number, callback?: (err: any) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback?: (err: any) => void): void;
}

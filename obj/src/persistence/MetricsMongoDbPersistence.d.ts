import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { MetricRecordV1 } from '../data/version1';
import { IMetricsPersistence } from './IMetricsPersistence';
import { TimeHorizonV1 } from '../data/version1';
import { ConfigParams } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { MetricUpdateV1 } from '../data/version1';
export declare class MetricsMongoDbPersistence extends IdentifiableMongoDbPersistence<MetricRecordV1, string> implements IMetricsPersistence {
    private readonly TimeHorizons;
    protected _maxPageSize: number;
    constructor();
    configure(config: ConfigParams): void;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricRecordV1>) => void): void;
    set(correlationId: string, item: MetricRecordV1, callback?: (err: any, item: MetricRecordV1) => void): void;
    updateOne(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1): void;
    updateMany(correlationId: string, updates: Array<MetricUpdateV1>, maxTimeHorizon: TimeHorizonV1): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback?: (err: any) => void): void;
}

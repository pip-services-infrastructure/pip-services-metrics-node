import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { MetricRecordV1 } from '../data/version1/MetricRecordV1';
import { MetricUpdateV1 } from '../data/version1';
import { TimeHorizonV1 } from '../data/version1';
import { ILoader, ISaver } from 'pip-services3-data-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IMetricsPersistence } from './IMetricsPersistence';
import { IReconfigurable } from 'pip-services3-commons-node';
export declare class MetricsMemoryPersistence extends IdentifiableMemoryPersistence<MetricRecordV1, string> implements IReconfigurable, IMetricsPersistence {
    private readonly TimeHorizons;
    protected _maxPageSize: number;
    constructor();
    constructor(loader: ILoader<MetricRecordV1>, saver: ISaver<MetricRecordV1>);
    configure(config: ConfigParams): void;
    private composeFilter;
    getPageByFilter(correlationId: string, filterParams: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricRecordV1>) => void): void;
    updateOne(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: TimeHorizonV1): void;
    updateMany(correlationId: string, updates: Array<MetricUpdateV1>, maxTimeHorizon: TimeHorizonV1): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback?: (err: any) => void): void;
}

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { MetricUpdateV1 } from '../data/version1/MetricUpdateV1';
import { MetricRecord } from './MetricRecord';

export interface IMetricsPersistence {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricRecord>) => void): void;
    set(correlationId: string, item: MetricRecord, callback?: (err: any, item: MetricRecord) => void): void;
    updateOne(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: number, callback?: (err: any) => void): void;
    updateMany(correlationId: string, updates: MetricUpdateV1[], maxTimeHorizon: number, callback?: (err: any) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback?: (err: any) => void): void;
}


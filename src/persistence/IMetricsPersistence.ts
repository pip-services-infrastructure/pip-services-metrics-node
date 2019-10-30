
import { TimeHorizonV1 } from '../data/version1';
import { MetricUpdateV1 } from '../data/version1';
import { MetricRecordV1 } from '../data/version1';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

export interface IMetricsPersistence {
    getPageByFilter(correlationId:string, filter:FilterParams, paging:PagingParams, callback: (err: any, page: DataPage<MetricRecordV1>) => void):void;
    set(correlationId:string, item:MetricRecordV1, callback?:(err:any, item:MetricRecordV1)=>void):void;
    updateOne(correlationId:string, update:MetricUpdateV1, maxTimeHorizon:TimeHorizonV1):void;
    updateMany(correlationId:string, updates:Array<MetricUpdateV1>, maxTimeHorizon:TimeHorizonV1):void;
    deleteByFilter(correlationId:string, filter:FilterParams):void;
}


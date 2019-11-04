import { MetricsMemoryPersistence } from './MetricsMemoryPersistence';
import { JsonFilePersister } from 'pip-services3-data-node';
import { MetricRecordV1 } from '../data/version1/MetricRecordV1';
import { ConfigParams } from 'pip-services3-commons-node';
export declare class MetricsFilePersistence extends MetricsMemoryPersistence {
    protected _persister: JsonFilePersister<MetricRecordV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}

import { MetricsMemoryPersistence } from './MetricsMemoryPersistence';
import { JsonFilePersister } from 'pip-services3-data-node';
import { MetricRecordV1 } from '../data/version1/MetricRecordV1';
import { ConfigParams } from 'pip-services3-commons-node';

export class MetricsFilePersistence extends MetricsMemoryPersistence {
    protected _persister: JsonFilePersister<MetricRecordV1>;

    constructor(path?: string) {
        super();
        this._persister = new JsonFilePersister<MetricRecordV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);

        this._persister.configure(config);
    }
}


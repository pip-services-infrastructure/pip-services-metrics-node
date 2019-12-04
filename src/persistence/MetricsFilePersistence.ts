import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';

import { MetricsMemoryPersistence } from './MetricsMemoryPersistence';
import { MetricRecord } from './MetricRecord';

export class MetricsFilePersistence extends MetricsMemoryPersistence {
    protected _persister: JsonFilePersister<MetricRecord>;

    constructor(path?: string) {
        super();
        this._persister = new JsonFilePersister<MetricRecord>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);

        this._persister.configure(config);
    }
}


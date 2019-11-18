import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';
import { MetricsServiceFactory } from '../build/MetricsServiceFactory';

export class MetricsProcess extends ProcessContainer {
    public constructor() {
        super("pip-services-metrics", "Analytical metrics microservice")

        this._factories.add(new DefaultRpcFactory());
        this._factories.add(new MetricsServiceFactory());
    }
}

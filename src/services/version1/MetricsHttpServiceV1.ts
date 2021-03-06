﻿import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class MetricsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super("v1/metrics");
        this._dependencyResolver.put("controller", new Descriptor("pip-services-metrics", "controller", "default", "*", "1.0"));
    }
}


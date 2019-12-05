# <img src="https://github.com/pip-services/pip-services/raw/master/design/Logo.png" alt="Pip.Services Logo" style="max-width:30%"> <br/> Clusters microservice

This is the metrics microservice. It keeps list of metrics.

This microservice is designed to manage various metrics characterizing the operation of a process.
Each metric has the following characteristics:
- metric name
- up to 3 types of measurements (in string format)
- date and time
is a numerical value characterizing the metric

When adding or updating a metric, statistics on the metric are automatically calculated for different time horizons (you can specify the depth of the horizon) with the calculation of the average, maximum, minimum and accumulated values ​​within each of them.

Data access is provided through a set of API functions

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process
* External APIs: HTTP/REST
* Persistence: Memory, Flat Files, MongoDB

This microservice has no dependencies on other microservices.
<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Deployment Guide](doc/Deployment.md)
* [Configuration Guide](doc/Configuration.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-infrastructure/pip-clients-metrics-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)
##  Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
// Create or update metric struct
class MetricUpdateV1 {
    public name: string;
    public year: number;
    public month: number;
    public day: number;
    public hour: number;
    public minute?: number;
    public dimension1?: string;
    public dimension2?: string;
    public dimension3?: string;
    public value: number;
}
// Metric definition struct
class MetricDefinitionV1 {
    public name: string;
    public dimension1: string[];
    public dimension2: string[];
    public dimension3: string[];
}
// Metric value struct
class MetricValueSetV1 {
    public name: string;
    public time_horizon: number;
    public dimension1: string;
    public dimension2: string;
    public dimension3: string;
    public values: MetricValueV1[];
}
// Values of metric
class MetricValueV1 {
    public year?: number;
    public month?: number;
    public day?: number;
    public hour?: number;
    public minute?: number;
    public count: number;
    public sum: number;
    public max: number;
    public min: number;
}
// Time horizons
class TimeHorizonV1 {
    public static Total: number = 0;
    public static Year: number = 1;
    public static Month: number = 2;
    public static Day: number = 3;
    public static Hour: number = 4;
    public static Minute: number = 5;
}

interface IMetricsController {
    getMetricDefinitions(correlationId: string, callback: (err: any, items: MetricDefinitionV1[]) => void): void;
    getMetricDefinitionByName(correlationId: string, name: string, callback: (err: any, item: MetricDefinitionV1) => void): void;
    getMetricsByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MetricValueSetV1>) => void): void;
    updateMetric(correlationId: string, update: MetricUpdateV1, maxTimeHorizon: number, callback: (err: any) => void): void;
    updateMetrics(correlationId: string, updates: MetricUpdateV1[], maxTimeHorizon: number, callback: (err: any) => void): void;
}

```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-infrastructure/pip-services-metrics-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yaml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yaml** file. 

Example of microservice configuration
```yaml
{    
---
- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "pip-services-metrics:persistence:file:default:1.0"
  path: "./data/blobs"

- descriptor: "pip-services-metrics:controller:default:default:1.0"

- descriptor: "pip-services-metrics:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 3000
}
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use
Inside your code get the reference to the client SDK
```typescript
 import { MetricsHttpClientV1 } from 'pip-clients-metrics-node';
```

Define client configuration parameters.

```typescript
// Client configuration
let httpConfig = ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 3000,
            'connection.host', 'localhost'
        );
client.configure(httpConfig);
```

Instantiate the client and open connection to the microservice
```typescript
// Create the client instance
client = new MetricssHttpClientV1();

// Connect to the microservice
client.open(null, function(err) {
    if (err) {
        console.error('Connection to the microservice failed');
        console.error(err);
        return;
    });
    // Work with the microservice
    ...

```
Now the client is ready to perform operations:

Update if exist metric or create otherwise:
```typescript 
    client.updateMetric(
                    null,
                    <MetricUpdateV1> {
                        name: "metric1",
                        dimension1: "A",
                        dimension2: "B",
                        dimension3: null,
                        year: 2018,
                        month: 8,
                        day: 26,
                        hour: 12,
                        value: 123
                    },
                    TimeHorizonV1.Hour,
                    (err: any)=>{
                        if (err != null) {
                            console.error('Update/create metric are failed');
                            console.error(err);
                        }
                    }
                );

```

Update if exist metrics or create otherwise::
```typescript 
    client.updateMetrics(
                    null,
                    [
                        <MetricUpdateV1> {
                            name: "metric1",
                            dimension1: "A",
                            dimension2: "B",
                            dimension3: null,
                            year: 2018,
                            month: 8,
                            day: 26,
                            hour: 13,
                            value: 321
                        },
                        <MetricUpdateV1> {
                            name: "metric2",
                            dimension1: "A",
                            dimension2: null,
                            dimension3: "C",
                            year: 2018,
                            month: 8,
                            day: 26,
                            hour: 13,
                            value: 321
                        }        
                    ],
                    TimeHorizonV1.Hour, 
                    (err: any)=>{
                        if (err != null) {
                            console.error('Update/create metric are failed');
                            console.error(err);
                        }
                    }    
                );

```

Get metrics by filter:
```typescript    
client.getMetricsByFilter(null,
                    FilterParams.fromTuples("name", "metric1"),
                    new PagingParams(),
                    (err, page) => {
                        if (err != null) {
                            console.error("Can\'t get metrics by filter");
                            console.error(err);
                            return;
                        }

                        console.log("Metrics:");
                        console.log(page.data);

                    }
);
    
```

Get all metrics definitions:
```typescript    
client.getMetricDefinitions(
                     null,
                     (err, definitions) => {
                     if (err != null) {
                            console.error("Can\'t get metrics definitions");
                            console.error(err);
                            return;
                        }

                        console.log("All metrics definition:");
                        console.log(definitions);
                    }
);
    
```

Get metric definition by name:
```typescript    
client.getMetricDefinitionByName(
                    null, 
                    "metric2", 
                    (err, definition) => {
                        if (err != null) {
                            console.error("Can\'t get metrics definition by name");
                            console.error(err);
                            return;
                        }

                        console.log("Metric definition name %s:", definition.name);
                        console.log(definition);
                });                
    
```

## Acknowledgements

This client SDK was created and currently maintained by *Sergey Seroukhov* and *Levichev Dmitry*.

# HTTP Protocol (version 1) <br/> Settings Microservice

Settings microservice implements a HTTP compatible API, that can be accessed on configured port.
All input and output data is serialized in JSON format. Errors are returned in [standard format]().

* [POST /v1/metrics/get_metric_definitions](#operation1)
* [POST /v1/metrics/get_metric_definition_by_name](#operation2)
* [POST /v1/metrics/get_metrics_by_filter](#operation3)
* [POST /v1/metrics/update_metric](#operation4)
* [POST /v1/metrics/update_metrics](#operation5)

## Operations

### <a name="operation1"></a> Method: 'POST', route '/v1/metrics/get_metric_definitions'

Get metric definitions.

**Request body:** 

**Response body:**
Array with retrieved metric definitions

### <a name="operation2"></a> Method: 'POST', route '/v1/metrics/get_metric_definition_by_name'

Get metric definition by name.

**Request body:** 
- name: string - definition name

**Response body:**
Metric definition

### <a name="operation3"></a> Method: 'POST', route '/v1/metrics/get_metrics_by_filter'

Get metrics by filter

**Request body:**
- filter: Object
  - name: string - (optional) unique metric name
  - names: string[] - (optional) unique metric names
  - time_horizon: number - (optional) TimeHorizon
  - dimension1: string - (optional) first dimension
  - dimension2: string - (optional) second dimension
  - dimension3: string - (optional) third dimension
- paging: Object
  - skip: int - (optional) start of page (default: 0). Operation returns paged result
  - take: int - (optional) page length (max: 100). Operation returns paged result

**Response body:**
Page with retrieved metrics value sets

### <a name="operation4"></a> Method: 'POST', route '/v1/metrics/update_metric'

Updates or create if not exist metric

**Request body:**
- update: MetricUpdateV1 - metric to update or create
- max_time_horizon: number - maximum time horizon

**Response body:**
Return occured error or null for success

### <a name="operation5"></a> Method: 'POST', route '/v1/metrics/update_metrics'

Updates or create if not exist metrics

**Request body:**
- updates: MetricUpdateV1[] - metric to update or create
- max_time_horizon: number - maximum time horizon

**Response body:**
Return occured error or null for success
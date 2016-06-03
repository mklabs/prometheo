# prometheo

```json
{
  "name": "prometheo",
  "version": "0.1.0",
  "description": "Prometheus REST API client for node and the browser",
  "main": "index.js",
  "devDependencies": {
    "eslint": "^2.11.0",
    "eslint-config-standard": "^5.3.1",
    "eslint-plugin-promise": "^1.3.1",
    "eslint-plugin-standard": "^1.3.2"
  }
}
```

---

**WIP**

---

> ~ https://prometheus.io/docs/querying/api/

## Expression queries

### Instant queries

The following endpoint evaluates an instant query at a single point in time:

    GET /api/v1/query
    URL query parameters:

    query=<string>: Prometheus expression query string.
    time=<rfc3339 | unix_timestamp>: Evaluation timestamp. Optional.
    The current server time is used if the time parameter is omitted.

The data section of the query result has the following format:

```json
{
  "resultType": "matrix" | "vector" | "scalar" | "string",
  "result": <value>
}
```

`<value>` refers to the query result data, which has varying formats depending
on the resultType. See the expression query result formats.


http://localhost:9090/api/v1/query?query=up&time=2015-07-01T20:10:51.781Z'

### Range queries

The following endpoint evaluates an expression query over a range of time:

    GET /api/v1/query_range
    URL query parameters:

    query=<string>: Prometheus expression query string.
    start=<rfc3339 | unix_timestamp>: Start timestamp.
    end=<rfc3339 | unix_timestamp>: End timestamp.
    step=<duration>: Query resolution step width.

The data section of the query result has the following format:

```json
{
  "resultType": "matrix",
  "result": <value>
}
```

For the format of the <value> placeholder, see the [range-vector](#range-vectors) result format.

The following example evaluates the expression up over a 30-second range with a query resolution of 15 seconds.

http://localhost:9090/api/v1/query_range?query=up&start=2015-07-01T20:10:30.781Z&end=2015-07-01T20:11:00.781Z&step=15s'

```json
{
   "status" : "success",
   "data" : {
      "resultType" : "matrix",
      "result" : [
         {
            "metric" : {
               "__name__" : "up",
               "job" : "prometheus",
               "instance" : "localhost:9090"
            },
            "values" : [
               [ 1435781430.781, "1" ],
               [ 1435781445.781, "1" ],
               [ 1435781460.781, "1" ]
            ]
         },
         {
            "metric" : {
               "__name__" : "up",
               "job" : "node",
               "instance" : "localhost:9091"
            },
            "values" : [
               [ 1435781430.781, "0" ],
               [ 1435781445.781, "0" ],
               [ 1435781460.781, "1" ]
            ]
         }
      ]
   }
}
```

## Querying metadata

### Finding series by label matchers

The following endpoint returns the list of time series that match a certain label set.

    GET /api/v1/series
    URL query parameters:

    match[]=<series_selector>: Repeated series selector argument that selects
    the series to return. At least one match[] argument must be provided.

The data section of the query result consists of a list of objects that contain
the label name/value pairs which identify each series.

The following example returns all series that match either of the selectors up
or process_start_time_seconds{job="prometheus"}:

http://localhost:9090/api/v1/series?match[]=up&match[]=process_start_time_seconds{job="prometheus"}

```json
{
   "status" : "success",
   "data" : [
      {
         "__name__" : "up",
         "job" : "prometheus",
         "instance" : "localhost:9090"
      },
      {
         "__name__" : "up",
         "job" : "node",
         "instance" : "localhost:9091"
      },
      {
         "__name__" : "process_start_time_seconds",
         "job" : "prometheus",
         "instance" : "localhost:9090"
      }
   ]
}
```

### Querying label values

The following endpoint returns a list of label values for a provided label name:

GET /api/v1/label/<label_name>/values
The data section of the JSON response is a list of string label names.

This example queries for all label values for the job label:

$ curl http://localhost:9090/api/v1/label/job/values
{
   "status" : "success",
   "data" : [
      "node",
      "prometheus"
   ]
}

## Deleting series

The following endpoint deletes matched series entirely from a Prometheus server:

    DELETE /api/v1/series
    URL query parameters:

    match[]=<series_selector>: Repeated label matcher argument that selects the series to delete. At least one match[] argument must be provided.

The data section of the JSON response has the following format:

```json
{
  "numDeleted": <number of deleted series>
}
```

The following example deletes all series that match either of the selectors up
or process_start_time_seconds{job="prometheus"}:

    $ curl -XDELETE -g 'http://localhost:9090/api/v1/series?match[]=up&match[]=process_start_time_seconds{job="prometheus"}'

```json
{
   "status" : "success",
   "data" : {
      "numDeleted" : 3
   }
}
```

## Expression query result formats

Expression queries may return the following response values in the result
property of the data section. <sample_value> placeholders are numeric sample
values. JSON does not support special float values such as NaN, Inf, and -Inf,
so sample values are transferred as quoted JSON strings rather than raw
numbers.

### Range vectors

Range vectors are returned as result type matrix. The corresponding result property has the following format:

```json
[
  {
    "metric": { "<label_name>": "<label_value>", ... },
    "values": [ [ <unix_time>, "<sample_value>" ], ... ]
  },
  ...
]
```


### Instant vectors

Instant vectors are returned as result type vector. The corresponding result property has the following format:

```json
[
  {
    "metric": { "<label_name>": "<label_value>", ... },
    "value": [ <unix_time>, "<sample_value>" ]
  },
  ...
]
```

### Scalars

Scalar results are returned as result type scalar. The corresponding result property has the following format:

```
[ <unix_time>, "<scalar_value>" ]
```

### Strings

String results are returned as result type string. The corresponding result property has the following format:

```
[ <unix_time>, "<string_value>" ]
```

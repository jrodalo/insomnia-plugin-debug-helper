# Insomnia Debug Helper

[![Npm Version](https://img.shields.io/npm/v/insomnia-plugin-debug-helper.svg)](https://www.npmjs.com/package/insomnia-plugin-debug-helper)

This is a simple plugin for [Insomnia](https://insomnia.rest) that allows users to open an error tracking service when a request fails.

## Installation

Install the `insomnia-plugin-debug-helper` plugin from Preferences > Plugins.

## Usage

This plugin uses a Request-ID header in the response to create a link that can be used for error tracing. To configure the header name and URL of the service you need to add an [environment variable](https://support.insomnia.rest/article/18-environment-variables) in Insomnia like this:

```json
{
    "DEBUG_HELPER": {
        "REQUEST_ID_HEADER": "X-Request-ID",
        "DEBUG_URL": "http://my-error-tracking-service/search?id=__REQUEST_ID__"
    }
}
```

## Examples

[Kibana](https://www.elastic.co/kibana):

```json
{
    "DEBUG_HELPER": {
        "REQUEST_ID_HEADER": "X-Request-ID",
        "DEBUG_URL": "https://my-kibana-server/_plugin/kibana/app/kibana#/discover?_a=(query:(query_string:(query:%22__REQUEST_ID__%22)))"
    }
}
```

[Bugsnag](https://bugsnag.com):

```json
{
    "DEBUG_HELPER": {
        "REQUEST_ID_HEADER": "X-Request-ID",
        "DEBUG_URL": "https://app.bugsnag.com/my-user/my-app/errors?filters[search][0][type]=eq&filters[search][0][value]=__REQUEST_ID__"
    }
}
```

[Sentry](https://docs.sentry.io/enriching-error-data/error-tracing/):

```json
{
    "DEBUG_HELPER": {
        "REQUEST_ID_HEADER": "X-Transaction-ID",
        "DEBUG_URL": "https://sentry.io/organizations/my-user/issues/?project=my-project&query=%22__REQUEST_ID__%22"
    }
}
```

Of course, you need to make sure that your API logs and returns a unique request ID header.

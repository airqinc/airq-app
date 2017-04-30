# AirQ App
> Where Air meets Quality

<!-- [![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url] -->

![AirQ logo](logo.png)

## Installation

OS X & Linux:
* install [docker](https://docs.docker.com/engine/installation/)
* install [bluemix client](https://clis.ng.bluemix.net/ui/home.html)
* install [bluemix container plugin](https://console.ng.bluemix.net/docs/containers/container_cli_cfic.html#container_cli_cfic)

* login to bluemix api
```sh
$ bx ic login
$ bx ic init
```
* Update set_bx.sh with your DOCKER_CERT_PATH (you get if after executing `bx ic init`)
```sh
$ source ./set_bx.sh
```
## Usage example
* Deploy images to bluemix
```sh
$ docker build -t aqi aqi/
$ docker build ...
$ docker-compose up
```

## Development setup

You can use docker-compose locally in order to test your containers
```
docker-compose up
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Release History

* 0.1.0
    * The first proper release
    * CHANGE: migrate from docker-compose.yml v3 to v1 for bluemix support
* 0.0.1
    * Work in progress

## Meta

AirQ – airq@protonmail.com

Distributed under the MIT license. See ``LICENSE`` for more information.
[AirQ's GitHub](https://github.com/airqinc)  

[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics

# AirQ App
> Where Air meets Quality

<!-- [![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url] -->

![AirQ logo](assets/logo.png)

## Installation

OS X & Linux:
* Install [docker](https://docs.docker.com/engine/installation/)
* Install [bluemix client](https://clis.ng.bluemix.net/ui/home.html)
* Install [bluemix container plugin](https://console.ng.bluemix.net/docs/containers/container_cli_cfic.html#container_cli_cfic)

* Login to bluemix api
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
$ docker-compose up
```

## Load testing
```sh
$ sudo apt-get install mosquitto-clients
$ mosquitto_sub -h hostname -t topic_name
```
* use [mqtt extension for chrome](https://chrome.google.com/webstore/detail/mqttbox/kaajoficamnjijhkeomgfljpicifbkaf) to publish messages to mqtt broker

## Run Node.js server locally
1. Copy `config.js` into the folder with settings and credentials.
2. Run test:
```sh
$ npm run test
```
3. Start the server:
```sh
$ npm run start
```


* in case you want to work on this container, you should use the following command:
```sh
$ npm run dev
```
## Run docker-compose locally
```sh
$ sudo usermod -aG docker $USER (optional)
$ docker-compose -f local_docker-compose.yml scale mqtt=2
$ docker-compose -f local_docker-compose.yml up [--build]
```
## Run docker-compose in Bluemix
```sh
$ bx login
$ bx ic init (exec exports)
$ docker build -t <image_name> <source> (build nececsary images)
$ docker-compose -f bx_docker-compose.yml scale mqtt=2
$ docker-compose -f bx_docker-compose.yml up
```
## Run web-server

* install [livereload extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en)
```sh
$ npm install -g gulp
$ cd web-server/
$ npm install
$ gulp
```
* enable livereload extension and connect
* page will be reloaded with each change
* links
   * [ExpressJS Tutorial](https://www.tutorialspoint.com/expressjs/expressjs_templating.htm)
   * [Best practices for Express app structure](https://www.terlici.com/2014/08/25/best-practices-express-structure.html)
## Useful links
* [Get started with Docker Compose](https://docs.docker.com/compose/gettingstarted/)
* [Compose file version 1 reference](https://docs.docker.com/compose/compose-file/compose-file-v1/)
* [Docker compose on bluemix](https://console.ng.bluemix.net/docs/containers/container_single_ui.html#container_compose_config)


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

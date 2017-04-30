#!/bin/bash
# read README.md before and change DOCKER_CERT_PATH in this file accordingly
export DOCKER_HOST=tcp://containers-api.eu-gb.bluemix.net:8443
#export DOCKER_CERT_PATH=...
export DOCKER_TLS_VERIFY=1
export COMPOSE_HTTP_TIMEOUT=300

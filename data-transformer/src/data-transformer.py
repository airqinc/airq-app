# -*- coding: utf-8 -*-
from optparse import OptionParser
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import time
import requests
import json

print("hi there, data-transformer here")


def on_connect(mqttc, obj, flags, rc):
    if verbose == True:
        print("connect: " + str(rc))


def on_publish(mqttc, obj, mid):
    if verbose == True:
        print("on publish: mid: " + str(mid))


def on_subscribe(mqttc, obj, mid, granted_qos):
    if verbose == True:
        print("Subscribed: " + str(mid) + " " + str(granted_qos))


def on_log(mqttc, obj, level, string):
    if verbose == True:
        print("log data: " + string)


def on_message(mqttc, obj, msg):
    headers = {'Content-Type': 'application/json'}
    payload = json.loads(msg.payload.decode())
    iaqi_elements = ['o3', 'pm25', 'pm10', 'co', 'so2', 'no2', 't', 'h', 'p']
    for iaqi_element in iaqi_elements:
        if iaqi_element not in payload['iaqi']:
            payload['iaqi'][iaqi_element] = 0
    json_payload = json.dumps(payload)
    publish.single("transformed_data", json_payload, hostname=broker_hostname)
    try:
        if options.post_to_storage == "True":
            print("posting measures to ", measures_path)
            requests.post(measures_path, json_payload, headers=headers)
        else:
            print("NOT posting ", json_payload, " to ", measures_path)
    except Exception as e:
        print("error: " + e)


if __name__ == '__main__':
    # time.sleep(2)  # seconds, give to to docker
    #

    parser= OptionParser(usage="%prog -d <debug-mode> -p <post-to-storage-server>")
    parser.add_option("-d", "--debug", action="store", dest="debug", metavar="<debug-mode>",default="False",
                      help= "debug mode prints more data")
    parser.add_option("-p", "--post", action="store", dest="post_to_storage", metavar="<post-mode>",default="False",
                      help= "post data to storage-server")

    (options, args) = parser.parse_args()

    broker_hostname = "haproxy"  # TODO: get hostname with container params
    measures_path = "http://storage-server:3000/measures"
    verbose = False

    mqttc = mqtt.Client("data-transformer")
    mqttc.on_message = on_message
    mqttc.on_connect = on_connect
    mqttc.on_publish = on_publish
    mqttc.on_subscribe = on_subscribe
    # Uncomment to enable debug messages
    # mqttc.on_log = on_log
    mqttc.connect(broker_hostname, 1883, 60)
    mqttc.subscribe("sensor_data", 0)

    mqttc.loop_forever()

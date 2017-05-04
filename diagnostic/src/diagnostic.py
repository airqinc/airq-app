# -*- coding: utf-8 -*-
from optparse import OptionParser
import paho.mqtt.client as mqtt
import time

print("hi there, diagnostic here")


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
    print("msg received. Topic:  " + msg.topic + " " +
          str(msg.qos) + " . payload: " + str(msg.payload))


if __name__ == '__main__':
    broker_hostname = "mqtt"  # TODO: get hostname with container params
    verbose = False

    mqttc = mqtt.Client("diagnostic")
    mqttc.on_message = on_message
    mqttc.on_connect = on_connect
    mqttc.on_publish = on_publish
    mqttc.on_subscribe = on_subscribe
    # Uncomment to enable debug messages
    # mqttc.on_log = on_log
    mqttc.connect(broker_hostname, 1883, 60)
    mqttc.subscribe("transformed_data", 0)

    mqttc.loop_forever()

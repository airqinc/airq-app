# -*- coding: utf-8 -*-
import paho.mqtt.client as mqtt
import time
import requests
import json


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
    try:
        r = requests.get("http://" + storage_server_hostname + "/zones")

        print(r.text)
    except Exception as e:
        print("error:" + e)


if __name__ == '__main__':

    try:
        r = requests.get("http://" + "134.168.38.17:3000" + "/zones")
        zones_json = json.loads(r.text)
        # print(json_data)
        zones = {}
        for zone in zones_json:
            zone_name = zone['name']
            zones[zone_name] = {}
            zones[zone_name]['received'] = 0
            try:
                zones[zone_name]['stations'] += 1
            except Exception as e:
                zones[zone_name]['stations'] = 1
        print(zones)
    except Exception as e:
        print("error:" + e)

    broker_hostname = "mqtt"  # TODO: get hostname with container params
    storage_server_hostname = "storage-server:3000"
    verbose = True

    # mqttc = mqtt.Client("diagnostic")
    # mqttc.on_message = on_message
    # mqttc.on_connect = on_connect
    # mqttc.on_publish = on_publish
    # mqttc.on_subscribe = on_subscribe
    # # Uncomment to enable debug messages
    # # mqttc.on_log = on_log
    # mqttc.connect(broker_hostname, 1883, 60)
    # mqttc.subscribe("transformed_data", 0)
    #
    # mqttc.loop_forever()

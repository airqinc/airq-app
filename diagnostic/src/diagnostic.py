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
    json_payload = json.loads(msg.payload.decode())
    # zone = 'Madrid'  # TODO get zone from msg
    zone = json_payload['station']['zone']
    print(zones)
    if zones[zone]['received'] == 0:
        zones[zone]['timestamp'] = json_payload['datetime']
        zones[zone]['received'] = 1
    elif zones[zone]['timestamp'] != json_payload['datetime']:
        print('diagnosTIC time!!! (with %d stations)' %
              zones[zone]['received'], zones)
        zones[zone]['received'] = 0
    else:
        zones[zone]['received'] += 1
        if zones[zone]['received'] == zones[zone]['stations']:
            print('diagnosTIC time!!! (with all stations)', zones)
            zones[zone]['received'] = 0


def get_zones(storage_server_hostname):
    try:
        r = requests.get("http://" + storage_server_hostname + "/zones")
        zones_json = json.loads(r.text)
        zones = {}
        for zone in zones_json:
            zone_name = zone['name']
            zones[zone_name] = {}
            zones[zone_name]['received'] = 0
            zones[zone_name]['stations'] = len(zone['stations'])
            # zones[zone_name]['timestamp'] = 0
        return zones
    except Exception as e:
        print("error:" + e)


if __name__ == '__main__':

    broker_hostname = "mqtt"
    storage_server_hostname = "storage-server:3000"
    verbose = False

    zones = get_zones(storage_server_hostname)
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

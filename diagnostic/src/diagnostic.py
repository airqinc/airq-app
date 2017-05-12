# -*- coding: utf-8 -*-
import paho.mqtt.client as mqtt
import time
import requests
import json
import numpy as np

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
    if zones[zone]['received'] == 0:
        zones[zone]['timestamp'] = json_payload['datetime']
        zones[zone]['received'] = 1
    elif zones[zone]['timestamp'] != json_payload['datetime']:
        print('diagnosTIC time!!! (with %d stations)' %
              zones[zone]['received'], zones)
        zones[zone]['received'] = 0
        make_diagnostic(zone, zones[zone]['timestamp'])
        # TODO work in the new diagnostic
    else:
        zones[zone]['received'] += 1
        if zones[zone]['received'] == zones[zone]['stations']:
            print('diagnosTIC time!!! (with all stations)', zones)
            zones[zone]['received'] = 0
            make_diagnostic(zone, zones[zone]['timestamp'])


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
        return zones
    except Exception as e:
        print("error:" + e)


def get_max_aqi(pollutant, measures):
    return max(map(lambda x: x['iaqi'][pollutant], measures))


def mean_value_for_key(key, measures):
    return np.mean(list(map(lambda x: x['aemet'][key], measures)))


def make_diagnostic(zone, timestamp):
    # measures = {"_id": "590cf0aa707ae10013ba5bb6", "station": "Madrid-Castellana", "datetime": "2017-05-05 23:00:00", "dayName": "Friday", "dominentpol": "o3", "__v": 0, "aemet": {"temperature": 13, "windSpeed": 24, "rainfall": 0.1, "windChill": 13, "windDirection": "SO", "humidity": 79}, "iaqi": {"o3": 20.8, "pm25": 9, "pm10": 4, "co": 0.1, "so2": 1.6, "no2": 11.9, "t": 12.46, "h": 58, "p": 1012}}, {"_id": "590cf0ab707ae10013ba5bb7", "station": "Madrid-PlazaDeCastilla", "datetime": "2017-05-05 22:00:00", "dayName": "Friday", "dominentpol": "o3", "__v": 0, "aemet": {"temperature": 13,
    #                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              "windSpeed": 19, "rainfall": 2.5, "windChill": 13, "windDirection": "SO", "humidity": 84}, "iaqi": {"o3": 26, "pm25": 9, "pm10": 4, "co": 0.1, "so2": 1.1, "no2": 16.5, "t": 14.49, "h": 53, "p": 1011}}, {"_id": "590cf0ab707ae10013ba5bb8", "station": "Madrid-CuatroCaminos", "datetime": "2017-05-05 23:00:00", "dayName": "Friday", "dominentpol": "o3", "__v": 0, "aemet": {"temperature": 13, "windSpeed": 24, "rainfall": 0.1, "windChill": 13, "windDirection": "SO", "humidity": 79}, "iaqi": {"o3": 20.8, "pm25": 5, "pm10": 3, "co": 0.1, "so2": 1.1, "no2": 11.5, "t": 12.46, "h": 58, "p": 1012}}
    payload = {"datetime": "2017-05-12 10:00:00"}
    headers = {'Content-Type': 'application/json'}
    try:
        r = requests.post("http://" + storage_server_hostname +
                          "/zones/Madrid/measures", json.dumps(payload), headers=headers)
        measures = json.loads(r.text)['measures']
        # print('posting bro. json payload', measures)
    except Exception as e:
        print("error: ", e)

    all_pollutants_max = {
        'o3': get_max_aqi('o3', measures),
        'pm25': get_max_aqi('pm25', measures),
        'pm10': get_max_aqi('pm10', measures),
        'co': get_max_aqi('co', measures),
        'so2': get_max_aqi('so2', measures),
        'no2': get_max_aqi('no2', measures)
    }

    max_pollutant = max(all_pollutants_max, key=all_pollutants_max.get)
    max_pollutant_value = all_pollutants_max[max_pollutant]

    aemet = {
        'temperature': mean_value_for_key('temperature', measures),
        'windSpeed': mean_value_for_key('windSpeed', measures),
        'rainfall': mean_value_for_key('rainfall', measures),
        'windChill': mean_value_for_key('windChill', measures),
        'humidity': mean_value_for_key('humidity', measures)}
    print('>>>>diagnostic result: ', max_pollutant, max_pollutant_value, aemet)
    # TODO check ranges for iaqi


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

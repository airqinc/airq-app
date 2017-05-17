# -*- coding: utf-8 -*-
import paho.mqtt.client as mqtt
from optparse import OptionParser
import requests
import json
import numpy as np
import time
import sys


print("hi there, diagnostic here")
print("arguments: ", sys.argv[1:])


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


def on_message(mqtt, obj, msg):
    print("msg received. Topic:  " + msg.topic + " " +
          str(msg.qos) + " . payload: " + str(msg.payload))
    json_payload = json.loads(msg.payload.decode())
    if str(msg.topic) == 'transformed_data':
        zone = json_payload['station']['zone']
        if zones[zone]['received'] == 0:
            zones[zone]['timestamp'] = json_payload['datetime']
            zones[zone]['received'] = 1
        elif zones[zone]['timestamp'] < json_payload['datetime']:
            print('diagnosTIC time!!! (with %d stations)' %
                  zones[zone]['received'], zones)
            make_diagnostic(zone, zones[zone]['timestamp'])
            # work in the new diagnostic
            zones[zone]['received'] = 1
            zones[zone]['timestamp'] = json_payload['datetime']
        else:
            zones[zone]['received'] += 1
            if zones[zone]['received'] == zones[zone]['stations']:
                print('diagnosTIC time!!! (with all stations)', zones)
                zones[zone]['received'] = 0
                make_diagnostic(zone, zones[zone]['timestamp'])
    elif str(msg.topic) == 'forecast_data':
        forecast_dominentpol = json_payload['dominentpol']
        forecast_alert_category = find_category(
            forecast_dominentpol, json_payload['iaqi'][forecast_dominentpol])
        json_payload['alerts'] = [
            {"pollutant": forecast_dominentpol, "category": forecast_alert_category}]
        print("forecast parsed: ", json_payload)
        post_diagnostic(json.dumps(json_payload))


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
        print("error:", e)


def get_max_aqi(pollutant, measures):
    return max(map(lambda x: x['iaqi'][pollutant], measures))


def mean_value_for_aemet(key, measures):
    return np.mean(list(map(lambda x: x['aemet'][key], measures)))


def mean_value_for_iaqi(key, measures):
    return np.mean(list(map(lambda x: x['iaqi'][key], measures)))


def make_diagnostic(zone, timestamp):
    payload = {"datetime": timestamp}
    headers = {'Content-Type': 'application/json'}
    try:
        r = requests.post("http://" + storage_server_hostname +
                          "/zones/" + zone + "/measures", json.dumps(payload), headers=headers)
        measures = json.loads(r.text)['measures']
        measures = list(filter(lambda x: x is not None, measures))
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
        'temperature': mean_value_for_aemet('temperature', measures),
        'windSpeed': mean_value_for_aemet('windSpeed', measures),
        'rainfall': mean_value_for_aemet('rainfall', measures),
        'windChill': mean_value_for_aemet('windChill', measures),
        'humidity': mean_value_for_aemet('humidity', measures)}

    category = find_category(max_pollutant, max_pollutant_value)
    dt = time.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
    dayName = time.strftime('%A', dt)

    diagnostic = {
        "zone": zone,
        "datetime": timestamp,
        "dayName": dayName,
        "dominentpol": max_pollutant,
        "iaqi": {
            "o3": all_pollutants_max['o3'],
            "pm25": all_pollutants_max['pm25'],
            "pm10": all_pollutants_max['pm10'],
            "co": all_pollutants_max['co'],
            "so2": all_pollutants_max['so2'],
            "no2": all_pollutants_max['no2'],
            "t": mean_value_for_iaqi('t', measures),
            "h": mean_value_for_iaqi('h', measures),
            "p": mean_value_for_iaqi('p', measures),
        },
        "aemet": {
            "humidity": aemet['humidity'],
            "windSpeed": aemet['windSpeed'],
            "rainfall": aemet['rainfall'],
            "windChill": aemet['windChill'],
            "temperature": aemet['temperature'],
            "windDirection": "N"  # TODO
        },
        "isForecast": 0,
        "alerts": [{"pollutant": max_pollutant, "category": category}]
    }
    post_diagnostic(json.dumps(diagnostic))


def post_diagnostic(diagnostic_json, force=False):
    # diagnostic_json = json.dumps(diagnostic)
    headers = {'Content-Type': 'application/json'}
    try:
        if options.post_to_storage == "True" or force == True:
            print("posting diagnostic", diagnostic_json,
                  " to ", diagnostics_path)
            requests.post(diagnostics_path, diagnostic_json, headers=headers)
        else:
            print("NOT posting diagnostic", diagnostic_json,
                  " to ", diagnostics_path)
    except Exception as e:
        print("error: ", e)


def find_category(dominentpol, dominentpol_val):
    r = requests.get("http://" + storage_server_hostname + "/categories")
    categories = json.loads(r.text)
    ranges = list()
    category = - 1
    for i, category in enumerate(categories):
        ranges.append((categories[i]['min_value'], categories[i]['max_value']))
    for i, aqi_range in enumerate(ranges):
        # closed range
        if aqi_range[0] < dominentpol_val and dominentpol_val < (aqi_range[1] + 1):
            category = i
    return category


if __name__ == '__main__':
    # time.sleep(2)  # seconds, give to to docker
    #
    parser = OptionParser(
        usage="%prog -d <debug-mode> -p <post-to-storage-server>")
    parser.add_option("-d", "--debug", action="store", dest="debug", metavar="<debug-mode>", default="False",
                      help="debug mode prints more data")
    parser.add_option("-p", "--post", action="store", dest="post_to_storage", metavar="<post-mode>", default="False",
                      help="post data to storage-server")

    (options, args) = parser.parse_args()

    broker_hostname = "haproxy"
    storage_server_hostname = "storage-server:3000"
    diagnostics_path = "http://storage-server:3000/diagnostics"
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
    mqttc.subscribe("forecast_data", 0)

    mqttc.loop_forever()

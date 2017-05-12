# -*- coding: utf-8 -*-
from optparse import OptionParser
from lxml import etree
import paho.mqtt.publish as publish
import requests
import sched
import time
import json
import requests
import datetime




def get_aqi_data(aqi_url):

    try:
        response = requests.get(aqi_url)
    except:
        print ("error: aqi API unreachable")
        return "error"

    if response.status_code == 200:
        json_data = json.loads(response.text)

        if json_data['status'] == "ok":
            return json_data['data']

        else:
            print (json_data['status'] + " produced by" + json_data['data'])
            return "error"
    else:
        print("error: " + response.status_code)
        return "error"


def parse_aqi_data(aqi_data):

    sensor_data = {}

    station_data = aqi_data['city']['name']
    station_data = station_data.replace(' ', '')
    station_name, station_zone = station_data.split(',')

    sensor_data['station'] = { 'zone': station_zone, 'name': station_name}
    sensor_data['datetime'] = aqi_data['time']['s']
    sensor_data['dominentpol'] = aqi_data['dominentpol']
    sensor_data['iaqi'] = {}

    for param in aqi_data['iaqi']:

        sensor_data['iaqi'][param] = aqi_data['iaqi'][param]['v']

    return sensor_data


def get_value(topic, forecast, hour, moment):

    if topic == "direccion" or topic == "velocidad":
        return forecast.xpath("//viento[@periodo=\"" + str(hour).zfill(2) + "\"]/" + topic + "/text()")[moment]
    else:
        return forecast.xpath("//" + topic + "[@periodo=\"" + str(hour).zfill(2) + "\"]/text()")[moment]


def get_aemet_data(locality, date_time, moment):

    data = {}
    hour = date_time.strftime("%H")
    try:
        xml = requests.get(
            "http://www.aemet.es/xml/municipios_h/localidad_h_" + str(locality) + ".xml").content
        forecast = etree.XML(xml)

        data["temperature"] = get_value("temperatura", forecast, hour, moment)
        data["windChill"] = get_value("sens_termica", forecast, hour, moment)
        data["humidity"] = get_value(
            "humedad_relativa", forecast, hour, moment)
        data["rainfall"] = get_value("precipitacion", forecast, hour, moment)
        data["windDirection"] = get_value("direccion", forecast, hour, moment)
        data["windSpeed"] = get_value("velocidad", forecast, hour, moment)

    except:
        return "error"

    return data


if __name__ == '__main__':

    print('Starting "sensor"...')

    delay = 5 * 60  # seconds of delay

    ########################## Stations config ##########################

    stations = ["castellana", "plaza-de-castilla", "cuatro-caminos",
                "casa-de-campo", "escuelas-aguirre", "mendez-alvaro"]
    last_seen_stations = {}

    ########################## Aemet config #############################

    locality = 28079  # Madrid
    hour = 20  # 0 - 23
    moment = 0  # 0: present, 1: future

    ########################## AQI API config ###########################

    aqi_token = "ef6bc8b53769124c36402b20a91b104f6677a4c8"
    aqi_base_url = "https://api.waqi.info/feed/spain/madrid/"

    ########################## MQTT Client config #######################

    broker_hostname = "mqtt"
    server_hostame = "storage-server"

    while True:

        for station in stations:

            aqi_station_url = aqi_base_url + station + "/?token=" + aqi_token
            aqi_data = get_aqi_data(aqi_station_url)

            if(aqi_data != "error"):  # if not an error use de data received

                # Parse from aqi response to a sensor response.
                sensor_data = parse_aqi_data(aqi_data)

                # DateTime received from aqi station
                aqi_datetime = datetime.datetime.strptime(aqi_data['time']['s'], '%Y-%m-%d %H:%M:%S')
                #TEST: aqi_datetime = datetime.datetime.strptime("2017-05-12 16:00:00", '%Y-%m-%d %H:%M:%S')

                # Current datetime (1h less, minutes and seconds to 0)
                current_datetime = datetime.datetime.now().replace(minute = 0 , second = 0, microsecond=0)
                current_datetime = current_datetime - datetime.timedelta(hours=1)

                if aqi_datetime < current_datetime:
                    sensor_datetime = current_datetime
                    print("time syntetic")
                else: sensor_datetime = aqi_datetime

                if station not in last_seen_stations or last_seen_stations[station] < sensor_datetime:

                    date = sensor_datetime
                    sensor_data['datetime'] = sensor_datetime.strftime("%Y-%m-%d %H:%M:%S")
                    sensor_data['dayName'] = sensor_datetime.strftime("%A")
                    aemet_data = get_aemet_data(locality,sensor_datetime, moment)

                    if(aemet_data != 'error'):

                        sensor_data['aemet'] = aemet_data

                        # Publish the message like a real sensor.
                        json_msg = json.dumps(sensor_data)
                        #DEBUG: print("sending json data: ", json_msg)
                        print(sensor_data['station']['zone'] + "-" + sensor_data['station']['name'] + " generated data on time = " + sensor_data['datetime'])

                        published = True
                        try:
                            publish.single("sensor_data", json_msg,
                                           hostname=broker_hostname, keepalive=240)
                        except Exception as e:
                            published = False
                            print("MQTT Broker unreachable, unable to publish data to sensor_data topic. Exception: ", e)

                        if published:
                            last_seen_stations[station] = sensor_datetime

        time.sleep(delay)

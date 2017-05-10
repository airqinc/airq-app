# -*- coding: utf-8 -*-
from optparse import OptionParser
import paho.mqtt.publish as publish
import requests
import sched
import time
import json
import requests
import datetime
from lxml import etree


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

    sensor_data['station'] = station_zone + "-" + station_name
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


def get_aemet_data(locality, hour, moment, date):

    data = {}

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

    delay = 15 * 60  # seconds of delay

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

                if station not in last_seen_stations or last_seen_stations[station] != aqi_data['time']['s']:

                    # Parse from aqi response to a sensor response.

                    sensor_data = parse_aqi_data(aqi_data)

                    data_date, data_time = aqi_data['time']['s'].split(' ')
                    hour, minutes, seconds = data_time.split(':')
                    #year, month, day = data_date.split('-')

                    date = datetime.datetime.strptime(data_date, '%Y-%m-%d')

                    sensor_data['dayName'] = date.strftime("%A")

                    sensor_data['aemet'] = get_aemet_data(
                        locality, hour, moment, date)

                    # Publish the message like a real sensor.
                    json_msg = json.dumps(sensor_data)
                    print(json_msg)

                    published = True
                    try:
                        publish.single("sensor_data", json_msg.getBytes(),
                                       hostname=broker_hostname, keepalive=240)
                    except:
                        published = False
                        print(
                            "MQTT Broker unreachable, unable to publish data to sensor_data topic.")

                    if published:
                        last_seen_stations[station] = aqi_data['time']['s']
                    #requests.post(server_hostame, data=json_msg)

        time.sleep(delay)

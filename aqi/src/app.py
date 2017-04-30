# -*- coding: utf-8 -*-
from optparse import OptionParser
import paho.mqtt.publish as publish
import requests
import sched, time
print("ellooo")
# publish.single("sensor_data", "boo", hostname="mqtt")
def parse_aqi(broker, sc):
    response = requests.post(aqi_url, data=aqi_data)
    if response.status_code == 200:
        publish.single("sensor_data", response.text, hostname = broker)
    else:
        response.raise_for_status()
    scheduler.enter(delay, priority, parse_aqi, (broker, sc,))

if __name__=='__main__':
    delay = 10 # seconds
    priority = 1
    broker_hostname = "mqtt" # TODO: get hostname with container params
    # parser= OptionParser(usage="%prog -b <broker-IP> -m <mongo-IP>")
    # parser.add_option("-b", "--brokerip", action="store", dest="brokerip", metavar="<broker-IP>",default="localhost",
    #                   help= "IP del broker MQTT al que se conectará este cliente. Por defecto es localhost")
    #
    # (opciones, args) = parser.parse_args()
    # ip_broker = opciones.brokerip

    aqi_token = "ef6bc8b53769124c36402b20a91b104f6677a4c8"                  #TODO: use mongo
    aqi_url = "https://api.waqi.info/feed/madrid/?token=" + aqi_token       #TODO: dynamic?
    aqi_data = {
        # "token": aqi_token,
        # "city": "madrid"
    }

    # SCHEDULE AQI TASK
    scheduler = sched.scheduler(time.time, time.sleep)
    parse_aqi(broker_hostname, scheduler)
    # scheduler.enter(delay, priority, parse_aqi, (scheduler,))
    scheduler.run()

#     #134.168.47.209

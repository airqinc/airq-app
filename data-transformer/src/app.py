# -*- coding: utf-8 -*-
from optparse import OptionParser
import paho.mqtt.client as mqtt
import time

def on_connect(mqttc, obj, flags, rc):
    # if options.verbose == "True":
        print("connect: "+str(rc))

def on_publish(mqttc, obj, mid):
    # if options.verbose == "True":
        print("on publish: mid: "+str(mid))

def on_subscribe(mqttc, obj, mid, granted_qos):
    # if options.verbose == "True":
        print("Subscribed: "+str(mid)+" "+str(granted_qos))

def on_log(mqttc, obj, level, string):
    # if options.verbose == "True":
        print("log data: " + string)

def on_message(mqttc, obj, msg):
    print("msg received. Topic:  " + msg.topic+" "+str(msg.qos)+" . payload: "+str(msg.payload))
    #mqttc.disconnect()
    # TODO publish for diag

if __name__=='__main__':
    # parser= OptionParser(usage="%prog -b <broker-IP> -m <mongo-IP> -v <verbose>")
    # parser.add_option("-b", "--brokerip", action="store", dest="brokerip", metavar="<broker-IP>",default="localhost",
    #                   help = "IP del broker MQTT al que se conectará este cliente. Por defecto es localhost")
    # parser.add_option("-v", "--verbose", action="store", dest="verbose", metavar="<verbose>",default="False",
    #                   help = "verbose mode")
    #
    # (options, args) = parser.parse_args()
    #
    broker_hostname = "mqtt" # TODO: get hostname with container params

    mqttc = mqtt.Client("external_data_transformer")
    mqttc.on_message = on_message
    mqttc.on_connect = on_connect
    mqttc.on_publish = on_publish
    mqttc.on_subscribe = on_subscribe
    # Uncomment to enable debug messages
    # mqttc.on_log = on_log
    mqttc.connect(broker_hostname, 1883, 60)
    mqttc.subscribe("sensor_data", 0)

    mqttc.loop_forever()

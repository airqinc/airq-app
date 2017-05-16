import pandas as pd
import numpy as np
import paho.mqtt.publish as publish
import requests
import json
import time
import datetime
from datetime import timedelta
from sklearn.model_selection import train_test_split
from lxml import etree
from sklearn.linear_model import Perceptron, LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error


def say(text):
    print(datetime.datetime.now().time(),text)
def success(text):
    print('\x1b[6;30;42m'+str(datetime.datetime.now().time())+'\x1b[0m',text)
def failure(text):
    print('\x1b[6;30;41m'+str(datetime.datetime.now().time())+'\x1b[0m',text)

def initializeDataset(date,zn):
    say("Initializing global dataset...")

    say("\tFetching all instances from "+str(datadir))
    wholedata = None
    while wholedata is None:
        try:
            response = requests.get(datadir)
            if response.status_code == 200:
                wholedata = response.text
            else:
                failure("\tUh-Oh! The request returned code %d! Retrying in 5."%(response.status_code))
                time.sleep(5)
        except:
            failure("\tUh-Oh! I can't reach the database! Retrying in 10.")
            time.sleep(10)

    dataset = pd.io.json.json_normalize(json.loads(wholedata))
    date = dataset.iloc[-1,dataset.columns.get_loc("datetime")]
    date = pd.to_datetime(date)
    zn = dataset.iloc[-1,dataset.columns.get_loc("station")]
    zn = zn[:zn.index('-')].title()
    rest = []
    rest.append(float(dataset.iloc[-1,dataset.columns.get_loc("iaqi.t")]))
    rest.append(float(dataset.iloc[-1,dataset.columns.get_loc("iaqi.h")]))
    rest.append(float(dataset.iloc[-1,dataset.columns.get_loc("iaqi.p")]))

    say("\tSelecting only rows with hour = %d" % (date.hour))
    dataset["datetime"] = dataset["datetime"].apply(lambda x: pd.to_datetime(x).hour)
    dataset = dataset.loc[dataset['datetime'] == date.hour]

    say("\tChoosing only one station among them")
    dataset = dataset.loc[dataset['station'] == "Madrid-Castellana"]
    #dataset.drop_duplicates(subset="datetime",keep="last",inplace=True)
    say("\tCleaning data")
    dataset = cleanDataset(dataset)
    #dataset.to_csv("cleanData.csv")

    success("Global dataset ready! ("+str(dataset.shape[0])+" X "+str(dataset.shape[1])+")\n")
    return dataset, date, zn, rest


def cleanDataset(ds):
    #     say("\t\tRenaming columns...")
    for col in ds.columns:
        if "aemet" in col:
            ds.rename(columns={col: col.replace("aemet.", "")}, inplace=True)
        elif "iaqi" in col:
            ds.rename(columns={col: col.replace("iaqi.", "")}, inplace=True)
    ds.rename(columns={"p": "pressure"}, inplace=True)
    #     ds["i"] = np.arange(0,ds.shape[0])
    #     ds = ds.set_index("i")

    #     say("\t\tGetting rid of unnecessary variables...")
    ds.drop(ds.columns[[ds.columns.get_loc("_id"), ds.columns.get_loc("station"), ds.columns.get_loc("h"),
                        ds.columns.get_loc("t"), ds.columns.get_loc("datetime"), ds.columns.get_loc("dominentpol"),
                        ds.columns.get_loc("__v"), ds.columns.get_loc("pressure")]],
            axis=1, inplace=True)

    #     say("\t\tFormatting categorical variables...")
    ds = pd.get_dummies(ds, prefix="day", columns=["dayName"])
    ds = pd.get_dummies(ds, prefix="wind", columns=["windDirection"])
    # ds = pd.get_dummies(ds, prefix="pol", columns=["dominentpol"])

    #     say("\t\tRemoving null instances...")
    ds.dropna(axis=0, how="any")

    return ds

def buildWindowedDataset(wind):
    say("Generating windowed dataset from global (window size = %d)"%(wind))
    windowedDataset = pd.DataFrame(index=np.arange(int(globalDataset.shape[0]+1-wind)))
    for i in range(wind):
        for col in globalDataset.columns:
            windowedDataset[col+"_"+str(i)] = list(globalDataset[col][i:i+globalDataset.shape[0]+1-wind])
    success("Windowed dataset done! (%d X %d)\n"%(windowedDataset.shape[0],windowedDataset.shape[1]))
    return windowedDataset

def buildModel(p):
    pollutants = ["o3_" + str(windowSize - 1), "pm25_" + str(windowSize - 1), "pm10_" + str(windowSize - 1),
                  "co_" + str(windowSize - 1),
                  "so2_" + str(windowSize - 1), "no2_" + str(windowSize - 1)]
    X = windowedDataset.drop(windowedDataset.columns[[windowedDataset.columns.get_loc(pollutants[0]),
                                                      windowedDataset.columns.get_loc(pollutants[1]),
                                                      windowedDataset.columns.get_loc(pollutants[2]),
                                                      windowedDataset.columns.get_loc(pollutants[3]),
                                                      windowedDataset.columns.get_loc(pollutants[4]),
                                                      windowedDataset.columns.get_loc(pollutants[5])]],
                             axis=1, inplace=False)
    y = windowedDataset.iloc[:, windowedDataset.columns.get_loc(p + "_" + str(windowSize - 1))]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.05, random_state=8)
    model = LinearRegression()
    model.fit(X_train, y_train)

    pred = model.predict(X_test)
    say("\t" + str(p) + " classifier done\t(ECM: %.2f, EAM: %.2f)" %
        (mean_squared_error(y_test, pred), mean_absolute_error(y_test, pred)))

    return model

def makePrediction():
    say("Starting 24-hour-after forecasting process from date %s..." % (lastDate))
    instance = pd.DataFrame()
    mask = [False] * globalDataset.shape[0]
    for i, c in enumerate(reversed(range(windowSize - 1))):
        mask[-(c + 1)] = True
        for col in globalDataset.columns:
            instance[col + "_" + str(i)] = list(globalDataset[col][mask])
        mask = [False] * globalDataset.shape[0]

    weather = fetchWeather(lastDate.hour)

    say("\tCreating instance from weather data")
    weather = pd.io.json.json_normalize(json.loads(weather))

    for col in weather.columns:
        weather.rename(columns={col: col[0].lower() + col[1:]}, inplace=True)
    weather.rename(columns={"rH": "humidity"}, inplace=True)

    day, wind = weather.iloc[0, weather.columns.get_loc("dayName")], weather.iloc[
        0, weather.columns.get_loc("windDirection")]

    for col in weather.columns:
        instance[col + "_" + str(windowSize - 1)] = list(weather[col])

    globalColumns = list(globalDataset.columns)
    dummyColumns = [x for x in globalColumns if '_' in x]

    for col in dummyColumns:
        instance[col + "_" + str(windowSize - 1)] = 0

    if "day_" + str(day) + "_" + str(windowSize - 1) in dummyColumns:
        instance["day_" + str(day) + "_" + str(windowSize - 1)] = 1
    if "wind_" + str(wind) + "_" + str(windowSize - 1) in dummyColumns:
        instance["wind_" + str(wind) + "_" + str(windowSize - 1)] = 1

    instance.drop(instance.columns[[instance.columns.get_loc("dayName_" + str(windowSize - 1)),
                                    instance.columns.get_loc("windDirection_" + str(windowSize - 1))]],
                  axis=1, inplace=True)

    say("\tMaking predictions")
    predictedValues = []
    for classifier in pollutantModels:
        predictedValues.append(classifier.predict(instance))
    values = [round(float(x[0]), 1) for x in predictedValues]
    map((lambda x: 0.0 if x < 0 else x), values)

    success("Forecasting process complete! My crystal ball says:\n\t\t Prediction date: " + str(predictionDate) +
            "\n\t\t o3 index: " + str(values[0]) + "\n\t\t pm25 index: " + str(values[1]) + "\n\t\t" +
            " pm10 index: " + str(values[2]) + "\n\t\t co index: " + str(values[3]) + "\n\t\t" +
            " so2 index: " + str(values[4]) + "\n\t\t no2 index: " + str(values[5]) + "\n\n")
    return values, weather

def getValue(topic,forecast,hour,moment):
    try:
        if topic == "direccion" or topic == "velocidad":
            return forecast.xpath("//viento[@periodo=\"" + str(hour).zfill(2) + "\"]/"+topic+"/text()")[moment]
        else:
            return int(forecast.xpath("//"+topic+"[@periodo=\""+str(hour).zfill(2)+"\"]/text()")[moment])
    except:
        return 0

def fetchWeather(h):
    say("\tFetching weather information for %s..." % (zone))
    locality = zonecode[zone]
    hour = h
    moment = 1
    source = "http://www.aemet.es/xml/municipios_h/localidad_h_"+str(locality)+".xml"
    data = {}

    say("\t\tAccessing to %s" % (source))
    xml = requests.get(source).content
    forecast = etree.XML(xml)

    say("\t\tGetting values at hour %d" % (h))
    data["DayName"] = datetime.datetime.now().strftime("%A")
    data["Temperature"] = getValue("temperatura",forecast,hour,moment)
    data["WindChill"] = getValue("sens_termica",forecast,hour,moment)
    data["RH"] = getValue("humedad_relativa",forecast,hour,moment)
    data["Rainfall"] = getValue("precipitacion",forecast,hour,moment)
    data["WindDirection"] = getValue("direccion",forecast,hour,moment)
    data["WindSpeed"] = int(getValue("velocidad",forecast,hour,moment))

    j = json.dumps(data)
    return j

def packPrediction():
    say("Packing prediction results")
    msg = {}

    msg["zone"] = str(zone)
    msg["datetime"] = str(predictionDate)
    msg["dayName"] = str(predictionDate.strftime("%A"))
    msg["dominentpol"] = str(pollutants[results.index(np.max(results))][0])
    msg["iaqi"] = {}
    for (p, v) in pollutants:
        msg["iaqi"][p] = float(v)
    msg["iaqi"]["t"] = float(restOfInfo[0])
    msg["iaqi"]["h"] = float(restOfInfo[1])
    msg["iaqi"]["p"] = float(restOfInfo[2])
    msg["aemet"] = {}
    msg["aemet"]["humidity"] = float(weather["humidity"][0])
    msg["aemet"]["windSpeed"] = float(weather["windSpeed"][0])
    msg["aemet"]["rainfall"] = float(weather["rainfall"][0])
    msg["aemet"]["windChill"] = float(weather["windChill"][0])
    msg["aemet"]["temperature"] = float(weather["temperature"][0])
    msg["aemet"]["windDirection"] = str(weather["windDirection"][0])
    msg["isForecast"] = 1
    msg["alerts"] = []

    msg = json.dumps(msg)

    return msg


def publishPrediction():
    try:
        print("Publishing forecast: ", message, " to ", broker_hostname)
        publish.single("forecast_data", message, hostname=broker_hostname)
        success("Prediction published successfully! I'm waiting for more data to come!")
    except Exception as e:
        failure("MQTT Broker unreachable, unable to publish data to forecast_data topic. Exception: %s"%(e))

if __name__ == '__main__':
    success("Forecast service on! Let's get down to business!\n")
    broker_hostname = "haproxy"  # TODO: get hostname with container params
    verbose = True

    datadir = "http://storage-server:3000/measures"
    globalDataset, lastDate, zone = None, None, None
    windowSize = 3
    windowSizeAux = windowSize
    zonecode = {"Madrid": 28079}
    restOfInfo = None
    pollutants = [("o3", 0.0), ("pm25", 0.0), ("pm10", 0.0), ("co", 0.0), ("so2", 0.0), ("no2", 0.0)]

    while True:
        globalDataset, lastDate, zone, restOfInfo = initializeDataset(lastDate, zone)
        predictionDate = lastDate + timedelta(days=1)

        if globalDataset.shape[0] >= 2:
            if globalDataset.shape[0] <= windowSize:
                windowSize = globalDataset.shape[0] - 1
            windowedDataset = buildWindowedDataset(windowSize)
            say("Building prediction models for each pollutant...")
            pollutantModels = [buildModel(x[0]) for x in pollutants]
            success("All models done! (%d)" % (len(pollutantModels)))
            success("Datasets and models created! Now I'm ready to predict!\n\n")

            results, weather = makePrediction()
            pollutants = [(pollutants[i][0], x) for i, x in enumerate(results)]
            # pollutants = {x:y for (x,y) in pollutants}
            message = packPrediction()

            publishPrediction()

            windowSize = windowSizeAux
        else:
            failure("Not enough data to build models. Better luck next hour.")
        time.sleep(15*60)

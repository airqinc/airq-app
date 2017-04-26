FROM python:2.7
WORKDIR /app
ADD requeriments.txt ./requeriments.txt
RUN pip install -r ./requeriments.txt
ADD * /app/
ADD app/mqtt_pub.py app/mqtt_pub.py
CMD python -u app/mqtt_pub.py

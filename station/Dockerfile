FROM python:3.6
ADD . /src
WORKDIR /src
RUN apt-get install -y libxml2-dev libxslt1-dev
RUN pip install -r requirements.txt
CMD python -u src/station.py

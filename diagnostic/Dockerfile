FROM python:3.6
ADD . /src
WORKDIR /src
RUN pip install -r requirements.txt
CMD python -u src/diagnostic.py -d $DEBUG -p $POST_TO_STORAGE_SERVER

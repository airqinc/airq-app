FROM python:3.4-alpine
ADD . /src
WORKDIR /src
RUN pip install -r requirements.txt
CMD python -u src/data-transformer.py

FROM electronicfrontierfoundation/https-everywhere-docker-base 
MAINTAINER William Budington "bill@eff.org"

WORKDIR /opt
ADD test/rules/requirements.txt test/rules/requirements.txt
ADD test/chromium/requirements.txt test/chromium/requirements.txt
RUN pip install -r test/rules/requirements.txt
RUN pip install -r test/chromium/requirements.txt

ENV FIREFOX /firefox-latest/firefox/firefox

WORKDIR /opt

RUN apt-get update
RUN apt-get install -y python-requests
RUN apt-get install -y python-dnspython
RUN apt-get install -y python-argparse
RUN apt-get install -y wget
RUN mkdir -p ~/bin
RUN wget https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 -O ~/bin/jq

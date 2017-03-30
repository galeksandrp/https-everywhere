FROM electronicfrontierfoundation/https-everywhere-docker-base 
MAINTAINER William Budington "bill@eff.org"

WORKDIR /opt
ADD test/rules/requirements.txt test/rules/requirements.txt
ADD test/chromium/requirements.txt test/chromium/requirements.txt
RUN pip install -r test/rules/requirements.txt
RUN pip install -r test/chromium/requirements.txt

ENV FIREFOX /firefox-latest/firefox/firefox

WORKDIR /opt

RUN git clone https://github.com/aboul3la/Sublist3r.git
RUN pip install -r Sublist3r/requirements.txt
RUN apt-get update && apt-get install python3-pip
RUN pip3 install -r requirements.txt
RUN chmod +x ct.sh

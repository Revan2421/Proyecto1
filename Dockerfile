FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y apache2 python3 python3-pip git

RUN apt-get install -y ssl-cert libapache2-mod-wsgi-py3

RUN a2enmod wsgi

RUN pip3 install beaker --break-system-packages

RUN echo "WSGIScriptAlias /ATI/index.py /var/www/html/ATI/index.py" > /etc/apache2/conf-available/mod-wsgi.conf \
    && a2enconf mod-wsgi

COPY ./ /var/www/html/

EXPOSE 80

CMD ["apache2ctl", "-D", "FOREGROUND"]
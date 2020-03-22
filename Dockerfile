FROM php:7-apache
MAINTAINER Luke Halpenny <D00219060@student.dkit.ie>

# Install PHP Modules
#RUN apt-get update
#RUN apt-get install -y php7.0-mysql
RUN docker-php-ext-install pdo pdo_mysql

# Apache2
# COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

COPY public /var/www/html/
RUN chown -R www-data:www-data /var/www

EXPOSE 80
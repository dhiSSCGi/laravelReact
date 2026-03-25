FROM php:8.2-apache

# System dependencies
RUN apt-get update && apt-get install -y \
    unzip zip curl git \
    libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql

# Enable Apache rewrite (IMPORTANT for Laravel routes)
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy project
COPY . .

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader
RUN php artisan migrate --force

# Install Node (for React/Vite)
RUN apt-get install -y nodejs npm

# Install frontend dependencies + build React
RUN npm install --legacy-peer-deps
RUN npm run build


# Permissions (IMPORTANT for Laravel)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80
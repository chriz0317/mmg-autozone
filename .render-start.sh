#!/usr/bin/env bash

# Run migrations
php artisan migrate --force

# Replace Apache port with Render's PORT environment variable (default 10000)
sed -i "s/Listen .*/Listen ${PORT:-10000}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost .*/<VirtualHost *:${PORT:-10000}>/g" /etc/apache2/sites-available/000-default.conf

# Start Apache in the foreground
apache2-foreground

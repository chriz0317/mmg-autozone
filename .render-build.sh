#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Building Laravel application for Render..."

# 1. Install Composer dependencies
composer install --prefer-dist --no-dev --optimize-autoloader --no-interaction

# 2. Install NPM dependencies and build Vite assets
npm install
npm run build

# 3. Clear and cache Laravel config/routes/views
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Run database migrations
# We use --force since this is technically a production environment
php artisan migrate --force

echo "Build complete."

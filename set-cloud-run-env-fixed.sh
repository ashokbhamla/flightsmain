#!/bin/bash

# Cloud Run Environment Variables Setup Script for Cloud Shell
# This script sets environment variables for your Cloud Run service

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
SERVICE_NAME="airlinesmap"
REGION="us-east5"
PROJECT_ID="decoded-battery-473511-q7"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed. Please install it first."
    exit 1
fi

print_status "Using project: $PROJECT_ID"
print_status "Service name: $SERVICE_NAME"
print_status "Region: $REGION"

# Set environment variables for Cloud Run
print_status "Setting environment variables for Cloud Run service..."

gcloud run services update $SERVICE_NAME \
    --region=$REGION \
    --project=$PROJECT_ID \
    --update-env-vars="NEXT_PUBLIC_DOMAIN=https://airlinesmap-274751619849.us-east5.run.app" \
    --update-env-vars="NEXT_PUBLIC_COMPANY_NAME=airlinesmap.com" \
    --update-env-vars="NEXT_PUBLIC_COMPANY_EMAIL=support@airlinesmap.com" \
    --update-env-vars="NEXT_PUBLIC_COMPANY_PHONE=+1-888-319-6206" \
    --update-env-vars="NEXT_PUBLIC_COMPANY_ADDRESS=8th the green suite b, Dover, DE 19901, US" \
    --update-env-vars="NEXT_PUBLIC_COMPANY_LOGO=https://airlinesmap-274751619849.us-east5.run.app/logo.png" \
    --update-env-vars="NEXT_PUBLIC_API_CONTENT=https://api.triposia.com" \
    --update-env-vars="NEXT_PUBLIC_API_REAL=https://api.triposia.com" \
    --update-env-vars="NEXT_PUBLIC_HEADER_TITLE=AirlinesMap" \
    --update-env-vars="NEXT_PUBLIC_HEADER_META_DESCRIPTION=Book flights, hotels, and cars" \
    --update-env-vars="NEXT_PUBLIC_HEADER_META_KEYWORDS=flights, hotels, travel, booking, airlines" \
    --update-env-vars="NEXT_PUBLIC_NAV_AIRLINES=/airlines" \
    --update-env-vars="NEXT_PUBLIC_NAV_HOTELS=/hotels" \
    --update-env-vars="NEXT_PUBLIC_NAV_AIRPORTS=/airports" \
    --update-env-vars="NEXT_PUBLIC_NAV_FLIGHTS=/flights" \
    --update-env-vars="NEXT_PUBLIC_NAV_LOGIN=/login" \
    --update-env-vars="NEXT_PUBLIC_NAV_REGISTER=/register" \
    --update-env-vars="NEXT_PUBLIC_NAV_MY_ACCOUNT=/my-account" \
    --update-env-vars="NEXT_PUBLIC_FOOTER_COPYRIGHT=© 2018-2025 AirlinesMap Inc. All rights reserved." \
    --update-env-vars="NEXT_PUBLIC_FOOTER_DESCRIPTION_1=Helps you find the cheapest flight deals to any destination with ease." \
    --update-env-vars="NEXT_PUBLIC_FOOTER_DESCRIPTION_2=Browse through the best hotels and find exclusive deals." \
    --update-env-vars="NEXT_PUBLIC_FOOTER_ABOUT_US=/about-us" \
    --update-env-vars="NEXT_PUBLIC_FOOTER_CONTACT_US=/contact-us" \
    --update-env-vars="NEXT_PUBLIC_FOOTER_PRIVACY_POLICY=/privacy-policy" \
    --update-env-vars="NEXT_PUBLIC_FOOTER_TERMS_CONDITIONS=/terms-and-conditions" \
    --update-env-vars="NEXT_PUBLIC_FOOTER_REFUND_POLICY=/refund-policy" \
    --update-env-vars="NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/airlinesmap" \
    --update-env-vars="NEXT_PUBLIC_TWITTER_URL=https://twitter.com/airlinesmap" \
    --update-env-vars="NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/airlinesmap" \
    --update-env-vars="NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/airlinesmap" \
    --update-env-vars="NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/airlinesmap" \
    --update-env-vars="NEXT_PUBLIC_POPUP_PHONE_NUMBER=+1-888-319-6206" \
    --update-env-vars="NEXT_PUBLIC_POPUP_PROMO_CODE=SAVE30" \
    --update-env-vars="NEXT_PUBLIC_POPUP_EMAIL=deals@airlinesmap.com" \
    --update-env-vars="NEXT_PUBLIC_CDN_BASE=https://storage.googleapis.com/web-unified-atom-469911-j9" \
    --update-env-vars="NEXT_PUBLIC_CDN_IMAGES=https://storage.googleapis.com/web-unified-atom-469911-j9/images" \
    --update-env-vars="NEXT_PUBLIC_CDN_ICONS=https://storage.googleapis.com/web-unified-atom-469911-j9/icons" \
    --update-env-vars="NEXT_PUBLIC_CDN_LOGO=https://storage.googleapis.com/web-unified-atom-469911-j9/logo" \
    --update-env-vars="NEXT_PUBLIC_AVIASALES_AUTOCOMPLETE_URL=https://autocomplete.travelpayouts.com/places2" \
    --update-env-vars="NEXT_PUBLIC_DEFAULT_CURRENCY=USD" \
    --update-env-vars="NEXT_PUBLIC_DEFAULT_LANGUAGE=en" \
    --update-env-vars="NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,es,ru,fr" \
    --update-env-vars="NEXT_PUBLIC_DEFAULT_TIMEZONE=UTC" \
    --update-env-vars="NEXT_PUBLIC_CACHE_TTL=3600" \
    --update-env-vars="NEXT_PUBLIC_IMAGE_OPTIMIZATION=true" \
    --update-env-vars="NEXT_PUBLIC_CRITICAL_CSS_ENABLED=true" \
    --update-env-vars="NEXT_PUBLIC_SERVICE_WORKER_ENABLED=true" \
    --update-env-vars="NODE_ENV=production" \
    --update-env-vars="NEXT_TELEMETRY_DISABLED=1" \
    --update-env-vars="NEXT_PUBLIC_DEBUG_MODE=false" \
    --update-env-vars="NEXT_PUBLIC_LOG_LEVEL=error" \
    --update-env-vars="PORT=3000" \
    --update-env-vars="HOSTNAME=0.0.0.0" \
    --update-env-vars="NEXT_PUBLIC_SITE_NAME=AirlinesMap" \
    --update-env-vars="NEXT_PUBLIC_SITE_DESCRIPTION=Find the best flight deals, hotels, and travel packages" \
    --update-env-vars="NEXT_PUBLIC_SITE_KEYWORDS=flights, hotels, travel, booking, airlines, deals, cheap flights" \
    --update-env-vars="NEXT_PUBLIC_SITE_AUTHOR=AirlinesMap Team" \
    --update-env-vars="NEXT_PUBLIC_SITE_URL=https://airlinesmap-274751619849.us-east5.run.app" \
    --update-env-vars="NEXT_PUBLIC_SITE_IMAGE=https://airlinesmap-274751619849.us-east5.run.app/og-image.jpg" \
    --update-env-vars="NEXT_PUBLIC_FEATURE_BOOKING_ENABLED=true" \
    --update-env-vars="NEXT_PUBLIC_FEATURE_HOTELS_ENABLED=true" \
    --update-env-vars="NEXT_PUBLIC_FEATURE_CARS_ENABLED=false" \
    --update-env-vars="NEXT_PUBLIC_FEATURE_REVIEWS_ENABLED=true" \
    --update-env-vars="NEXT_PUBLIC_FEATURE_CHAT_ENABLED=false"

if [ $? -eq 0 ]; then
    print_status "✅ Environment variables set successfully!"
    print_status "Service URL: https://$SERVICE_NAME-274751619849.us-east5.run.app"
else
    print_error "❌ Failed to set environment variables"
    exit 1
fi

print_status "Environment variables configured:"
echo "  - NEXT_PUBLIC_DOMAIN=https://airlinesmap-274751619849.us-east5.run.app"
echo "  - NEXT_PUBLIC_COMPANY_NAME=airlinesmap.com"
echo "  - NEXT_PUBLIC_API_CONTENT=https://api.triposia.com"
echo "  - NEXT_PUBLIC_API_REAL=https://api.triposia.com"
echo "  - And 40+ additional configuration variables"

print_status "Deployment complete! 🚀"

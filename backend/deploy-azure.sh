#!/bin/bash

# Azure Container Instances Deployment Script
# This script automates the deployment of the backend to Azure

echo "🚀 Notes App - Azure Deployment Script"
echo "========================================"

# Configuration Variables - UPDATE THESE
RESOURCE_GROUP="notes-app-rg"
LOCATION="eastus"
REGISTRY_NAME="notesappregistry"
CONTAINER_NAME="notes-backend"
DNS_NAME="notes-app-backend-unique"  # Must be globally unique
IMAGE_NAME="notes-backend"

# Environment Variables - UPDATE THESE WITH YOUR VALUES
DB_HOST="your-aiven-host.aivencloud.com"
DB_USER="avnadmin"
DB_PASSWORD="your-aiven-password"
DB_NAME="notes_app"
DB_PORT="your-aiven-port"
JWT_SECRET="your-super-secret-jwt-key-change-this-to-something-random"
FRONTEND_URL="https://your-app.vercel.app"

echo ""
echo "📋 Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  Registry: $REGISTRY_NAME"
echo "  Container: $CONTAINER_NAME"
echo "  DNS: $DNS_NAME.$LOCATION.azurecontainer.io"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   brew install azure-cli"
    exit 1
fi

echo "✅ Azure CLI found"

# Check if logged in
echo ""
echo "🔐 Checking Azure login status..."
az account show &> /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Not logged in to Azure. Running 'az login'..."
    az login
else
    echo "✅ Already logged in to Azure"
fi

# Create Resource Group
echo ""
echo "📦 Creating Resource Group..."
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION \
    --output table

# Create Container Registry
echo ""
echo "🐳 Creating Azure Container Registry..."
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $REGISTRY_NAME \
    --sku Basic \
    --admin-enabled true \
    --output table

# Build and push image
echo ""
echo "🔨 Building Docker image in Azure..."
az acr build \
    --registry $REGISTRY_NAME \
    --image $IMAGE_NAME:latest \
    --file Dockerfile \
    . \
    --output table

# Get ACR credentials
echo ""
echo "🔑 Getting ACR credentials..."
ACR_USERNAME=$(az acr credential show --name $REGISTRY_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $REGISTRY_NAME --query passwords[0].value --output tsv)

echo "✅ Registry Username: $ACR_USERNAME"

# Create Container Instance
echo ""
echo "🚀 Deploying Container Instance..."
az container create \
    --resource-group $RESOURCE_GROUP \
    --name $CONTAINER_NAME \
    --image $REGISTRY_NAME.azurecr.io/$IMAGE_NAME:latest \
    --registry-login-server $REGISTRY_NAME.azurecr.io \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --dns-name-label $DNS_NAME \
    --ports 3000 \
    --cpu 1 \
    --memory 1.5 \
    --environment-variables \
        DB_HOST=$DB_HOST \
        DB_USER=$DB_USER \
        DB_PASSWORD=$DB_PASSWORD \
        DB_NAME=$DB_NAME \
        DB_PORT=$DB_PORT \
        JWT_SECRET=$JWT_SECRET \
        PORT=3000 \
        NODE_ENV=production \
        FRONTEND_URL=$FRONTEND_URL \
    --output table

# Get the FQDN
echo ""
echo "🌐 Getting Backend URL..."
BACKEND_URL=$(az container show \
    --resource-group $RESOURCE_GROUP \
    --name $CONTAINER_NAME \
    --query ipAddress.fqdn \
    --output tsv)

echo ""
echo "✅ Deployment Complete!"
echo "================================"
echo "Backend URL: http://$BACKEND_URL:3000"
echo "API Endpoints:"
echo "  - http://$BACKEND_URL:3000/api/auth/register"
echo "  - http://$BACKEND_URL:3000/api/auth/login"
echo "  - http://$BACKEND_URL:3000/api/notes"
echo "  - http://$BACKEND_URL:3000/api/profile"
echo ""
echo "📝 Next Steps:"
echo "1. Update frontend/js/main.js with API_URL: http://$BACKEND_URL:3000"
echo "2. Update frontend/js/profile.js with API_URL: http://$BACKEND_URL:3000"
echo "3. Commit and push changes to GitHub"
echo "4. Deploy frontend to Vercel"
echo "5. Update FRONTEND_URL in this script and redeploy"
echo ""
echo "🧪 Test the backend:"
echo "curl http://$BACKEND_URL:3000/api/auth/register -H 'Content-Type: application/json' -d '{\"username\":\"test\",\"email\":\"test@test.com\",\"password\":\"test123\"}'"
echo ""

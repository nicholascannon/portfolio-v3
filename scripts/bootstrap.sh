#!/usr/bin/env bash
set -e

echo "setting up infra..."
cd infra && npm ci --silent
echo "infra installed!"

cd ..

echo "setting up frontend..."
cd frontend && npm ci --silent
echo "frontend installed!"

cd ..

echo "setting up functions..."
cd functions/getBlob && npm ci --silent
echo "functions installed!"

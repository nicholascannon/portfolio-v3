#!/usr/bin/env bash

echo "setting up infra..."
cd infra && npm install --silent
echo "infra installed!"

cd ..

echo "setting up frontend..."
cd frontend && npm install --silent
echo "frontend installed!"

cd ..

echo "setting up functions..."
cd functions/getBlob && npm install --silent
echo "functions installed!"
#!/usr/bin/env bash
set -e

echo "building frontend..."
cd frontend && npm run build
echo "frontend built!"

cd ..

echo "building getBlob lambda..."
cd functions/getBlob
npm run build
echo "getBlob lambda built!"

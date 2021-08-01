#!/usr/bin/env bash
set -e

echo "building frontend..."
cd frontend && npm run build
echo "frontend built!"

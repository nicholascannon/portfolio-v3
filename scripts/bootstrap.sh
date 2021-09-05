#!/usr/bin/env bash
set -e

echo "setting up frontend..."
cd frontend && npm ci --silent && cd ..
echo "frontend installed!"

echo "setting up backend..."
cd backend && npm ci --silent
echo "backend installed!"

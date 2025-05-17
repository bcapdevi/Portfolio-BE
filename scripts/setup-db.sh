#!/bin/bash

# Start development database
docker run --name portfolio-dev-db \
  -e POSTGRES_PASSWORD=portfolio \
  -e POSTGRES_USER=portfolio \
  -e POSTGRES_DB=portfolio \
  -p 5432:5432 \
  -d postgres:16

# Start test database
docker run --name portfolio-test-db \
  -e POSTGRES_PASSWORD=portfolio \
  -e POSTGRES_USER=portfolio \
  -e POSTGRES_DB=portfolio_test \
  -p 5433:5432 \
  -d postgres:16
#!/bin/sh
./backup.sh

docker-compose build --build-arg buildId="$(git rev-parse --short HEAD) ($(git rev-parse --abbrev-ref HEAD))"
docker-compose up -d --force-recreate

#!/bin/bash

# start the server with HTTPS
export FLASK_APP=server_site.py
export FLASK_KEY=server.key
export FLASK_CERT=server.crt
export FLASK_RUN_PORT=5001
export FLASK_RUN_HOST=0.0.0.0

python3 -m flask run --cert=$FLASK_CERT --key=$FLASK_KEY

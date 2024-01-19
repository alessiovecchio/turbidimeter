#!/bin/bash

# Start the server with HTTPS
export FLASK_APP=server_sito.py
export FLASK_KEY=server.key
export FLASK_CERT=server.crt

python3 -m flask run --cert=$FLASK_CERT --key=$FLASK_KEY

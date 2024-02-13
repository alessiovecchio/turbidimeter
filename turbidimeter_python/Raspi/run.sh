#!/bin/bash

hostname -I > ip.txt
python3 main2.py
./sync.sh
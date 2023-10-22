#!/usr/bin/python3

import serial
import time
import sys

def send_command(command):
	rec_buffer = ''
	ser.write((command + "\r\n").encode())
	time.sleep(0.01)

	if ser.inWaiting():
		time.sleep(0.01)
		rec_buffer = ser.read(ser.inWaiting())
	if rec_buffer != '':
		print (rec_buffer.decode())

if __name__=="__main__":
	argument=sys.argv[1]
	print (f"Starting sendATCommands.py {argument}")
	ser = serial.Serial("/dev/ttyUSB2", 115200)

	try:
		send_command(argument)

	except:
		print("Request failed")
		ser.close()
		serial.Serial("/dev/ttyUSB2", 115200)
#!/usr/bin/env python
# Simple script that puts data in the rabbitmq queue for testing
import json
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(
                                     host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='hello')
body = json.dumps({'lat': 52.30, 'lon': 9.24})
channel.basic_publish(exchange='',
                      routing_key='hello',
                      body=body)
print " [x] Sent some coords"
connection.close()

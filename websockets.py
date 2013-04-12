import json

from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler
import pika


class WebSocketApp(object):
    '''Send random data to the websocket'''
    def __init__(self):
        # Rabbitmq
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(
                                                  host='localhost'))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue='ding')

        self.channel.basic_consume(self.callback,
                                   queue='ding',
                                   no_ack=True)

    def callback(self, ch, method, properties, body):
        body = json.loads(body)
        data = json.dumps({'lat': body['lat'],
                           'lon': body['lon'],
                           'amount': body['amount']})
        self.ws.send(data)

    def __call__(self, environ, start_response):
        self.ws = environ['wsgi.websocket']
        self.channel.start_consuming()


server = pywsgi.WSGIServer(("", 10000), WebSocketApp(),
                           handler_class=WebSocketHandler)
server.serve_forever()

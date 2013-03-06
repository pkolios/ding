# Simple gevent-websocket server pushing random coords to the client
import cPickle
import json
import random

from gevent import pywsgi, sleep
from geventwebsocket.handler import WebSocketHandler


class WebSocketApp(object):
    '''Send random data to the websocket'''

    def __call__(self, environ, start_response):
        ws = environ['wsgi.websocket']
        # coords.dat contains lat/lon tuples of German cities
        coords = cPickle.load(open('coords.dat', 'rb'))
        while True:
            city = random.choice(coords)
            data = json.dumps({'lat': city[0], 'lon': city[1]})
            ws.send(data)
            sleep(0.5)

server = pywsgi.WSGIServer(("", 10000), WebSocketApp(),
                           handler_class=WebSocketHandler)
server.serve_forever()

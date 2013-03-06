import json

import pika

from flask import Flask, Response, request, abort

app = Flask(__name__)

# Rabbitmq
connection = pika.BlockingConnection(pika.ConnectionParameters(
                                     host='localhost'))
channel = connection.channel()
channel.queue_declare(queue='hello')


@app.route('/ding', methods=['GET'])
def ding():
    if all(k in request.args for k in ('lat', 'lon')):
        ding = json.dumps({'lat': request.args['lat'],
                           'lon': request.args['lon']})
        channel.basic_publish(exchange='',
                              routing_key='hello',
                              body=ding)
        resp = Response(json.dumps({'status': 'Accepted'}), status=200,
                        mimetype='application/json')
        return resp
    else:
        abort(400)


if __name__ == '__main__':
    app.run(debug=True)

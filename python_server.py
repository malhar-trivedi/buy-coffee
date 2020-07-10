import os
import asyncio
import random
import ujson
import re
from sanic import Sanic
from sanic.response import json, text
from sanic.log import logger
from sanic_cors import CORS, cross_origin

app = Sanic("coffee_shops")
CORS(app)
# TODO add this config file
# app.config.from_envvar('MYAPP_SETTINGS')

my_path = os.path.abspath(os.path.dirname(__file__))

@app.route("/store/<slug>", methods=["GET",])
async def get_store_info(request, slug):
    data_path = os.path.join(my_path, f"store_data/{slug}.json")
    if not os.path.exists:
        logger.error(f'{slug}.json is not present')
        return
    with open(data_path, 'r') as f:
        listing = ujson.load(f)
    return json(listing)

@app.route('/get_listing', methods=['GET',])
async def get_listing(request):
    test_data_path = os.path.join(my_path, "store_data/test_data.json")
    listing = {}
    with open(test_data_path, 'r') as f:
        listing = ujson.load(f)
    return json(listing)

@app.route('/shop/create', methods=['POST',])
async def create_shop(request):
    data = request.json

    city = data.get('city', 'sf').lower()
    address = data.get('address', 'new-block').lower()
    slug = re.sub('\s+', '-', city) + '-' + re.sub('\s+', '-', address)

    store_data = {
        'name': data['name'],
        'tagline': data.get('tagLine', 'Best Coffee'),
        'slug': slug,
        'address': address,
        'hours': {
            "state": "Open",
            "current_time": "some time"
        },
        'delivery_fee': data.get('delivery_fee', '$3.99 Delivery'),
    }

    store_items = {'name': data['name'], 'tagline': data.get('tagLine', 'Best Coffee'), 'items': []}
    for item in data['items']:
        store_items['items'].append({
            'name': item['name'],
            'tagline': item['description'],
            'price': item['price']
        })

    test_data_path = os.path.join(my_path, "store_data/test_data.json")
    with open(test_data_path, 'r') as f:
        listing = ujson.load(f)

    listing['0']['results'].append(store_data)

    with open(test_data_path, 'w') as f:
        ujson.dump(listing, f)

    data_path = os.path.join(my_path, f"store_data/{slug}.json")
    with open(data_path, 'w') as f:
        ujson.dump(store_items, f)

    return json({"status": "ok"})


if __name__ == "__main__":
    # you can see app config
    # print(app.config)
    # TODO uncomment next line in final version
    # app.run(debug=False, access_log=False)
    app.run(host="0.0.0.0", port=8000, debug=False)

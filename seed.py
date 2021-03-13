"""Script to seed database."""

import os
import json
import crud
from faker import Faker
from random import sample, randint, choice
from model import connect_to_db, db
from server import app


os.system('dropdb restaurants')
os.system('createdb restaurants')

connect_to_db(app, echo=False)
db.create_all()

# Load restaurant data from JSON file
# There are 20 restaurants
with open('data/restaurants.json') as f:
    restaurant_data = json.loads(f.read())

# Create restaurants, store them in a list so 
# we can use them to fake favorites
restaurants_in_db = []
for r in restaurant_data:
    id, name, cuisine, address, longitude, latitude, image_url = (
        r['id'],
        r['name'],
        r['categories'][0]['title'],
        "\n".join(r['location']['display_address']),
        r['coordinates']['longitude'],
        r['coordinates']['latitude'],
        r['image_url']
    )

    db_restaurant = crud.create_restaurant(id, 
                    name, cuisine, address, 
                    longitude, latitude, image_url)

    restaurants_in_db.append(db_restaurant)


# Create the 11 users
with open('data/users.json') as f:
    user_data = json.loads(f.read())

users_in_db = []
meetups_in_db = []

for u in user_data:
    fname, lname, username, image_url, about = (
        u['fname'],
        u['lname'],
        u['username'],
        u['image_url'],
        u['about']
    )
    email = f'{username}@username.com'
    password = 'test'
    db_user = crud.create_user(username,fname,lname,email,password,image_url,about)
    users_in_db.append(db_user)

    if u['username'] == 'peppa':
        db_user.favorites.extend(restaurants_in_db)
    else:
        # Favorite 5 restaurants
        r_list = sample(restaurants_in_db, 5)
        for r in r_list:
            db_user.favorites.append(r)

db.session.commit()


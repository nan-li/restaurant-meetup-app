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
        r['location']['display_address'],
        r['coordinates']['longitude'],
        r['coordinates']['latitude'],
        r['image_url']
    )

    db_restaurant = crud.create_restaurant(id, 
                    name, cuisine, address, 
                    longitude, latitude, image_url)

    restaurants_in_db.append(db_restaurant)


def create_fake_user():
    fake = Faker()

    u = fake.first_name()
    f = u
    l = fake.last_name()
    e = fake.email()
    p = "test"
    i = fake.image_url()
    a = fake.text()

    db_user = crud.create_user(u,f,l,e,p,i,a)

    return db_user


def create_fake_meetup():
    fake = Faker()

    n = 'Fun Dinner'
    dt = fake.date_time()
    c = 10
    a = 0
    d = fake.text()
    r = choice(r_list)
    h = db_user

    db_meetup = crud.create_meetup(n,dt,c,a,d,r,h)
    return db_meetup

# Create 10 users
# Each will favorite 5 restaurants
# Each will create a meetup at a favorited restaurant
users_in_db = []
meetups_in_db = []

# Create 10 users
for _ in range(10):
    db_user = create_fake_user()
    users_in_db.append(db_user)

    # Favorite 5 restaurants
    r_list = sample(restaurants_in_db, 5)
    for r in r_list:
        db_user.favorites.append(r)

    # create a Meetup
    db_meetup = create_fake_meetup()
    meetups_in_db.append(db_meetup)

# Create 10 users
# Each will attend a Meetup from above iteratively
# and favorite it

for i in range(10):
    db_user = create_fake_user()
    users_in_db.append(db_user)

    meetup = meetups_in_db[i]
    db_user.meetups.append(meetup)
    db_user.favorites.append(meetup.restaurant)
    db.session.commit()

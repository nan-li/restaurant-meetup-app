"""Models for Restaurant Meetup app."""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Association Tables
favorites = db.Table('favorites', 
        db.Column('user_id', db.Integer, db.ForeignKey('users.id')), 
        db.Column('restaurant_id', db.String, db.ForeignKey('restaurants.id'))
)

user_meetups = db.Table('user_meetups',
        db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
        db.Column('meetup_id', db.Integer, db.ForeignKey('meetups.id'))    
)


class User(db.Model):
    """A user."""

    __tablename__ = 'users'
    
    # TODO: come back and make nullable=False

    id = db.Column(db.Integer, autoincrement=True, 
                    primary_key=True)
    username = db.Column(db.String, unique=True)
    fname = db.Column(db.String)
    lname = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
    image_url = db.Column(db.String)
    about = db.Column(db.Text)

    # hosted_meetups = list of Meetup objects hosted by this user

    favorites = db.relationship('Restaurant', secondary=favorites,
                    backref='fans')

    meetups = db.relationship('Meetup', secondary=user_meetups,
                backref='attendees')

    def __repr__(self):
        return f'<User {self.fname} {self.lname}>'


class Restaurant(db.Model):
    """A restaurant."""

    __tablename__ = 'restaurants'
    
    # TODO: come back and make nullable=False

    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    cuisine = db.Column(db.String)
    address = db.Column(db.String)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    image_url = db.Column(db.String)

    # meetups = list of Meetup objects at this restaurant
    # fans = list of User objects favoriting this restaurant

    def __repr__(self):
        return f'<Restaurant {self.name}>'


class Meetup(db.Model):
    """A meetup."""

    __tablename__ = 'meetups'

    # TODO: come back and make nullable=False

    id = db.Column(db.Integer, autoincrement=True, 
                    primary_key=True)
    name = db.Column(db.String)
    date = db.Column(db.DateTime)
    capacity = db.Column(db.Integer)
    attendees_count = db.Column(db.Integer)
    description = db.Column(db.Text)
    restaurant_id = db.Column(db.String, 
                    db.ForeignKey('restaurants.id'))
    host_id = db.Column(db.Integer, 
                    db.ForeignKey('users.id'))

    host = db.relationship('User', backref="hosted_meetups")
    restaurant = db.relationship('Restaurant', backref="meetups")

    # attendees = list of User objects attending

    def __repr__(self):
        return f'<Meetup {self.name} at {self.restaurant.name}>'




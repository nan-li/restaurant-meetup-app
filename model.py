"""Models for Restaurant Meetup app."""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

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
    email = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String)
    image_url = db.Column(db.String)
    about = db.Column(db.Text)

    # hosted_meetups = list of Meetup objects hosted by this user

    favorites = db.relationship('Restaurant', secondary=favorites,
                    backref='fans')

    meetups = db.relationship('Meetup', secondary=user_meetups,
                backref='attendees')

    def __repr__(self):
        return f'<User {self.fname} {self.lname}>'

    def to_dict(self, include_email=False):
        data = {
            'id': self.id,
            'username': self.username,
            'fname': self.fname,
            'lname': self.lname,
            'image_url': self.image_url,
            'about': self.about
        }
        if include_email:
            data['email'] = self.email
        return data

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


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

    def to_dict(self):
        data = {
            'id': self.id,
            'name': self.name,
            'cuisine': self.cuisine,
            'address': self.address,
            'long': self.longitude,
            'lat': self.latitude,
            'image_url': self.image_url
        }
        return data

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

    def to_dict(self):
        data = {
           'id': self.id,
            'name': self.name,
            'date': self.date,
            'capacity': self.capacity,
            'attendees_count': self.attendees_count,
            'description': self.description, 
            # TODO: link to restaurant and host
        }
        return data
        

def connect_to_db(flask_app, db_uri='postgresql:///restaurants', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app
    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
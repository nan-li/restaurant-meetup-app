"""Models for Restaurant Meetup app."""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

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
    username = db.Column(db.String) #unique=True
    fname = db.Column(db.String)
    lname = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String)
    image_url = db.Column(db.String, default='/v1615408384/user-avatar_gejisd.png')
    about = db.Column(db.Text)

    
    favorites = db.relationship('Restaurant', secondary=favorites,
                    backref='fans')

    # hosted_meetups = list of Meetup objects hosted by this user
    hosted_meetups = db.relationship('Meetup', order_by='Meetup.date')
    
    meetups = db.relationship('Meetup', secondary=user_meetups,
                backref='attendees', order_by='Meetup.date')
    
    messages_sent = db.relationship('Message', foreign_keys='Message.sender_id',
                        backref='sender')

    messages_received = db.relationship('Message', foreign_keys='Message.recipient_id',
                            backref='recipient')

    notifications = db.relationship('Notification', backref='user')

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
            # TODO: link to favorites and meetups
        }
        # default: don't send user email back unless toldß
        if include_email:
            data['email'] = self.email
        return data

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Message(db.Model):
    """A message."""
    __tablename__ = 'messages'

    id = db.Column(db.Integer, autoincrement=True, 
                    primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    body = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # sender = user who wrote the message
    # recipient = user who received the message

    def __repr__(self):
            return f'<Message from {self.sender_id} to {self.recipient_id}>'

    def to_dict(self):
        data = {
            'id': self.id,
            'sender_id': self.sender_id,
            'recipient_id': self.recipient_id,
            'body': self.body,
            'timestamp': self.timestamp,
            'sender': self.sender.to_dict(),
            'recipient': self.recipient.to_dict()
        }
        return data

class Notification(db.Model):
    """A notification."""
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, autoincrement=True, 
                    primary_key=True)
    name = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    payload_json = db.Column(db.Text)
    # 'READ', 'UNREAD', 'DELETED'
    status = db.Column(db.String(10), default='UNREAD')

    # user = user this notification is for
    def __repr__(self):
            return f'<Notification {self.name} for User {self.user_id}>'

    def get_data(self):
        return json.loads(str(self.payload_json))

    def to_dict(self):
        data = {
            'id': self.id,
            'name': self.name,
            'status': self.status,
            'timestamp': self.timestamp,
            'data': self.get_data()
        }
        return data


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
    image_url = db.Column(db.String, default='/v1615407752/gn4vjpy16debw6sghogu.jpg')

    # 'CANCELLED' 'ACTIVE'
    status = db.Column(db.String(10), default='ACTIVE')

    restaurant_id = db.Column(db.String, 
                    db.ForeignKey('restaurants.id'))
    host_id = db.Column(db.Integer, 
                    db.ForeignKey('users.id'))

    host = db.relationship('User')
    
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
            'status': self.status,
            'image_url': self.image_url,
            'restaurant_id': self.restaurant_id,
            'host_id': self.host_id, 
            'host': self.host.to_dict(),
            'restaurant': self.restaurant.to_dict()
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
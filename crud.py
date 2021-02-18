"""CRUD operations."""

from model import db, User, Restaurant, Meetup, connect_to_db

def create_restaurant(id, name, cuisine, address, 
                longitude, latitude, image_url):
    """Create and return a new restaurant."""

    r = Restaurant(id=id, name=name, cuisine=cuisine, 
            address=address, longitude=longitude, 
            latitude=latitude, image_url=image_url)
    
    db.session.add(r)
    db.session.commit()

    return r


def create_user(username, fname, lname, email, password, 
                image_url, about):
    """Create and return a new user."""

    # When I create a new user, I don't pass password in:
    u = User(username=username, fname=fname, lname=lname, 
                email=email, image_url=image_url, about=about)
    
    # Here I set the password_hash with password
    u.set_password(password)
    
    db.session.add(u)
    db.session.commit()

    return u

def create_meetup(name, date, capacity, attendees_count,
                description, restaurant, host):
    """Create and return a new meetup.
        restaurant and host are Restaurant and User objects"""
    

    m = Meetup(name=name, date=date, capacity=capacity, 
                attendees_count=attendees_count,
                description=description, restaurant=restaurant, 
                host=host)

    db.session.add(m)
    db.session.commit()

    return m



def get_user_by_id(user_id):
    """Return a user by primary key."""
    return User.query.get(user_id)

def get_user_by_username(username):
    """Return a user by username."""
    return User.query.filter_by(username=username).first()

def get_favorites_by_user_id(user_id):
    """Return all favorite restaurants of user."""
    user = get_user_by_id(user_id)
    return user.favorites

def get_hosted_meetups_by_user_id(user_id):
    """Return all meetups hosted by user."""
    user = get_user_by_id(user_id)
    return user.hosted_meetups

def get_meetups_by_user_id(user_id):
    """Return all meetups user is attending."""
    user = get_user_by_id(user_id)
    return user.meetups



def get_restaurant_by_id(restaurant_id):
    """Return a restaurant by primary key."""
    return Restaurant.query.get(restaurant_id)

def get_fans_by_restaurant_id(restaurant_id):
    """Return all fans of a restaurant."""
    restaurant = get_restaurant_by_id(restaurant_id)
    return restaurant.fans

def get_meetups_by_restaurant_id(restaurant_id):
    """Return all meetups at a restaurant."""
    restaurant = get_restaurant_by_id(restaurant_id)
    return restaurant.meetups



def get_meetup_by_id(meetup_id):
    """Return a meetup by primary key."""
    return Meetup.query.get(meetup_id)

def get_host_by_meetup_id(meetup_id):
    """Return the host of a meetup."""
    meetup = get_meetup_by_id(meetup_id)
    return meetup.host

def get_restaurant_by_meetup_id(meetup_id):
    """Return the restaurant for a meetup."""
    meetup = get_meetup_by_id(meetup_id)
    return meetup.restaurant

def get_attendees_by_meetup_id(meetup_id):
    """Return the attendees of a meetup."""
    meetup = get_meetup_by_id(meetup_id)
    return meetup.attendees
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

    u = User(username=username, fname=fname, lname=lname, 
                email=email, password=password, 
                image_url=image_url, about=about)
    
    db.session.add(u)
    db.session.commit()

    return u

def create_meetup(name, date, capacity, attendees_count,
                description, restaurant, host):
    """Create and return a new meetup."""

    m = Meetup(name=name, date=date, capacity=capacity, 
                attendees_count=attendees_count,
                description=description, restaurant=restaurant, 
                host=host)

    db.session.add(m)
    db.session.commit()

    return m
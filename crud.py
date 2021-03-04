"""CRUD operations."""

from model import db, User, Restaurant, Meetup, Message, Notification, connect_to_db
from datetime import datetime

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

def create_message(sender, recipient, body):
    """Create and return a message from sender to recipient."""
    m = Message(sender=sender, recipient=recipient, body=body)

    db.session.add(m)
    db.session.commit()

    return m


def create_notification(name, user_id, payload_json):
    """Create and return a notification."""
    n = Notification(name=name, user_id=user_id, payload_json=payload_json)

    db.session.add(n)
    db.session.commit()

    return n

def create_many_notifications(name, id, payload_json):
    """Create and return notifications for all users to be notified.
        name: new_meetup, meetup_changed, meetup_cancelled
        id: meetup or restaurant id """

    users = []
    notifications = []
    if name == 'new_meetup':
        users = get_fans_by_restaurant_id(id)
    
    elif name == 'meetup_changed' or name == 'meetup_cancelled':
        users = get_attendees_by_meetup_id(id)
    
    for user in users:
        notifications.append(create_notification(name, user.id, payload_json))
    
    return notifications

        

def delete_notification_by_id(id):
    """Delete a notification by its id."""
    n = Notification.query.get(id)
    db.session.delete(n)
    db.session.commit()
    
def get_user_notifications(user_id):
    """Get the notifications for a user."""
    notifications = Notification.query.filter_by(user_id=user_id).order_by('timestamp').all()

    return notifications

def get_messages_between_users(user1_id, user2_id):
    """Get the messages exchanged between current and other user sorted by timestamp."""

    messages = Message.query.filter(
            ((Message.recipient_id == user1_id) & (Message.sender_id == user2_id)) |
            ((Message.recipient_id == user2_id) & (Message.sender_id == user1_id))
        ).order_by('timestamp').all()
    
    return messages


def get_user_messages(user_id):
    """Get the messages a user sent or received.
        Return results sorted by user being interacted with."""

    messages = (Message.query.filter((Message.recipient_id == user_id) | (Message.sender_id == user_id))
            .order_by('timestamp').all())

    result = {} # {user_id: {messages as dict()}}
    users = {} # {user_id: user.to_dict()}

    for message in messages:
        other_user_id = (message.recipient_id if message.sender_id == user_id 
                                                else message.sender_id)
        other_user = (message.recipient if message.sender_id == user_id 
                                                else message.sender)
        if other_user_id in result:
            result[other_user_id].append(message.to_dict())
        else:
            result[other_user_id] = [message.to_dict()]
        
        if other_user_id not in users:
            users[other_user_id] = other_user.to_dict()


    return [users, result]

def get_user_by_id(user_id):
    """Return a user by primary key."""
    return User.query.get(user_id)

def get_user_by_username(username):
    """Return a user by username."""
    return User.query.filter_by(username=username).first()

def get_user_by_email(email):
    """Return a user by email."""
    return User.query.filter_by(email=email).first()

def update_user(user, fname, lname, email, password, image_url, about):
    
    if fname:
        user.fname = fname
    if lname:
        user.lname = lname
    if email:
        user.email = email
    if password:
        user.set_password(password)
    if image_url:
        user.image_url = image_url
    if about:
        user.about = about

    db.session.commit()

    return get_user_by_id(user.id)

def get_favorites_by_user_id(user_id):
    """Return all favorite restaurants of user."""
    user = get_user_by_id(user_id)
    return user.favorites

def get_restaurant_by_user_restaurant_id(user_id, restaurant_id):
    """Return a restaurant if favorited by that user. Return None if not favorited."""
    user = get_user_by_id(user_id)
    res = get_restaurant_by_id(restaurant_id)
    if res in user.favorites:
        return res
    else:
        return None

def create_user_restaurant_relationship(user, restaurant):
    """Make restaurant object a favorite of user object."""
    user.favorites.append(restaurant)
    db.session.commit()

def delete_user_restaurant_relationship(user, restaurant):
    user.favorites.remove(restaurant)
    db.session.commit()

def add_user_to_meetup(user_id, meetup_id):
    """Add a user to meetup attendees."""
    user = get_user_by_id(user_id)
    meetup = get_meetup_by_id(meetup_id)
    meetup.attendees.append(user)
    meetup.attendees_count += 1
    db.session.commit()
    return meetup

def delete_user_from_meetup(user_id, meetup_id):
    """Remove a user from meetup attendees."""
    user = get_user_by_id(user_id)
    meetup = get_meetup_by_id(meetup_id)
    meetup.attendees.remove(user)
    meetup.attendees_count -= 1
    db.session.commit()
    return meetup


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
    """Return all meetups at a restaurant.
        Return None if restaurant_id not found."""
    restaurant = get_restaurant_by_id(restaurant_id)
    return restaurant.meetups if restaurant else None
   



def get_meetup_by_id(meetup_id):
    """Return a meetup by primary key."""
    return Meetup.query.get(meetup_id)

def update_meetup_by_id(meetup_id, name, date, capacity, description):
    """Update the details of a meetup."""
    meetup = get_meetup_by_id(meetup_id)
    if name:
        meetup.name = name
    if date:
        meetup.date = datetime.strptime(date, '%Y-%m-%dT%H:%M')
    if capacity:    
        meetup.capacity = capacity
    if description:
        meetup.description = description
    
    db.session.commit()

def cancel_meetup_by_id(meetup_id):
    """Cancel the meetup with this id."""
    
    meetup = get_meetup_by_id(meetup_id)
    meetup.status = 'CANCELLED'
    db.session.commit()
    return meetup

    


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
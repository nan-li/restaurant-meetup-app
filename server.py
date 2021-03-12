"""Server for Restaurant Meetup app."""

from flask import (Flask, render_template, redirect, 
                    flash, request, session, jsonify, request)
from datetime import datetime
from model import connect_to_db, User, Restaurant, Meetup
import cloudinary.uploader
import os
import requests
import json
import crud

YELP_API_KEY = os.environ['YELP_API_KEY']

cloudinary.config(
  cloud_name = os.environ['CLOUDINARY_CLOUD_NAME'],  
  api_key = os.environ['CLOUDINARY_API_KEY'],  
  api_secret = os.environ['CLOUDINARY_API_SECRET'] 
)


app = Flask(__name__)
app.secret_key = 'dev'

@app.route('/', defaults={'path': ''}) 
@app.route('/<path:path>') 
def show_homepage(path):
    """View the homepage."""
    
    return render_template('index.html')


"""
API Routes.
"""

@app.route('/api/users/login', methods=['POST'])
def login_user():
    username = request.json['username'].lower()
    password = request.json['password']

    user = crud.get_user_by_username(username)
    if not user:
        return jsonify({
            'status': 'error',
            'message': 'User does not exist.'
        })
    else:
        if user.check_password(password):
            session['user_id'] = user.id
            return jsonify({
                'status': 'success',
                'message': 'Successfully logged in.',
                'user': user.to_dict('include_email')
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Invalid password.'
            })


@app.route('/api/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    """Update user information."""

    old_password = request.form.get('old_password')
    new_password = request.form.get('new_password')

    user = crud.get_user_by_id(user_id)
    if old_password and not user.check_password(old_password):
        return jsonify({
            'status': 'error',
            'message': 'Incorrect password.'
        })
    
    password = new_password

    fname = request.form.get('fname')
    lname = request.form.get('lname')
    email = request.form.get('email')
    image = request.files.get('image')
    about = request.form.get('about')
    image_url = ''
    
    if image:
        cloudinary_upload = cloudinary.uploader.upload(image)
        image_url = cloudinary_upload['url'].partition("upload")[2]



    user = crud.update_user(user, fname, lname, email, password, image_url, about)
    return jsonify({
                    'status': 'success',
                    'message': 'Successfully update information.',
                    'user': user.to_dict('include_email')
                })


@app.route('/api/users/signup', methods=['POST'])
def register_user():
    """Create a new user account."""

    username = request.form.get('username').lower()
    fname = request.form.get('fname')
    lname = request.form.get('lname')
    email = request.form.get('email')
    password = request.form.get('password')
    image = request.files.get('image')
    about = request.form.get('about')

    # Check if user with that email already exists
    user = crud.get_user_by_email(email)
    if user:
        return jsonify({
                'status': 'error',
                'message': 'Account with that email already exists.'
        })
    
    # Check if user with that username already exists
    user = crud.get_user_by_username(username)
    if user:
        return jsonify({
                'status': 'error',
                'message': 'Username already exists. Please pick a different one.'
        })

    # OK to create a new user account
    image_url = None
    if image:
        cloudinary_upload = cloudinary.uploader.upload(image)
        image_url = cloudinary_upload['url'].partition("upload")[2]

    user = crud.create_user(username, fname, lname, email, password, 
                image_url, about)

    session['user_id'] = user.id
    
    return jsonify({
                'status': 'success',
                'message': 'Welcome! Account successfully created.',
                'user': user.to_dict('include_email')
    })


@app.route('/api/users/<int:id>.json')
def get_user(id):
    """Return user information."""
    return jsonify(crud.get_user_by_id(id).to_dict())


@app.route('/api/user/<int:user_id>/notifications')
def get_user_notifications(user_id):
    """Get the notifications for a user."""
    notifications = crud.get_user_notifications(user_id)

    if not notifications:
        return jsonify({
            'status': 'error',
            'message': 'There are no notifications.'
        })
    
    return jsonify([notification.to_dict() for notification in notifications])


@app.route('/api/notification/<int:notification_id>', methods=['DELETE', 'PATCH'])
def update_notification(notification_id):
    """Delete or mark as read a notification by its id."""
    message = ''
    if request.method == 'DELETE':
        crud.update_notification_by_id(notification_id, 'DELETE')
        message = 'Notification deleted.'
    else:
        crud.update_notification_by_id(notification_id, 'READ')
        message = 'Notification marked as read.'

    return jsonify({
        'status': 'success',
        'message': message
    })


@app.route('/api/users/<int:user_id>/restaurants.json')
def get_user_favorites(user_id):
    """Return a list of the user's favorite restaurants."""

    restaurants = crud.get_favorites_by_user_id(user_id)

    restaurants_info = [r.to_dict() for r in restaurants]

    return jsonify(restaurants_info)



@app.route('/api/users/<int:user_id>/restaurants/<restaurant_id>.json')
def get_a_restaurant_for_user(user_id, restaurant_id):
    """Get restaurant for a user.
        Give status if restaurant is favorited by user.
        Return error if restaurant is not found."""
    
    user = crud.get_user_by_id(user_id)
    restaurant = crud.get_restaurant_by_id(restaurant_id)

    if not restaurant:
        return jsonify({
            'status': 'error',
            'message': 'Restaurant not found.'
        })

    result = {}
    result['restaurant'] = restaurant.to_dict()

    if restaurant in user.favorites:
        result['favorited'] = 'true'

    return jsonify(result)



@app.route('/api/users/<int:user_id>/restaurants/<restaurant_id>.json', methods=['POST'])
def update_user_restaurant_relationship(user_id, restaurant_id):
    """Make restaurant a favorite of the user."""
    #TODO: Make user able to un-favorite a restaurant

    restaurant = crud.get_restaurant_by_id(restaurant_id)
    user = crud.get_user_by_id(user_id)

    # Check if restaurant is in database
    if not restaurant:
        id = request.json['id']
        name = request.json['name']
        cuisine = request.json['categories'][0]['title']
        address = "\n".join(request.json['location']['display_address'])
        longitude = request.json['coordinates']['longitude']
        latitude = request.json['coordinates']['latitude']
        image_url = request.json['image_url']

        restaurant = crud.create_restaurant(id, name, cuisine, address, 
                        longitude, latitude, image_url)

    crud.create_user_restaurant_relationship(user, restaurant)

    return jsonify({
        'status': 'success',
        'message': "Restaurant added to user's favorites."
    })


@app.route('/api/users/<int:user_id>/restaurants/<restaurant_id>.json', methods=['DELETE'])
def delete_restaurant_for_user(user_id, restaurant_id):
    user = crud.get_user_by_id(user_id)
    restaurant = crud.get_restaurant_by_id(restaurant_id)
    crud.delete_user_restaurant_relationship(user, restaurant)

    return jsonify({
        'status': 'success',
        'message': 'Restaurant is unfavorited.'
    })


@app.route('/api/users/<int:user_id>/hosting.json')
def get_user_hosted_meetups(user_id):
    """Return a list of meetups the user is hosting.
       Split into meetups past meetups and future meetups.
       Meetups are sorted by date."""

    [past, future] = crud.get_hosted_meetups_by_user_id(user_id)

    past_info = [m.to_dict() for m in past]
    future_info = [m.to_dict() for m in future]

    return jsonify({
        'past': past_info,
        'future': future_info
    })


@app.route('/api/users/<int:user_id>/meetups.json')
def get_user_meetups(user_id):
    """Return a list of meetups the user is attending.
        Split into past meetups and future meetups.
        Meetups are sorted by date."""
    
    [past, future] = crud.get_meetups_by_user_id(user_id)
    past_info = [m.to_dict() for m in past]
    future_info = [m.to_dict() for m in future]
        
    return jsonify({
        'past': past_info,
        'future': future_info
    })


@app.route('/api/users/<int:user_id>/meetups/<int:meetup_id>', methods=['POST'])
def add_user_to_meetup(user_id, meetup_id):
    """Add user to meetup attendees."""

    meetup = crud.add_user_to_meetup(user_id, meetup_id)

    return jsonify({
        'status': 'success',
        'message': "You've successfully joined this meetup.",
        'meetup': meetup.to_dict()
    })

@app.route('/api/users/<int:user_id>/meetups/<int:meetup_id>', methods=['DELETE'])
def delete_user_from_meetup(user_id, meetup_id):
    """Remove user from meetup attendees."""

    meetup = crud.delete_user_from_meetup(user_id, meetup_id)

    return jsonify({
        'status': 'success',
        'message': "You've successfully unjoined this meetup.",
        'meetup': meetup.to_dict()
    })


@app.route('/api/users/<int:recipient_id>/message/<int:sender_id>', methods=['POST'])
def create_message(recipient_id, sender_id):
    """Create a message from sender to recipient."""
    body = request.json['body']

    sender = crud.get_user_by_id(sender_id)
    recipient = crud.get_user_by_id(recipient_id)
    message = crud.create_message(sender, recipient, body)

    message = message.to_dict()
   
    notification_data = {'message': f'You have a new message from {message["sender"]["username"]}.',
            'link': 'Go to messages.',
            'url': '/messages'}
    notification = crud.create_notification('new_message', recipient_id, json.dumps(notification_data))

    return jsonify({
        'status': 'success',
        'message': 'Message successfully sent.'
    })

@app.route('/api/users/<int:current_user_id>/messages/<int:other_user_id>')
def get_messages_between_users(current_user_id, other_user_id):
    """Get the messages exchanged between current and other user."""
    messages = crud.get_messages_between_users(current_user_id, other_user_id)
    
    if not messages:
        return jsonify({
            'status': 'error',
            'message': 'No messages exist between you and this user.'
        })
    
    return jsonify([m.to_dict() for m in messages])


@app.route('/api/user/<int:user_id>/messages')
def get_user_messages(user_id):
    """Get all the messages a user sent or received.
        Return results sorted by user interacting with."""

    users, messages = crud.get_user_messages(user_id)

    if not messages:
        return jsonify({
            'status': 'error',
            'message': 'No messages exchanged with this user.'
        })
    
    return jsonify({
        'users': users,
        'messages': messages
    })
    
@app.route('/api/restaurants/<id>.json')
def get_restaurant(id):
    """Return restaurant information."""
    return jsonify(crud.get_restaurant_by_id(id).to_dict())



@app.route('/api/restaurants/search.json')
def get_search_results():
    """Return restaurants from a Yelp search."""

    url = 'https://api.yelp.com/v3/businesses/search'
    
    headers = {
        'Authorization': f'Bearer {YELP_API_KEY}',
        'Content-Type': 'application/json'
    }

    params = request.args.to_dict()
   
    # {'location': 'San Francisco', 'term': 'sushi'}

    params['limit'] = 50
    print('\n' * 5)
    print(params)
    print(request.args.to_dict())
    # request.args.to_dict()
    req = requests.get(url, params=params, headers=headers)
    print("*" * 100)
    print('The status code from YELP is', req.status_code)
    print(req.json())
    if 'error' in req.json():
        print("THERES AN ERROR")
    return req.json()




@app.route('/api/restaurants/<restaurant_id>/meetups.json')
def get_restaurant_meetups(restaurant_id):
    """Return a list of meetups at this restaurant.
        Split into past and future meetups.
        Meetups are sorted by date."""

    [past, future] = crud.get_meetups_by_restaurant_id(restaurant_id)

    if not past and not future:
        return jsonify({
            'status': 'error',
            'message': 'No meetups at this restaurant.'
        })

    [attending_past, attending_future] = crud.get_meetups_by_user_id(session['user_id'])
    
    past_info = [m.to_dict() for m in past]
    future_info = [m.to_dict() for m in future]
    
    result = {
        'meetups_info': {
            'past': past_info,
                'future': future_info
        }
    }

    for meetup in future:
        if session['user_id'] == meetup.host_id:
            result['isHosting'] = 'true'
            break
        if meetup in attending_future:
            result['isAttending'] = 'true'
    
    return jsonify(result)


@app.route('/api/restaurants/<restaurant_id>/fans.json')
def get_restaurant_fans(restaurant_id):
    """Return a list of users favoriting the restaurant."""
    fans = crud.get_fans_by_restaurant_id(restaurant_id)
    if not fans:
        return jsonify({
            'status': 'error',
            'message': 'This restaurant has no fans.'
        })

    fans_info = [f.to_dict() for f in fans]
    return jsonify(fans_info)


@app.route('/api/meetups/create', methods=['POST'])
def create_meetup():
    """Create a new meetup."""
    name = request.form.get('name')
    date = datetime.strptime(request.form.get('date'), '%Y-%m-%dT%H:%M')
    capacity = request.form.get('capacity')
    attendees_count = 0
    description = request.form.get('description')
    restaurant_id = request.form.get('restaurant_id')
    host_id = request.form.get('host_id')
    image = request.files.get('image')
    image_url = None

    restaurant = crud.get_restaurant_by_id(restaurant_id)
    host = crud.get_user_by_id(host_id)

    if image:
        cloudinary_upload = cloudinary.uploader.upload(image)
        image_url = cloudinary_upload['url'].partition("upload")[2]
    
    meetup = crud.create_meetup(name, date, capacity, attendees_count, description, image_url, restaurant, host)

    notification_data = {
        'message': f'There is a new event at {restaurant.name}.',
        'link': 'Go to meetup.',
        'url': f'/meetup/{meetup.id}'
    }

    notifications = crud.create_many_notifications(
        'new_meetup', restaurant_id, json.dumps(notification_data), host)

    return jsonify({
        'status': 'success',
        'message': 'Meetup created successfully.',
        'meetup': meetup.to_dict()
    })

@app.route('/api/meetups/<int:meetup_id>.json')
def get_meetup(meetup_id):
    """Return meetup information."""
    return jsonify(crud.get_meetup_by_id(meetup_id).to_dict())


@app.route('/api/meetups/<int:meetup_id>', methods=['PATCH'])
def update_meetup(meetup_id):
    """Update meetup details."""
    name = request.json.get('name')
    date = request.json.get('date')
    capacity = request.json.get('capacity')
    description = request.json.get('description')

    host = crud.get_user_by_id(session['user_id'])

    meetup = crud.update_meetup_by_id(meetup_id, name, date, capacity, description)
    
    notification_data = {
        'message': f'Your meetup at {meetup.restaurant.name} has been changed.',
        'link': 'Go to meetup.',
        'url': f'/meetup/{meetup_id}'
    }

    notifications = crud.create_many_notifications(
        'meetup_changed', meetup_id, json.dumps(notification_data), host)

    return jsonify({
        'status': 'success',
        'message': 'Successfully updated meetup.'
    })


@app.route('/api/meetups/<int:meetup_id>', methods=['DELETE'])
def cancel_meetup(meetup_id):
    """Cancel this meetup."""
    meetup = crud.cancel_meetup_by_id(meetup_id)
    host = crud.get_user_by_id(session['user_id'])

    notification_data = {
        'message': f'Your meetup at {meetup.restaurant.name} has been cancelled.',
        'link': 'Go to meetup.',
        'url': f'/meetup/{meetup_id}'
    }

    notifications = crud.create_many_notifications(
        'meetup_cancelled', meetup_id, json.dumps(notification_data), host)
    
    return jsonify({
        'status': 'success',
        'message': 'Successfully cancelled meetup.'
    })

@app.route('/api/meetups/<int:meetup_id>/host.json')
def get_host(meetup_id):
    """Return host information for a meetup."""
    return jsonify(crud.get_host_by_meetup_id(meetup_id).to_dict())


@app.route('/api/meetups/<int:meetup_id>/restaurant.json')
def get_meetup_restaurant(meetup_id):
    return jsonify(crud.get_restaurant_by_meetup_id(meetup_id).to_dict())


@app.route('/api/meetups/<int:meetup_id>/attendees.json')
def get_meetup_attendees(meetup_id):
    """Return a list of attendees for the meetup."""
    attendees = crud.get_attendees_by_meetup_id(meetup_id)
    attendees_info = [a.to_dict() for a in attendees]
    return jsonify(attendees_info)


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)


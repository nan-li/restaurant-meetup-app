"""Server for Restaurant Meetup app."""

from flask import (Flask, render_template, redirect, 
                    flash, request, session, jsonify, request)
from datetime import datetime
from model import connect_to_db, User, Restaurant, Meetup
import os
import requests
import json
import crud

YELP_API_KEY = os.environ['YELP_API_KEY']

app = Flask(__name__)
app.secret_key = 'dev'


@app.route('/')
def show_homepage():
    """View the homepage."""

    return render_template('index.html')

@app.route('/sign-up')
def show_sign_up_page():
    """Show the sign up page."""

    return render_template('sign_up.html')

# Old sign-up route.. use API instead
@app.route('/sign-up', methods=['POST'])
def create_user():
    """Create a new user account."""

    username = request.form.get('username')
    fname = request.form.get('fname')
    lname = request.form.get('lname')
    email = request.form.get('email')
    password = request.form.get('password')
    image_url = request.form.get('image_url')
    about = request.form.get('about')

    # TODO: validation of user inputs, prefererably AJAX
    
    user = crud.create_user(username, fname, lname, email, password, 
                image_url, about)
    session['user_id'] = user.id
    
    flash('Account successfully created.')

    return redirect('/')

"""
API Routes.
"""

@app.route('/api/users/login', methods=['POST'])
def login_user():
    username = request.json['username'].lower()
    print(username)
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
    old_password = request.json.get('old_password')
    new_password = request.json.get('new_password')

    user = crud.get_user_by_id(user_id)
    if old_password and not user.check_password(old_password):
        return jsonify({
            'status': 'error',
            'message': 'Incorrect password.'
        })
    
    password = new_password

    fname = request.json.get('fname')
    lname = request.json.get('lname')
    email = request.json.get('email')
    image_url = request.json.get('image_url')
    about = request.json.get('about')

    user = crud.update_user(user, fname, lname, email, password, image_url, about)
    return jsonify({
                    'status': 'success',
                    'message': 'Successfully update information.',
                    'user': user.to_dict('include_email')
                })


@app.route('/api/users/signup', methods=['POST'])
def register_user():
    """Create a new user account."""

    username = request.json.get('username').lower()
    fname = request.json.get('fname')
    lname = request.json.get('lname')
    email = request.json.get('email')
    password = request.json.get('password')
    image_url = request.json.get('image_url')
    about = request.json.get('about')

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
        Return error is restaurant is not found."""
    
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
    
@app.route('/api/users/<int:user_id>/restaurants/<restaurant_id>.json',
    methods=['DELETE'])
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
    """Return a list of meetups the user is hosting."""

    meetups = crud.get_hosted_meetups_by_user_id(user_id)
    meetups_info = [m.to_dict() for m in meetups]
        
    return jsonify(meetups_info)


@app.route('/api/users/<int:user_id>/meetups.json')
def get_user_meetups(user_id):
    """Return a list of meetups the user is attending."""
    
    meetups = crud.get_meetups_by_user_id(user_id)
    meetups_info = [m.to_dict() for m in meetups]
        
    return jsonify(meetups_info)

@app.route('/api/users/<int:user_id>/meetups/<int:meetup_id>', methods=['POST'])
def add_user_to_meetup(user_id, meetup_id):
    """Add user to meetup attendees."""

    meetup = crud.add_user_to_meetup(user_id, meetup_id)

    return jsonify({
        'status': 'success',
        'message': "You're added to this Meetup.",
        'meetup': meetup.to_dict()
    })

@app.route('/api/users/<int:user_id>/meetups/<int:meetup_id>', methods=['DELETE'])
def delete_user_from_meetup(user_id, meetup_id):
    """Remove user from meetup attendees."""

    meetup = crud.delete_user_from_meetup(user_id, meetup_id)

    return jsonify({
        'status': 'success',
        'message': "You're not attending this Meetup anymore.",
        'meetup': meetup.to_dict()
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
    print(params)
    print(request.args.to_dict())
    # request.args.to_dict()
    req = requests.get(url, params=params, headers=headers)
    print("*" * 100)
    print('The status code from YELP is', req.status_code)
    print(req.json())

    return req.json()




@app.route('/api/restaurants/<restaurant_id>/meetups.json')
def get_restaurant_meetups(restaurant_id):
    """Return a list of meetups at this restaurant."""
    meetups = crud.get_meetups_by_restaurant_id(restaurant_id)
    if not meetups:
        return jsonify({
            'status': 'error',
            'message': 'No meetups at this restaurant.'
        })

    attending = crud.get_meetups_by_user_id(session['user_id'])

    result = {
        'meetups_info': [m.to_dict() for m in meetups]
    }

    for meetup in meetups:
        if session['user_id'] == meetup.host_id:
            result['isHosting'] = 'true'
            break
        if meetup in attending:
            result['isAttending'] = 'true'
    
    return jsonify(result)


@app.route('/api/restaurants/<restaurant_id>/fans.json')
def get_restaurant_fans(restaurant_id):
    """Return a list of users favoriting the restaurant."""
    fans = crud.get_fans_by_restaurant_id(restaurant_id)
    fans_info = [f.to_dict() for f in fans]
    return jsonify(fans_info)

@app.route('/api/meetups/create', methods=['POST'])
def create_meetup():
    """Create a new meetup."""
    name = request.json.get('name')
    date = datetime.strptime(request.json.get('date'), '%Y-%m-%dT%H:%M')
    capacity = request.json.get('capacity')
    attendees_count = 0
    description = request.json.get('description')
    restaurant_id = request.json.get('restaurant_id')
    host_id = request.json.get('host_id')

    restaurant = crud.get_restaurant_by_id(restaurant_id)
    host = crud.get_user_by_id(host_id)

    meetup = crud.create_meetup(name, date, capacity, attendees_count, 
                description, restaurant, host)

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

    crud.update_meetup_by_id(meetup_id, name, date, capacity, description)

    return jsonify({
        'status': 'success',
        'message': 'Successfully updated meetup.'
    })

@app.route('/api/meetups/<int:meetup_id>', methods=['DELETE'])
def delete_meetup(meetup_id):
    """Delete this meetup."""
    meetup = crud.delete_meetup_by_id(meetup_id)
    return jsonify({
        'status': 'success',
        'message': 'Successfully deleted meetup.'
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


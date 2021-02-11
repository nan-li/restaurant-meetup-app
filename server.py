"""Server for Restaurant Meetup app."""

from flask import Flask, render_template, redirect, flash, request, session
from model import connect_to_db
import crud

app = Flask(__name__)
app.secret_key = 'dev'


@app.route('/')
def show_homepage():
    """View the homepage."""

    return render_template('homepage.html')

@app.route('/sign-up')
def show_sign_up_page():
    """Show the sign up page."""

    return render_template('sign_up.html')

@app.route('/sign-up', methods=['POST'])
def register_user():
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
    session['fname'] = fname
    session['lname'] = lname

    flash('Account successfully created.')

    return redirect('/')


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

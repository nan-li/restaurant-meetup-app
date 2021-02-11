"""Server for Restaurant Meetup app."""

from flask import Flask
from model import connect_to_db

app = Flask(__name__)
app.secret_key = "dev"



if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

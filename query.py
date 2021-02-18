"""Test queries"""

from model import db, User, Meetup, Restaurant, favorites, user_meetups
import crud

def show_all():
    """Show all users and their restaurant and meetup information."""
    # TODO: make these queries more efficient
    
    users = User.query.options(db.joinedload('favorites')).all()

    for user in users:
        print(user.fname, user.lname)

        for rest in user.favorites:
            print("- ", rest.name)
        
        for meetup in user.hosted_meetups:
            print("*** Host: ", meetup.restaurant)

        for meetup in user.meetups:
            print("     Meetup: ", meetup.restaurant)

        print("\n")

    
if __name__ == '__main__':
    from server import app
    from model import connect_to_db

    connect_to_db(app, echo=False)

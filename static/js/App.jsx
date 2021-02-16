"use strict";

function App(props) {
  return (
    <div>
      <Navbar />
      <br /><br />
      <Login />
      <br /><br />
      <Signup />
      <br /><br />
      <MyFavoriteRestaurants user_id="5"/>
      <br /><br />
      <MyHostedMeetups user_id="5" />
      <br /><br />
      <MyAttendingMeetups user_id="15" />
      <br /><br />
      <UserProfile user_id="1" />
      <br /><br />
      <MeetupDetail meetup_id="3" />
    </div>
  );
}

function Navbar(props) {
  return (
    <div className="container">
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="/">Home</a>
        <a className="navbar-brand" href="#">Restaurants</a>
        <a className="navbar-brand" href="#">Meetups</a>
        <a className="navbar-brand" href="#">Messages</a>
      </nav>
      <img id="header-img" src="/static/img/people-in-restaurant.jpg" 
        className="container col-md-6" 
        alt="Busy restaurant with diners." />
    </div>
  );
}


function Login(props) {
  function handleSubmit(evt) {
    // handle the Login form submission
    evt.preventDefault();
    ReactDOM.render(<h1>Logged In!</h1>, document.getElementById('root'));
  }

  return (
    <div className="container border rounded col-md-6 p-5" id="login-form">
      <h1>Log In</h1>
        <form onSubmit={handleSubmit}>

          <div className="form-group p-2">
            <input type="text" className="form-control" name="username" placeholder="Username" required />
          </div>

          <div className="form-group p-2">
            <input type="password" className="form-control" name="password" placeholder="Password" />
          </div>

          <button type="submit" className="btn btn-primary">Log In</button>
        </form>
    </div>
  );
}

function Signup(props) {
  function handleSubmit(evt) {
    //handle the Signup form submission
    evt.preventDefault();
    alert("You're signed up but actually not really!");
  }

  return (
    <div className="container border rounded col-md-6 p-5" id="signup-form">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group p-2">
            <input type="text" className="form-control" name="fname" placeholder="First Name" required />
          </div>

          <div className="form-group p-2">
            <input type="text" className="form-control" name="lname" placeholder="Last Name" required />
          </div>
        </div>

        <div className="form-group p-2">
          <input type="email" className="form-control" name="email" placeholder="Email" required />
        </div>

        <div className="form-group p-2">
        <input type="text" className="form-control" name="username" placeholder="Username" required />
        </div>

        <div className="form-group p-2">
        <input type="password" className="form-control" name="password" placeholder="Password" required />
        <small id="passwordHelpInline" className="text-muted">
          Must be 8-20 characters long.
        </small>
        </div>

        <div className="form-group p-2">
        <input type="password" className="form-control" name="confirm" placeholder="Confirm Password" required />
        </div>

        <div className="form-group p-2">
        <textarea className="form-control"  name="about" placeholder="About Me"></textarea>
        </div>

        <div className="form-group p-2">
          <label>Upload a Profile Picture </label>
          <input type="file" className="form-control-file" name="image_url" />
        </div>

        <button type="submit" className="btn btn-primary">Create Account</button>
      </form>
    </div>
  );
}

function MyFavoriteRestaurants(props) {
  const [restaurants, setRestaurants] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/users/${props.user_id}/restaurants.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setRestaurants(result);
        }
      )
  }, [])

  return (
    <div className="container">

      <h1>My Favorite Restaurants</h1>

      <div className="list-group">
        {restaurants.map(rest => (
        <a href={`/api/restaurants/${rest.id}.json`} className="list-group-item" key={rest.id}>
          <img className="img-thumbnail" src={rest.image_url} />
          {rest.name}
        </a>
        ))}
      </div>

    </div>
  );
}


function MyHostedMeetups(props) {
  const [hostedMeetups, setHostedMeetups] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/users/${props.user_id}/hosting.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setHostedMeetups(result);
        }
      )
  }, [])

  return (
    <div className="container">
      <h1>My Hosted Meetups</h1>
      <div className="list-group">
        {hostedMeetups.map(meetup => (
        <a className="list-group-item" key={meetup.id} href={`/api/meetups/${meetup.id}.json`}>
          {meetup.name}
          {meetup.date}
        </a>
        
      ))} 
      </div>
    </div>
  );
}

function MyAttendingMeetups(props) {
  const [meetups, setMeetups] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/users/${props.user_id}/meetups.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setMeetups(result);
        }
      )
  }, [])

  return (
    <div className="container">
      <h1>Meetups Attending</h1>
      <div className="list-group">
        {meetups.map(meetup => (
        <a className="list-group-item" key={meetup.id} href={`/api/meetups/${meetup.id}.json`}>
          {meetup.name}
          {meetup.date}
        </a>
        
      ))} 
      </div>
    </div>
  );
}



function UserProfile(props) {
  const [error, setError] = React.useState(null);
  const [user, setUser] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/users/${props.user_id}.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setUser(result);
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="container">
        <h1>User Details</h1>
        <img src={user.image_url} />
        <p>Username: {user.username}</p>
        <p>First Name: {user.fname}</p>
        <p>About {user.username}:</p>
        <p>{user.about}</p>        
        <MyFavoriteRestaurants user_id={user.id} />
        <MyHostedMeetups user_id={user.id} />
      </div>
    );
  }
}

function MeetupDetail(props) {
  const [error, setError] = React.useState(null);
  const [meetup, setMeetup] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/meetups/${props.meetup_id}.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setMeetup(result);
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="container">
        <h1>Meetup Details</h1>
        <p>Event Name: {meetup.name}</p>
        <p>Event Description: {meetup.description}</p>
      </div>
    );
  }

}

// function useLoginForm(callback) {
//   const [inputs, setInputs] = React.useState({});

//   function handleSubmit(evt) {
//     if (evt) {
//       evt.preventDefault();
//     }
// //     callback();
// //   }

//   function handleInputChange(evt) {
//     evt.persist();
//     setInputs(inputs => ({...inputs, [evt.target.name]:
//       evt.target.value}));
//   }

//   return {
//     handleSubmit,
//     handleInputChange,
//     inputs
//   };
// }

ReactDOM.render(
  (
    <App />
  ),
  document.getElementById('root')
);

function Playground(props) {
  const [name, setName] = React.useState('');
 
  React.useEffect(() => {
     document.title = `Hi, ${name}`;
   }, [name]);
  
   return (
     <div>
       <p>Use {name} input field below to rename this page!</p>
       <input 
         onChange={({target}) => setName(target.value)} 
         value={name} 
         type='text' />
     </div>
   );
}

function PlaygroundYelp(props) {
  const [restaurants, setRestaurants] = React.useState([]);
  let API_KEY = "secret";

  React.useEffect(() => {
    fetch("https://api.yelp.com/v3/businesses/search?location=Milpitas", {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          setRestaurants(result);
        }
      )
  }, []) 
  
  return (
    <div className="container border rounded">

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

// Following this: 
// https://linguinecode.com/post/how-to-get-form-data-on-submit-in-reactjs
const initialFormData = Object.freeze({
  username: "",
  password: ""
});

function LoginForm(props) {
  const [formData, setFormData] = React.useState(initialFormData);
  const [error, setError] = React.useState(null);

  const handleChange = (evt) => {
    setFormData({
      ...formData, [evt.target.name]: evt.target.value.trim()
    });
  };

  function handleSubmit(evt) {
    // handle the Login form submission
    evt.preventDefault();
    console.log("formData from <Login>", formData);
    
    // Submit to API
    fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(
      (data) => {
      console.log('Success:', data)
      if (data.status != 'error') {
        props.setUser(data.user);
      }
      alert(data.message);
    },
    (error) => {
      setError(error)
    });
  }

  return (
    <div className="container border rounded col-md-6 p-5" id="login-form">
      <h1>Log In</h1>
        <form onSubmit={handleSubmit}>

          <div className="form-group p-2">
            <input type="text" className="form-control" name="username" 
              placeholder="Username" required onChange={handleChange} />
          </div>

          <div className="form-group p-2">
            <input type="password" className="form-control" name="password" 
              placeholder="Password" required onChange={handleChange} />
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
      <div className="container border rounded">
        <h1>User Details</h1>
        <img src={user.image_url} />
        <p>Username: {user.username}</p>
        <p>First Name: {user.fname}</p>
        <p>About {user.username}:</p>
        <p>{user.about}</p>        
        <MyFavoriteRestaurants user_id={user.id} />
        <MyHostedMeetups user_id={user.id} />
        <MyAttendingMeetups user_id={user.id} />
      </div>
    );
  }
}

function RestaurantSearchBox(props) {
  const [restaurants, setRestaurants] = React.useState([]);
  const [error, setError] = React.useState(null);

  function handleSubmit(evt) {
    fetch('ur')
      .then(res => res.json())
      .then(
        (result) => {
          setRestaurants(result);
        },
        (error) => {
          setError(error);
        }
      )
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

// Trying something out from online below:
function useLoginForm(callback) {
  const [inputs, setInputs] = React.useState({});

  function handleSubmit(evt) {
    if (evt) {
      evt.preventDefault();
    }
//     callback();
  }

  function handleInputChange(evt) {
    evt.persist();
    setInputs(inputs => ({...inputs, [evt.target.name]:
      evt.target.value}));
  }

  return {
    handleSubmit,
    handleInputChange,
    inputs
  };
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
    <div className="container border rounded">

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

function MeetupDetail(props) {
  // TODO: fetch host and restaurant too
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
      <div className="container border rounded">
        <h1>Meetup Details</h1>
        <p>Event Name: {meetup.name}</p>
        <p>Event Description: {meetup.description}</p>
        <MeetupAttendees meetup_id={meetup.id} />
      </div>
    );
  }
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
    <div className="container border rounded">
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
    <div className="container border rounded">
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


function MeetupAttendees(props) {
  const [attendees, setAttendees] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/meetups/${props.meetup_id}/attendees.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setAttendees(result);
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
    <div className="container border rounded">

      <h1>Attendees</h1>

      <div className="list-group">
        {attendees.map(user => (
        <a href={`/api/users/${user.id}.json`} className="list-group-item" key={user.id}>
          <img className="img-thumbnail" src={user.image_url} />
          {user.username}
        </a>
        ))}
      </div>

    </div>
    );
  }
}
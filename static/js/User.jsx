const {Media, Row, Col} = ReactBootstrap;

// Following this: 
// https://linguinecode.com/post/how-to-get-form-data-on-submit-in-reactjs
const initialLoginFormData = Object.freeze({
  username: "",
  password: ""
});

function LoginForm(props) {
  const [formData, setFormData] = React.useState(initialLoginFormData);
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

const initialSignupFormData = Object.freeze({
  fname: "",
  lname: "",
  email: "",
  username: "",
  password: "",
  confirm: "",
  about: "",
  image_url: ""
});

function SignupForm(props) {
  const [formData, setFormData] = React.useState(initialSignupFormData);
  const [error, setError] = React.useState(null);

  const handleChange = (evt) => {
    setFormData({
      ...formData, [evt.target.name]: evt.target.value.trim()
    });
  };

  function handleSubmit(evt) {
    //handle the Signup form submission
    evt.preventDefault();
    console.log("formData from <Signup>:", formData);

    // validate passwords match
    if (formData.password != formData.confirm) {
      alert("Passwords don't match.");
    } else if (formData.password.length < 8 || formData.password.length > 20) {
      alert("Password must be 8-20 characters long.");
    } else {
      // Submit to API
      fetch ('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(
        (data) => {
          if (data.status != 'error') {
            props.setUser(data.user);
          }
          alert(data.message);
        },
        (error) => {
          setError(error)
        });
      }
  }

  return (
    <div className="container border rounded col-md-6 p-5" id="signup-form">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <input type="text" className="form-control" name="fname" placeholder="First Name" required onChange={handleChange} />
          </Col>

          <Col>
            <input type="text" className="form-control" name="lname" placeholder="Last Name" required onChange={handleChange} />
          </Col>
        </Row>

        <div className="form-group p-2">
          <input type="email" className="form-control" name="email" placeholder="Email" required onChange={handleChange} />
        </div>

        <div className="form-group p-2">
        <input type="text" className="form-control" name="username" placeholder="Username" required onChange={handleChange} />
        </div>

        <div className="form-group p-2">
        <input type="password" className="form-control" name="password" placeholder="Password" required onChange={handleChange} />
        <small id="passwordHelpInline" className="text-muted">
          Must be 8-20 characters long.
        </small>
        </div>

        <div className="form-group p-2">
        <input type="password" className="form-control" name="confirm" placeholder="Confirm Password" required onChange={handleChange} />
        </div>

        <div className="form-group p-2">
        <textarea className="form-control"  name="about" placeholder="About Me" onChange={handleChange}></textarea>
        </div>

        <div className="form-group p-2">
          <label>Upload a Profile Picture </label>
          <input type="file" className="form-control-file" name="image_url" onChange={handleChange}/>
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
const initialSearchTerms = Object.freeze({
  term: "",
  location: ""
});

function RestaurantSearch(props) {
  const [searchTerms, setSearchTerms] = React.useState(initialSearchTerms);
  const [restaurants, setRestaurants] = React.useState([]);
  const [error, setError] = React.useState(null);
  // search results are being fetched
  const [isLoading, setIsLoading] = React.useState(false);
  // search results returned and loaded restaurants state
  const [loadResults, setLoadResults] = React.useState(false);

  const handleChange = (evt) => {
    setSearchTerms({
      ...searchTerms, [evt.target.name]: evt.target.value.trim()
    });
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsLoading(true);

    let url = `/api/restaurants/search.json?term=${searchTerms.term}&location=${searchTerms.location}`;
    console.log("URL: ", url);
    fetch(url)
      .then(res => res.json()) //don't reach here
      .then(
        (result) => {
          setRestaurants(result);
          console.log("Returned from call");
          setLoadResults(true);
        },
        (error) => {
          setError(error);
        });
  }
  if (!isLoading) {
    return (
      <div>
        <h1>Search for New Restaurants to Love</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="term" placeholder="sushi, salad, korean..."
            required onChange={handleChange}/>
          <input type="text" name="location" placeholder="San Francisco" 
            required onChange={handleChange}/>
          <button type="submit">Search</button>
        </form>
      </div>
    );
  } else if (!loadResults) {
    return (
      <div>
        <h1>Search for New Restaurants to Love</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="term" placeholder="sushi, salad, korean..."
            required onChange={handleChange}/>
          <input type="text" name="location" placeholder="San Francisco" 
            required onChange={handleChange}/>
          <button type="submit">Search</button>
        </form>

        <h1>Search Results</h1>
        <p>Loading...</p>
          
    </div>
    ); 
  } else {
    return (
      <div>
        <h1>Search for New Restaurants to Love</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="term" placeholder="sushi, salad, korean..."
            required onChange={handleChange}/>
          <input type="text" name="location" placeholder="San Francisco" 
            required onChange={handleChange}/>
          <button type="submit">Search</button>
        </form>

        <h1>Search Results</h1>
        <div className="list-group">
          {restaurants.businesses.map(rest => (
          <Media className="list-group-item" key={rest.id}>
            <img className="img-thumbnail" src={rest.image_url} />
            <Media.Body>
              <h5>{rest.name}</h5>
              <hr />
              <p>{rest.location.display_address}</p>
              <p>{rest.categories[0].title}</p>
            </Media.Body>

          </Media>
          ))}
        </div>
    </div>
    )
  }
}


function MyFavoriteRestaurants(props) {
  const [restaurants, setRestaurants] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/users/${props.user_id}/restaurants.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setRestaurants(result);
          console.log("<MyFaveRestaurants> component state: ", restaurants);
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
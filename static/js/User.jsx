const {Media, Row, Col} = ReactBootstrap;
const {useParams} = ReactRouterDOM;

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

  const handleSubmit = (evt) => {
    // handle the Login form submission
    evt.preventDefault();
    // console.log("formData from <Login>", formData);
    
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
      // console.log('Success:', data)
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

  const handleSubmit = (evt) => {
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

  let {userID} = useParams();

  React.useEffect(() => {
    fetch(`/api/users/${userID}.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setUser(result);
        },
        (error) => {
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (user.length === 0) {
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
        <MyFavoriteRestaurants user={user} />
        <MyHostedMeetups user={user} />
        <MyAttendingMeetups user={user} />
      </div>
    );
  }
}

function MyProfile(props) {
  return (
    <Container>
      {/* const [showEditForm] */}
      <Button onClick={handleShowEditForm}>Edit Profile</Button>

      <h1>My Profile</h1>
      <img src={props.user.image_url} />
      <p>Username: {props.user.username}</p>
      <p>First Name: {props.user.fname}</p>
      <p>About Me:</p>
      <p>{props.user.about}</p> 
    </Container>
  );
}

function MeetupDetails(props) {
  let {meetupID} = useParams();
  // TODO: fetch host and restaurant too
  const [error, setError] = React.useState(null);
  const [meetup, setMeetup] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/meetups/${meetupID}.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setMeetup(result);
        },
        (error) => {
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (meetup.length === 0) {
    return <div>Loading...</div>;
  } else {
    return (
      <Container>
        <h1>Meetup Details</h1>
        <p>Event Name: {meetup.name}</p>
        <p>Event Description: {meetup.description}</p>
        <MeetupAttendees meetup_id={meetup.id} />
      </Container>
    );
  }
}

function MyHostedMeetups(props) {
  const [hostedMeetups, setHostedMeetups] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/users/${props.user.id}/hosting.json`)
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
    fetch(`/api/users/${props.user.id}/meetups.json`)
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

  // get the users attending the Meetup
  React.useEffect(() => {
    fetch(`/api/meetups/${props.meetup_id}/attendees.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setAttendees(result);
        },
        (error) => {
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (attendees.length === 0) {
    return <div>Loading Meetup Attendees...</div>;
  } else {
    return (
    <div className="container border rounded">

      <h1>Attendees</h1>
      <div className="list-group">
        {attendees.map(user => (
          <UserTile user={user} key={user.id} />
        ))}
      </div>

    </div>
    );
  }
}

function UserTile(props) {
  return (
    <Container>
      <Media className="list-group-item" >
          <img className="img-thumbnail" src={props.user.image_url} />
          <Media.Body>
            <Link to={`/user/${props.user.id}`}>
              <h5>{props.user.username}</h5>
            </Link>
            <hr />
            <p>{props.user.fname} {props.user.lname}</p>
          </Media.Body>
        </Media>
    </Container>
  )

}
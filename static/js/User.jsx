const {Media, Row, Col, Modal, Alert} = ReactBootstrap;
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
          setError(error);
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
  if (userID == props.user.id) {
    return <MyProfile user={props.user} setUser={props.seUser} />;
  }

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
      <Container>
        <Row>
          <Col>
            <h1>User Details</h1>
            <img src={user.image_url} />
          </Col>
          <Col>
            <p>Username: {user.username}</p>
            <p>First Name: {user.fname}</p>
            <p>About {user.username}:</p>
            <p>{user.about}</p>  
            <MyFavoriteRestaurants user={user} />    
          </Col>
        </Row>
        <Row>
          <Col><MyHostedMeetups user={user} /></Col>
          <Col><MyAttendingMeetups user={user} /></Col>
        </Row>
      </Container>
    );
  }
}

const initialFormData = Object.freeze({
  fname: "",
  lname: "",
  email: "",
  old_password: "",
  new_password: "",
  confirm: "",
  about: "",
  image_url: ""
});

function MyProfile(props) {
  const [show, setShow] = React.useState(false);
  const [formData, setFormData] = React.useState(initialFormData);
  const [error, setError] = React.useState(null);
  console.log(formData);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (evt) => {
    setFormData({
      ...formData, [evt.target.name]: evt.target.value.trim()
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    // validate passwords match
   
    if (formData.old_password && formData.new_password != formData.confirm) {
      alert("Passwords don't match.");
    } else if (!formData.old_password && (formData.new_password || formData.confirm)) {
      alert("Please enter your old password to change password.")
    } else if (formData.old_password && (formData.new_password.length < 8 || formData.new_password.length > 20)) {
      alert("Password must be 8-20 characters long.");
    } else if (formData == initialFormData) {
      alert("Nothing to update.");
    } else {
      // Submit to API
      fetch (`/api/users/${props.user.id}`, {
        method: 'PATCH',
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
            alert(data.message);
            setShow(false);
          } else {
            alert(data.message);
          }
          
          
        },
        (error) => {
          setError(error)
      });
  
    }
    
    
      

  }

  return (
    <Container>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Fill in the fields that you would like to update.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group p-2">
              <label>First Name</label>
              <input type="text" className="form-control" name="fname" placeholder={props.user.fname} onChange={handleChange} />
            </div>

            <div className="form-group p-2">
              <label>Last Name</label>
              <input type="text" className="form-control" name="lname" placeholder={props.user.lname} onChange={handleChange} />
            </div>

            <div className="form-group p-2">
              <label>Email</label>
              <input type="email" className="form-control" name="email" placeholder={props.user.email} onChange={handleChange} />
            </div>

            <div className="form-group p-2">
              <label>Old Password</label>    
              <input type="password" className="form-control" name="old_password" placeholder="Old Password" onChange={handleChange} />
            </div>

            <div className="form-group p-2"> 
              <label>New Password</label>
              <input type="password" className="form-control" name="new_password" placeholder="New Password" onChange={handleChange} />
              <small id="passwordHelpInline" className="text-muted">
                Must be 8-20 characters long.
              </small>
            </div>

            <div className="form-group p-2">
              <label>Confirm New Password</label>
              <input type="password" className="form-control" name="confirm" placeholder="Confirm Password" onChange={handleChange} />
            </div>  
              
            <div className="form-group p-2">
              <label>About Me</label>
              <textarea className="form-control"  name="about" placeholder={props.user.about} onChange={handleChange} ></textarea>
            </div>

            <div className="form-group p-2">
              <label>Upload a Profile Picture</label>
              <input type="file" className="form-control-file" name="image_url" onChange={handleChange} />
            </div>

            <Button variant="primary" type="submit">Save Changes</Button>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col>
          <h1>My Profile</h1>
          <img src={props.user.image_url} />
        </Col>
        <Col>
          <Button onClick={handleShow}>Edit Profile</Button>
          <p>Username: {props.user.username}</p>
          <p>Name: {props.user.fname} {props.user.lname}</p>
          <p>About Me:</p>
          <p>{props.user.about}</p> 
        </Col>
      </Row>
      
      
    </Container>
  );
}

function JoinMeetupButton(props) {
  const createUserMeetupRelationship = () => {
    props.setAttending(true);
    // POST to server
    fetch(`/api/users/${props.user.id}/meetups/${props.meetup.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(
        (data) => {
          console.log(data);
      }
    );
  }

  const deleteUserMeetupRelationship = () => {
    props.setAttending(false);
    // POST to server
    fetch(`/api/users/${props.user.id}/meetups/${props.meetup.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(
        (data) => {
          console.log(data);
      }
    );
  }

  return (
    <React.Fragment>
      
      {props.attending &&
        <Button onClick={deleteUserMeetupRelationship}>Leave Meetup</Button> }
      {!props.attending && (props.meetup.attendees_count < props.meetup.capacity) &&  
        <Button onClick={createUserMeetupRelationship}>Join Meetup</Button>}
    </React.Fragment>
  );
}
function MeetupDetails(props) {
  const [error, setError] = React.useState(null);
  const [meetup, setMeetup] = React.useState([]);
  const [attending, setAttending] = React.useState(false);
  const [hosting, setHosting] = React.useState(false);
  console.log("You're attending:", attending);
  console.log("You're hosting:", hosting);


  let {meetupID} = useParams();

  React.useEffect(() => {
    
    fetch(`/api/meetups/${meetupID}.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setMeetup(result);
          setHosting(result.host.id === props.user.id);
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
        {(meetup.attendees_count === meetup.capacity) && 
          <Alert variant='warning'>This event is full.</Alert>}
        {!hosting && 
          <JoinMeetupButton setAttending={setAttending} attending={attending}
          setMeetup={setMeetup}
          meetup={meetup} user={props.user} />}
        <h1>Meetup Details</h1>
        <img src={meetup.restaurant.image_url} width={400}/>
        <p>Event Name: {meetup.name}</p>
        <p>Event Date: {meetup.date}</p>
        <p>Event Capacity: {meetup.capacity}</p>
        <p>Event Description: {meetup.description}</p>

        <p>Hosted by:</p>
        {meetup.host.id === props.user.id ? "You!" : 
          <UserTile user={meetup.host} />}
        
        <MeetupAttendees meetup_id={meetupID} attending={attending}
          setAttending={setAttending} user={props.user}/>
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
    <Container>
      <h1>My Hosted Meetups</h1>
      <div className="list-group">
        {hostedMeetups.map(meetup => (
          <MeetupTile meetup={meetup} user={props.user} key={meetup.id} />
        
      ))} 
      </div>
    </Container>
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
    <Container>
      <h1>Meetups Attending</h1>
      <div className="list-group">
        {meetups.map(meetup => (
          <MeetupTile user={props.user} meetup={meetup} key={meetup.id} />
        
      ))} 
      </div>
    </Container>
  );
}


function MeetupAttendees(props) {
  const [attendees, setAttendees] = React.useState([]);
  const [error, setError] = React.useState(null);
  //console.log("MeetupAttendees attendees: ", attendees);
  // get the users attending the Meetup
  React.useEffect(() => {
    fetch(`/api/meetups/${props.meetup_id}/attendees.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setAttendees(result);
          props.setAttending(result.some(el => el.id === props.user.id));
        },
        (error) => {
          setError(error);
        }
      )
  }, [props.attending])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (attendees.length === 0) {
    return <div>No Attendees Yet</div>;
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
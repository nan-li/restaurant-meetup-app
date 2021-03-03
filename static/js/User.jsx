const {Media, Row, Col, Modal, Alert, Toast} = ReactBootstrap;
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

const initialMessageData = Object.freeze({
  body: ""
});

function UserProfile(props) {
  console.log("IN USER PROFILE")
  const [error, setError] = React.useState(null);
  const [user, setUser] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [reload, setReload] = React.useState(false);
  let {userID} = useParams();
  
  const [show, setShow] = React.useState(false);
  const [formData, setFormData] = React.useState(initialMessageData);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (evt) => {
    setFormData({
      ...formData, [evt.target.name]: evt.target.value.trim()
    });
  };

  // fetch all Messages exchanged with this user
  React.useEffect(() => {
    fetch(`/api/users/${props.user.id}/messages/${userID}`)
      .then(res => res.json())
      .then((result) => {
        if (result.status != 'error') {
          setMessages(result);
        }
      })
  }, [reload])

  const handleSubmit = (evt) => {
    evt.preventDefault();
    fetch(`/api/users/${userID}/message/${props.user.id}`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      setReload(!reload);
      document.querySelector('[name="body"]').value = '';
      
    })
  }
  
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
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Compose Your Message</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {messages && messages.map(message => (
              <Container key={message.id}>
                <p>From: {message.sender.fname} To: {message.recipient.fname} </p>
                <p>Sent on: {message.timestamp}</p>
                <p>{message.body}</p>
                <hr />
              </Container>
              
            ))}
            <form onSubmit={handleSubmit}>

              <div className="form-group p-2">
                <label>Message</label>
                <textarea className="form-control"  name="body" 
                  placeholder={`Hi ${user.username}`} onChange={handleChange} required>
                </textarea>
              </div>

              <Button variant="primary" type="submit">Send Message</Button>
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
            <h1>User Details</h1>
            <img src={user.image_url} />
          </Col>
          <Col>
            <Button onClick={handleShow}>Send a Message to {user.username}</Button>
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



function UserTile(props) {
  // if (props.user.id === props.currentUser.id) {
  //   return null;
  // }
  return (
    <Container>
      <Media className="list-group-item" >
          <img className="img-thumbnail" src={props.user.image_url} />
          <Media.Body>
            <Link to={`/user/${props.user.id}`}>
              <h5>{props.user.username}</h5>
            </Link>
            {props.currentUser && props.user.id === props.currentUser.id && <p>That's YOU!</p>}
            <hr />
            <p>{props.user.fname} {props.user.lname}</p>
            <hr />
            {props.setSelectedUser && 
              <Button onClick={() => {
                props.setSelectedUser(props.user);
                window.scrollTo({top: 0, behavior: 'auto'});
                }}>Messages</Button>}
          </Media.Body>
        </Media>
    </Container>
  )
}


function Messages (props) {
  const [messages, setMessages] = React.useState(null);
  // user id's of all other users being messaged
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [reload, setReload] = React.useState(false);

  console.log("users are", users);

  React.useEffect(() => {
    console.log("in use effect");
    fetch(`/api/user/${props.user.id}/messages`)
    .then(res => res.json())
    .then((result) => {
      if (result.status != 'error') {
        console.log("Users and Messages", result);
        setMessages(result.messages);
        setUsers(Object.values(result.users));
      }
    })
    console.log("")
  }, [reload])

  console.log("messages is", messages);
    return (
    <Container>
      <h1>Messages</h1>
      <Row>
        <Col>
          {users.map(user => (
            <UserTile user={user} key={user.id} setSelectedUser={setSelectedUser} />              
          ))}
        </Col>
        <Col>

          {selectedUser &&  
            <MessageContainer user={selectedUser}
                currentUser={props.user}
                messages={messages[selectedUser.id]}
                reload={reload} setReload={setReload} /> }
          {!selectedUser && messages &&
            <p>Select a user on the left to read messages.</p> }
          {!selectedUser && !messages &&
            <p>You have no messages.</p>}
        </Col>
      </Row>
    </Container>
  );
}

function MessageContainer(props) {
  const [formData, setFormData] = React.useState(initialMessageData);
  const [reload, setReload] = React.useState(false);

  const handleChange = (evt) => {
    setFormData({
      ...formData, [evt.target.name]: evt.target.value.trim()
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    fetch(`/api/users/${props.user.id}/message/${props.currentUser.id}`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      props.setReload(!props.reload);
      document.querySelector('[name="body"]').value = '';
      
    })
  }

  return (
    <Container>
      {props.messages.map(message => (
        <Container key={message.id}>
          <p>From: {message.sender.fname} To: {message.recipient.fname} </p>
          <p>Sent on: {message.timestamp}</p>
          <p>{message.body}</p>
          <hr />
        </Container>
      ))}
      <form onSubmit={handleSubmit}>

        <div className="form-group p-2">
          <label>Message</label>
          <textarea className="form-control"  name="body" 
            placeholder={`Hi ${props.user.username}`} onChange={handleChange} required>
          </textarea>
        </div>

        <Button variant="primary" type="submit">Send Message</Button>
      </form>
    </Container>
  )
}

function Notifications (props) {
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/user/${props.user.id}/notifications`)
    .then(res => res.json())
    .then((result) => {
      if (result.status != 'error') {
        setNotifications(result);
      }
    })
  }, [])
  console.log(notifications);
  if (notifications.length === 0) return <p>There are no notifications</p>
  return (
    <Container>
      {notifications.map(notification => (
        <NotificationTile key={notification.id} 
          notification={notification} />
      ))}
    </Container>
  )
}

function NotificationTile (props) {
  const [show, setShow] = React.useState(true);
  console.log(show);
  // change background color based on status
  const markNotificationAsRead = () => {
    console.log('hi');
  }

  const deleteNotification = () => {
    setShow(false);
  }

  return (
    <Toast show={show} onClose={deleteNotification}>
      <Toast.Header>
        <img src='/static/img/favicon.ico' className="rounded mr-2" alt="" />
        <strong className="mr-auto">{props.notification.data.message}</strong>
      </Toast.Header>
      <Toast.Body>
        <p>This notification is {props.notification.status}</p>
        <Link to={props.notification.data.url} onClick={markNotificationAsRead}>
          {props.notification.data.link}
        </Link>
      </Toast.Body>
    </Toast>
  )
}


function Homepage(props) {
  const [hostedMeetups, setHostedMeetups] = React.useState([]);
  const [meetups, setMeetups] = React.useState([]);
  
  React.useEffect(() => {
    fetch(`/api/users/${props.user.id}/hosting`)
      .then(res => res.json())
      .then(
        (result) => {
          setHostedMeetups(result);
        }
      )
  }, [])

  React.useEffect(() => {
    fetch(`/api/users/${props.user.id}/meetups`)
      .then(res => res.json())
      .then(
        (result) => {
          setMeetups(result);
        }
      )
  }, [])
  if (hostedMeetups.length === 0 || meetups.length === 0) return <p>Loading...</p>;

  return (
    <Container>
      <Row>
        <Col>
          <h3>Your Next Hosted Meetup</h3>
          {hostedMeetups.future.length != 0 ? 
            <MeetupTile meetup={hostedMeetups.future[0]} dontDisplayHost={props.dontDisplayHost} 
              user={props.user} key={hostedMeetups.future[0].id} /> : 
              <Alert variant='warning'>
                <p>No upcoming meetups.</p>
                <p>Perhaps you'd like to host a new meetup?</p>
              </Alert>}        
        </Col>
        <Col>
          <h3>Next Attending Meetup</h3>
          {meetups.future.length != 0 ? 
            <MeetupTile meetup={meetups.future[0]} user={props.user} key={meetups.future[0].id} /> : 
              <Alert variant='warning'>
                <p>No upcoming meetups.</p>
                <p>Feel free to look around and find one to join.</p>
              </Alert>}                
        </Col>
      </Row>
    </Container>
  );  
}

const initialLoginFormData = Object.freeze({
  username: "",
  password: ""
});

function LoginForm(props) {
  const [formData, setFormData] = React.useState(initialLoginFormData);
  const [error, setError] = React.useState(null);
  let history = useHistory();

  const handleChange = (evt) => {
    setFormData({
      ...formData, [evt.target.name]: evt.target.value.trim()
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    
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
      if (data.status != 'error') {
        props.setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        history.push('/');
      } else alert(data.message);
    },
    (error) => {
      setError(error)
    });
  }

  return (
    <div className="container border rounded mt-5 col-md-6 p-5" id="login-form">
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
  about: ""
});

function SignupForm(props) {
  const [formData, setFormData] = React.useState(initialSignupFormData);
  const [error, setError] = React.useState(null);
  let history = useHistory();

  const handleChange = (evt) => {
    setFormData({
      ...formData, [evt.target.id]: evt.target.value.trim()
    });
  };

  //handle the Signup form submission
  const handleSubmit = (evt) => {
    
    evt.preventDefault();
    console.log("formData from <Signup>:", formData);
    
    // make a FormData()
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('image', document.querySelector('input[type="file"]').files[0]);

    // validate passwords match
    if (formData.password != formData.confirm) {
      alert("Passwords don't match.");
    } else if (formData.password.length < 8 || formData.password.length > 20) {
      alert("Password must be 8-20 characters long.");
    } else {
      // Submit to backend
      fetch ('/api/users/signup', {
        method: 'POST',
        body: data
      })
      .then(res => res.json())
      .then(
        (data) => {
          if (data.status != 'error') {
            props.setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            props.setAlert(data.message);
            history.push('/');
          } else {
            alert(data.message);
          }
        },
        (error) => {
          setError(error);
        });
      }
  }

  return (
    <div className="mt-5 mb-5 container border rounded col-md-9 p-5" id="signup-form">
      <h1>Sign Up</h1>

      <Form onSubmit={handleSubmit}>
        <div className="form-row">
          <Form.Group className='form-group' as={Col} controlId="fname">
            <Form.Label>First Name</Form.Label>
            <Form.Control placeholder="First Name" required onChange={handleChange}/>
          </Form.Group>

          <Form.Group className='form-group' as={Col} controlId="lname">
            <Form.Label>Last Name</Form.Label>
            <Form.Control placeholder="Last Name " required onChange={handleChange}/>
          </Form.Group>
        </div>

        <Form.Group className='form-group' controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Email" required onChange={handleChange}/>
        </Form.Group>

        <Form.Group className='form-group' controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control placeholder="Username" required onChange={handleChange}/>
        </Form.Group>

        <div className="form-row">
          <Form.Group className='form-group' as={Col} controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" required onChange={handleChange} />
            <small id="passwordHelpInline" className="text-muted">
              Must be 8-20 characters long.
            </small>
          </Form.Group>

          <Form.Group className='form-group' as={Col} controlId="confirm">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm Password" required onChange={handleChange} />
          </Form.Group>
        </div>

        <Form.Group className='form-group' controlId="about">
          <Form.Label>About Me</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="About Me" onChange={handleChange}/>
        </Form.Group>

        <div className="form-group">
          <label htmlFor="exampleFormControlFile1">Upload a Profile Picture</label>
          <input type="file" className="form-control-file" id="image" />
        </div>

        <button type="submit" className="btn btn-primary">Create Account</button>
      </Form>

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

  React.useEffect(() => {
    fetch(`/api/users/${userID}`)
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
      <Container fluid>
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
  
        <Row className='mb-5'>
          <Col sm={4}>      
            <img alt='A profile photo of this user.' width={400}
              src={'http://res.cloudinary.com/dfzb7jmnb/image/upload/' + user.image_url} />
          </Col>
          <Col sm={1}>            
            <Button variant='link' onClick={handleShow}>
              <Img width={50} alt='A message icon.' src='/static/img/message-icon.png'/>
            </Button>
          </Col>
          <Col sm={7}>
            <p><strong>Username: </strong>{user.username}</p>
            <p><strong>First Name: </strong>{user.fname}</p>
            <p><strong>About {user.username}:</strong></p>
            <p>{user.about}</p>    
          </Col>
        </Row>
        
        <hr />
        <Row className='mt-5'>
          <Col><MyFavoriteRestaurants user={user} /></Col>
          <Col>
            <MyHostedMeetups user={user} dontDisplayHost={true} />
            <br />
            <br />
            <MyAttendingMeetups user={user} />
          </Col>
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
  about: ""
});

function MyProfile(props) {
  const [show, setShow] = React.useState(false);
  const [formData, setFormData] = React.useState(initialFormData);
  const [error, setError] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  console.log(formData);
  
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setFormData(initialFormData);
    setShow(true);
  }
  

  const handleChange = (evt) => {
    setFormData({
      ...formData, [evt.target.name]: evt.target.value.trim()
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    // make a FormData()
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('image', document.querySelector('input[type="file"]').files[0]);

    // validate passwords match
    if (formData.old_password && formData.new_password != formData.confirm) {
      setAlert("New passwords don't match.");
    } else if (!formData.old_password && (formData.new_password || formData.confirm)) {
      setAlert("Please enter your old password to update password.");
    } else if (formData.old_password && (formData.new_password.length < 8 || formData.new_password.length > 20)) {
      setAlert("New password must be 8-20 characters long.");
    } else if (formData == initialFormData) {
      setAlert("Nothing to update.");
    } else {

      
      // Submit to API
      fetch (`/api/users/${props.user.id}`, {
        method: 'PATCH',
        body: data,
      })
      .then(res => res.json())
      .then(
        (data) => {
          if (data.status != 'error') {
            props.setUser(data.user);
            setShow(false);
            props.setAlert(data.message);
          } else {
            setAlert(data.message);
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

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>First Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="fname" 
                  placeholder={props.user.fname} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group col-md-6">
                <label>Last Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="lname" 
                  placeholder={props.user.lname} 
                  onChange={handleChange} 
                />
              </div>              
            </div>


            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                className="form-control" 
                name="email" 
                placeholder={props.user.email} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Old Password</label>    
              <input 
                type="password" 
                className="form-control" 
                name="old_password" 
                placeholder="Old Password" 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group col-md-6"> 
                <label>New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  name="new_password" 
                  placeholder="New Password" 
                  onChange={handleChange} 
                />
                <small id="passwordHelpInline" className="text-muted">
                  Must be 8-20 characters long.
                </small>
              </div>

              <div className="form-group col-md-6">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  name="confirm" 
                  placeholder="Confirm Password" 
                  onChange={handleChange} 
                />
              </div>  
            </div>
              
            <div className="form-group">
              <label>About Me</label>
              <textarea 
                className="form-control"  
                name="about" 
                placeholder={props.user.about} 
                onChange={handleChange}>
              </textarea>
            </div>

            <div className="form-group">
              <label>Upload a Profile Picture</label>
              <input type="file" className="form-control-file" name="image" onChange={handleChange} />
            </div>

            {alert &&
              <Alert variant='danger'>
                <p>{alert}</p>
                <div className="d-flex justify-content-end">
                  <Button onClick={() => setAlert(null)} variant="outline-danger">
                    Close
                  </Button>
                </div>
              </Alert>}
            <Button variant="primary" type="submit">Save Changes</Button>
          </form>
        </Modal.Body>
        <Modal.Footer>   
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Row className='mb-3'>
        <Col>
          <h2>My Profile <span><Button onClick={handleShow}>Edit Profile</Button></span></h2>
        </Col>
      </Row>
      <Row>
        <Col>      
          <img src={'http://res.cloudinary.com/dfzb7jmnb/image/upload' + props.user.image_url}
            alt='Your profile picture.' width={400} />
        </Col>
        <Col>
          <p><strong>Username: </strong>{props.user.username}</p>
          <p><strong>Name: </strong>{props.user.fname} {props.user.lname}</p>
          <p><strong>About Me:</strong></p>
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
    <Card className='bg-light' style={{ width: '16rem' }}>
      <Link to={`/user/${props.user.id}`}>
        <Card.Img 
          variant="top" 
          alt='Profile photo.' 
          src={'http://res.cloudinary.com/dfzb7jmnb/image/upload/h_400,w_600,b_auto,c_pad' + props.user.image_url} 
        />
      </Link>
      <Card.Body>
        <Card.Title>
          {props.user.username}
          {props.setSelectedUser && 
            <Button variant='link' 
              onClick={() => {
                props.setSelectedUser(props.user);
                window.scrollTo({top: 0, behavior: 'auto'});
            }}>
              <Img alt='A message icon.' width={50} src='/static/img/message-icon.png'/>
            </Button>
          }
          {props.currentUser && props.user.id === props.currentUser.id && 
          <span>  <em>(That's you!)</em></span>}
          {props.host && <div className='btn btn-default disabled'>HOST</div>}
        </Card.Title>

        
      </Card.Body>
    </Card>
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
      <h2>Messages</h2>
      <Row>
        <Col>
          {users.map(user => (
            <UserTile 
              user={user} 
              key={user.id} 
              setSelectedUser={setSelectedUser} 
            />              
          ))}
        </Col>
        <Col>

          {selectedUser &&  
            <MessageContainer 
              user={selectedUser}
              currentUser={props.user}
              messages={messages[selectedUser.id]}
              reload={reload} setReload={setReload} 
            /> 
          }
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
          <p><strong>From: </strong>{message.sender.fname}</p>
          <p><strong>To: </strong>{message.recipient.fname}</p>
          <p><strong>Sent on: </strong>{message.timestamp}</p>
          <p>{message.body}</p>
          <hr />
        </Container>
      ))}
      <form onSubmit={handleSubmit}>

        <div className="form-group p-2">
          <label>Write a Message</label>
          <textarea className="form-control"  name="body" 
            placeholder={`Hi ${props.user.username}`} onChange={handleChange} required>
          </textarea>
        </div>
        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit">Send Message</Button>
        </div>
      </form>
    </Container>
  )
}

function Notifications (props) {
  const [notifications, setNotifications] = React.useState([]);
  const [reload, setReload] = React.useState(false);

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
  if (notifications.length === 0) return <p>You have no notifications</p>
  return (
    <Container>
      {notifications.reverse().map(notification => (
        <NotificationTile key={notification.id} 
          notification={notification} />
      ))}
    </Container>
  )
}

function NotificationTile (props) {
  const [show, setShow] = React.useState(true);
  const [reload, setReload] = React.useState(false);
  console.log(show);

  const deleteNotification = () => {
    setShow(false);
    fetch(`/api/notification/${props.notification.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const markNotificationAsRead = () => {
    fetch(`/api/notification/${props.notification.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      props.notification.status = 'READ';
      setReload(!reload);
    })
  }

  return (
    <Toast show={show} onClose={deleteNotification} 
      className={props.notification.status === 'UNREAD' ? 'unread-toast' : 'bg-light'}>
      <Toast.Header>
        <img src='/static/img/favicon.ico' width={20} className="rounded mr-2" alt="" />
        <strong className="mr-auto">{props.notification.timestamp}</strong>
      </Toast.Header>
      <Toast.Body onClick={markNotificationAsRead}>
        <p>{props.notification.data.message}</p>
        <Link 
          to={props.notification.data.url} 
          onClick={markNotificationAsRead}>
          {props.notification.data.link}
        </Link>
      </Toast.Body>
    </Toast>
  )
}


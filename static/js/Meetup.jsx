
function MeetupTile(props) {

  return (
    <Card style={{ width: '24rem' }}>
      <Link to={`/meetup/${props.meetup.id}`}>
        <Card.Img variant="top" src={'http://res.cloudinary.com/dfzb7jmnb/image/upload' + props.meetup.image_url} />
      </Link>
      <Card.Body>
        <Card.Title>{props.meetup.name}</Card.Title>
        <Card.Text>
          Date: {props.meetup.date}
        </Card.Text>  
        {!props.dontDisplayHost &&
          <Card.Text>Hosted by: {props.meetup.host.id === props.user.id ? 
            "You!" : props.meetup.host.username}</Card.Text>
          }
        {props.past &&
          <hr /> && 
          <Alert className='alert-past' variant='warning'>Past Event</Alert> }
        {(props.meetup.status === 'CANCELLED') &&
          <hr /> && 
          <Alert className='alert-cancelled' variant='danger'>This event is cancelled.</Alert> }
      </Card.Body>
    </Card>
  )
}

function JoinUnjoinMeetupButton(props) {
  const createUserMeetupRelationship = () => {
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
          props.setAttending(true);
          console.log(data);
          props.setAlert(data.message);
      }
    );
  }

  const deleteUserMeetupRelationship = () => {
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
          props.setAttending(false);
          console.log(data);
          props.setAlert(data.message);
      }
    );
  }

  return (
    <React.Fragment>
      
      {!props.attending && (props.meetup.attendees_count < props.meetup.capacity) &&  
        <Button onClick={createUserMeetupRelationship}>Join Meetup</Button>}
      {props.attending &&
        <Button onClick={deleteUserMeetupRelationship}>Leave Meetup</Button> }
    </React.Fragment>
  );
}

const initialMeetupData = Object.freeze({
  name: "",
  date: "",
  capacity: "",
  description: ""
});

function EditMeetupButton(props) {
  let history = useHistory();
  const [show, setShow] = React.useState(false);
  const [formData, setFormData] = React.useState(initialMeetupData);
  console.log('meetup form data', formData);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setFormData(initialMeetupData);
    setShow(true);
  }
  const handleChange = (evt) => {
    setFormData({
      ...formData, [evt.target.name]: evt.target.value.trim()
    });
  };

  const editMeetup = (evt) => {
    evt.preventDefault();

    // check new capacity against attendees_count
    if (formData.capacity && formData.capacity < props.meetup.attendees_count) {
      alert("Capacity is less than the number of attendees currently RSVP'd.")
    } else if (formData == initialMeetupData) {
      alert("Nothing to update.");
    } else {
      fetch (`/api/meetups/${props.meetupID}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then((data) => {
        props.setAlert(data.message);
        setShow(false);
        props.setReload(!props.reload);
      });
    }
  }

  const cancelMeetup = (evt) => {
    evt.preventDefault();
    fetch (`/api/meetups/${props.meetupID}`, {
      method: 'DELETE',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then((data) => {
      setShow(false);
      props.setAlert(data.message);
      props.setReload(!props.reload);
    });
  }  
  return (
    <Container>
      <Button onClick={handleShow}>Edit Meetup</Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Fill in the details that you would like to update.</p>
          <form onSubmit={editMeetup}>
            <div className="form-group p-2">
              <label>Event Name</label>
              <input type="text" className="form-control" name="name" 
                placeholder={props.meetup.name}onChange={handleChange} />
            </div>

            <div className="form-group p-2">
              <label>Date</label>
              <input type="datetime-local" className="form-control" name="date" 
                placeholder={props.meetup.date} onChange={handleChange} />
            </div>

            <div className="form-group p-2">
              <label>Maximum Capacity</label>
              <input type="number" className="form-control" name="capacity"
                placeholder={props.meetup.capacity} 
                onChange={handleChange} />
            </div>

            <div className="form-group p-2">
              <label>Event Description</label>    
              <textarea className="form-control"  name="description" 
                placeholder={props.meetup.description}
                onChange={handleChange} >
              </textarea>
            </div>
            <Button variant="primary" type="submit">Save Changes</Button>
            <Button variant="danger" onClick={cancelMeetup}>Cancel Meetup</Button>

          </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>


  );
}

function MeetupDetails(props) {
  const [error, setError] = React.useState(null);
  const [meetup, setMeetup] = React.useState([]);
  const [attending, setAttending] = React.useState(false);
  const [hosting, setHosting] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  console.log("You're attending:", attending);
  console.log("You're hosting:", hosting);
  console.log('reload', reload);


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

      
  }, [reload])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (meetup.length === 0) {
    return <div>Loading...</div>;
  } else {
    return (
      <Container>
        {(meetup.status == 'CANCELLED') && 
          <Alert variant='danger'>This event is cancelled.</Alert>}

        {(meetup.status == 'PAST') && 
          <Alert variant='warning'>This event has passed.</Alert>}

        {(meetup.status == 'ACTIVE') && (meetup.attendees_count === meetup.capacity) && 
          <Alert variant='warning'>This event is full.</Alert>}

        {!hosting && (meetup.status == 'ACTIVE') && 
          <JoinUnjoinMeetupButton setAttending={setAttending} attending={attending}
            setMeetup={setMeetup} meetup={meetup} user={props.user}
            setAlert={props.setAlert} />}

        

        
        <Row>
          <Col>
            <img src={'http://res.cloudinary.com/dfzb7jmnb/image/upload' + meetup.image_url}
              width={400}/>
          </Col>
          <Col>
            <h1>Meetup Details</h1>
            {hosting && (meetup.status == 'ACTIVE') &&
              <EditMeetupButton meetup={meetup} 
                meetupID={meetupID} setReload={setReload} reload={reload}
                setAlert={props.setAlert} />}
            {meetup.host.id === props.user.id ? "YOU'RE HOSTING!" : 
              <UserTile host={true} user={meetup.host} currentUser={props.user} />}

            <Link to={`/restaurant/${meetup.restaurant.id}`}>
              <p>{meetup.restaurant.name}</p>
            </Link>
            <p>Event Name: {meetup.name}</p>
            <p>Event Date: {meetup.date}</p>
            <p>Event Capacity: {meetup.capacity}</p>
            <p>Event Description: {meetup.description}</p>
          </Col>
        </Row>

        
        <MeetupAttendees meetup_id={meetupID} attending={attending}
          setAttending={setAttending} user={props.user}/>
      </Container>
    );
  }
}


function MyHostedMeetups(props) {
  const [hostedMeetups, setHostedMeetups] = React.useState([]);
  const [showPast, setShowPast] = React.useState(false);
  const [showUpcoming, setShowUpcoming] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/users/${props.user.id}/hosting.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setHostedMeetups(result);
        }
      )
  }, [])
  if (hostedMeetups.length === 0) return <p>Loading...</p>;

  return (
    <Container fluid>
      <h1 className='mb-3'>Meetups I'm Hosting</h1>
      <ButtonGroup className='mb-3' aria-label="Show Meetups">
        <Button onClick={() => {setShowPast(true);
                                setShowUpcoming(false);}}>Show Past</Button>
        <Button onClick={() => {setShowPast(false);
                                setShowUpcoming(false);}}>Hide All</Button>                     
        <Button onClick={() => {setShowUpcoming(true);
                              setShowPast(false);}}>Show Upcoming</Button>
      </ButtonGroup>
      
      {showPast &&
        <Container>
          <h3 className='mb-3'>Past Meetups</h3>
          {hostedMeetups.past.length != 0 ? 
            <div className="list-group">
              {hostedMeetups.past.map(meetup => (
                <MeetupTile meetup={meetup} 
                            past={true}
                            dontDisplayHost={props.dontDisplayHost} 
                            user={props.user} 
                            key={meetup.id} />
              ))} 
            </div> : <Alert variant='warning'>No Meetups</Alert>}
        </Container>}
      
      {showUpcoming &&
      <Container>
      <h3>Upcoming Meetups</h3>
        {hostedMeetups.future.length != 0 ? 
        <div className="list-group">
          {hostedMeetups.future.map(meetup => (
            <MeetupTile meetup={meetup} dontDisplayHost={props.dontDisplayHost} 
              user={props.user} key={meetup.id} />
          ))} 
        </div> : <Alert variant='warning'>
          <p>No upcoming meetups.</p>
          <p>Perhaps you'd like to host a new meetup?</p></Alert>}
      </Container>}

    </Container>
  );
}

function MyAttendingMeetups(props) {
  const [meetups, setMeetups] = React.useState([]);
  const [showPast, setShowPast] = React.useState(false);
  const [showUpcoming, setShowUpcoming] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/users/${props.user.id}/meetups.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setMeetups(result);
        }
      )
  }, [])

  if (meetups.length === 0) return <p>Loading...</p>;

  return (
    <Container fluid>
      <h1>Meetups I'm Attending</h1>
      <ButtonGroup className='mb-3' aria-label="Show Meetups">
        <Button onClick={() => {setShowPast(true);
                                setShowUpcoming(false);}}>Show Past</Button>
        <Button onClick={() => {setShowPast(false);
                                setShowUpcoming(false);}}>Hide All</Button>                     
        <Button onClick={() => {setShowUpcoming(true);
                              setShowPast(false);}}>Show Upcoming</Button>
      </ButtonGroup>

      {showPast &&
        <Container>
          <h3 className='mb-3'>Past Meetups</h3>
          {meetups.past.length != 0 ? 
            <div className="list-group">
              {meetups.past.map(meetup => (
                <MeetupTile past={true} user={props.user} meetup={meetup} key={meetup.id} />
              ))} 
            </div> : <Alert variant='warning'>No Meetups</Alert>}
        </Container>}

        {showUpcoming &&
        <Container>
          <h3 className='mb-3'>Upcoming Meetups</h3>
          {meetups.future.length != 0 ? 
            <div className="list-group">
              {meetups.future.map(meetup => (
                <MeetupTile user={props.user} meetup={meetup} key={meetup.id} />
              ))} 
            </div> : <Alert variant='warning'>
              <p>No upcoming meetups.</p>
              <p>Feel free to look around and find one to join.</p></Alert>}
        </Container>}      
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
    <Container>

      <h1>Attendees</h1>
      <div className="list-group">
        {attendees.map(user => (
          <UserTile currentUser={props.user} user={user} key={user.id} />
        ))}
      </div>

    </Container>
    );
  }
}
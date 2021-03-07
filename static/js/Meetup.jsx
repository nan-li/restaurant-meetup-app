const {useParams, useHistory} = ReactRouterDOM;

function MeetupTile(props) {

  console.log('props.displayhost', props.displayHost);
  return (
    <Container>
      <Media className="list-group-item">
        <img className="img-thumbnail" src={props.meetup.restaurant.image_url} />

        <Media.Body>
          <Link to={`/meetup/${props.meetup.id}`}>
            <h5>{props.meetup.name}</h5>
          </Link>
          <hr />
          <p>Date: {props.meetup.date}</p>
          {!props.dontDisplayHost &&
            <p>Hosted by: {props.meetup.host.id === props.user.id ? "You!" : props.meetup.host.username}</p>
          }
          {(props.meetup.status === 'CANCELLED') &&
            <hr /> && 
            <Alert variant='danger'>This event is cancelled.</Alert> }
        </Media.Body>
      </Media>
    </Container>

  )
}

function JoinUnjoinMeetupButton(props) {
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (evt) => {
    setFormData({
      ...formData, [evt.target.name]: evt.target.value.trim()
    });
  };

  const editMeetup = (evt) => {
    evt.preventDefault();

    // check new capacity against attendees_count
    if (formData.capacity < props.meetup.attendees_count) {
      alert("Capacity is less than the number of attendees currently RSVP'd.")
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
        alert(data.message);
        setShow(false);
        props.setReload(true);
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
      history.push('/meetups');
      alert(data.message);
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

        {(meetup.status == 'ACTIVE') && (meetup.attendees_count === meetup.capacity) && 
          <Alert variant='warning'>This event is full.</Alert>}

        {!hosting && (meetup.status == 'ACTIVE') &&
          <JoinUnjoinMeetupButton setAttending={setAttending} attending={attending}
            setMeetup={setMeetup}
            meetup={meetup} user={props.user} />}

        {hosting && (meetup.status == 'ACTIVE') &&
          <EditMeetupButton meetup={meetup} 
          meetupID={meetupID} setReload={setReload} />}

        <h1>Meetup Details</h1>
        <img src={meetup.restaurant.image_url} width={400}/>
        <p>Event Name: {meetup.name}</p>
        <p>Event Date: {meetup.date}</p>
        <p>Event Capacity: {meetup.capacity}</p>
        <p>Event Description: {meetup.description}</p>

        <p>Hosted by:</p>
        {meetup.host.id === props.user.id ? "You!" : 
          <UserTile user={meetup.host} currentUser={props.user} />}
        
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
          <MeetupTile meetup={meetup} dontDisplayHost={props.dontDisplayHost} user={props.user} key={meetup.id} />
        
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
          <UserTile currentUser={props.user} user={user} key={user.id} />
        ))}
      </div>

    </div>
    );
  }
}
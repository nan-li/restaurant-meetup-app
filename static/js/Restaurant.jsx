/* 
  This component will render RestaurantSearch
  and MyFavoriteRestaurants  
*/

function Restaurants(props) {
  const [displaySearchResults, setDisplaySearchResults] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState(null);
  const [coordinates, setCoordinates] = React.useState(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = React.useState([]);

  return (
      <Container>
        <Switch>
          <Route exact path='/restaurants'>
            <Row>
                {!displaySearchResults && <Col>
                  <MyFavoriteRestaurants user={props.user} 
                    favoriteRestaurants={favoriteRestaurants}
                    setFavoriteRestaurants={setFavoriteRestaurants} /> </Col>}
                {displaySearchResults && <Col>
                  <MapContainer searchResults={searchResults}
                    coordinates={coordinates} /> </Col>}
              <Col>
                <RestaurantSearch 
                  setDisplaySearchResults={setDisplaySearchResults} 
                  setSearchResults={setSearchResults} 
                  setCoordinates={setCoordinates} />
             
                {displaySearchResults && 
                  <RestaurantSearchResults user={props.user} restaurants={searchResults} />}
              </Col>
            </Row>
          </Route>
          <Route path='/restaurant/:restaurantID'>
            <RestaurantDetails user={props.user} 
              displaySearchResults={displaySearchResults}
              restaurants={searchResults} 
              favoriteRestaurants={favoriteRestaurants}
              setAlert={props.setAlert} />

          </Route>
        </Switch>
      </Container>     
  );
}

const initialSearchTerms = Object.freeze({
  term: "",
  location: ""
});

function RestaurantSearch(props) {
  const [searchTerms, setSearchTerms] = React.useState(initialSearchTerms);
  const [error, setError] = React.useState(null);

  console.log("searchTerms at top of Component", searchTerms);

  const handleChange = (evt) => {
    setSearchTerms({
      ...searchTerms, [evt.target.name]: evt.target.value.trim()
    });
  };

  const getLocation = () => {
    props.setDisplaySearchResults(true);
    document.querySelector('[name="location"]').placeholder = 'Current Location'; 
    navigator.geolocation.getCurrentPosition(searchByCurrentLocation);
  }
  
  const searchByCurrentLocation = (position) => {
    props.setCoordinates({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });

    let url = (`/api/restaurants/search.json?term=${searchTerms.term}&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
    console.log("url", url);
    fetch(url)
    .then(res => res.json()) 
    .then(
      (result) => {
        if (result.error) {
          alert(result.error.description);
        } else {
        props.setSearchResults(result.businesses);
        localStorage.setItem('searchResults', JSON.stringify(result.businesses));
        console.log("*******", JSON.parse(localStorage.getItem('searchResults')));
        // props.setDisplaySearchResults(true);
        }
        
      },
      (error) => {
        setError(error);
      });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.setDisplaySearchResults(true);

    let url = `/api/restaurants/search.json?term=${searchTerms.term}&location=${searchTerms.location}`;
    console.log("URL: ", url);
    fetch(url)
      .then(res => res.json()) 
      .then(
        (result) => {
          props.setSearchResults(result.businesses);
          localStorage.setItem('searchResults', JSON.stringify(result.businesses));
          // console.log("*******", JSON.parse(localStorage.getItem('searchResults')));

          console.log("Returned from call");
          // props.setDisplaySearchResults(true);
        },
        (error) => {
          setError(error);
        });
    }
    return (
      <div>
        <h1>Search</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="term" placeholder="sushi, salad, korean..."
            required onChange={handleChange}/>
          < hr />
          <Row>
            <Col>
            <input type="text" name="location" placeholder="San Francisco" 
              onChange={handleChange} required/>
            <button type="submit">Search</button>
            </Col>
          </Row>
          <p className='mt-1'> - or - </p>
          <Button onClick={getLocation}>Use Current Location</Button>
        </form>
      </div>
    );
}


function RestaurantSearchResults(props) {
  if (!props.restaurants) return <Spinner animation="border" variant="success" />;
    
  
  return (
      <Container>
        <h1>Search Results</h1>
        <div className="list-group">
          {props.restaurants.map(rest => (        
              <RestaurantTile restaurant={rest} user={props.user} key={rest.id}/>     
          ))}
        </div>
      </Container>
  );
}

function RestaurantTile(props) {

  return (
    <Card style={{ width: '24rem' }}>
      <Link to={`/restaurant/${props.restaurant.id}`}>
          <Card.Img variant="top" src={props.restaurant.image_url}  />
        </Link>
      
      <Card.Body>
        <Card.Title>{props.restaurant.name}</Card.Title> 
        <Card.Text>
          {props.isFavorite ? props.restaurant.address : props.restaurant.location.display_address}
        </Card.Text>
        <Card.Text>
          {props.isFavorite ? props.restaurant.cuisine : props.restaurant.categories[0].title}
        </Card.Text>

      </Card.Body>
    </Card> 
  )
}


function FavoriteUnfavoriteRestaurantButton(props) {

  let history = useHistory();

  const createUserRestaurantRelationship = () => {
    // POST to server
    fetch(`/api/users/${props.user.id}/restaurants/${props.restaurantID}.json`, {
      method: 'POST',
      body: JSON.stringify(props.restaurant),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(
      (data) => {
        console.log(data);
        props.setFavorited(true);
      }
    );
  }
  
  const deleteUserRestaurantRelationship = () => {
    console.log("isHosting?", props.isHostingMeetupHere);
    console.log("isAttending?", props.isAttendingMeetupHere);

    // check if user is attending or hosting meetups here
    if (props.isHostingMeetupHere) {
      alert('You are hosting a meetup here. Cannot unfavorite this restaurant');
    }
    else if (props.isAttendingMeetupHere) {
      alert('You are attending a meetup here. Cannot unfavorite this restaurant');
    } else {
      // Make request to backend
      fetch(`/api/users/${props.user.id}/restaurants/${props.restaurantID}.json`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        history.push('/restaurants');
      })
    }
  }

  return (
    <React.Fragment>
      {!props.favorited && 
        <Button onClick={createUserRestaurantRelationship}>
          Add to Favorites
        </Button>}
      {props.favorited && 
        <Button variant='danger' onClick={deleteUserRestaurantRelationship}>
          Remove From Favorites
        </Button>}
      
    </React.Fragment>
  );
}


const initialMeetupData = Object.freeze({
  name: "",
  date: "",
  capacity: "",
  attendees_count: 0,
  description: "",
  restaurant_id: "",
  host_id: ""
});

function RestaurantDetails(props) {
  const [favorited, setFavorited] = React.useState(false);
  const [fromYelp, setFromYelp] = React.useState(false);
  console.log("favorited?", favorited);

  const [restaurant, setRestaurant] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [formData, setFormData] = React.useState(initialMeetupData);
  const [error, setError] = React.useState(null);

  const [isHostingMeetupHere, setIsHostingMeetupHere] = React.useState(false);
  const [isAttendingMeetupHere, setIsAttendingMeetupHere] = React.useState(false);

  console.log(formData);

  let {restaurantID} = useParams();
  let history = useHistory();
  
  console.log("restaurnt is", restaurant);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

    fetch ('/api/meetups/create', {
      method: 'POST',
      body: data
    })
    .then(res => res.json())
    .then(
      (data) => {
        if (data.status != 'error') {
          props.setAlert(data.message);
          setShow(false);
          history.push(`/meetup/${data.meetup.id}`)
        } else {
          props.setAlert(data.message);
        }
      },
      (error) => {
        setError(error);
      }
    )
  }
  
  React.useEffect(() => {
    // get the restaurant data from own database with restaurantID
    fetch(`/api/users/${props.user.id}/restaurants/${restaurantID}.json`)
    .then(res => res.json())
    .then(
      (data) => {
        if (data.status != 'error') {
          setRestaurant(data.restaurant);
          setFormData({
            ...formData, 
            ['restaurant_id']: restaurantID, 
            ['host_id']: props.user.id
          });
          if (data.favorited) {
            setFavorited(true);
          }          
        } else {
          // this was rendered from Yelp search results
          for (const res of JSON.parse(localStorage.getItem('searchResults'))) {
            console.log('res', res);
            if (res.id === restaurantID) {
              setRestaurant(res);
              setFormData({
                ...formData, 
                ['restaurant_id']: restaurantID, 
                ['host_id']: props.user.id
              });
              setFromYelp(true);
              return;
            }
          }
        }
      }
    )
  }, [])


 
  if (restaurant.length === 0) return <div>Loading...</div>
  
  return (
    <Container>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create a New Meetup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group p-2">
              <label>Event Name</label>
              <input type="text" className="form-control" name="name" 
                placeholder="Chill Dinner" onChange={handleChange} required />
            </div>

            <div className="form-group p-2">
              <label>Date</label>
              <input type="datetime-local" className="form-control" name="date" 
                placeholder="2021-06-12T19:30" onChange={handleChange} required />
            </div>

            <div className="form-group p-2">
              <label>Maximum Capacity</label>
              <input type="number" className="form-control" name="capacity" 
                onChange={handleChange} required />
            </div>

            <div className="form-group p-2">
              <label>Event Description</label>    
              <textarea className="form-control"  name="description" 
                placeholder="Let's get together and enjoy a meal together with new friends." 
                onChange={handleChange} >
              </textarea>
            </div>

            <div className="form-group p-2">
              <label>Upload an Event Picture</label>
              <input type="file" className="form-control-file" name="image" 
                onChange={handleChange} />
            </div>

            <Button variant="primary" type="submit">Create Meetup</Button>
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
          <img width={400} src={restaurant.image_url} />
        </Col>
        <Col>
          {favorited && 
            <Button onClick={handleShow} className='mr-1'>Create a Meetup</Button>}
          <FavoriteUnfavoriteRestaurantButton 
            favorited={favorited} setFavorited={setFavorited}
            restaurant={restaurant}
            restaurantID={restaurantID} user={props.user} 
            isHostingMeetupHere={isHostingMeetupHere} 
            isAttendingMeetupHere={isAttendingMeetupHere} />
          <br />
          <br />
          <h1>{restaurant.name}</h1>
          <p>{fromYelp ? restaurant.location.display_address : restaurant.address}</p>
          <p>{fromYelp ? restaurant.categories[0].title : restaurant.cuisine}</p>
        </Col>
      </Row>
      
      
      <hr />

      <Row>
        <Col>
          {favorited && 
            <RestaurantFans restaurantID={restaurantID}
              user={props.user} />}
        </Col>
        <Col>
          {favorited && 
            <RestaurantMeetups user={props.user} restaurantID={restaurantID} 
              show={show} setIsAttendingMeetupHere={setIsAttendingMeetupHere}
              setIsHostingMeetupHere={setIsHostingMeetupHere} />}
        </Col>
      </Row>
      
      
    </Container>
    
  );
}



/*
  Shows favorite restaurants for a logged in user using user state
*/
function MyFavoriteRestaurants(props) {
  // this component wasn't rendered from Restaurant component
  
  const [favoriteRestaurants, setFavoriteRestaurants] = React.useState([]);  
  console.log('faves', favoriteRestaurants);
  React.useEffect(() => {
    fetch(`/api/users/${props.user.id}/restaurants.json`)
      .then(res => res.json())
      .then(
        (result) => {
          if (props.setFavoriteRestaurants) {
            props.setFavoriteRestaurants(result);
          }
          setFavoriteRestaurants(result);
        }
      )
  }, [])
  
  return (
    <Container>
      <h1>My Favorite Restaurants</h1>
      {favoriteRestaurants.length !== 0 ? 
        <div className="list-group">
          {favoriteRestaurants.map(rest => (       
            <RestaurantTile isFavorite restaurant={rest} user={props.user} key={rest.id} />
          ))}
        </div> : <Alert variant='warning'>
          <p>You have no favorite restaurants yet.</p>
          <p>Why not search for some new restaurants to visit?</p>
        </Alert>

      }

    </Container>
  );
}

function RestaurantMeetups (props) {
  const [meetups, setMeetups] = React.useState([]);
  const [showPast, setShowPast] = React.useState(false);
  const [showUpcoming, setShowUpcoming] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/restaurants/${props.restaurantID}/meetups.json`)
      .then(res => res.json())
      .then((result) => {
        if (result.status != 'error') {
          setMeetups(result.meetups_info);
          // check meetups to see if user is hosting or attending any
          if (result.isHosting) {
            props.setIsHostingMeetupHere(true);
          }
          if (result.isAttending) {
            props.setIsAttendingMeetupHere(true);
          }
        }
      })
  }, [props.show])

  if (meetups.length === 0) return null;

  return (
    <Container>
      <h1>Meetups at this Restaurant</h1>
      <ButtonGroup aria-label="Show Meetups">
        <Button onClick={() => {setShowPast(true);
                                setShowUpcoming(false);}}>Show Past</Button>
        <Button onClick={() => {setShowPast(false);
                                setShowUpcoming(false);}}>Hide All</Button>                     
        <Button onClick={() => {setShowUpcoming(true);
                              setShowPast(false);}}>Show Upcoming</Button>
      </ButtonGroup>

      {showPast &&
        <Container>
          <h3>Past Meetups</h3>
          {meetups.past.length != 0 ? 
            <div className="list-group">
              {meetups.past.map(meetup => (
                <MeetupTile past={true} meetup={meetup} user={props.user} key={meetup.id} />
              ))}
            </div> : <Alert variant='warning'>No Meetups</Alert>}
        </Container>}

        {showUpcoming &&
        <Container>
          <h3>Upcoming Meetups</h3>
          {meetups.future.length != 0 ? 
            <div className="list-group">
              {meetups.future.map(meetup => (
                <MeetupTile meetup={meetup} user={props.user} key={meetup.id} />
              ))}
            </div> : <Alert variant='warning'>
              <p>No upcoming meetups.</p>
              <p>Perhaps you'd like to host one here?</p></Alert>}
          
        </Container>}
    </Container>
  )
}

function RestaurantFans (props) {
  const [fans, setFans] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/restaurants/${props.restaurantID}/fans.json`)
      .then(res => res.json())
      .then((result) => {
        if (result.status != 'error') {
          setFans(result);         
        }
      })
  }, [])

  if (fans.length === 0) return null;

  return (
    <Container>
      <h1>Fans of this Restaurant</h1>
      <div className="list-group">
        {fans.map(user => (
          <UserTile currentUser={props.user} user={user} key={user.id} />
        ))}
      </div>
    </Container>
  );
}
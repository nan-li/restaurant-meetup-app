const {useParams, useHistory} = ReactRouterDOM;
/* 
  This component will render RestaurantSearch
  and MyFavoriteRestaurants  
*/

function Restaurants(props) {
  const [displaySearchResults, setDisplaySearchResults] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = React.useState([]);
  // console.log("searchResults is: ", searchResults);
  return (
    // <Router>
      <Container>
        <Switch>
          <Route exact path='/restaurants'>
            <RestaurantSearch 
              setDisplaySearchResults={setDisplaySearchResults} 
              setSearchResults={setSearchResults} />
            {displaySearchResults && 
              <RestaurantSearchResults user={props.user} restaurants={searchResults} />}
            
            {!displaySearchResults &&
              <MyFavoriteRestaurants user={props.user} 
                favoriteRestaurants={favoriteRestaurants}
                setFavoriteRestaurants={setFavoriteRestaurants} />}
          </Route>
          <Route path='/restaurant/:restaurantID'>
            <RestaurantDetails user={props.user} 
              displaySearchResults={displaySearchResults}
              restaurants={searchResults} 
              favoriteRestaurants={favoriteRestaurants} />
          </Route>
        </Switch>
      </Container>   
    // </Router>

     
  );
}


const initialSearchTerms = Object.freeze({
  term: "",
  location: ""
});

function RestaurantSearch(props) {
  const [searchTerms, setSearchTerms] = React.useState(initialSearchTerms);
  const [error, setError] = React.useState(null);

  const handleChange = (evt) => {
    setSearchTerms({
      ...searchTerms, [evt.target.name]: evt.target.value.trim()
    });
  };

  function handleSubmit(evt) {
    evt.preventDefault();

    let url = `/api/restaurants/search.json?term=${searchTerms.term}&location=${searchTerms.location}`;
    console.log("URL: ", url);
    fetch(url)
      .then(res => res.json()) //don't reach here
      .then(
        (result) => {
          props.setSearchResults(result.businesses);
          console.log("Returned from call");
          props.setDisplaySearchResults(true);
        },
        (error) => {
          setError(error);
        });
    }
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
}


function RestaurantSearchResults(props) {

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
    
      <Container>
        <Media className="list-group-item" >
          <img className="img-thumbnail" src={props.restaurant.image_url} />
          <Media.Body>
            <Link to={`/restaurant/${props.restaurant.id}`}>
              <h5>{props.restaurant.name}</h5>
            </Link>
            <hr />
            <p>{props.isFavorite ? props.restaurant.address : props.restaurant.location.display_address}</p>
            <p>{props.isFavorite ? props.restaurant.cuisine : props.restaurant.categories[0].title}</p>
          </Media.Body>
        </Media>
        
          {/* needs to go up, don't pass single restaurant info. Pass all of them and find with id */}
          {/* <Route exact path='/restaurants/:restaurant-id'>
            <RestaurantDetails user={props.user} restaurant={props.restaurant}/>
          </Route> */}
       
      </Container>
   

    
  )
}


function AddRestaurantToFavorites(props) {
  const createUserRestaurantRelationship = () => {
    props.setFavorited(true);
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
      }
    );
  }
  
  return (
    <button onClick={createUserRestaurantRelationship}>Add to Favorites</button>
  )
}


/* 
Show details of a restaurant given restaurant object */
function RestaurantDetails(props) {
  const [favorited, setFavorited] = React.useState(false);
  const [restaurant, setRestaurant] = React.useState([]);
  let address;

  let {restaurantID} = useParams();
  console.log("restaurnt is", restaurant);
  
    
  React.useEffect(() => {
    // check if this restaurant is in user's favorited restaurants
    // I got to this component from clicking a restaurant in MyFavoriteRestaurants
    if (!props.displaySearchResults) {
      setFavorited(true);
      for (const res of props.favoriteRestaurants) {
        if (res.id === restaurantID) {
          setRestaurant(res);
          address = res.address
        }
      }
    } else {
    // this component was rendered from Yelp search results

    for (const res of props.restaurants) {
      if (res.id === restaurantID) {
        setRestaurant(res);
        address = res.location.display_address;
        console.log("address", address);
      }
    }

    // check if this restaurant is a favorited
    fetch(`/api/users/${props.user.id}/restaurants/${restaurantID}.json`)
      .then(res => res.json())
      .then(
        (data) => {
          if (data.status != 'error') {
            setFavorited(true);
          }
        }
      )
    }
  }, [])

  

 
  if (restaurant.length === 0) return <div>Loading...</div>
  
  return (
    <Container>
      <h1>{restaurant.name}</h1>
      <img height={200} src={restaurant.image_url} />
      <hr />
      <p>{address}</p>
      <p>{props.displaySearchResults ? restaurant.categories[0].title : restaurant.cuisine}</p>
      {!favorited &&
        <AddRestaurantToFavorites setFavorited={setFavorited} 
          restaurant={restaurant}
          restaurantID={restaurantID} user={props.user} />}

      {favorited && <RestaurantMeetups restaurantID={restaurantID} />}
    </Container>
    
  );
}



/*
  Shows favorite restaurants for a logged in user using user state
*/
function MyFavoriteRestaurants(props) {
  // this component wasn't rendered from Restaurant component
  
  const [favoriteRestaurants, setFavoriteRestaurants] = React.useState([]);  
  
  React.useEffect(() => {
    fetch(`/api/users/${props.user.id}/restaurants.json`)
      .then(res => res.json())
      .then(
        (result) => {
          if (props.setFavoriteRestaurants) {
            props.setFavoriteRestaurants(result);
          }

          if (!props.setFavoriteRestaurants) {
            setFavoriteRestaurants(result);
          } else {
            
          }


        }
      )
  }, [])

  return (

    <Container>
      <h1>My Favorite Restaurants</h1>
      <div className="list-group">
        {props.favoriteRestaurants.map(rest => (
          
          <RestaurantTile isFavorite restaurant={rest} user={props.user} key={rest.id} />
        // <a href={`/api/restaurants/${rest.id}.json`} className="list-group-item" key={rest.id}>
        //   <img className="img-thumbnail" src={rest.image_url} />
        //   {rest.name}
        // </a>

        ))}
      </div>

    </Container>

      
  );
}

function RestaurantMeetups (props) {
  const [meetups, setMeetups] = React.useState([]);
  
  React.useEffect(() => {
    fetch(`/api/restaurants/${props.restaurantID}/meetups.json`)
      .then(res => res.json())
      .then((result) => {
        if (result.status != 'error') {
          setMeetups(result);
        }
      })
  }, [])

  if (meetups.length === 0) return null;

  console.log("Meetups is ", meetups);
  return (
    <Container>
      <h1>Meetups at this Restaurant</h1>
      <div className="list-group">
        {meetups.map(meetup => (
          <MeetupTile meetup={meetup} key={meetup.id} />
        ))}
      </div>
    </Container>
  )
}

function MeetupTile(props) {

  // let history = useHistory();
  // function handleClick() {
  //   history.push(`/meetup/${props.meetup.id}`);
  // }
  return (
    <Container>
      <Media className="list-group-item">
     
        <Media.Body>
          <Link to={`/meetup/${props.meetup.id}`}>
            <h5>{props.meetup.name}</h5>
            {/* <Button onClick={handleClick}>Visit!</Button> */}
          </Link>
          <hr />
          <p>Hosted by: {props.meetup.host}</p>
        </Media.Body>
      </Media>
    </Container>

  )
}
const {useParams} = ReactRouterDOM;
/* 
  This component will render RestaurantSearch
  and MyFavoriteRestaurants  
*/

function Restaurants(props) {
  const [displaySearchResults, setDisplaySearchResults] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  console.log("searchResults is: ", searchResults);
  return (
    <Router>
      <Container>

        <Switch>
          <Route exact path='/restaurant/:restaurantID'>
            <RestaurantDetails user={props.user} restaurants={searchResults}/>
          </Route>
          <Route exact path='/restaurants'>
            <RestaurantSearch 
              setDisplaySearchResults={setDisplaySearchResults} 
              setSearchResults={setSearchResults} />
              {displaySearchResults ? 
                <RestaurantSearchResults user={props.user} restaurants={searchResults} /> : null}
            <MyFavoriteRestaurants user={props.user}/>
          </Route>
        </Switch>

        
        

      </Container>   
    </Router>

     
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


function AddRestaurantToFavorites(props) {
  return (
    <button onClick={props.setFavorited}>Add to Favorites</button>
  )
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
            <p>{props.restaurant.location.display_address}</p>
            <p>{props.restaurant.categories[0].title}</p>
          </Media.Body>
        </Media>
        
          {/* needs to go up, don't pass single restaurant info. Pass all of them and find with id */}
          {/* <Route exact path='/restaurants/:restaurant-id'>
            <RestaurantDetails user={props.user} restaurant={props.restaurant}/>
          </Route> */}
       
      </Container>
   

    
  )
}




/* 
Show details of a restaurant given restaurant object */
function RestaurantDetails(props) {
  const [favorited, setFavorited] = React.useState(false);
  const [restaurant, setRestaurant] = React.useState([]);
  let {restaurantID} = useParams();
  console.log("restaurnt is", restaurant);

  // check if this restaurant is in user's favorited restaurants
  // I got to this component from a link where I know the restaurant is
  
    
  React.useEffect(() => {
    if (props.isFavorite) {
      setFavorited(true);
      setRestaurant(props.restaurant)
    } else {

    for (const res of props.restaurants) {
      if (res.id === restaurantID) {
        setRestaurant(res);
      }
    }

    fetch(`/api/users/${props.user.id}/restaurants/${restaurantID}.json`)
      .then(res => res.json())
      .then(
        (data) => {
          if (data.status != 'error') {
            setFavorited(true);
            setRestaurant(data.data);
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
      <p>{restaurant.location.display_address}</p>
      <p>{restaurant.categories[0].title}</p>
      {favorited ? null : <AddRestaurantToFavorites setFavorited={setFavorited} />}
    </Container>
    
  );
}

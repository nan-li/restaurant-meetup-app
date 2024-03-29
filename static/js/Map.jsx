const GOOGLE_MAPS_API_KEY = 'AIzaSyBbl0gifiv6edqb_3K6x6V211nvnxGVpoA';

function MapContainer(props) {
  const [map, setMap] = React.useState(null);
  let center;

  // Center on user's location if they did a search by current location
  if (props.coordinates) {
    center = {
      lat: props.coordinates.lat,
      lng: props.coordinates.lng
    }
  } else {
    center = {
      lat: 37.7887459,
      lng: -122.4115852
    }
  }
  
  const options = {
    center: center,
    zoom: 12,
  }

  return (
    <MapComponent 
      options={options} 
      map={map} setMap={setMap} 
      favorites={props.favorites}
      restaurants={props.restaurants} 
      mapDimensions={props.mapDimensions}
      coordinates={props.coordinates} 
    />
  );
}


// function goToRestaurant() {
//     let history = useHistory();
//     history.push(`/restaurant/VPXezwmTETrwitrzj9BZPA`);
// }

function MapComponent(props) {
  // console.log('rendering the map')
  const options = props.options;
  const locs = props.restaurants;
  const ref = React.useRef();
  const markers = [];

  React.useEffect(() => {
    const createMap = () => props.setMap(new window.google.maps.Map(ref.current, options));

    if (!window.google) { // Create an html element with a script tag in the DOM
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      document.head.append(script);
      script.addEventListener('load', createMap);
      // console.log('and now there is a map 1');
      return () => script.removeEventListener('load', createMap);
    } else { // Initialize the map if a script element with google url IS found
      createMap();
      // remove any old markers from the last query
      for ( let i = 0;  i < markers.length; i++) {
        markers[i].setMap(null);
      }
    }
  }, [locs]); 
  
  let bounds;
  let userMarker;

  let restaurantInfo;
  let restaurant_id = '';

  const addMarkers = () => {
    restaurantInfo = new google.maps.InfoWindow();
   
    // Add a marker for user's current location if provided
    if (props.coordinates) {
      userMarker = new google.maps.Marker({
        position: props.coordinates,
        title: 'You are here.',
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: new google.maps.Size(50, 50)
        },
        map: props.map
      })
    } else {
      bounds = new google.maps.LatLngBounds();
    }

    
    for (const loc of locs) {

      const latitude = (props.favorites) ? loc.lat : loc.coordinates.latitude;
      const longitude = (props.favorites) ? loc.long : loc.coordinates.longitude;
      const addr = (props.favorites) ? loc.address : loc.location.display_address;

      if (latitude && longitude) {
        // add all the restaurant markers to the map
        const restaurantInfoContent = (`
        <div class="container">
          <h5>${loc.name}</h5> 
          <hr/>
          <div class="row">
            <div class="col">
              <img class="google-maps-img" src=${loc.image_url} />
            </div>
            <div class="col">
              <a href="/restaurant/${loc.id}">
                <button class="btn btn-primary btn-sm">
                  Visit Restaurant
                </button>
              </a>
              <p class="mt-3">${addr}</p>
            </div>
          </div>
          
        </div>        
        `);


        const restaurantMarker = new google.maps.Marker({
          position: {lat: latitude,
                      lng: longitude},
          title: loc.name,
          map: props.map 
        });

        restaurantMarker.addListener('click', () => {
          restaurant_id = loc.id;
          restaurantInfo.close();
          restaurantInfo.setContent(restaurantInfoContent);
          restaurantInfo.open(props.map, restaurantMarker);
        });

        markers.push(restaurantMarker);

        // fit the map to the markers
        if (!props.coordinates) {
          bounds.extend(new google.maps.LatLng(
            latitude,
            longitude
          ));
        } 
      } // end outer if statement
    } // end for loop
  
    if (!props.coordinates) {
      props.map.fitBounds(bounds);
      props.map.panToBounds(bounds);
    }
  }

  if (props.map && locs) {
    // console.log('and the map exists');
    addMarkers();
  }
  return (
    <div id="map-div"
      style={{ height: props.mapDimensions.height, 
        borderRadius: `0.5em`, 
        width: props.mapDimensions.width}}
      ref={ref}
    ></div>
  )
}
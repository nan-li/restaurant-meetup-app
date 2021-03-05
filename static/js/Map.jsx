// const {Image} = ReactBootstrap;

/* https://janosh.dev/blog/google-maps+react-hooks */

// function Map () {
//   const ref = React.useRef();
//   const [map, setMap] = React.useState();

//   React.useEffect(() => {
//     const onLoad = () => setMap(new window.google.maps.Map(ref.current, options));
    
//     if (!window.google) {
//       const script = document.createElement(`script`)
//       script.src =
//         `https://maps.googleapis.com/maps/api/js?key=AIzaSyAdDBsi8si_qW5snlDOESFtr6LxkJn_Hzg`
//       document.head.append(script)
//       script.addEventListener(`load`, onLoad)
//       return () => script.removeEventListener(`load`, onLoad)
//     } else onLoad()
//   }, [options])

//   if (map && typeof onMount === `function`) onMount(map, onMountProps)

//   return (
//     <div
//       style={{ height: `60vh`, margin: `1em 0`, borderRadius: `0.5em` }}
//       {...{ ref, className }}
//     />
//   )
// }

// Map.defaultProps = {
//   options: {
//     center: { lat: 48, lng: 8 },
//     zoom: 5,
//   },
// }

const locations = [
  {
    name: 'Hackbright Academy',
    coords: {
      lat: 37.7887459,
      lng: -122.4115852
    }
  },
  {
    name: 'Powell Street Station',
    coords: {
      lat: 37.7844605,
      lng: -122.4079702
    }
  },
  {
    name: 'Montgomery Station',
    coords: {
      lat: 37.7894094,
      lng: -122.4013037
    }
  },
];



function MapContainer(props) {
  const [map, setMap] = React.useState(null);
  const locs = props.searchResults;
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

  const mapDimensions = {
    height: 500,
    width: 500
  }

  return (
    <MapComponent options={options} map={map} setMap={setMap} 
      searchResults={props.searchResults} mapDimensions={mapDimensions}
      coordinates={props.coordinates} />
  );
}


/* From Andrew */
function MapComponent(props) {
  console.log('rendering the map')
  const options = props.options;
  const locs = props.searchResults;
  const ref = React.useRef();
  const markers = [];


  React.useEffect(() => {
    const createMap = () => props.setMap(new window.google.maps.Map(ref.current, options));
    console.log('search results', locs);

    if (!window.google) { // Create an html element with a script tag in the DOM
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAdDBsi8si_qW5snlDOESFtr6LxkJn_Hzg';
      document.head.append(script);
      script.addEventListener('load', createMap);
      console.log('and now there is a map 1');
      return () => script.removeEventListener('load', createMap);
    } else { // Initialize the map if a script element with google url IS found
      createMap();
      console.log('and now there is a map 2');
      // remove any old markers from the last query
      for ( let i = 0;  i < markers.length; i++) {
        console.log('###cleaning the old markers');
        markers[i].setMap(null);
      }
    }
  }, [locs]); //options.center.lat Need the value of the lat of options because it does not change
  
  let bounds;
  let userMarker;
  const addMarkers = () => {
    // Add a marker for user's current location if provided
    if (props.coordinates) {
      userMarker = new google.maps.Marker({
        position: props.coordinates,
        title: 'You are here.',
        map: props.map
      })
    } else {
      bounds = new google.maps.LatLngBounds();
    }

    for (const loc of locs) {
      console.log("const is", loc);

      if (loc.coordinates.latitude && loc.coordinates.longitude) {
        // add all the restaurant markers to the map
        markers.push(new google.maps.Marker({
          position: {lat: loc.coordinates.latitude,
                      lng: loc.coordinates.longitude},
          title: loc.name,
          map: props.map 
        }));

        // fit the map to the markers
        if (!props.coordinates) {
          bounds.extend(new google.maps.LatLng(
            loc.coordinates.latitude,
            loc.coordinates.longitude
          ));
        } 
      }
    } // end for loop
  
    if (!props.coordinates) {
      console.log("HERERERER")
      props.map.fitBounds(bounds);
      props.map.panToBounds(bounds);
    }
    console.log(markers);
  }

  if (props.map && locs) {
    console.log('and the map exists');
    addMarkers();

  } else { console.log('but there is no map')}
  return (
    <div id="map-div"
      style={{ height: props.mapDimensions.height, 
        margin: `1em 0`, borderRadius: `0.5em`, 
        width: props.mapDimensions.width }}
      ref={ref}
    ></div>
  )
}
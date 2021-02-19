const Router = ReactRouterDOM.BrowserRouter;
const Link = ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;
const Route = ReactRouterDOM.Route;


function App(props) {
  const [user, setUser] = React.useState(null);
  console.log("User info:", user);

  // no one is logged in
  if (!user) {
    return (
      <div>
        <RestaurantSearchBox />
        <Signup />
        <LoginForm setUser={setUser} />
      </div>    
    )
  // user is logged in
  } else {
    return (
      <Router>
        <div>
          <Navbar />
  
          <Switch>
            <Route exact path="/">
              <h1>Homepage</h1>
            </Route>
            <Route path="/restaurants">
              <RestaurantSearchBox />
              <MyFavoriteRestaurants user_id="5"/>
  
            </Route>
            <Route path="/meetups">
              <MyHostedMeetups user_id="5" />
              <MyAttendingMeetups user_id="15" />
              <MeetupDetail meetup_id="3" />
  
            </Route>
            <Route path="/myprofile">
              <UserProfile user_id="1" />
            </Route>        
          </Switch>
        </div>
      </Router>
    );
  }

  
}

function Navbar(props) {
  return (
    <div className="container border rounded">
      <nav className="navbar navbar-light bg-light">
        <Link className="navbar-brand" to="/">Home</Link>
        <Link className="navbar-brand" to="/restaurants">Restaurants</Link>
        <Link className="navbar-brand" to="/meetups">Meetups</Link>
        <Link className="navbar-brand" to="/myprofile">My Profile</Link>

        <Link className="navbar-brand" to="/messages">Messages</Link>
      </nav>
      <img id="header-img" src="/static/img/people-in-restaurant.jpg" 
        className="container col-md-6" 
        alt="Busy restaurant with diners." />
    </div>
  );
}



ReactDOM.render(
  (
    <App />
  ),
  document.getElementById('root')
);

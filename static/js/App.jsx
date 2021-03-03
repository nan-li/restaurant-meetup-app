const Router = ReactRouterDOM.BrowserRouter;
const {Link, Switch, Route, useHistory} = ReactRouterDOM;

const {Container, Image, Button, Navbar, Nav} = ReactBootstrap;

function App(props) {
  const [user, setUser] = React.useState(null);
  // console.log("User info:", user);

  // for now, hardcode a user in
  React.useEffect(()=>{
    fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({username: 'angela', password: 'test'}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(
      (data) => {
      // console.log('Success:', data)
      if (data.status != 'error') {
        setUser(data.user);
      }
    },
    (error) => {
      setError(error)
    });
  }, [])
  // end for now hardcode user in


  // no one is logged in
  if (!user) {
    return (
      <div>
        <Homepage setUser={setUser} />
      </div>    
    )
  // user is logged in
  } else {
    return (
        <div>
          <SiteNavbar />
        
            <Route path={["/restaurant", "/restaurants"]}>
              <Restaurants user={user}/>
            </Route>

            <Route exact path="/meetup/:meetupID">
              <MeetupDetails user={user} />
            </Route>

            <Route exact path="/user/:userID">
              <UserProfile setUser={setUser} user={user}/>
            </Route>

            <Route exact path="/">
              <h1>Todo</h1>
              <p>Your Next Meetup</p>
            </Route>

            <Route exact path="/meetups">
              <Row>
                <Col><MyHostedMeetups user={user} /></Col>
                <Col><MyAttendingMeetups user={user} /></Col>
              </Row>
            </Route>

            <Route exact path="/messages">
              <Messages user={user} />
            </Route>

            <Route exact path="/notifications">
              <Notifications user={user} />
            </Route>

            <Route exact path="/myprofile">
              <MyProfile setUser={setUser} user={user} />
            </Route>        
        </div>
    );
  }

  
}

/*
  Navigation bar for the primary site
  Accessed when user is logged in
*/
function SiteNavbar(props) {
  return (
    <Container>
      <Navbar>
        <Navbar.Brand>
          <Link to="/">
            <img src="/static/img/logo.png" height={100}/>
          </Link>
        </Navbar.Brand>
        <Nav>
          <Link className="navbar-brand" to="/">Home</Link>
          <Link className="navbar-brand" to="/restaurants">Restaurants</Link>
          <Link className="navbar-brand" to="/meetups">Meetups</Link>
          <Link className="navbar-brand" to="/myprofile">My Profile</Link>
          <Link className="navbar-brand" to="/messages">Messages</Link>
          <Link className="navbar-brand" to="/notifications">Notifications</Link>
        </Nav>
      </Navbar>
      

      {/* <img id="header-img" src="/static/img/people-in-restaurant.jpg" 
        className="container col-md-6" 
        alt="Busy restaurant with diners." /> */}
        
    </Container>
  );
}

/* 
  Homepage component displays Navbar
  Displays welcome banner
  Routes users to /login or /signup
*/
function Homepage(props) {
  return (
    // <Router>
      <Container>
        <Navbar static="top">
          <Navbar.Brand>
            <Link to="/">
              <img src="/static/img/logo.png" height={100}/>
            </Link>
          </Navbar.Brand>
          <Nav>
            <span className="nav-link">
              <Link to="/login">Login</Link>
            </span>
            <span className="nav-link">
            <Link to="/signup">Signup</Link>
            </span>
          </Nav>
        </Navbar>       
        {/* <Switch> */}
          <Route exact path="/">
            <Container fluid id="banner">
              <Image fluid className="mx-auto d-block" src="/static/img/banner.png" />
              <Link to="/signup">
                <span className="btn btn-primary" id="join-button">Join Meet+Eat</span>
              </Link>
            </Container>             
          </Route>
          <Route exact path="/login">
            <LoginForm setUser={props.setUser} />
          </Route>
          <Route exact path="/signup">
            <SignupForm setUser={props.setUser} />
          </Route>
        {/* </Switch> */}
      </Container>
   
    // </Router>

      
   

  )
}

ReactDOM.render(
  (
    <Router>
      <App />
    </Router>
      

      
    
  ),
  document.getElementById('root')
);

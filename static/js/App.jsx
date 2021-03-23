const Router = ReactRouterDOM.BrowserRouter;
const {Link, Switch, Route, useHistory, useParams, Redirect} = ReactRouterDOM;
const Img = ReactBootstrap.Image;
const {Container, Button, ButtonGroup, Navbar, Form, NavDropdown,
  Nav, Media, Row, Col, Modal, Alert, Toast, Card, Spinner} = ReactBootstrap;

function App() {
  const [user, setUser] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  console.log("User info:", user);
  
  // Find the logged in user
  React.useEffect(() => {
    if (localStorage.getItem('user') !== 'null') {
      setUser(JSON.parse(localStorage.getItem('user'))); 
    }
  }, [])

  // no one is logged in
  if (!user) {
    return (
        <GeneralHomepage setUser={setUser} setAlert={setAlert} />  
    )
  // user is logged in
  } else {
    return (
        <div>
          <SiteNavbar setUser={setUser} />
          <div className="ml-5 mr-5 mt-5 mb-5">

            {alert && 
              <Alert variant='success'>
                <p>{alert}</p>
                <div className="d-flex justify-content-end">
                  <Button onClick={() => setAlert(null)} variant="outline-success">
                    Close
                  </Button>
                </div>
                
              </Alert>}

            <Switch>
              <Route path={["/restaurant", "/restaurants"]}>
                <Restaurants user={user} setAlert={setAlert} />
              </Route>

              <Route exact path="/meetup/:meetupID">
                <MeetupDetails user={user} setAlert={setAlert} />
              </Route>

              <Redirect from={`/user/${user.id}`} to='/myprofile' />
              
              <Route exact path="/user/:userID">
                <UserProfile setUser={setUser} user={user}/>
              </Route>

              <Route exact path="/">
                <Homepage user={user} />
              </Route>

              <Route exact path="/meetups">
                <Container>
                  <Row>
                    <Col><MyHostedMeetups user={user} /></Col>
                    <Col><MyAttendingMeetups user={user} /></Col>
                  </Row>
                </Container>
                
              </Route>

              <Route exact path="/messages">
                <Messages user={user} />
              </Route>

              <Route exact path="/notifications">
                <Notifications user={user} />
              </Route>

              <Route exact path="/myprofile">
                <MyProfile setUser={setUser} user={user} setAlert={setAlert} />
              </Route>        
            </Switch>
          </div>
        </div>
    );
  } 
}

/*
  Navigation bar for the primary site
  Accessed when user is logged in
*/
function SiteNavbar(props) {
  let history = useHistory();
  return (
      <Navbar sticky="top">
        <Navbar.Brand>
          <Link to="/">
            <img height={60} src="/static/img/small-new-logo.png"/>
          </Link>
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Link className="navbar-brand mr-0" to="/restaurants">Restaurants</Link>
              <NavDropdown>
                <NavDropdown.Item>
                  <Link role='button' className="navbar-brand" to="/restaurants">Restaurants</Link>
                </NavDropdown.Item>
              <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Link role='button' className="navbar-brand" to="/restaurants/favorites">Favorites</Link>
                </NavDropdown.Item>
              </NavDropdown>
            <Link className="navbar-brand ml-3" to="/meetups">Meetups</Link>
            <Link className="navbar-brand" to="/messages">Messages</Link>
            <Link className="navbar-brand" to="/notifications">Notifications</Link>
            <Link to="/myprofile">
              <Button className='mr-3'>Account</Button>
            </Link> 
            <Link to='/'>
            <Button variant='danger' onClick={() => {
              props.setUser(null);
              localStorage.setItem('user', null);}}>Logout</Button>            
            </Link>           
          </Nav>          
        </Navbar.Collapse>

      </Navbar>
  );
}

/* 
  GeneralHomepage component displays Navbar
  Displays welcome banner
  Routes users to /login or /signup
*/
function GeneralHomepage(props) {
  return (
    // <Router>
      <React.Fragment>
        <Navbar sticky='top'>
          <Navbar.Brand>
            <Link to="/">
              <img height={60} src="/static/img/small-new-logo.png"/>
            </Link>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Link className="navbar-brand" to="/login">Login</Link>
              <Link className="navbar-brand" to="/signup">Signup</Link>
            </Nav>  
          </Navbar.Collapse>          
        </Navbar>       
        {/* <Switch> */}
          <Route exact path="/">
            <Container className='mt-5' id="banner">
              <Img fluid className="mx-auto d-block" src="/static/img/banner.png" />
              <Link to="/signup">
                <Button size='lg' variant="primary" id="join-button">Join Meet+Eat</Button>
              </Link>
            </Container>             
          </Route>
          <Route exact path="/login">
            <LoginForm setUser={props.setUser} />
          </Route>
          <Route exact path="/signup">
            <SignupForm setUser={props.setUser} setAlert={props.setAlert} />
          </Route>
        {/* </Switch> */}
      </React.Fragment>
   
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

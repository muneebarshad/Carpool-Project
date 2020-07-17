import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css'
import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";



// Home page - Login and register
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.onLogoutClick = this.onLogoutClick.bind(this);
}

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser(this.props.history);  

  };

  render() {
    const { user } = this.props.auth;

    return (


        <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/dashboard">Carpool Project</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/createRide">Create Ride</Nav.Link>
          <Nav.Link href="/myRides">My Rides</Nav.Link>
          <Nav.Link href="/selectedRides">Selected Rides</Nav.Link>
        </Nav>
        <NavDropdown title={user.name} id="account-dropdown">
                <NavDropdown.Item href="/accountInfo">Profile</NavDropdown.Item>
                 <NavDropdown.Divider />
                 <NavDropdown.Item onClick={this.onLogoutClick}>Logout</NavDropdown.Item>
               </NavDropdown>
        </Navbar>
    );
  }
}
NavBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired

};
const mapStateToProps = state => ({
  auth: state.auth
  
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(NavBar);
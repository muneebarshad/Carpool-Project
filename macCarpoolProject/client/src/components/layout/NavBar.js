import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css'
import React, { Component } from "react";
import { logoutUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";



// Home page - Login and register
class NavBar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;

    return (
//     <Navbar bg="light" expand="lg">
//       <Navbar.Brand href="#home">Carpool Project</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="mr-auto">
//               <Nav.Link href="/createRide">Create Ride</Nav.Link>
//               <Nav.Link href="/myRides">My Rides</Nav.Link>
//               <NavDropdown title="Account" id="basic-nav-dropdown">
//                <NavDropdown.Item href="/accountInfo">{user.name}</NavDropdown.Item>
//                 <NavDropdown.Divider />
//                 <NavDropdown.Item onClick={this.onLogoutClick}>Logout</NavDropdown.Item>
//               </NavDropdown>
//     </Nav>
    
//   </Navbar.Collapse>
// </Navbar>

        <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="">Carpool Project</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/createRide">Create Ride</Nav.Link>
          <Nav.Link href="/myRides">My Rides</Nav.Link>
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
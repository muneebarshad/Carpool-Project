import React, { Component } from "react";
import { Button, Jumbotron } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Home page - Login and register
class Landing extends Component {
  render() {
    return (

      <Jumbotron style={{
        height:"400px",
        width: "50%",
        margin:"auto",
        textAlign: "center"
      }}>
        <h1>Carpool Project</h1>
        <br></br>
        <div class="menu-option" style={{ padding:"40px"}}>
        <p>
          <Button variant="primary" href="/register" style={{
            width: "140px",
          }}>Register</Button>
        </p>

        <p>
          <Button variant="primary" href="/login" style={{
            backgroundColor: "grey",
            borderColor: "grey",
            width: "140px",
          }}>Login</Button>
        </p>
        </div>
        
      </Jumbotron>

      // <div style={{ 
      //     height: "75vh",


      // }} className="container valign-wrapper">
          
      //   <div className="row">
      //     <div className="col s12 center-align">
      //       <h4>
      //         <b>Carpool Project</b> 
      //       </h4>

      //       <br />
      //       <div className="col s6">
      //         <Link
      //           to="/register"
      //           style={{
      //             width: "140px",
      //             borderRadius: "3px",
      //             letterSpacing: "1.5px"
      //           }}
      //           className="btn btn-large waves-effect waves-light hoverable blue accent-3"
      //         >
      //           Register
      //         </Link>
      //       </div>
      //       <div className="col s6">
      //         <Link
      //           to="/login"
      //           style={{
      //             width: "140px",
      //             borderRadius: "3px",
      //             letterSpacing: "1.5px"
      //           }}
      //           className="btn btn-large btn-flat waves-effect white black-text"
      //         >
      //           Log In
      //         </Link>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}
export default Landing;
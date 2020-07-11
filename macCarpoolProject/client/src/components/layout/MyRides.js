import React, { Component } from "react";
import Navbar from "../layout/NavBar.js"
import '../dashboard/dashboard.css';
import { Button } from 'react-bootstrap';
import { BsPersonFill,BsFillClockFill, BsPeople } from "react-icons/bs";
import { MdMyLocation  } from "react-icons/md";
import {  GoLocation } from "react-icons/go";
import jwt_decode from "jwt-decode";

class ManageRides extends Component {

  constructor(props){
    super(props);
    this.state={
      getRides:[]
    }

  }

  callAPI(){
          // Set auth token header auth
     const token = localStorage.jwtToken;
     // Decode token and get user info and exp
       const decoded = jwt_decode(token);
       
   const requestBody = {
         email: decoded.email    
     };
   
     let request = {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(requestBody),
     };
    fetch("/api/ride/getMyRides", request)
      .then(res => res.json())
      .then(res => this.setState({getRides: res}));

  }
  

  componentWillMount(){
    this.callAPI();
  }

  handleClick = (rideId, email) =>{
    const requestBody = {
      id:  rideId ,
      email: email 
    };

    let request = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    fetch("/api/ride/removeRide", request).then(res => {
      if(res.status === 200){
        this.callAPI(); 
      }else{
        alert("Not able to delete the ride")
      }
    });

  }
  

render() {
  
  let rideNotAvailable;
  if(this.state.getRides.length === 0){
    rideNotAvailable = <div id="rideNotAvailable">You have created no Rides</div>
  }
 
return (
      <div>
        {/* Navigation bar */}
        <Navbar/>

        
      
      <div className="main-container"> 
      {/* Ride Object */}
      <div className="rideItems">
      {/* If ride not available */}
      {rideNotAvailable}
      {/* For each ride create html */}
      {this.state.getRides.map(ride =>
          <div className="rideItem">  
            <div className="rideInfo">
              <div className="User"><BsPersonFill/> <a><span>Driver: </span>{ride.email}</a></div>
              <div className="locationFrom"><MdMyLocation/> <a><span>From: </span>{ride.locationFrom}</a></div>
              <div className="locationFrom"><GoLocation/> <a><span>To: </span>{ride.locationTo}</a></div>
            </div>
            <div className="rideInfo">
              <div className="Departure"><BsFillClockFill/> <a><span>Date: </span>{ride.rideDate.split("T")[0]}</a></div>
              <div className="Departure"><BsFillClockFill/> <a><span>Time: </span>{ride.rideTime}</a></div>
              <div className="Capcity"><BsPeople/> <a><span>Remaining Capacity: </span>{ride.remainingCapacity}/{ride.maxCapacity}</a></div>
            </div>
            <div className="selectRide">
            <Button variant="danger" onClick={() => { this.handleClick(ride._id, ride.email) }} >Delete Ride</Button>{' '}
            <Button variant="dark">Disable Ride</Button>{' '}
            </div>
            
            
            </div>)
          }
         
      </div>
        
         
      </div>


      

      
           
      </div>
      
    );
  }
}


export default ManageRides;
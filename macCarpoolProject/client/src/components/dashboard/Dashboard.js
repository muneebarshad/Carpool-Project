import React, { Component } from "react";
import Navbar from "../layout/NavBar.js"
import './dashboard.css';
import { Button } from 'react-bootstrap';
import { BsPersonFill,BsFillClockFill, BsPeople } from "react-icons/bs";
import { MdMyLocation  } from "react-icons/md";
import {  GoLocation } from "react-icons/go";
import jwt_decode from "jwt-decode";
import { store } from 'react-notifications-component';


class Dashboard extends Component {

  constructor(props){
    super(props);
    this.state={
      getRides:[],
      selectedRides:[]
    }

  }

  callAPI(){
    fetch("/api/ride/getRides")
      .then(res => res.json())
      .then(res => this.setState({getRides: res}));

  }

  callAPI2(){
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
        
    fetch("/api/ride/getSelectedRides", request)
      .then(res => res.json())
      .then(res => this.setState({selectedRides: res.data.selectedRides}));

  }

  componentWillMount(){
    this.callAPI();
    this.callAPI2();

  }


  
handleClick = (rideId) => {
  // Set auth token header auth
   const token = localStorage.jwtToken;
// Decode token and get user info and exp
  const decoded = jwt_decode(token);
  
const requestBody = {
    email: decoded.email ,
};

let request = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(requestBody),
};

let URI = "/api/ride/selectRide/" + rideId;

fetch(URI, request).then(res => {
  if(res.status === 201){
    this.callAPI();
    this.props.history.push('/selectedRides');
    store.addNotification({
      title: "Success",
      message: "Ride Selected!",
      type: "success",
      insert: "top",
      container: "bottom-center",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 1000,
        onScreen: false
      }
    });


    
  }else{
    alert("Not able to select Ride")
  }
})

};


render() {
  //If no rides are available add "Ride not available"
  let rideNotAvailable;
  if(this.state.getRides.length === 0){
    rideNotAvailable = <div id="rideNotAvailable">Ride not available</div>
  }

  // If the ride is selected then make change the ride selected state to true
  for (let i = 0; i < this.state.getRides.length; i++) {
    for (let j = 0; j < this.state.selectedRides.length; j++) {
      if( this.state.selectedRides[j]._id === this.state.getRides[i]._id ){
        this.state.getRides[i].selected = true
      }else{
        this.state.getRides[i].selection = false
      }
    } 
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

          {/* If the ride is selected make the button disable */}
           {ride.selected ===false?<div className="selectRide"><Button variant="success" disabled={ride.disabled} onClick={() => { this.handleClick(ride._id) }}>Select Ride</Button></div>:<div className="selectRide"><Button variant="outline-success" disabled={true} >Selected</Button></div>}
            </div>)
          }
         
      </div>
        
         
      </div>


      

      
           
      </div>
      
    );
  }
}


export default Dashboard;
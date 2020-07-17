import { Form, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css';
import Navbar from "./NavBar.js"
import classnames from "classnames";
import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { store } from 'react-notifications-component';
import { BsPersonFill,BsFillClockFill, BsPeople } from "react-icons/bs";
import { MdMyLocation  } from "react-icons/md";
import {  GoLocation } from "react-icons/go";


export default class SelectRide extends Component {
    constructor(props){
        super(props);
        this.state={
          selectedRides:[]
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
            
        fetch("/api/ride/getSelectedRides", request)
          .then(res => res.json())
          .then(res => this.setState({selectedRides: res.data.selectedRides}));
    
      }
    
      componentWillMount(){
        this.callAPI();
      }


    render() {
        let rideNotAvailable;
        if(this.state.selectedRides.length === 0){
            rideNotAvailable = <div id="rideNotAvailable">You have selected no Rides</div>
        }
        return (
            <div>
                <Navbar/>

                <div className="main-container"> 
                    {/* Ride Object */}
                    <div className="rideItems">
                    {/* If ride not available */}
                    {rideNotAvailable}
                    {/* For each ride create html */}
                    {this.state.selectedRides.map(ride =>
                        <div className="rideItem">  
                            <div className="rideInfo">
                            {/* <div className="User"><BsPersonFill/> <a><span>Driver: </span>{ride.email}</a></div> */}
                            <div className="locationFrom"><MdMyLocation/> <a><span>From: </span>{ride.locationFrom}</a></div>
                            <div className="locationFrom"><GoLocation/> <a><span>To: </span>{ride.locationTo}</a></div>
                            </div>
                            <div className="rideInfo">
                            <div className="Departure"><BsFillClockFill/> <a><span>Date: </span>{ride.rideDate.split("T")[0]}</a></div>
                            <div className="Departure"><BsFillClockFill/> <a><span>Time: </span>{ride.rideTime}</a></div>
                            </div>
                            <div className="selectRide">
                                <Button variant="dark" href="/{ride._id}/driver">Driver Info</Button>{' '}
                                <Button variant="danger">Remove Ride</Button>{' '}

                            </div>
                            
                            </div>)
                        }
                        
                    </div>
        
         
            </div>


            </div>
        )
    }
}

import { Form, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css';
import Navbar from "./NavBar.js"
import classnames from "classnames";
import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { store } from 'react-notifications-component';



class CreateRide extends Component {


  constructor(props) {
    super(props);
    this.state = {
      locationFrom: "",
      locationTo: "",
      rideDate: "",
      rideTime: "",
      email:"",
      maxCapacity:"",
      remainingCapacity:"",
      disabled:"",
      errors: {},
      myRides:[],

    };

    this.handleChange = this.handleChange.bind(this);
   

  }

 
//Entering the input will change the state
  handleChange(e){
    this.setState({[e.target.id]: e.target.value});
  }

onSubmit = e => {
    e.preventDefault();
    // Set auth token header auth
     const token = localStorage.jwtToken;
  // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    
const newRideBody = {
      locationFrom:this.state.locationFrom,
      locationTo:  this.state.locationTo ,
      rideDate:  this.state.rideDate ,
      rideTime:  this.state.rideTime ,
      email: decoded.email ,
      maxCapacity: this.state.maxCapacity ,
      remainingCapacity: this.state.maxCapacity ,
      disabled: false
      
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRideBody),
  };

  fetch("/api/ride/createRide", request).then(res => {
    if(res.status === 200){
      this.props.history.push('/myRides');
      store.addNotification({
        title: "Success",
        message: "Ride Created!",
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
      res.json().then(json => {
        this.setState({errors:json})
      })

      
    }

  })

  };
  
  
    render() {
       const { errors } = this.state;
  
      return (
        <div>
          <Navbar/>

          <div className="main-container">
          <Form onSubmit={this.onSubmit}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>From</Form.Label>
                <input value={this.state.locationFrom} 
                id="locationFrom" onChange={this.handleChange} 
                type="text" 
                placeholder="From Location" 
                error={errors.locationFrom} 
                className={classnames("", {
                    invalid: errors.locationFrom
                  })}/>
                <label htmlFor="locationFrom"></label>
                <span className="red-text">{errors.locationFrom}</span>
              </Form.Group>

              <Form.Group as={Col} >
                <Form.Label>To</Form.Label>
                <input value={this.state.locationTo} 
                id="locationTo" 
                onChange={this.handleChange} 
                type="text" 
                placeholder="To Location"
                className={classnames("", {
                  invalid: errors.locationTo
                })}/>
                <label htmlFor="locationTo"></label>
                <span className="red-text">{errors.locationTo}</span>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} >
                <Form.Label>Date</Form.Label>
                <input value={this.state.rideDate} 
                id="rideDate" 
                onChange={this.handleChange} 
                type="date" 
                className={classnames("", {
                  invalid: errors.rideDate
                })}/>
                <label htmlFor="rideDate"></label>
                <span className="red-text">{errors.rideDate}</span>
              </Form.Group>

              <Form.Group as={Col} >
                <Form.Label>Time</Form.Label>
                <input value={this.state.rideTime} 
                id="rideTime" 
                onChange={this.handleChange} 
                type="time" 
                className={classnames("", {
                  invalid: errors.rideTime
                })}/>
                <label htmlFor="rideTime"></label>
                <span className="red-text">{errors.rideTime}</span>
              </Form.Group>

            </Form.Row>

           

            <Form.Row>
              
              <Form.Group as={Col} >
                <Form.Label>Max Capcity</Form.Label >
                <Form.Control as="select" defaultValue="..." 
                value={this.state.maxCapacity} 
                id="maxCapacity" 
                onChange={this.handleChange}
                className={classnames("", {
                  invalid: errors.maxCapacity
                })}
                >
                  <option>...</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                </Form.Control>
                <label htmlFor="maxCapacity"></label>
                <span className="red-text">{errors.maxCapacity}</span>
              </Form.Group>


              
            </Form.Row>

            <Button variant="primary" type="submit">
              Create Ride
            </Button>
          </Form>
          </div>

          
        </div>
        
        
       
      );
    }
  }

export default CreateRide;
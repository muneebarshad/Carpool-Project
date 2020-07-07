import { Form, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css';
import Navbar from "./NavBar.js"

import React, { Component } from "react";


class CreateRide extends Component {

  
    render() {
  
      return (
        <div>
          <Navbar/>

          <div className="main-container">
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="fromLocation">
                <Form.Label>From</Form.Label>
                <Form.Control type="text" placeholder="From Location" />
              </Form.Group>

              <Form.Group as={Col} controlId="toLocation">
                <Form.Label>To</Form.Label>
                <Form.Control type="text" placeholder="To Location" />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="rideDate">
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" placeholder="Date" />
              </Form.Group>

              <Form.Group as={Col} controlId="rideTime">
                <Form.Label>Time</Form.Label>
                <Form.Control type="time" placeholder="Time" />
              </Form.Group>

            </Form.Row>

           

            <Form.Row>
              {/* <Form.Group as={Col} controlId="maxCapacity">
                <Form.Label>Max Capacity</Form.Label>
                <Form.Control type="number" />
              </Form.Group> */}

              <Form.Group as={Col} controlId="maxCapacity">
                <Form.Label>Max Capcity</Form.Label>
                <Form.Control as="select" defaultValue="1">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                </Form.Control>
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
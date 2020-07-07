import { Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css';

import React, { Component } from "react";


class Tab extends Component {

  
    render() {
  
      return (
        <Tabs defaultActiveKey="myRides" >
        
        <Tab eventKey="myRides" title="My Rides">
        </Tab>

        <Tab eventKey="selectedRides" title="Selected Rides">
        </Tab>
        </Tabs>
      );
    }
  }

export default Tab;
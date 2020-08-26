import React, { Component } from 'react'
import Navbar from "./NavBar.js"
import { Table } from 'react-bootstrap';
import "./Layout.css"



export default class DriverInfo extends Component {

    constructor(props){
        super(props);
        this.state={
          driver:[]
        }
    
      }
    
    callAPI(){
        var id = window.location.pathname.split("/")[1]

        let request = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.jwtToken 

            },
        };
            
        fetch("/api/ride/getSelectedRides/driverInfo/"+id ,request)
        .then(res => res.json())
        .then(res => this.setState({driver: res}));

    }

    componentWillMount(){
        this.callAPI();

    }

    render() {
        const driver = this.state.driver;
        return (
            <div>
                <Navbar/>

                <div className="main-container">
                    
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>{driver.driverName}</td>
                        <td>{driver.driverEmail}</td>
                        <td>{driver.driverPhone}</td>
                        </tr>
                    </tbody>
                </Table>
                </div>



            </div>
        )
    }


}

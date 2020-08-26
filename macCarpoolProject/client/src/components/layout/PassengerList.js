import React, { Component } from 'react'
import Navbar from "./NavBar.js"
import { Table } from 'react-bootstrap';
import "./Layout.css"



export default class DriverInfo extends Component {

    constructor(props){
        super(props);
        this.state={
          passengerList:[]
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
            
        fetch("/api/ride/getMyRides/passengerList/"+id ,request)
        .then(res => res.json())
        .then(res => this.setState({passengerList: res}));

    }

    componentWillMount(){
        this.callAPI();

    }

    render() {
        const passengerList = this.state.passengerList;
        return (
            <div>

                <Navbar/>
                <div className="main-container"> 

                    {passengerList.length ===0?<div class="rideNotAvailable">Ride has no passengers</div>:
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                </tr>
                            </thead>
                            {this.state.passengerList.map((passenger,index) =>
                                
                                <tbody>
                                    <tr>
                                    <td>{index+1}</td>
                                    <td>{passenger.passengerName}</td>
                                    <td>{passenger.passengerEmail}</td>
                                    <td>{passenger.passengerPhone}</td>
                                    </tr>
                                </tbody>    
                            )}
                            
                        </Table>
                    }
                
                </div>                
            </div>
        )
    }


}

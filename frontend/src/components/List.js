import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class List extends Component {
    constructor(){
        super();
        this.state = { users : [] }
        //Bind the handlers to this class
        this.deleteUser = this.deleteUser.bind(this);
    }
    //get the users data from backend  
    componentDidMount(){
        axios.get('http://localhost:5001/list')
                .then((response) => {
                //update the state with the response data
                console.log(response.data);
                this.setState({
                    users : this.state.users.concat(response.data) 
                });
        });
    }

    logout = () => {
        cookie.remove('cookie', {path: '/'})
        console.log("Cookie removed!")
        window.location = "/"
    }

    //delete user handler to send a delete request to the node backend
    deleteUser = (e, deleteID) => {
        console.log("Inside delete User");
        console.log("ID to be deleted is ", deleteID);
        //prevent page from refresh
        e.preventDefault();
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        var url = "http://localhost:5001/delete/" + deleteID;
        console.log("URL is ", url);
        axios.delete(url)
            .then(response => {
                console.log("Delete Status Code : ", response.status);
                if(response.status === 200){
                    console.log("response.data is", response.data);
                    this.setState({users: []});
                    this.setState({
                        users : this.state.users.concat(response.data)
                    })
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                alert("Deleting User Unsuccessful :(");
            })
        
    }

    render(){
        //iterate over users to create a table row
        let details = this.state.users.map((user) => {
            return(
                <tr>
                    <td style={{outline: "thin solid"}}>{user.name}</td>
                    <td style={{outline: "thin solid"}} key={user.studentID}>{user.studentID}</td>
                    <td style={{outline: "thin solid"}}>{user.department}</td>
                    <td style={{outline: "thin solid"}}>
                        <input onClick={(e) => this.deleteUser(e, user.studentID)} type="submit" name="DeleteBtn" class="btn btn-danger" value="Delete"/>
                    </td>
                </tr>
            )
        })
        //if not logged in go to login page
        let redirectVar = null;
        console.log ("cookie in list.js is", cookie.load('cookie'));
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/"/>
        }
        console.log ("redirectVar in list.js is", redirectVar);
        return(
            <div>
                {redirectVar}
                <div class="container">
                    <h3 align="center">User Report</h3>
                    <ul class="nav nav-pills">
                    <h4><a align="center" href="/create">Create an User</a>
                    <a style={{float: "right"}} href="#" onClick= {this.logout} >Logout </a></h4>
                    </ul>
                </div>
                <div class="container">
                    <table class="table" style={{outline: "thin solid"}} border="1px solid black">
                        <thead>
                            <tr style={{outline: "thin solid"}}>
                                <th bgcolor="yellow">Name</th>
                                <th bgcolor="yellow">Student ID</th>
                                <th bgcolor="yellow">Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/*Display the Table row based on data recieved*/}
                            {details}   
                        </tbody>
                    </table>   
                </div> 
            </div> 
        )
    }
}

//export List Component
export default List;
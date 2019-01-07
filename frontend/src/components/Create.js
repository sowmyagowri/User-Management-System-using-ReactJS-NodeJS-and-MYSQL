import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Create extends Component{

    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            Name : "",
            StudentID : "",
            Department : "",
            posted : false
        }
        //Bind the handlers to this class
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.studentIDChangeHandler = this.studentIDChangeHandler.bind(this);
        this.departmentChangeHandler = this.departmentChangeHandler.bind(this);
        this.addUser = this.addUser.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            posted : false
        })
    }
    //Name change handler to update state variable with the text entered by the user
    nameChangeHandler = (e) => {
        this.setState({
            Name : e.target.value
        })
    }
    //StudentID change handler to update state variable with the text entered by the user
    studentIDChangeHandler = (e) => {
        this.setState({
            StudentID : e.target.value
        })
    }
    //Department change handler to update state variable with the text entered by the user
    departmentChangeHandler = (e) => {
        this.setState({
            Department : e.target.value
        })
    }
    handleValidation(){
        let formIsValid = true;

        //Name
        if(!this.state.Name){
           formIsValid = false;
           alert("Name is a Required field");
           console.log("Name cannot be empty");
        } else if(typeof this.state.Name !== "undefined"){
            if(!this.state.Name.match(/^[a-zA-Z ]+$/)){
                formIsValid = false;
                alert("Name cannot contain numbers");
                console.log("Name cannot contain numbers");
            }
        }     

        //StudentID
        if(!this.state.StudentID){
            formIsValid = false;
            alert("StudentID is a Required field");
            console.log("Student ID cannot be empty");
        }     

         //Department
        if(!this.state.Department){
            formIsValid = false;
            alert("Department is a Required field");
            console.log("Department cannot be empty");
         } else if(typeof this.state.Department !== "undefined"){
            if(!this.state.Department.match(/^[a-zA-Z ]+$/)){
                formIsValid = false;
                alert("Department cannot contain numbers");
                console.log("Department cannot contain numbers");
            }
        }   
       return formIsValid;
   }
    //submit Login handler to send a request to the node backend
    addUser = (e) => {
        console.log("Inside Add User");
        //prevent page from refresh
        e.preventDefault();
        if(this.handleValidation()){
            const data = {
                Name : this.state.Name,
                StudentID : this.state.StudentID,
                Department : this.state.Department
            }
            //set the with credentials to true
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:5001/create',data)
                .then(response => {
                    console.log("Status Code : ", response.status);
                    if(response.status === 200){
                        this.setState({
                            posted : true
                        })
                    }
                    console.log("this.state.posted", this.state.posted);
                })
                .catch(error => {
                    console.log("In error");
                    this.setState({
                        posted : false
                    });
                    console.log(error.response.status);
                    alert("Adding User Unsuccessful :(");
                })
        }
    }

    logout = () => {
        cookie.remove('cookie', {path: '/'})
        console.log("Cookie removed!")
        window.location = "/"
    }

    //Clear the form on reset
    clearForm = (e) => {
        document.getElementById("create-user-form").reset();
    }

    render(){
       //redirect based on successful login
       let redirectVar = null;
       console.log ("cookie in create.js is", cookie.load('cookie'));
       if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/"/>
       }
       if (this.state.posted){
            redirectVar = <Redirect to= "/list"/>
       }
       console.log ("redirectVar in create.js is", redirectVar);
       return(
           <div>
               {redirectVar}
            <div class="col-md-5 col-md-offset-5">
                <h3> User Information</h3>
                <ul class="nav nav-pills">
                <h4>
                    <a href="/list">List Users</a>
                    <a style={{float: "right"}} href="#" onClick= {this.logout} >Logout </a>
                </h4>
                </ul>
            </div>
            <p></p>
            <br/>
            <div class="col-md-5 col-md-offset-5">
            <br/>
            <form id="create-user-form">
                <div style={{width: '35%'}} class="form-group">
                    <input onChange = {this.nameChangeHandler} type="text" class="form-control" name="Name" placeholder="Name">
                    </input>
                </div>
                <br/>
                <div style={{width: '35%'}} class="form-group">
                    <input onChange = {this.studentIDChangeHandler} type="number" min = "0" class="form-control" name="StudentID" placeholder="Student ID">
                    </input>
                </div>
                <br/>
                <div style={{width: '35%'}} class="form-group">
                    <input onChange = {this.departmentChangeHandler} type="text" class="form-control" name="Department" placeholder="Department">
                    </input>
                </div>
                <br/>
                <div style={{width: '35%'}} class="form-group">
                    <button onClick = {this.clearForm} type="reset" class="btn btn-warning">Reset</button>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    <button onClick = {this.addUser} type="submit" class="btn btn-success">Add a User</button>
                </div>
            </form>
        </div>
        </div>
        )
    }
}

export default Create;
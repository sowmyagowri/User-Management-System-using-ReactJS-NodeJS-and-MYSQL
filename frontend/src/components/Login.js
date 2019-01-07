import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

//Define a Login Component
class Login extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username : "",
            password : "",
            authFlag : false
        }
        cookie.remove('cookie', { path: '/' });
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
        this.setState({
            username : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    handleValidation(){
        let formIsValid = true;

        //username
        if(!this.state.username){
           formIsValid = false;
           alert("Login ID is a Required field");
           console.log("Login ID cannot be empty");
        }

        //Password
        if(!this.state.password){
            formIsValid = false;
            alert("Password is a Required field");
            console.log("Password cannot be empty");
         }
       return formIsValid;
   }
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        console.log("Inside submit login");
        //prevent page from refresh
        e.preventDefault();
        if(this.handleValidation()){
            const data = {
                username : this.state.username,
                password : this.state.password
            }
            //set the with credentials to true
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:5001/login',data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        this.setState({
                            authFlag : true
                        })
                    }
                })
                .catch(error => {
                    console.log("In error");
                    this.setState({
                        authFlag : false
                    });
                    console.log(error);
                    alert("Authentication Unsuccessful :(");
                })
        }
    }

    render(){
        //redirect based on successful login
        let redirectVar = null;
        console.log ("cookie is", cookie.load('cookie'));
        if(cookie.load('cookie')){
            redirectVar = <Redirect to= "/create"/>
        }
        return(
            <div>
                {redirectVar}
                <div class="container">
                <div class="col-sm-4 col-sm-offset-4">
                    <h1 align="center"> Login</h1>
                    <br/>
                    <div class="login-form">
                        <div class="form-group">
                            <label>Username</label>
                            <input onChange = {this.usernameChangeHandler} type="text" class="form-control" name="username" ></input>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" ></input>
                        </div>
                        <button onClick = {this.submitLogin} type="submit" class="btn btn-success" style={{position: 'relative'}}>Submit</button> 
                    </div>
                </div>
                </div>
            </div>
        )
    }
}
//export Login Component
export default Login;
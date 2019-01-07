import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login';
import List from './List';
import Create from './Create';
//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={Login}/>
                <Route path="/create" component={Create}/>
                <Route path="/list" component={List}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;
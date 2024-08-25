import React from'react';
import Houses from './components/Products/product';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Registration from './components/Register/registration';
import Login from './components/Login/login';

import './App.css'

function App() {
  

  return (
    
  <Router>
     <Switch>
     <Route path="/products" component={Houses} />
     <Route path="/login" component={Login} />
        <Route path="/register" component={Registration} />
{/* 
       // <Redirect from="/" to="/components/Login/login" /> */}
      </Switch>
    </Router>
    
  )
}

export default App

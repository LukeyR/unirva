import React from 'react';
import './App.css';
import Product from './Product';
import {Route, Link} from 'react-router-dom';

/**
 * This is like a template which will appear on every page of our website. Here we can insert all the backend for switching
 * between tabs as well as a header (nice design) which we can include on every page.
 */

function App() {

  // I used react-router-dom for switching between the pages so far (note that it should be installed using npm install)
  return (
    <div className="App">
      <>If I understand correctly this is kind of like a default page / section which appears for every tab.</>
      <br></br>
      <li><Link to="/Product">Product</Link></li>
      <Route exact path="/Product" component={Product}/>
    </div>
  );
}

export default App;

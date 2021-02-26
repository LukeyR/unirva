import React from 'react';
import './App.css';
import Product from './Product';
import Chat from './Chat';
import Home from './Home';
import Profile from './Profile';
import {Route} from 'react-router-dom';

import NavBar from './hfRegion/NavBar';
import Footer from './hfRegion/Footer';
import SignIn from './SignIn';
import SignOut from './SignOut';
import {auth} from "./firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import DisplayProduct from './DisplayProduct';

/**
 * This is like a template which will appear on every page of our website. Here we can insert all the backend for switching
 * between tabs as well as a header (nice design) which we can include on every page.
 */

function App() {
  const [user] = useAuthState(auth);
  // I used react-router-dom for switching between the pages so far (note that it should be installed using npm install)
  return (
    <div className="App">
      <NavBar />
      <>Yes, whatever is put here is displayed on every page.</>
      <Route exact path="/Profile" component={Profile} />
      <Route exact path="/Home" component={Home} />
      <Route exact path="/Product" component={Product} />
      <Route exact path="/Chat" component={Chat} />
      <Route exact path="/DisplayProduct" component={DisplayProduct} />
      <Route exact path="/SignIn" component={SignIn} />
      <Route exact path="/SignOut" component={SignOut} />
      <Footer />
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import Product from './Product';
import Chat from './Chat';
import Home from './Home';
import Profile from './Profile';
import {Route, useLocation} from 'react-router-dom';
import NavBar from './hfRegion/NavBar';
import Footer from './hfRegion/Footer';
import Menu from "./authentication/Menu";
import SignIn from './SignIn';
import SignOut from './SignOut';
import {auth} from "./firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import DisplayProduct from './DisplayProduct';

function HideHeader() {
    const location = useLocation();

     if (location.pathname !== "/menu") {
         return (
             <>
                 <NavBar/>
                 <>Yes, whatever is put here is displayed on every page.</>
             </>
         )
     } else {
         return <></>
     }
}

/**
 * This is like a template which will appear on every page of our website. Here we can insert all the backend for switching
 * between tabs as well as a header (nice design) which we can include on every page.
 */

function App() {

  const location = useLocation();

  const [user] = useAuthState(auth);
  // I used react-router-dom for switching between the pages so far (note that it should be installed using npm install)
  return (
      <div>
    <div className="App">
      <NavBar />
      <>Yes, whatever is put here is displayed on every page.</>
      <Route exact path="/Profile" component={Profile} />
      <Route exact path="/Product" component={Product} />
      <Route exact path="/Chat" component={Chat} />
      <Route exact path="/DisplayProduct" component={DisplayProduct} />
      <Route exact path="/SignIn" component={SignIn} />
      <Route exact path="/SignOut" component={SignOut} />
        {location.pathname === "/" ? <Home/> : <></>}
      <Footer />
    </div>
          <Route exact path = "/Menu" component={Menu} />
    </div>
  );
}

export default App;

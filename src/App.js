import React from 'react';
import './App.css';
import Product from './Product';
import Chat from './Chat';
import Home from './Home';
import Profile from './Profile';
import {Route, useLocation} from 'react-router-dom';
import Header from './hfRegion/Header';
import Footer from './hfRegion/Footer';
import Menu from "./authentication/Menu";
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";
import DisplayProduct from './DisplayProduct';
import EditProduct from "./EditProduct";
import ChatRoom from './ChatRoom';

const ignorePages = ["/menu", "/login", "/register", "/signin" ]

function HideFooter() {
    const location = useLocation();

    return !ignorePages.includes(location.pathname.toString()) ? (
        <>
            <Footer />
        </>
    ) : <></>;
}

/**
 * This is like a template which will appear on every page of our website. Here we can insert all the backend for switching
 * between tabs as well as a header (nice design) which we can include on every page.
 */

function App() {

    const location = useLocation();

    // I used react-router-dom for switching between the pages so far (note that it should be installed using npm install)
    return (
        <div>
            <div className="App">
                <Header/>
                <Route exact path="/Profile" component={Profile}/>
                <Route exact path="/Product" component={Product}/>
                <Route exact path="/Chat" component={Chat}/>
                <Route exact path="/DisplayProduct" component={DisplayProduct}/>
                <Route exact path="/SignIn" component={Login}/>
                <Route exact path="/LogIn" component={Login}/>
                <Route exact path="/SignOut" component={Logout}/>
                <Route exact path="/EditProduct" component={EditProduct}/>
                <Route exact path="/ChatRoom" component={ChatRoom}/>
                <Route exact path="/Logout" component={Logout}/>
                {location.pathname === "/" ? <Home/> : <></>}
                {HideFooter()}
            </div>
            <Route exact path="/Menu" component={Menu}/>
        </div>
    );
}

export default App;

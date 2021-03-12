import React from 'react';
import './App.css';
import Product from './Product';
import Chat from './Chat';
import Home from './Home';
import Profile from './Profile';
import Register from './authentication/Register';
import {Route, useLocation} from 'react-router-dom';

import Search from './search'
import Header from './hfRegion/Header';
import Footer from './hfRegion/Footer';
import Menu from "./authentication/Menu";
import Logout from "./authentication/Logout";
import SignIn from './authentication/SignIn';
import {AuthProvider} from './Auth';
import {auth} from "./firebase";
import {useAuthState} from 'react-firebase-hooks/auth';
import DisplayProduct from './DisplayProduct';
import EditProduct from "./EditProduct";
import ChatRoom from './ChatRoom';
import {ThemeProvider} from "@material-ui/styles";
import {createMuiTheme, CssBaseline} from "@material-ui/core";
import {deepOrange, orange} from "@material-ui/core/colors";
import lightBlue from "@material-ui/core/colors/lightBlue";
import pink from "@material-ui/core/colors/pink";
import {useDocumentData} from "react-firebase-hooks/firestore";
import firebase from "./firebase";
import Favourites from "./Favourites";

const ignorePages = ["/menu", "/login", "/register", "/signin", "/menu", "/product"]



function HideFooter() {
    const location = useLocation();

    return !ignorePages.includes(location.pathname.toString()) ? (
        <>
            <Footer/>
        </>
    ) : <></>;
}


const firestore = firebase.firestore();

/**
 * This is like a template which will appear on every page of our website. Here we can insert all the backend for switching
 * between tabs as well as a header (nice design) which we can include on every page.
 */

function App() {
    const location = useLocation();
    const [user] = useAuthState(auth);


    const lightTheme = () =>({
        palette: {
            type: "light",
            primary: {
                main: lightBlue[400],
            },
            secondary: {
                main: pink[500],
            },
        },
    });


    const darkTheme = () => ({
            palette: {
                type: "dark",
                primary: {
                    main: orange[500],
                },
                secondary: {
                    main: deepOrange[500],
                },
            },
    });

    let userID = null;
    let userDocRef = null;
    if(user) {
        userID = user.uid;
        const usersRef = firestore.collection("users");
        userDocRef = usersRef.doc(userID)
    }

    const [userDoc, loadingUserDoc] = useDocumentData(userDocRef);

    let muiTheme = createMuiTheme(lightTheme())
    if (!loadingUserDoc && user && userDoc !== undefined) muiTheme = (userDoc.darkModeEnable) ? createMuiTheme(darkTheme()) : createMuiTheme(lightTheme())

    // I used react-router-dom for switching between the pages so far (note that it should be installed using npm install)
    return (
        <AuthProvider>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline/>
                <div className="App">
                    <Header theme={muiTheme}/>
                    {/*<>Yes, whatever is put here is displayed on every page.</>*/}
                    <Route exact path="/Profile" render={() => (<Profile {...muiTheme} isAuthed={true}/>)}/>
                    <Route exact path="/Product" component={Product}/>
                    <Route exact path="/Chat" component={Chat}/>
                    <Route exact path="/Favourites" component={Favourites}/>
                    <Route exact path="/search:results" component={Search}/>
                    <Route exact path="/DisplayProduct" component={DisplayProduct}/>
                    <Route exact path="/SignIn" component={SignIn}/>
                    <Route exact path="/Register" component={Register}/>
                    <Route exact path="/EditProduct" component={EditProduct}/>
                    <Route exact path="/ChatRoom" component={ChatRoom}/>
                    <Route exact path="/Logout" component={Logout}/>
                    <Route exact path="/signout" component={Logout}/>
                    {location.pathname === "/" ? <Home/> : <></>}
                    {HideFooter()}
                </div>
                <Route exact path="/Menu" component={Menu}/>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;

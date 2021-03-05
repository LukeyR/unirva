import React, {useState} from 'react';
import './App.css';
import Product from './Product';
import Chat from './Chat';
import Home from './Home';
import Profile from './Profile';
import Register from './authentication/Register';
import {Route, useLocation} from 'react-router-dom';

import Search from './search'
import NavBar from './hfRegion/NavBar';
import Header from './hfRegion/Header';
import Footer from './hfRegion/Footer';
import Menu from "./authentication/Menu";
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";
import SignIn from './authentication/SignIn';
import {AuthProvider} from './Auth';
import {auth} from "./firebase";
import {useAuthState} from 'react-firebase-hooks/auth';
import DisplayProduct from './DisplayProduct';
import {AuthContext} from './Auth';
import EditProduct from "./EditProduct";
import ChatRoom from './ChatRoom';
import {ThemeProvider} from "@material-ui/styles";
import {createMuiTheme, CssBaseline} from "@material-ui/core";
import {deepOrange, orange} from "@material-ui/core/colors";
import lightBlue from "@material-ui/core/colors/lightBlue";
import pink from "@material-ui/core/colors/pink";

const ignorePages = ["/menu", "/login", "/register", "/signin", "/menu", "/product"]


function HideFooter() {
    const location = useLocation();

    return !ignorePages.includes(location.pathname.toString()) ? (
        <>
            <Footer/>
        </>
    ) : <></>;
}


/**
 * This is like a template which will appear on every page of our website. Here we can insert all the backend for switching
 * between tabs as well as a header (nice design) which we can include on every page.
 */

function App() {
    const location = useLocation();
    const [user] = useAuthState(auth);

    const [theme, setTheme] = useState({
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

    const toggleDarkTheme = () => {
        let newPaletteType = theme.palette.type === "light";
        setTheme({
            palette: {
                type: newPaletteType ? "dark" : "light",
                primary: {
                    main: newPaletteType ? orange[500] : lightBlue[400],
                },
                secondary: {
                    main: newPaletteType ? deepOrange[500] : pink[500],
                },
            },
        });
    };

    const muiTheme = createMuiTheme(theme);


    // I used react-router-dom for switching between the pages so far (note that it should be installed using npm install)
    return (
        <AuthProvider>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline/>
                <div className="App">
                    <Header theme={muiTheme} onToggleDark={toggleDarkTheme}/>
                    {/*<>Yes, whatever is put here is displayed on every page.</>*/}
                    <Route exact path="/Profile" component={Profile}/>
                    <Route exact path="/Product" component={Product}/>
                    <Route exact path="/Chat" component={Chat}/>
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

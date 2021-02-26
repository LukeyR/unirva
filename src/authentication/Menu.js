import React from 'react';
import "./Menu.css";
import {Grid} from "@material-ui/core"
import Header from "../hfRegion/Header";
import Content from "./MenuContent.jsx";

function Menu() {
    return (
        <div className="Menu">
            {/*<Header/>*/}
            <Grid container direction="column">
                <Grid item container>
                        <Content/>
                </Grid>
            </Grid>
        </div>

        /*<div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

            <div className='logIn'>
                <img src={brandLogo} alt="Brand Logo" />
                <div className='button' onClick={() => loginOnClick("Log In")}><p>Log In</p></div>
                <p>or sign in with:</p>
                <div className='buttonExternalService' onClick={() => loginOnClick("Google")} >
                    <p>Google</p>
                    <img src={googleLogo} alt="Google logo"/>
                </div>
                <div className='buttonExternalService' onClick={() => loginOnClick("Apple")} ><p>Apple</p></div>
                <div className='button' onClick={() => loginOnClick("Register")}><p>Register</p></div>
            </div>
        </div>*/
    )
}

export default Menu;
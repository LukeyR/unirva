import React from 'react';
import {Grid} from "@material-ui/core";
import Content from "./LoginContent";
import {useStyles} from "./Menu";

function Login() {
    const classes = useStyles()

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <Grid item container>
                <div className={classes.div}>
                    <Content />
                </div>
            </Grid>
        </div>
    )
}

export default Login;
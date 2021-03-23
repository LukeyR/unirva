import React from 'react';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import {useHistory} from "react-router-dom";
import {Button, ButtonGroup, Card, CardActions, CardContent, CardMedia,} from "@material-ui/core";
import brandLogo from "../img/Brandlogo.svg";
import {useStyles} from "./Menu";


const Header = () => {
    const [user, loading] = useAuthState(auth);
    const history = useHistory();
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="contained"> {/*Need outline as we remove border in css*/}
            <CardContent>
                <CardMedia className={classes.media} image={brandLogo} title="Brand Logo"/>
            </CardContent>

            {/*log in button*/}
            <CardActions className={classes.cardActions}>
                <ButtonGroup>
                    <Button onClick={() => {
                        // loginOnClick("Log in")
                    }} className={classes.button}>
                        Log In
                    </Button>
                </ButtonGroup>
            </CardActions>
        </Card>
    )
}

export default Header;
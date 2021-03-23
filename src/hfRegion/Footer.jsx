import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {useHistory} from "react-router-dom";
import {Tooltip} from "@material-ui/core";
import {auth} from "../firebase";
import {useAuthState} from "react-firebase-hooks/auth";

const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    Button: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
    circle: {
        position: `fixed`,
        bottom: `5%`,
        left: `5%`,
        zIndex: `99`,
    },
}));


function Footer() {
    const classes = useStyles();
    const history = useHistory();
    const [user] = useAuthState(auth);


    return (
        <Tooltip title="Add Listing" aria-label="Add listing">
            {user ?
                <div className={classes.circle} onClick={() => {
                    history.push("/product")
                }}>
                    <Fab color="secondary" size="large" aria-label="Add Listing">
                        <AddIcon/>
                    </Fab>
                </div>
                : <></>}
        </Tooltip>
    )
}

export default Footer;
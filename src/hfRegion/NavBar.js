import React from 'react';
import {Link} from 'react-router-dom';
import "./NavBar.css"
import {makeStyles} from "@material-ui/styles";
import auth from "../firebase";
import {useAuthState} from "react-firebase-hooks/auth";

const profilePictureSize = "35"

const useStyles = makeStyles(() => ({
    circle: {
        borderRadius: "50%",
        height: {profilePictureSize},
        width: {profilePictureSize},
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

function NavBar() {
    const [user, loading, error] = useAuthState(auth);

    const classes = useStyles();

    return (
        <div className="NavBar">
            <div className="leftSide">
                <input type="text" placeholder="Search.."/>
                <button>Search</button>
                {/*<Link className="link" to="/Search">Search</Link>*/}
            </div>
            <div className="rightSide">
                <Link className="link" to="/menu">Sign in</Link>
                <Link className="link" to="/Profile">Profile</Link>
            </div>
        </div>
    )
}

export default NavBar;
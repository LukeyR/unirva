import React from 'react';
import {auth} from "../firebase";
import {useHistory} from "react-router-dom";

function Logout() {
    const history = useHistory();

    const logout = () => {
        auth.signOut().then(() => {
            history.push("/menu");
        })
    }

    return (
        <>
            {logout()}
        </>
    )
}

export default Logout;
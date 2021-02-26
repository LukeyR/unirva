import React from 'react';
import {Link} from 'react-router-dom';
import './Footer.css';


function Footer(){
    return(
        <div className="Footer">
            <div className="left">
                <Link className="link" to="/Home">Home</Link>
            </div>
            <div className="middle">
                <Link className="link" to="/Product">Add Listing</Link>
            </div>
            <div className="right">
                <Link className="link" to="/Chat">Chat</Link>
            </div>
        </div>
    )
}

export default Footer;
import React from 'react';
import {Link} from 'react-router-dom';
import "./NavBar.css"


function NavBar(){

    return(
        <div className="NavBar">
            <div className="leftSide">
                <input type="text" placeholder="Search.."/>
                <button>Search</button>
                {/*<Link className="link" to="/Search">Search</Link>*/}
            </div>
            <div className="rightSide">
                <Link className="link" to="/Profile">Profile</Link>
            </div>
        </div>
    )
}

export default NavBar;
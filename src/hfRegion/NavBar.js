import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import "./NavBar.css";
import Search from "../search";


function NavBar(){

    const [inputData, setInputData] = useState(null);
    const [search, setSearch] = useState(false);

    function getData(val){
        setInputData(val.target.value);
        setSearch(false);
    }

    return(
        <div className="NavBar">
            <div className="leftSide">
                <input type="text" className="search-box" placeholder="Search.." onChange={getData} />
                {/*<Link to={{pathname: `/search=${inputData}`, state:[{index: 1, iD: inputData}]}}> */}
                <Link to={{pathname: `/search=${inputData}`}}>
                    <button onClick={() => setSearch(true)} type="submit">Search</button>
                </Link>
            </div>
            <div className="rightSide">
                <Link className="link" to="/Profile">Profile</Link>
            </div>
        </div>
    )
}

export default NavBar;
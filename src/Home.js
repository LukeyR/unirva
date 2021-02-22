import React from 'react';
import ReactLogo from './logo.svg';
import './Home.css';

function Home(){
    return(
        <div>
            <h1><code>Testing what would work best. </code></h1>
            <h2>Categories</h2>
            <button>A</button>
            <button>B</button>
            <button>C</button>
            <button>More Categories</button> 
            <h2>Listings in Bath</h2>
            <div className="listingRow1">
                <button>Prod1</button>
                <button>Prod2</button>
                <button>Prod3</button>
                <button>Prod4</button>
            </div>
            
            <div className="listingRow">
                <div className="product">
                    <img src={ReactLogo} alt='react logo' className='productImage' />
                    <p className='productTitle' >Listing 1</p>
                    <p className='productPrice' >Price: £0.00</p>
                </div>
                <div className="product">
                    <img src={ReactLogo} alt='react logo' className='productImage' />
                    <p className='productTitle' >Listing 2</p>
                    <p className='productPrice' >Price: £0.00</p>
                </div>
                <div className="product">
                    <img src={ReactLogo} alt='react logo' className='productImage' />
                    <p className='productTitle' >Listing 3</p>
                    <p className='productPrice' >Price: £0.00</p>
                </div>
            </div>
        </div>
    )
}

export default Home;
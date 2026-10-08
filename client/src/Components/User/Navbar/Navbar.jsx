import React from 'react'

import { Link } from "react-router-dom";


import { CiSearch, CiShoppingCart, CiBellOn, } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";


import './Navbar.css'

const Navbar = () => {
    return (
        <div className='navbar'>
            <h1>
                <Link to="/">Fragranzia</Link>
            </h1>
            <nav>
                <ul className="abo">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/products">Products</Link>
                    </li>
                    {/* <li>
                        <Link to="/gifting">Gifting</Link>
                    </li> */}
                    <li>
                        <Link to="/about">About</Link>                    </li>
                    <li className="search">
                        <CiSearch /><input type="search" placeholder="Search Here" />

                    </li>
                    <li>
                        <Link to="/cart">
                            <CiShoppingCart />
                        </Link>
                    </li>

                    <li>

                        <Link to="/wish"><IoHeartOutline /></Link>
                    </li>
                    <li>
                        <Link to="/profile"><IoPersonOutline /></Link>

                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
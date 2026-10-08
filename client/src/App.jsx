import React from 'react';

import {
    Routes,
    Route
} from 'react-router-dom';

import AdminProtectedRoute from "./Components/Protected-Route/AdminProtectedRoute";
import UserProtectedRoute from "./Components/Protected-Route/UserProtectedRoute";


import SignIn from './Pages/User/SignIn';
import SignUp from './Pages/User/SignUp';

import Cart from './Pages/User/Cart/Cart';

import Checkout from './Pages/User/Checkout/Checkout';
import Payment from './Pages/User/Payment/Payment';
import Profile from './Pages/User/Profile/Profile';

import AdminLayout from './Components/Layout/AdminLayout';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import Products from './Pages/Admin/Products/Products';
import Customers from './Pages/Admin/Customers/Customers';
import Offers from './Pages/Admin/Offers/Offers';
import Categories from './Pages/Admin/Categories/Categories';
import Orders from './Pages/Admin/Orders/Orders';

import About from './Pages/User/About/About';

import ProductDetails from './Pages/User/Product/ProductDetails';
import Home from './Pages/User/Home/Home';
import AddProduct from './Pages/Admin/AddProduct/AddProduct';
import AllProducts from './Pages/User/Product/AllProducts';
import Wishlist from './Pages/User/WishList/WishList';


const App = () => {

    return (

        <Routes>




            {/* HOME */}

            <Route
                path="/"
                element={<Home />}
            />


            {/* SIGN IN */}

            <Route
                path="/signin"
                element={<SignIn />}
            />


            {/* SIGN UP */}

            <Route
                path="/signup"
                element={<SignUp />}
            />


            {/* ALL PRODUCTS */}

            <Route
                path="/products"
                element={<AllProducts />}
            />


            {/* PRODUCT DETAILS */}

            <Route
                path="/product/:id"
                element={<ProductDetails />}
            />


            <Route element={<UserProtectedRoute />}>

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/wish"
                    element={<Wishlist />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/payment"
                    element={<Payment />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

            </Route>
            {/* ABOUT */}

            <Route
                path="/about"
                element={<About />}
            />




            {/* ADMIN */}

            <Route element={<AdminProtectedRoute />}>

                <Route
                    path="/admin"
                    element={<Dashboard />}
                />

                <Route
                    path="/admin/products"
                    element={<Products />}
                />

                <Route
                    path="/admin/customers"
                    element={<Customers />}
                />

                <Route
                    path="/admin/offers"
                    element={<Offers />}
                />

                <Route
                    path="/admin/orders"
                    element={<Orders />}
                />

                <Route
                    path="/admin/categories"
                    element={<Categories />}
                />

                <Route
                    path="/admin/add-product"
                    element={<AddProduct />}
                />

                <Route
                    path="/admin/add-product/:id"
                    element={<AddProduct />}
                />

            </Route>

        </Routes>

    );

};


export default App;

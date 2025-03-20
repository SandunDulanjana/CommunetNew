import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs'
import Rules from './pages/Rules'
import LogIn from './pages/LogIn'
import Register from './pages/Register'
import RUserProfile from "./pages/RUserProfile";
import Navbar from './componenets/Navbar';


function App() {
  return (
    <div className='mx-4 sm:max-[10%]:'>
      <Navbar />
      <Routes>
        <Route path='/' element = {<Home/>}></Route>
        <Route path='/AboutUs' element = {<AboutUs/>}></Route>
        <Route path='/ContactUs' element = {<ContactUs/>}></Route>
        <Route path='/Rules' element = {<Rules/>}></Route>
        <Route path='/LogIn' element = {<LogIn/>}></Route>
        <Route path='/Register' element = {<Register/>}></Route>
        <Route path='/RUserProfile' element = {<RUserProfile/>}></Route>
      </Routes>
    </div>
  );
}

export default App;


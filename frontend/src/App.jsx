import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './componenets/Navbar';
import AboutUs from './pages/AboutUs';

import AdminPage from '../src/pages/AdminPage';
import Adminadd from '../src/pages/Adminadd'
import AdminUpdate from '../src/pages/AdminUpdate'


import AddMaintenance from './pages/AddMaintenance';
import AddElection from '../src/pages/AddElection'
import AddEvent from './pages/AddEvent';
import ContactUs from './pages/ContactUs'

import Rules from './pages/Rules'
import LogIn from './pages/LogIn'
import Register from './pages/Register'
import RUserProfile from "./pages/RUserProfile";

import Election  from '../src/pages/Election'
import Event  from '../src/pages/Event'
import MyEvents from '../src/pages/MyEvents'
import MyMaintance from './pages/MyMaintance';

import CommuniCoPage from '../src/pages/CommuniCoPage';
import ElectionCoPage from '../src/pages/ElectionCoPage';
import EventCoPage from '../src/pages/EventCoPage';
import FinaceCoPage from '../src/pages/FinaceCoPage';
import MaintanCoPage from '../src/pages/MaintanCoPage';
import UpdatePassword from '../src/pages/setting/UpdatePassword';
import UpdateEmail from '../src/pages/setting/UpdateEmail';
import TwoStepV from '../src/pages/setting/TwoStepV';

import UpdateEvent from './pages/UpdateEvent';
import EditElection from '../src/pages/EditElection'

import BuyPlans from './pages/BuyPlans';
import Checkout from './pages/CheckOut';
import Payment from "./pages/Payment";

import QR from './pages/QR';
import Expences from './pages/Expences'
import EditMaintenance from './pages/EditMaintenance';
import FinanceHome from './pages/FinanceHome';

import Notifications from './pages/notifications';
import Settings from './pages/settings';

import AddRule from './pages/addrule';
import UpdateRule from './pages/updaterule';
import DisplayRules from './pages/displayRules';

function App() {
  return (
    <div className='mx-4 sm:max-[10%]:'>
      <Navbar />
      <Routes>
      <Route path='/' element = {<Home/>}></Route>
      <Route path='/AboutUs' element = {<AboutUs/>}></Route>
      <Route path='/Adminadd' element = {<Adminadd/>}></Route>
      <Route path='/AdminPage' element = {<AdminPage/>}></Route>
      <Route path='//AdminUpdate/:id' element = {<AdminUpdate/>}></Route>

      <Route path='/AddMaintenance' element = {<AddMaintenance/>}></Route>
      <Route path='/addElection' element = {<AddElection/>}></Route>
      <Route path='/AddEvent' element = {<AddEvent/>}></Route>
      <Route path='/ContactUs' element = {<ContactUs/>}></Route>

        <Route path='/Rules' element = {<Rules/>}></Route>
        <Route path='/LogIn' element = {<LogIn/>}></Route>
        <Route path='/Register' element = {<Register/>}></Route>
        <Route path='/RUserProfile' element = {<RUserProfile/>}></Route>

        <Route path='/Election' element = {<Election/>}></Route>
        <Route path='/Event' element = {<Event/>}></Route>
        <Route path='/MyEvents' element = {<MyEvents/>}></Route>
        <Route path='/MyMaintance' element = {<MyMaintance/>}></Route>


        <Route path='/CommuniCoPage' element = {<CommuniCoPage/>}></Route>
        <Route path='/ElectionCoPage' element = {<ElectionCoPage/>}></Route>
        <Route path='/EventCoPage' element = {<EventCoPage/>}></Route>
        <Route path='/FinaceCoPage' element = {<FinaceCoPage/>}></Route>
        <Route path='/MaintanCoPage' element = {<MaintanCoPage/>}></Route>

        <Route path='/UpdateEvent/:id' element = {<UpdateEvent/>}></Route>
        <Route path='/EditElection/:id' element = {<EditElection/>}></Route>

        
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path='/expences' element={<Expences/>} />
        <Route path='/buy' element={<BuyPlans/>}></Route>
        
        <Route path='/EditMaintenance/:id' element = {<EditMaintenance/>}></Route>
        <Route path='/financeHome' element={<FinanceHome/>} />
        <Route path='/qr/:id' element = {<QR/>}></Route>

        <Route path='/UpdatePassword' element={<UpdatePassword/>} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/UpdateEmail' element={<UpdateEmail />} />
        <Route path='/TwoStepV' element={<TwoStepV />} />

        <Route path='/addrule' element={<AddRule />} />
        <Route path='/updaterule/:id' element={<UpdateRule />} />

        <Route path='/community-rules' element={<DisplayRules />} />

      </Routes>
      
    </div>
  );
}

export default App;


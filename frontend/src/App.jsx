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
import MyPayments from "./pages/MyPayments";

import CommuniCoPage from '../src/pages/CommuniCoPage';
import ElectionCoPage from '../src/pages/ElectionCoPage';
import EventCoPage from '../src/pages/EventCoPage';
import FinaceCoPage from '../src/pages/FinaceCoPage';
import MaintanCoPage from '../src/pages/MaintanCoPage';
import UpdatePassword from '../src/pages/setting/UpdatePassword';
import UpdateEmail from '../src/pages/setting/UpdateEmail';
import TwoStepV from '../src/pages/setting/TwoStepV';
import ForgotPassword from '../src/pages/setting/forgotPassword';
import NewPassword from '../src/pages/setting/newPassword';

import UpdateEvent from './pages/UpdateEvent';
import EditElection from '../src/pages/EditElection'

import BuyPlans from './pages/BuyPlans';
import Checkout from './pages/CheckOut';
import Payment from "./pages/Payment";

import QR from './pages/QR';
import EditMaintenance from './pages/EditMaintenance';

import Notifications from './pages/notifications';
import Settings from './pages/settings';

import AddRule from './pages/addrule';
import UpdateRule from './pages/updaterule';
import DisplayRules from './pages/displayRules';

import AddAnnoucement from './pages/AddAnnoucement';
import UpdateAddAnnoucement from './pages/UpdateAddAnnoucement';
import DisplayAllAnnoucement from './pages/DisplayAllAnnoucement';

import Ticket from './pages/Ticket';
import EventRequest from './pages/EventRequest';
import MarkAttendance from './pages/MarkAttendance';
import DustReport from '../src/pages/DustReport';
import Success from '../src/pages/Success'
import PrivateRoute from './componenets/PrivateRoute';


function App() {
  return (
    <div className='mx-4 sm:max-[10%]:'>
      <Navbar />
      <Routes>
      <Route path='/' element = {<Home/>}></Route>
      <Route path='/AboutUs' element = {<AboutUs/>}></Route>
      <Route path='/Adminadd' element = {<PrivateRoute><Adminadd/></PrivateRoute>}></Route>
      <Route path='/AdminPage' element = {<PrivateRoute><AdminPage/></PrivateRoute>}></Route>
      <Route path='//AdminUpdate/:id' element = {<PrivateRoute><AdminUpdate/></PrivateRoute>}></Route>

      <Route path='/AddMaintenance' element={<PrivateRoute><AddMaintenance /></PrivateRoute>} />
      <Route path='/addElection' element={<PrivateRoute><AddElection /></PrivateRoute>} />
      <Route path='/AddEvent' element={<PrivateRoute><AddEvent /></PrivateRoute>} />
      <Route path='/ContactUs' element = {<ContactUs/>}></Route>

      <Route path='/forgotPassword' element = {<ForgotPassword/>}></Route>
        <Route path='/Rules' element = {<Rules/>}></Route>
        <Route path='/LogIn' element = {<LogIn/>}></Route>
        <Route path='/Register' element = {<Register/>}></Route>
        <Route path='/RUserProfile' element={<PrivateRoute><RUserProfile /></PrivateRoute>} />

      <Route path='/Election' element={<PrivateRoute><Election /></PrivateRoute>} />
      <Route path='/Event' element={<PrivateRoute><Event /></PrivateRoute>} />
      <Route path='/MyEvents' element={<PrivateRoute><MyEvents /></PrivateRoute>} />
      <Route path='/MyMaintance' element={<PrivateRoute><MyMaintance /></PrivateRoute>} />
      <Route path='/MyPayments' element={<PrivateRoute><MyPayments /></PrivateRoute>} />

      <Route path='/CommuniCoPage' element={<PrivateRoute><CommuniCoPage /></PrivateRoute>} />
      <Route path='/ElectionCoPage' element={<PrivateRoute><ElectionCoPage /></PrivateRoute>} />
      <Route path='/EventCoPage' element={<PrivateRoute><EventCoPage /></PrivateRoute>} />
      <Route path='/FinaceCoPage' element={<PrivateRoute><FinaceCoPage /></PrivateRoute>} />
      <Route path='/MaintanCoPage' element={<PrivateRoute><MaintanCoPage /></PrivateRoute>} />

      <Route path='/UpdateEvent/:id' element={<PrivateRoute><UpdateEvent /></PrivateRoute>} />
      <Route path='/EditElection/:id' element={<PrivateRoute><EditElection /></PrivateRoute>} />

      <Route path='/dust-report' element={<PrivateRoute><DustReport /></PrivateRoute>} />
      <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
      <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
      <Route path='/buy' element={<PrivateRoute><BuyPlans /></PrivateRoute>} />
      <Route path='/success' element={<PrivateRoute><Success /></PrivateRoute>} />

      <Route path='/EditMaintenance/:id' element={<PrivateRoute><EditMaintenance /></PrivateRoute>} />

      <Route path='/UpdatePassword' element={<PrivateRoute><UpdatePassword /></PrivateRoute>} />
      <Route path='/notifications' element={<PrivateRoute><Notifications /></PrivateRoute>} />
      <Route path='/settings' element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path='/UpdateEmail' element={<PrivateRoute><UpdateEmail /></PrivateRoute>} />
      <Route path='/TwoStepV' element={<PrivateRoute><TwoStepV /></PrivateRoute>} />
      <Route path='/new-Password' element={<PrivateRoute><NewPassword /></PrivateRoute>} />

      <Route path='/addrule' element={<PrivateRoute><AddRule /></PrivateRoute>} />
      <Route path='/updaterule/:id' element={<PrivateRoute><UpdateRule /></PrivateRoute>} />

      <Route path='/community-rules' element={<PrivateRoute><DisplayRules /></PrivateRoute>} />

      <Route path='/addannoucement' element={<PrivateRoute><AddAnnoucement /></PrivateRoute>} />
      <Route path='/updateannoucement/:id' element={<PrivateRoute><UpdateAddAnnoucement /></PrivateRoute>} />
      <Route path='/displayallannoucement' element={<PrivateRoute><DisplayAllAnnoucement /></PrivateRoute>} />

      <Route path='/ticket' element={<PrivateRoute><Ticket /></PrivateRoute>} />
      <Route path="/event-requests/:eventId" element={<PrivateRoute><EventRequest /></PrivateRoute>} />
      <Route path="/mark-attendance/:eventId" element={<PrivateRoute><MarkAttendance /></PrivateRoute>} />
      <Route path="/event-qr/:id" element={<PrivateRoute><QR /></PrivateRoute>} />

        
      </Routes>
      
    </div>
  );
}

export default App;


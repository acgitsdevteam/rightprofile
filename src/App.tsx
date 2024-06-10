import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Routes,Route, BrowserRouter as Router, Link} from 'react-router-dom';
import Login from './Components/Login';
// import SideMenu from './Components/Layout/SideMenu';
// import PersonalDiscussion from './Components/PersonalDiscussion';
// import LoanCreationPhases from './Components/LoanCreationPhases'
// import Dashboard from './Components/Dashboard';
// import LoanInformation from './Components/LoanInformation';
// import PersonalInformation from './Components/PersonalInformation';
// import NotFound from './Components/NotFound';

function App() {
  return (
<>
{/* <SideMenu /> */}
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/personal" element={<PersonalDiscussion />} />
          <Route path="/loan" element={<LoanCreationPhases />}>
            <Route index element = {<LoanInformation />} />
            <Route path="info" element={<LoanInformation />} />
            <Route path="person" element={<PersonalInformation />} />
          </Route> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  </>
  );
}

export default App;

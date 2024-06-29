import React from 'react';
import './App.css';
import {Routes,Route, BrowserRouter as Router, Link,useNavigate} from 'react-router-dom';
import Login from './Components/Login';
import SideMenu from './Components/Layout/SideMenu';
import PersonalDiscussion from './Components/PersonalDiscussion';
import LoanCreationPhases from './Components/LoanCreationPhases'
import Dashboard from './Components/Dashboard';
import NotFound from './Components/NotFound';
import Users from './Components/Users';


function App() {
  return (
<>

    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/personal" element={<PersonalDiscussion />} />
          <Route path="/loan" element={<LoanCreationPhases />} />
          <Route path="/loan/:applicationID" element={<LoanCreationPhases />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<NotFound />} />
          
        </Routes>
    </Router>
  </>
  );
}

export default App;

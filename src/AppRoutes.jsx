import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clients from './components/clients/Clients';
import Projects from './components/projects/Projects';
import Tasks from './components/tasks/Tasks';
import Users from './components/users/Users';
import Timesheets from './components/timesheets/Timesheets';
import Signup from './components/authentication/Signup';
import Login from './components/authentication/Login';
import Home from './components/home/Home';
import TaskHour from './components/taskhours/TaskHour'
import ForgotPassword from './components/authentication/ForgotPassword';
import Approvals from './components/approvals/Approvals';
import ApprovalTimesheet from './components/approvals/ApprovalTimesheet';
import ResetPassword from './components/authentication/ResetPassword';
import Profile from './components/users/Profile';
import GuideMe from './components/guide-me/GuideMe';
import NotFound from './components/not-found/NotFound';


const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Auth Urls */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Signup />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
            <Route path='/reset-password/:code' element={<ResetPassword />} />

            {/* Home Urls */}
            

            <Route path="*" element={<NotFound />} />
            <Route path='/' element={<Home />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/timesheets' element={<Timesheets />} />
            <Route path='/users' element={<Users />} />
            <Route path='/timesheet/:timesheetId' element={<TaskHour />} />
            <Route path='/approvals' element={<Approvals />} />
            <Route path='/approval/:timesheetId' element={<ApprovalTimesheet />} />
            <Route path='/guide-me' element={<GuideMe />} />

            <Route path='/profile' element={<Profile />} />
            {/* <Route path='/compress' element={<Compression />} /> */}
        </Routes>
    </Router>
);

export default AppRoutes;
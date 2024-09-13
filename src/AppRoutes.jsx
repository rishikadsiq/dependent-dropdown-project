import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clients from './components/clients/Clients';
import Projects from './components/projects/Projects';
import Tasks from './components/tasks/Tasks';
import Users from './components/users/Users';
import Timesheets from './components/timesheets/Timesheets';
import Signup from './components/authentication/Signup';
import Login from './components/authentication/Login';
import Home from './components/home/Home';
import TaskHour from './components/taskhours/TaskHour';

const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Auth Urls */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Signup />} />
            {/* <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} /> */}

            {/* Home Urls */}
            

            
            <Route path='/' element={<Home />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/timesheets' element={<Timesheets />} />
            <Route path='/users' element={<Users />} />
            <Route path='/timesheet/:timesheetId' element={<TaskHour />} />

            {/* <Route path='/profile' element={<Profile />} /> */}
            {/* <Route path='/compress' element={<Compression />} /> */}
        </Routes>
    </Router>
);

export default AppRoutes;
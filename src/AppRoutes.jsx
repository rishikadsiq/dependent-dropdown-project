import * as  React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotFound from './components/not-found/NotFound'
import GuideMe from './components/guide-me/GuideMe'
import  Profile from './components/users/Profile'
import  ResetPassword from './components/authentication/ResetPassword'
import  ApprovalTimesheet from './components/approvals/ApprovalTimesheet'
import  ForgotPassword from './components/authentication/ForgotPassword'
import  TaskHour from './components/taskhours/TaskHour'
import  Approvals from './components/approvals/Approvals'
import  Home from './components/home/Home'
import  Login from './components/authentication/Login'
import  Signup from './components/authentication/Signup'
import  Timesheets from './components/timesheets/Timesheets'
import  Users from './components/users/Users'
import  Tasks from './components/tasks/Tasks'
import  Projects from './components/projects/Projects'
import  Clients from './components/clients/Clients'

const AppRoutes = () => {
    const [role, setRole] = useState("")
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if(userData){
            setRole(userData.role)
        }
    },[])

    return (
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

            {role==="Admin" && (
                <>
                    <Route path='/clients' element={<Clients />} />
                    <Route path='/projects' element={<Projects />} />
                    <Route path='/tasks' element={<Tasks />} />
                    <Route path='/users' element={<Users />} />
                    <Route path='/guide-me' element={<GuideMe />} />
                </>
            )}

            
            <Route path='/timesheets' element={<Timesheets />} />
            <Route path='/timesheet/:timesheetId' element={<TaskHour />} />
            <Route path='/approvals' element={<Approvals />} />
            <Route path='/approval/:timesheetId' element={<ApprovalTimesheet />} />
            

            <Route path='/profile' element={<Profile />} />
        </Routes>
    </Router>
    )
};

export default AppRoutes;
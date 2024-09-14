import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';


function NavbarComponent() {
  const navigate = useNavigate()
  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')
  const userData = JSON.parse(localStorage.getItem('userData'));

  
  React.useEffect(() => {
    if(!access_token && !refresh_token && !userData)  return navigate('/login')
},[])
  console.log(userData);

  // Set circle color based on role
  const circleColor = userData?.role === 'Admin' ? '#6A9C89' : '#227B94';

  const circleStyle = {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: circleColor,
    marginLeft: '8px',
  };

  // Dropdown visibility state
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown1, setShowDropdown1] = useState(false);

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);
  const handleMouseEnter1 = () => setShowDropdown1(true);
  const handleMouseLeave1 = () => setShowDropdown1(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userData');
    console.log('Logged out successfully')
    navigate('/login');
  }

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#EAE4DD" }}>
      <Container>
        <Navbar.Brand href="/">TimeChronos</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {userData?.role === "Admin" && (
              <>
                <div  
                  onMouseEnter={handleMouseEnter1}
                  onMouseLeave={handleMouseLeave1}
                >
                  <NavDropdown title="Management" id="basic-nav-dropdown" show={showDropdown1}>
                    <NavDropdown.Item href="/clients">Clients</NavDropdown.Item>
                    <NavDropdown.Item href="/projects">Projects</NavDropdown.Item>
                    <NavDropdown.Item href="/tasks">Tasks</NavDropdown.Item>
                    <NavDropdown.Item href="/users">Users</NavDropdown.Item>
                  </NavDropdown>
                </div>
                <Nav.Link href="/approvals">Approvals</Nav.Link>
              </>
            )}
            <Nav.Link href="/timesheets">Timesheets</Nav.Link>
          </Nav>
          {/* Right-aligned Nav for user role with hover-controlled dropdown */}
          <Nav
            className="ms-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              <NavDropdown
                title={
                  <>
                    <span>{userData?.user_name.toUpperCase() || 'Guest'}</span>
                  </>
                }
                id="user-nav-dropdown"
                show={showDropdown} // Controls visibility based on hover
                align="end"
              >
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;

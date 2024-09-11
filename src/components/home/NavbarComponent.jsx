import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavbarComponent() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">TimeChronos</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <NavDropdown title="Management" id="basic-nav-dropdown">
              <NavDropdown.Item href="/clients">Clients</NavDropdown.Item>
              <NavDropdown.Item href="/projects">Projects</NavDropdown.Item>
              <NavDropdown.Item href="/tasks">Tasks</NavDropdown.Item>
              <NavDropdown.Item href="/users">Users</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/timesheets">Timesheets</Nav.Link>
            {/* <Nav.Link href="/timesheets">Timesheets</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
import Container from 'react-bootstrap/Container';
import Clients from './components/clients/Clients';
import Projects from './components/projects/Projects';
import Tasks from './components/tasks/Tasks';
import Users from './components/users/Users';
import Timesheets from './components/timesheets/Timesheets';
// import NewDemo from './components/taskhours/NewDemo';
function App() {
  

  return (
    <Container>
      {/* <NewDemo /> */}
      <Clients />
      <Projects />
      <Tasks />
      <Users />
      <Timesheets />
    </Container>
  )
}

export default App

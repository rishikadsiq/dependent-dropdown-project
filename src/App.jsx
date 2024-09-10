import Container from 'react-bootstrap/Container';
import Clients from './components/clients/Clients';
import Projects from './components/projects/Projects';
import Tasks from './components/tasks/Tasks';
// import NewDemo from './components/taskhours/NewDemo';
function App() {
  

  return (
    <Container>
      {/* <NewDemo /> */}
      <Clients />
      <Projects />
      <Tasks />
    </Container>
  )
}

export default App

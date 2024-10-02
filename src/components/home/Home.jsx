import React, { useEffect } from 'react'
import HeaderLayout from './HeaderLayout'
import Alerts from '../dynamic-compoenents/Alerts'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setVariant] = React.useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    const login_message = JSON.parse(localStorage.getItem('login_message'));
    if (login_message) {
      setShowAlert(true);
      setMessage('Login Successfully');
      setVariant('success');
      localStorage.removeItem('login_message');
    }
  })

  const cardsData = [
    { title: 'Clients', total: 'Total Clients', active: 'Active Clients', navigate: 'clients' },
    { title: 'Projects', total: 'Total Projects', active: 'Active Projects', navigate: 'projects' },
    { title: 'Tasks', total: 'Total Tasks', active: 'Active Tasks', navigate: 'tasks' },
    { title: 'Employees', total: 'Total Employees', active: 'Active Employees', navigate: 'users' },
    { title: 'Timesheets', total: 'Total Timesheets', active: 'Pending Timesheets', navigate: 'timesheets' },
    { title: 'Approvals', total: 'Total Approvals', active: 'Pending Approvals', navigate: 'approvals' }
  ];
  const handleNavigate= (link) => {
    navigate(`/${link}`)
  }
  return (
    <div>
    <HeaderLayout>
      {showAlert && (
        <Alerts showAlert={showAlert} setShowAlert={setShowAlert} message={message} variant={variant} />
      )}
      <div className='mt-3 mb-3' style={{ paddingTop: showAlert ? '60px' : '0' }}>
        <h1>Home</h1>
      </div>
        
      <div>
      <Row>
        {cardsData.map((card, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>{card.total}</ListGroup.Item>
                <ListGroup.Item>{card.active}</ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Card.Link onClick={() => handleNavigate(card.navigate)}>More Details...</Card.Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </HeaderLayout>
      
    </div>
  )
}

export default Home

import React, { useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { ListGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTasks, faProjectDiagram, faUserTie, faClipboardCheck, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import HeaderLayout from './HeaderLayout';
import Alerts from '../dynamic-compoenents/Alerts';
import { GetRequestHelper } from '../helper/GetRequestHelper';

const Home = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [variant, setVariant] = React.useState(null);
  const navigate = useNavigate();
  const [data, setData] = React.useState({})
  const [userType, setUserType] = React.useState()
  const [cardData, setCardData] = React.useState([])



  useEffect(() => {
    const login_message = JSON.parse(localStorage.getItem('login_message'));
    if (login_message) {
      setShowAlert(true);
      setMessage('Login Successfully');
      setVariant('success');
      localStorage.removeItem('login_message');
    }
    const userData = JSON.parse(localStorage.getItem('userData'));
    if(userData){
      if(userData.role === 'Admin'){
        setUserType(userData.role)
      }else(
        setUserType('normal_user')
      )
    }

  }, []);

  const getListing = async() => {
    try {
        const data1 = await GetRequestHelper('getstats', navigate);
        if (data1.status === 404) {
            setData([]);
        } else {
            setData(data1.stats_data);
          }
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]); 
        }
    };

  React.useEffect(() => {
    getListing(); // Call the function to fetch data
}, []);

useEffect(() => {
  if(userType==='Admin'){
    setCardData([
      { title: 'Clients', total: 'Total Clients', active: 'Active Clients', icon: faUsers, navigate: 'clients', total_data: 'total_clients', active_data: 'active_clients' },
      { title: 'Projects', total: 'Total Projects', active: 'Active Projects', icon: faProjectDiagram, navigate: 'projects', total_data: 'total_projects', active_data: 'active_projects' },
      { title: 'Tasks', total: 'Total Tasks', active: 'Active Tasks', icon: faTasks, navigate: 'tasks', total_data: 'total_tasks', active_data: 'active_tasks' },
      { title: 'Employees', total: 'Total Employees', active: 'Active Employees', icon: faUserTie, navigate: 'users', total_data: 'total_employees', active_data: 'active_employees' },
      { title: 'Timesheets', total: 'Total Timesheets', active: 'Pending Timesheets', icon: faCalendarCheck, navigate: 'timesheets', total_data: 'total_timesheet', active_data: 'total_pending_approvals' },
      { title: 'Approvals', total: 'Total Approvals', active: 'Pending Approvals', icon: faClipboardCheck, navigate: 'approvals', total_data: 'total_approver_timesheets', active_data: 'total_approver_pending_approvals' }
    ])
  } else if(userType==='normal_user'){
    setCardData([
     { title: 'Timesheets', total: 'Total Timesheets', active: 'Pending Timesheets', icon: faCalendarCheck, navigate: 'timesheets', total_data: 'total_timesheet', active_data: 'total_pending_approvals' },
      { title: 'Approvals', total: 'Total Approvals', active: 'Pending Approvals', icon: faClipboardCheck, navigate: 'approvals', total_data: 'total_approver_timesheets', active_data: 'total_approver_pending_approvals' }
    ])
  }
},[userType])



  const handleNavigate = (link) => {
    navigate(`/${link}`);
  };

  return (
    <HeaderLayout>
      {showAlert && (
          <Alerts showAlert={showAlert} setShowAlert={setShowAlert} message={message} variant={variant} />
        )}
            <div className='mt-3 mb-3' style={{ paddingTop: showAlert ? '60px' : '0' }}>
        <h4>Home</h4>
      </div>

      <Row className="g-4 text-center">
        {cardData.map((card, index) => (
          <Col key={index} sm={12} md={6} lg={4}>
            <Card className="h-100 text-center shadow" onClick={() => handleNavigate(card.navigate)}>
              <Card.Body>
                <FontAwesomeIcon icon={card.icon} size="3x" className="mb-3 text-primary" />
                <Card.Title className="mb-2">{card.title}</Card.Title>
              </Card.Body>
              <Card.Footer className="bg-transparent">
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>{card.total}: {data[card.total_data]}</ListGroup.Item>
                  <ListGroup.Item>{card.active}: {data[card.active_data]}</ListGroup.Item>
                  <ListGroup.Item>
                    <Button variant="link" className="text-primary">More Details...</Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </HeaderLayout>
  );
};

export default Home;

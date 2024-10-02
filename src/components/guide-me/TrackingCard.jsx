import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassStart, faClock } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons

const TrackingCard = ({setClientComponent, setVisible}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
      <Card style={{ width: '18rem', textAlign: 'center', padding: '20px', borderRadius: '15px'}}>
        <Card.Body>
          <Card.Title style={{ fontSize: '24px', fontWeight: 'bold' }}>Let's start tracking</Card.Title>
          <FontAwesomeIcon icon={faHourglassStart} style={{ fontSize: '50px', margin: '20px 0' }} />
          <Card.Text>Add clients to get started</Card.Text>
          <Button variant="outline-dark" onClick={() => {
            setClientComponent(true)
            setVisible(true);
          }}>Guide me</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TrackingCard;

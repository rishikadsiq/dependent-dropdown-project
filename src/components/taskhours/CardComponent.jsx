import Card from 'react-bootstrap/Card';

function CardComponent() {
  return (
    <Card style={{ backgroundColor: '#f8d7da' }} className="text-blue"> {/* Sets background to light red */}
      <Card.Body className="text-center"> {/* Centers the content */}
        <Card.Title>Note *</Card.Title>
        <Card.Subtitle className="mb-2">
        No client, project, or task is available, so the timesheet cannot be edited.
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
}

export default CardComponent;

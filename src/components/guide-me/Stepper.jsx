import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Stepper = () => {
  return (
    <Container className="py-3">
      <Row className="align-items-center justify-content-center no-gutters">
        {/* Step 1 */}
        <Col xs={2} className="text-center">
          <div
            className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto"
            style={{ width: '40px', height: '40px' }}
          >
            1
          </div>
          <p style={{fontSize: '0.8em'}}>Step 1</p>
            <small>Add client</small>
          
        </Col>

        {/* Dashed line */}
        <Col xs={1} className="p-0">
          <hr className="border-top border-dark border-2 border-dashed my-0" />
        </Col>

        {/* Step 2 */}
        <Col xs={2} className="text-center">
          <div
            className="rounded-circle border border-danger text-dark d-flex align-items-center justify-content-center mx-auto"
            style={{ width: '40px', height: '40px' }}
          >
            2
          </div>
          <p style={{fontSize: '0.8em'}}>Step 2</p>
            <small>Add project</small>
        </Col>

        {/* Line */}
        <Col xs={1} className="p-0">
          <hr className="border-top border-dark border-2 my-0" />
        </Col>

        {/* Step 3 */}
        <Col xs={2} className="text-center">
          <div
            className="rounded-circle border border-danger text-dark d-flex align-items-center justify-content-center mx-auto"
            style={{ width: '40px', height: '40px' }}
          >
            3
          </div>
          <p style={{fontSize: '0.8em'}}>Step 3</p>
            <small>Add task</small>
        </Col>

        {/* Line */}
        <Col xs={1} className="p-0">
          <hr className="border-top border-dark border-2 my-0" />
        </Col>

        {/* Step 4 */}
        <Col xs={2} className="text-center">
          <div
            className="rounded-circle border border-danger text-dark d-flex align-items-center justify-content-center mx-auto"
            style={{ width: '40px', height: '40px' }}
          >
            4
          </div>
          <p style={{fontSize: '0.8em'}}>Step 4</p>
          <small>Add User</small>
        </Col>
      </Row>
    </Container>
  );
};

export default Stepper;

import React, { useState, useRef, useEffect } from 'react';
import HeaderLayout from '../home/HeaderLayout';
import { Button } from '@progress/kendo-react-buttons';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { GetRequestHelper } from '../helper/GetRequestHelper';
import { PostRequestHelper } from '../helper/PostRequestHelper';
import ChangePassword from './ChangePassword';

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditable, setIsEditable] = useState(false); // State to track edit mode
  const fileInputRef = useRef(null); // Reference to the file input
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({}); // State to store form data
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please choose a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    alert(`File ${selectedFile.name} uploaded successfully!`);

    setSelectedFile(null);
    fileInputRef.current.value = ''; // Clear the file input
  };

  const CircularImage = ({ src, alt }) => {
    return (
      <div style={styles.circle}>
        <img src={src} alt={alt} style={styles.image} />
      </div>
    );
  };

  const styles = {
    circle: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #000',
      marginRight: '10px',
    },
    image: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
    },
    profilePhotoContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
    },
  };

  const handleEdit = () => {
    setIsEditable(true);
    setFormData(data); // Set the form data to the existing data
  };

  const cancelEdit = () => {
    setIsEditable(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async() => {
    // Find the fields that were changed by comparing formData with data
    const changedData = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== data[key]) {
        acc[key] = formData[key]; // Collect only the changed fields
      }
      return acc;
    }, {});
  
    console.log('Changed Profile Data:', changedData);
    const response = await PostRequestHelper('/updateprofile', changedData, navigate)
    console.log(response)
  
    // Update the state with the new data
    fetchData()
  
    // Exit edit mode
    setIsEditable(false);
  };
  

  const fetchData = async () => {
    const response = await GetRequestHelper('/getprofile', navigate);
    console.log(response.data);
    setData(response.data || {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <HeaderLayout>
      <h4>Profile Page</h4>
      <hr style={{ border: '1px solid #000', margin: '20px 0' }} />
      <div style={{ paddingLeft: '10px' }}>
        <h6>Profile Photo</h6>
        <p style={{ fontSize: '0.6em', marginLeft: '10px' }}>Formats: png, jpg, gif. Max size: 1 MB.</p>
        <div style={styles.profilePhotoContainer}>
          <span>
            <CircularImage src="https://via.placeholder.com/150" alt="Example" />
          </span>
          <span>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" onChange={handleFileChange} ref={fileInputRef} />
            </Form.Group>
          </span>
          <span style={{ paddingLeft: '20px' }}>
            <Button themeColor={'primary'} onClick={handleUpload} style={{ height: '40px' }}>
              Upload Image
            </Button>
          </span>
        </div>
      </div>
      <hr style={{ border: '1px solid #000', margin: '20px 0' }} />
      <div style={{ paddingLeft: '10px' }}>
        <h6>Personal Info </h6>
        <div className="flex my-3">
          {!isEditable && (
            <Button themeColor={'primary'} style={{ paddingTop: '3px' }} size={'small'} onClick={handleEdit}>
              Edit
            </Button>
          )}
          {isEditable && (
            <>
              <Button
                themeColor={'primary'}
                style={{ paddingTop: '3px', marginRight: '5px' }}
                size={'small'}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button themeColor={'primary'} style={{ paddingTop: '3px' }} size={'small'} onClick={cancelEdit}>
                Cancel
              </Button>
            </>
          )}
        </div>

        <Form style={{ width: '850px' }}>
        <Row className="mb-3">
            <Col sm="6">
              <Form.Group controlId="formPlaintextFirstName">
                <Form.Label>First Name</Form.Label>
                {isEditable ? (
                  <Form.Control
                    type="text"
                    name="firstname"
                    value={formData.firstname || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control readOnly value={data.firstname || ''} />
                )}
              </Form.Group>
            </Col>

            <Col sm="6">
              <Form.Group controlId="formPlaintextLastName">
                <Form.Label>Last Name</Form.Label>
                {isEditable ? (
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={formData.lastname || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control readOnly value={data.lastname || ''} />
                )}
              </Form.Group>
            </Col>
          </Row>

          
          <Row className="mb-3">
            <Col sm="6">
              <Form.Group controlId="formPlaintextEmail">
                <span>
                  <Form.Label>Email</Form.Label>
                </span>
                <span style={{ fontSize: '0.6em', marginLeft: '10px'}}>
                  Not Editable *
                </span>
                <Form.Control readOnly value={data.email || ''} />
              </Form.Group>
            </Col>

            <Col sm="6">
              <Form.Group controlId="formPlaintextRole">
              <span>
                  <Form.Label>Role</Form.Label>
                </span>
                <span style={{ fontSize: '0.6em', marginLeft: '10px'}}>
                  Not Editable *
                </span>
                <Form.Control readOnly value={data.role || ''} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm="6">
              <Form.Group controlId="formPlaintextPhone">
                <Form.Label column sm="2">
                  Contact
                </Form.Label>
                  {isEditable ? (
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Form.Control readOnly value={data.phone || ''} />
                  )}
              </Form.Group>
            </Col>

            <Col sm="6">
              <Form.Group controlId="formPlaintextDOB">
                <Form.Label column sm="4">
                  Date of Birth
                </Form.Label>
                  {isEditable ? (
                    <Form.Control
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Form.Control readOnly value={data.date_of_birth || ''} />
                  )}
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col sm="6">
              <Form.Group controlId="formPlaintextAddress">
                <Form.Label column sm="2">
                  Address
                </Form.Label>
                
                  {isEditable ? (
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Form.Control readOnly value={data.address || ''} />
                  )}
              </Form.Group>
            </Col>

            <Col sm="6">
              <Form.Group controlId="formPlaintextEmail">
              <span>
                  <Form.Label>Approver Name</Form.Label>
                </span>
                <span style={{ fontSize: '0.6em', marginLeft: '10px'}}>
                  Not Editable *
                </span>
                  <Form.Control readOnly defaultValue={data.approver_name || ''} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm="6">
              <Form.Group controlId="formPlaintextEmail">
              <span>
                  <Form.Label>Supervisor Name</Form.Label>
                </span>
                <span style={{ fontSize: '0.6em', marginLeft: '10px'}}>
                  Not Editable *
                </span>
                  <Form.Control readOnly defaultValue={data.supervisor_name || ''} />
              </Form.Group>
            </Col>

            <Col sm="6">
              <Form.Group controlId="formPlaintextEmail">
              <span>
                  <Form.Label>Company Name</Form.Label>
                </span>
                <span style={{ fontSize: '0.6em', marginLeft: '10px'}}>
                  Not Editable *
                </span>
                  <Form.Control readOnly defaultValue={data.company_name || ''} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
      <hr style={{ border: '1px solid #000', margin: '20px 0' }} />
      <div style={{ paddingLeft: '10px' }}>
        <h6>Security & Privacy</h6>
          <Button themeColor={'primary'} className='my-2' size={'small'} onClick={() => {console.log('change password')}}>
            Change Password
          </Button>
          <ChangePassword />
      </div>
    </HeaderLayout>
  );
};

export default Profile;

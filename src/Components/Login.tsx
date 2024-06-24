import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Form, FormControl, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.png';
import axios from 'axios';
import styled from 'styled-components';
import { edbranchList } from './Services/Branches';


const axiosInstance = axios.create({
  baseURL: 'https://3.7.159.34/rightprofile/api/', // Replace with your API base URL
  // timeout: 1000,                      // Set a timeout if needed
  //headers: { 'Content-Type': 'application/json' }
});


const Login = () => {
  const [user, setUser] = useState({});
  const [branches, setBranches] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({
    usertype: '',
    password: '',
    username: '',
    edbranch: ''
  });
  const [formData, setFormData] = useState({
    usertype: '',
    password: '',
    username: '',
    edbranch: ''
  });

  const navigate = useNavigate();

  const customStyles = {
    checkbox: {
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
    },
    label: {
      color: '#333',
      fontWeight: 'bold',
    },
    input: {
      marginLeft: '10px',
    },
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (checkValidation()) {
      console.log("Form submitted");
      let maskedCredentials = {
        usertype: '',
        password: '',
        username: '',
        edbranch:''
      };

      
      maskedCredentials.usertype = btoa(formData.usertype);
      maskedCredentials.password = btoa(formData.password);
      maskedCredentials.username = btoa(formData.username);
      if (formData.usertype === "AdityaBirla") {
        maskedCredentials.edbranch = btoa(formData.edbranch);
      }

      var encodedString = '';
      for (var i = 0; i < JSON.stringify(maskedCredentials).length; i++) {
        // Get the character code of each character in the input
        const charCode = JSON.stringify(maskedCredentials).charCodeAt(i);
        // Add 1 to the character code and convert it back to character
        const encodedChar = String.fromCharCode(charCode + 1);
        // Append the encoded character to the encoded string
        encodedString += encodedChar;
      }

      const headers = {
        'Content-Type': 'text/plain',
      };
      axios.post(process.env.REACT_APP_API_URL+'/auth/', encodedString, { headers })
        .then(response => {
          console.log("Login Response data", response)
          localStorage.setItem("user_data",JSON.stringify(response.data));
          setErrorMsg("");
          navigate("/personal")
        }).catch((error) => {
          console.log("Error response:", error)
          setErrorMsg("Invalid Username or Password")
        });
    } else {
      console.log("Validation failed");
      //setErrorMsg("Validation errors occured")
    }

  }

  const checkValidation = () => {
    const newErrors = {
      usertype: '',
      password: '',
      username: '',
      edbranch: ''
    };

    const name_regex = /^[A-Za-z\s]+$/;

    if (!formData.username) {
      newErrors.username = 'Please enter username';
    }

    if (formData.username && !name_regex.test(formData.username)) {
      newErrors.username = 'Please enter valid username';
    }

    if (!formData.usertype) {
      newErrors.usertype = 'Please select usertype';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter password';
    }

    if (formData.usertype && formData.usertype === 'AdityaBirla' && !formData.edbranch) {
      newErrors.edbranch = 'Please select the branch';
    }

    
    setErrors(newErrors);
    return Object.values(newErrors).every(x => x === '');
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("Form Data:", formData)
  };


  
  return (
    <React.Fragment>
      <div className="wrapper">
        <Navbar bg="light" expand="lg" fixed="top">
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            {/* Add Nav.Link components if needed */}
          </Navbar.Collapse>
        </Navbar>

        <Container className="login-container">
          <Row className="justify-content-center">
            <Col md={6}>
              <div className="login-box">
                <Navbar.Brand href="#">
                  <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="" width="400" height="70" />
                </Navbar.Brand>
                <h3 className="mb-4 mt-3 fw-400">Login to RightProfile™ Portal</h3>
                <div className='text-danger mb-1'>{errorMsg}</div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Select as="select" name="usertype" onChange={handleChange} className="mb-2" style={{ width: '230px' }}>
                      <option value=""></option>
                      <option value="Edelweiss">Edelweiss</option>
                      <option value="Admin">Admin</option>
                      <option value="Test">Test</option>
                      <option value="AdityaBirla">AdityaBirla</option>
                    </Form.Select>
                    {errors.usertype && <p style={{ color: 'red' }}>{errors.usertype}</p>}

                  </Form.Group>

                  {formData.usertype === 'AdityaBirla' &&
                    <Form.Group className="mb-3">
                      <Form.Select as="select" name="edbranch" onChange={handleChange} className="mb-2" style={{ width: '230px' }}>
                        <option value=""></option>
                        {
                          edbranchList.map((item, i) => (<option key={i} value={item.type}>{item.type}</option>))
                        }
                      </Form.Select>
                      {errors.edbranch && <p style={{ color: 'red' }}>{errors.edbranch}</p>}

                    </Form.Group>
                  }

                  <Form.Group className="mb-3">
                    <FormControl type="text" name="username" onChange={handleChange} placeholder="Username" className="mt-2" value={formData.username} />
                    {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <FormControl name="password" onChange={handleChange} type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                  </Form.Group>
                  <Form.Group className="form-check mb-3">
                    <Form.Check
                      type="checkbox"
                      id="showPassword"
                      label="Show Password"
                      onClick={togglePasswordVisibility}
                      style={{fontWeight:400}}

                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button type="submit" variant="danger">
                      Login
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
          
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Login;
import React, { useState } from 'react';
import SideMenu from './Layout/SideMenu';
import { Outlet, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { Form, Col, Row, FormControl } from 'react-bootstrap';
import { edbranchList, loanPurposes, dropDownLists } from './Services/Branches';
import axios from 'axios';

import myLoan from '././Model/Loan.json';

interface UserData {
    token: string;
    userId: string;
    usertype: string;
    role: string;
    // Add other fields if necessary
}
const LoanCreationPhases = () => {
  const [key, setKey] = useState<string>('loanInfo');
  const [innerKey, setInnerKey] = useState<string>('applicant');

  const [subTabkey, setSubTabKey] = useState<string>('applicant');
  const [innerSubKey, setInnerSubKey] = useState<string>('applicant');
  debugger; 
  const month=new Date().getMonth()+1;
  let smonth='';
  if(month<10)
      smonth = '0' + month;
  else
     smonth=month.toString();
 const year = new Date().getFullYear();
const date = new Date().getDate();
const currDate = date + "/" + smonth + "/" + year;
  
  const currTime = new Date().toLocaleTimeString();
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        loanAmountRequested: 0,
        customerAffordableEmi: 0,
        purposeOfLoan: '',
        edbranch: ''
    });
    const axiosInstance = axios.create({
        baseURL: 'https://3.7.159.34/rightprofile/api/', // Replace with your API base URL
        // timeout: 1000,                      // Set a timeout if needed
        //headers: { 'Content-Type': 'application/json' }
    });
    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        loanAmountRequested: '',
        customerAffordableEmi: '',
        purposeOfLoan: '',
        edbranch: ''
    });

    const handleChange = (e: any) => {
        debugger;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log("Form Data:", formData)
    };
    const checkValidation = () => {
        const newErrors = {
            loanAmountRequested: '',
            customerAffordableEmi: '',
            purposeOfLoan: '',
            edbranch: ''
        };

       

        if (!formData.loanAmountRequested) {
            newErrors.loanAmountRequested = 'Please enter Loan Amount';
        }

        if (!formData.customerAffordableEmi) {
            newErrors.customerAffordableEmi = 'Please enter Emi Payment Amount';
        }

        if (!formData.purposeOfLoan) {
            newErrors.purposeOfLoan = 'Please Enter Purpose of Loan';
        }

        if (!formData.edbranch) {
            newErrors.edbranch = 'Please select the branch';
        }


        setErrors(newErrors);
        return Object.values(newErrors).every(x => x === '');
    };

    const updateLoanJson = () => {
        console.log("loan Form Data:", formData.loanAmountRequested);
        myLoan.application.loanamount = formData.loanAmountRequested;

        console.log("emi Form Data:", formData.customerAffordableEmi);
        myLoan.application.affordableemi = formData.customerAffordableEmi;

        console.log("purpose Form Data:", formData.purposeOfLoan);
        myLoan.application.loanpurpose = formData.purposeOfLoan;

        console.log("branch Form Data:", formData.edbranch);
        myLoan.application.bankparticulars.location.branch = formData.edbranch;
        myLoan.application.bankparticulars.logindate = currDate + ' ' + currTime;
        myLoan.userid = 'psivaraju';

        console.log("Json Form Data:", myLoan);
       
    };


    const SubmitData = async () => {
        if (checkValidation()) {
            console.log("Form submitted");
           
        }


        updateLoanJson();

        const userData = localStorage.getItem("user_data");
        if (!userData) {
            throw new Error("No user data found in local storage");
        }

        const user: UserData = JSON.parse(userData);
       debugger;
        const headers = {
            "Authorization": "Bearer " + user.token,
            "Content-Type": "application/json"
        };
        axios.post('https://3.7.159.34/rightprofile/api/app/reach', myLoan, { headers })
            .then(response => {
                console.log("Login Response data", response)
                localStorage.setItem("loan_data", JSON.stringify(response.data));
                setErrorMsg("");
                navigate("/personal")
            }).catch((error) => {
                console.log("Error response:", error)
                setErrorMsg("Invalid Username or Password")
            });

    } 

  return (
    <>
      <SideMenu />
      <div className="content-wrapper-user-tab mt-5">
        <div className="col-md-4 col-lg-6 mb-2 mt-1">
          <div className="title-header">
            <h2>Loan</h2>
          </div>
        </div>


        <Tabs
          id="main-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k || 'loanInfo')}
          className="custom-tabs"
        >
          <Tab eventKey="loanInfo" title="Loan Information" tabClassName="outerTabs">
            <div className="tab-content">


              <div className="container mt-5">
                <h3>Loan Summary</h3>
                <hr></hr>
                <Form>
                  <Row className="mb-3">
                    <Col md={3}>
                      <Form.Group controlId="loanAmountRequestedid">
                        <Form.Label className="custom-form-label">Loan Amount Requested *</Form.Label>
                        <Form.Control name="loanAmountRequested" onChange={handleChange} style={{ fontSize: '16px', height: '40px' }} type="number" min="15000" value={formData.loanAmountRequested} />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="customerAffordableEmiid">
                        <Form.Label className="custom-form-label">Customer Affordable EMI *</Form.Label>
                        <Form.Control name="customerAffordableEmi" onChange={handleChange} style={{ fontSize: '16px', height: '40px' }} type="number" min="800" value={formData.customerAffordableEmi} />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="purposeOfLoanid">
                        <Form.Label className="custom-form-label">Purpose of Loan *</Form.Label>
                        <Form.Select size="lg" name="purposeOfLoan" onChange={handleChange} style={{ fontSize: '16px', height: '40px' }} aria-label="Select Purpose of loan">
                          <option></option>
                          {
                            loanPurposes.map((item, i) => (<option key={i} value={item.key}>{item.value}</option>)
                            )
                          }
                        </Form.Select>

                      </Form.Group>
                    </Col>
                    <Col md={3}>
                       <Form.Group controlId="branchid">
                        <Form.Label className="custom-form-label">Branch *</Form.Label>
                        <Form.Select name="edbranch" onChange={handleChange} style={{ fontSize: '16px', height: '40px' }} size="lg" aria-label="Select the branch">
                          <option value=""></option>
                          {
                            edbranchList.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>)
                            )
                          }
                        </Form.Select>

                      </Form.Group>
                    </Col>

                  </Row>


                </Form>
              </div>


            </div>

            <div style={{ marginTop: '100px' }}>
                          <span style={{ marginTop: '30px' }}>Applicant Number</span> | <span style={{ marginTop: '30px' }}>Login Date : {currDate} {currTime}</span>
            </div>

          </Tab>

          <Tab eventKey="personal" title="Personal" tabClassName="outerTabs">
            <div className="tab-content">
              <div>
                <div className="col-md-4 col-lg-6 mb-2 mt-3">
                  <div className="title-header">
                    <h4>Applicants</h4>
                  </div>
                </div>
                <div className="card-box mh-50">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col"><span style={{ fontSize: "200%", color: "yellow" }}>★</span></th>
                          <th scope="col">NAME</th>
                          <th scope="col">TYPE</th>
                          <th scope="col">DATE OF BIRTH</th>
                          <th scope="col">APPLICANT FOR</th>
                          <th scope="col">QUALIFICATION</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="table-row">
                          <td><span style={{ fontSize: "200%", color: "yellow" }}>★</span></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>


                <Tabs
                  activeKey={subTabkey}
                  onSelect={(k) => setSubTabKey(k || 'applicant')}
                  className="custom-tabs"
                >
                  <Tab eventKey="applicant" title="Applicant" tabClassName="innerTabs">
                    <div className="tab-content">

                      <div className="tab-content custom-tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="tab5" role="tabpanel" aria-labelledby="tab5-tab">
                          <div className="form-group row mt-4">
                            <div className="col-sm-12 text-left">
                              <div className="form-check">
                                <input type="checkbox" className="custom-form-label form-check-input" id="Active" />
                                <label className="custom-form-label form-check-label" htmlFor="Active">Primary Applicant</label>
                              </div>
                            </div>
                          </div>

                          <Form className="page-section">
                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="">
                                  <Form.Label className="custom-form-label">On Application For*:</Form.Label>
                                  <FormControl type="text" className="form-control" name="applicantfor" />
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Label className="custom-form-label" >Applicant Type*:</Form.Label>
                                <FormControl type="text" className="form-control" id="lastname1" />
                              </Col>
                              <Col md={3}>
                                <Form.Group className="form-check mt-4">
                                  <FormControl type="checkbox" className="form-check-input" id="Active" />
                                  <Form.Label className="custom-form-label form-check-label mx-2" htmlFor="Active">Head Of Family</Form.Label>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="qualification">
                                  <Form.Label className="custom-form-label" >Qualification *</Form.Label>
                                  <Form.Control as="select" name="qualification" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.QUALIFICATION.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="firstname">
                                  <Form.Label className="custom-form-label">First Name</Form.Label>
                                  <FormControl type="text" className="form-control" name="firstname" />
                                </Form.Group>
                              </Col>

                              <Col md={3}>
                                <Form.Group controlId="lastName">
                                  <Form.Label className="custom-form-label" >Last Name</Form.Label>
                                  <FormControl type="text" className="form-control" name="lastname" />
                                </Form.Group>
                              </Col>

                              <Col md={3}>
                                <Form.Group controlId="dob">
                                  <Form.Label className="custom-form-label" >Date Of Birth:</Form.Label>
                                  <FormControl type="date" className="form-control" name="dob" />
                                </Form.Group>
                              </Col>

                              <Col md={3}>
                                <Form.Group controlId="lastName">
                                  <Form.Label className="custom-form-label" >Gender</Form.Label>
                                  <Form.Control as="select" name="gender" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.Gender.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={4}>
                                <Form.Group controlId="pincode">
                                  <Form.Label className="custom-form-label">Pin Code</Form.Label>
                                  <FormControl type="number" min="0" className="form-control" name="firstname" />
                                </Form.Group>
                              </Col>
                              <Col md={2} className='mt-37'>
                                <Form.Group controlId="pincode">
                                  <Button variant='primary'>Fetch</Button>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={4}>
                                <Form.Group controlId="address1">
                                  <Form.Label className="custom-form-label">Address Line 1 *</Form.Label>
                                  <FormControl type="text" name="address1" />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group controlId="address2">
                                  <Form.Label className="custom-form-label">Address Line 2 *</Form.Label>
                                  <FormControl type="text" name="address2" />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group controlId="state">
                                  <Form.Label className="custom-form-label">State / Union Territory *</Form.Label>
                                  <FormControl type="number" name="state" />
                                </Form.Group>
                              </Col>

                            </Row>

                            <Row className="mt-3">
                              <Col md={4}>
                                <Form.Group controlId="city">
                                  <Form.Label className="custom-form-label">City / Village *</Form.Label>
                                  <FormControl type="text" name="city" />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group controlId="district">
                                  <Form.Label className="custom-form-label">District *</Form.Label>
                                  <FormControl type="text" name="district" />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group controlId="locality">
                                  <Form.Label className="custom-form-label">Locality *</Form.Label>
                                  <FormControl type="text" name="locality" />
                                </Form.Group>
                              </Col>

                            </Row>

                            <Row className="mt-3">
                              <Form.Group controlId="distance" className="form-check mt-4">
                                <FormControl name="distance" type="checkbox" className="form-check-input" />
                                <Form.Label className="custom-form-label form-check-label mx-2" >Select to calculate the distance between the proposed property and the current residence.</Form.Label>
                              </Form.Group>
                            </Row>

                            <Row className="mt-3">
                              <Form.Group controlId="dependents" className="form-check mt-4">
                                <FormControl name="distance" type="checkbox" className="form-check-input" />
                                <Form.Label className="custom-form-label form-check-label mx-2" >Dependents?</Form.Label>
                              </Form.Group>
                            </Row>

                            <Row className="mt-3">
                              <Col md={2}>
                                <Form.Group controlId="spouse">
                                  <Form.Label className="custom-form-label">Spouse (Number)</Form.Label>
                                  <FormControl type="number" min="0" name="spouse" />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group controlId="parent">
                                  <Form.Label className="custom-form-label">Parents (Number)</Form.Label>
                                  <FormControl type="number" min="0" name="parent" />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group controlId="brother">
                                  <Form.Label className="custom-form-label">Brother (Number)</Form.Label>
                                  <FormControl type="number" min="0" name="brother" />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group controlId="sister">
                                  <Form.Label className="custom-form-label">Sister (Number)</Form.Label>
                                  <FormControl type="number" min="0" name="sister" />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group controlId="children">
                                  <Form.Label className="custom-form-label">Brother (Number)</Form.Label>
                                  <FormControl type="number" min="0" name="children" />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group controlId="others">
                                  <Form.Label className="custom-form-label">Others (Number)</Form.Label>
                                  <FormControl type="number" min="0" name="others" />
                                </Form.Group>
                              </Col>

                            </Row>

                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="earningmembers">
                                  <Form.Label className="custom-form-label" >Earning Members</Form.Label>
                                  <Form.Control as="select" name="earningmembers" >
                                    {
                                      dropDownLists.members.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="totalmembers">
                                  <Form.Label className="custom-form-label" >Total Members</Form.Label>
                                  <Form.Control as="select" name="totalmembers" >
                                    {
                                      dropDownLists.members.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="earningmembers">
                                  <Form.Label className="custom-form-label" >Current Residence (Yrs) *</Form.Label>
                                  <Form.Control as="select" name="earningmembers" >
                                    {
                                      dropDownLists.yearsresidence.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="totalmembers">
                                  <Form.Label className="custom-form-label" >Current Residence (Mths) *</Form.Label>
                                  <Form.Control as="select" name="totalmembers" >
                                    {
                                      dropDownLists.monthsresidence.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="earningmembers">
                                  <Form.Label className="custom-form-label" >Residence in Current City (Yrs) *</Form.Label>
                                  <Form.Control as="select" name="earningmembers" >
                                    {
                                      dropDownLists.yearsresidence.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="totalmembers">
                                  <Form.Label className="custom-form-label" >Residence in Current City (Mths) *</Form.Label>
                                  <Form.Control as="select" name="totalmembers" >
                                    {
                                      dropDownLists.monthsresidence.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="earningmembers">
                                  <Form.Label className="custom-form-label" >Residence Type *</Form.Label>
                                  <Form.Control as="select" name="earningmembers" >
                                    {
                                      dropDownLists.residenceTypes.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="totalmembers">
                                  <Form.Label className="custom-form-label" >Distance from Work Place</Form.Label>
                                  <Form.Control as="select" name="totalmembers" >
                                    {
                                      dropDownLists.distanceRange.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="earningmembers">
                                  <Form.Label className="custom-form-label" >Residence Ownership *</Form.Label>
                                  <Form.Control as="select" name="earningmembers" >
                                    {
                                      dropDownLists.ownership.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="residencearea">
                                  <Form.Label className="custom-form-label" >Residence Premise Area (sq ft) *</Form.Label>
                                  <FormControl type="number" min="0" name="residencearea" />
                                </Form.Group>
                              </Col>
                            </Row>




                          </Form>
                        </div>
                        <div className="tab-pane fade" id="tab6" role="tabpanel" aria-labelledby="tab6-tab"></div>
                        <div className="tab-pane fade" id="tab7" role="tabpanel" aria-labelledby="tab7-tab"></div>
                        <div className="tab-pane fade" id="tab8" role="tabpanel" aria-labelledby="tab8-tab"></div>
                        <div className="tab-pane fade" id="tab9" role="tabpanel" aria-labelledby="tab9-tab"></div>
                      </div>

                    </div>
                  </Tab>
                  <Tab eventKey="bank" title="Banking" tabClassName="innerTabs" >
                    <div className="tab-content">
                      banking
                    </div>
                  </Tab>
                  <Tab eventKey="repayment" title="Repayment" tabClassName="innerTabs">
                    <div className="tab-content">
                      repayment
                    </div>
                  </Tab>

                  <Tab eventKey="sitevisit" title="Site Visit" tabClassName="innerTabs">

                    <div className="tab-content">
                      SITE VISIT
                    </div>
                  </Tab>

                  <Tab eventKey="networth" title="Net Worth" tabClassName="innerTabs">

                    <div className="tab-content">
                      North Worth
                    </div>
                  </Tab>
                </Tabs>

                {/* <div className="tab-content custom-tab-content" id="myTabContent">
                  <div className="tab-pane fade show active" id="tab5" role="tabpanel" aria-labelledby="tab5-tab">
                    <div className="form-group row mt-4">
                      <div className="col-sm-12 text-left">
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="Active" />
                          <label className="form-check-label" htmlFor="Active">Primary Applicant</label>
                        </div>
                      </div>
                    </div>

                    <form action="dashboard.html" className="page-section">
                      <div className="row align-items-center">
                        <div className="col-3 form-group">
                          <label htmlFor="username1">On Application For*:</label>
                          <input type="text" className="form-control" id="username1" />
                        </div>
                        <div className="col-3 form-group">
                          <label htmlFor="lastname1">Applicant Type*:</label>
                          <input type="text" className="form-control" id="lastname1" />
                        </div>
                        <div className="col-3 form-group">
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="Active" />
                            <label className="form-check-label" htmlFor="Active">Head Of Family</label>
                          </div>
                        </div>
                        <div className="col-3 form-group">
                          <label htmlFor="Qualification">Qualification*</label>
                          <input type="text" className="form-control" id="Qualification" />
                        </div>
                      </div>
                      <div className="row align-items-center">
                        <div className="col-3 form-group">
                          <label htmlFor="username2">First name:</label>
                          <input type="text" className="form-control" id="username2" />
                        </div>
                        <div className="col-3 form-group">
                          <label htmlFor="username2">Middle Name:</label>
                          <input type="text" className="form-control" id="username2" />
                        </div>
                        <div className="col-3 form-group">
                          <label htmlFor="lastname2">Last name:</label>
                          <input type="text" className="form-control" id="lastname2" />
                        </div>
                        <div className="col-3 form-group">
                          <label htmlFor="DateOfBirth">Date of Birth</label>
                          <input type="text" className="form-control" id="DateOfBirth" />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="tab-pane fade" id="tab6" role="tabpanel" aria-labelledby="tab6-tab"></div>
                  <div className="tab-pane fade" id="tab7" role="tabpanel" aria-labelledby="tab7-tab"></div>
                  <div className="tab-pane fade" id="tab8" role="tabpanel" aria-labelledby="tab8-tab"></div>
                  <div className="tab-pane fade" id="tab9" role="tabpanel" aria-labelledby="tab9-tab"></div>
                </div> */}
              </div>


            </div>
          </Tab>

          <Tab eventKey="household" title="Household Expenses" tabClassName="outerTabs">
            <div className="tab-content">
              {/* Loan Information Content */}
            </div>
          </Tab>

          <Tab eventKey="property" title="Property" tabClassName="outerTabs">
            <div className="tab-content">
              {/* Loan Information Content */}
            </div>
          </Tab>



        </Tabs>

        {/* <Outlet /> */}
        {/* <div className="tab-content custom-tab-content" id="myTabContent"> */}
        {/* <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">Hellow</div> */}


        {/* <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
                <div className="col-md-4 col-lg-6 mb-2 mt-3">
                  <div className="title-header">
                    <h4>Applicants</h4>
                  </div>
                </div>
                <div className="card-box mh-50">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col"><span style={{ fontSize: "200%", color: "yellow" }}>&starf;</span></th>
                          <th scope="col">NAME</th>
                          <th scope="col">TYPE</th>
                          <th scope="col">DATE OF BIRTH</th>
                          <th scope="col">APPLICANT FOR</th>
                          <th scope="col">QUALIFICATION</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="table-row">
                          <td><span style={{ fontSize: "200%", color: "yellow" }}>&starf;</span></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <ul className="nav nav-tabs custom-tabs" id="myTab" role="tablist">
                  <li className="nav-item">
                    <a className="nav-link active" id="tab5-tab" data-toggle="tab" href="#tab5" role="tab" aria-controls="tab5" aria-selected="true">Applicant</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" id="tab6-tab" data-toggle="tab" href="#tab6" role="tab" aria-controls="tab6" aria-selected="false">Banking</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" id="tab7-tab" data-toggle="tab" href="#tab7" role="tab" aria-controls="tab7" aria-selected="false">Repayment</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" id="tab8-tab" data-toggle="tab" href="#tab8" role="tab" aria-controls="tab8" aria-selected="false">Site Visit</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" id="tab9-tab" data-toggle="tab" href="#tab9" role="tab" aria-controls="tab9" aria-selected="false">Net worth</a>
                  </li>
                </ul>
    
                <div className="tab-content custom-tab-content" id="myTabContent">
                  <div className="tab-pane fade show active" id="tab5" role="tabpanel" aria-labelledby="tab5-tab">
                    <div className="form-group row mt-4">
                      <div className="col-sm-12 text-left">
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="Active" />
                          <label className="form-check-label" htmlFor="Active">Primary Applicant</label>
                        </div>
                      </div>
                    </div>
    
                    <form action="dashboard.html" className="page-section">
                      <div className="row align-items-center">
                        <div className="col-3 form-group">
                          <label htmlFor="username1">On Application For*:</label>
                          <input type="text" className="form-control" id="username1" />
                        </div>
                        <div className="col-3 form-group">
                          <label htmlFor="lastname1">Applicant Type*:</label>
                          <input type="text" className="form-control" id="lastname1" />
                        </div>
                        <div className="col-3 form-group">
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="Active" />
                            <label className="form-check-label" htmlFor="Active">Head Of Family</label>
                          </div>
                        </div>
                        <div className="col-3 form-group">
                          <label htmlFor="Qualification">Qualification*</label>
                          <input type="text" className="form-control" id="Qualification" />
                        </div>
                      </div>
                      <div className="row align-items-center">
                        <div className="col-3 form-group">
                          <label htmlFor="username2">First name:</label>
                          <input type="text" className="form-control" id="username2" />
                        </div>
                        <div className="col-3 form-group">
                          <label htmlFor="username2">Middle Name:</label>
                          <input type="text" className="form-control" id="username2" />
                        </div>
                        <div className="col-3 form-group">
                          <label htmlFor="lastname2">Last name:</label>
                          <input type="text" className="form-control" id="lastname2" />
                        </div>
                        <div className="col-3 form-group">
                          <label htmlFor="DateOfBirth">Date of Birth</label>
                          <input type="text" className="form-control" id="DateOfBirth" />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="tab-pane fade" id="tab6" role="tabpanel" aria-labelledby="tab6-tab"></div>
                  <div className="tab-pane fade" id="tab7" role="tabpanel" aria-labelledby="tab7-tab"></div>
                  <div className="tab-pane fade" id="tab8" role="tabpanel" aria-labelledby="tab8-tab"></div>
                  <div className="tab-pane fade" id="tab9" role="tabpanel" aria-labelledby="tab9-tab"></div>
                </div>
              </div> */}

        {/* <div className="tab-pane fade" id="tab3" role="tabpanel" aria-labelledby="tab3-tab"></div>
              <div className="tab-pane fade" id="tab4" role="tabpanel" aria-labelledby="tab4-tab"></div> */}
        {/* </div> */}
      </div>

      <div style={{ float: 'right' }}>
        <Button variant="danger"><span style={{ borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block', width: '23px', height: '23px' }}><i className="fa fa-arrow-left text-danger"></i></span> Cancel</Button>
              <Button type="button" onClick={SubmitData} style={{ background: '#ffe600', margin: '3px', borderColor: '#ffe600' }}>Save & Continue <span style={{ borderRadius: '50%', backgroundColor: '#fff', color: '#ffe600', display: 'inline-block', width: '23px', height: '23px' }}><i className="fa fa-arrow-right text-yellow"></i></span></Button>
        <Button variant="success">Finalize <span style={{ borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block', width: '23px', height: '23px' }}><i className="fa fa-arrow-right text-success"></i></span></Button>

      </div>
    </>
  );
}

export default LoanCreationPhases;

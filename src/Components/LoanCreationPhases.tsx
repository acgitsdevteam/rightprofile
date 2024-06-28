import React, { useState } from 'react';
import SideMenu from './Layout/SideMenu';
import { Outlet, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { Form, Col, Row, FormControl } from 'react-bootstrap';
import { edbranchList, loanPurposes, dropDownLists } from './Services/Branches';
import myLoan from './Model/Loan.json';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


interface UserData {
  token: string;
  userId: string;
  usertype: string;
  role: string;
}



const LoanCreationPhases = () => {

  const [key, setKey] = useState<string>('loanInfo');
  const [innerKey, setInnerKey] = useState<string>('applicant');

  const [subTabkey, setSubTabKey] = useState<string>('applicant');
  const [innerSubKey, setInnerSubKey] = useState<string>('applicant');

  const [loanData, setLoanData] = useState({});
  const [loading, setLoading] = useState(false);



  const userData = localStorage.getItem("user_data");
  if (!userData) {
    throw new Error("No user data found in local storage");
  }

  const user: UserData = JSON.parse(userData);


  const month = new Date().getMonth() + 1;
  let smonth = '';
  if (month < 10)
    smonth = '0' + month;
  else
    smonth = month.toString();
  const year = new Date().getFullYear();
  const date = new Date().getDate();
  const currDate = date + "/" + smonth + "/" + year;
  let currTime = '';
  const chrs = new Date().getHours();
  const cmins = new Date().getMinutes();
  const csecs = new Date().getSeconds();
  let ampm = '';
  if (chrs < 10) {
    currTime = 0 + chrs.toString() + ':';
    ampm = " AM";
  }
  else {
    currTime = chrs.toString() + ':';
    if (chrs > 12) {
      if (chrs - 12 < 10)
        currTime = "0" + (chrs - 12).toString() + ':';
      else
        currTime = (chrs - 12).toString() + ':';
      ampm = " PM";
    }
    else
      ampm = "AM";

  }
  if (cmins < 10)
    currTime = currTime + 0 + cmins.toString() + ':';
  else
    currTime = currTime + cmins.toString() + ':';

  if (csecs < 10)
    currTime = currTime + 0 + csecs.toString();
  else
    currTime = currTime + csecs.toString()

  currTime = currTime + ampm;


  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    loanAmountRequested: 0,
    customerAffordableEmi: 0,
    purposeOfLoan: '',
    edbranch: '',
    applicantfor: '',
    type: '',
    primary: false,
    familyHead: false,
    firstname: '',
    lastname: '',
    dob: '',
    gender: '',
    address1: '',
    address2: '',
    district: '',
    city: '',
    state: '',
    zipcode: '',
    locality: '',
    latitude: '',
    longitude: '',
    distance: '',
    qualification: '',
    dependents: false,
    standards: [],
    earningnumbers: 0,
    totalmembers: 0,
    yearsincurrentresidence: 0,
    monthincurrentresidence: 0,
    yearsincurrentcity: 0,
    monthincurrentcity: 0,
    residencetype: '',
    distancework: '',
    residenceownership: '',
    residencearea: '',
    spouseaware: false,
    vehiclesOwned: [],
    remarks: '',
    bankaccounts: [],
    repayments: [],
    sitevisits: [],
    networth: {},
    employer: {},
    income: {}
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    loanAmountRequested: '',
    customerAffordableEmi: '',
    purposeOfLoan: '',
    edbranch: ''
  });

  const [loanID, setLoanID] = useState(0);
  const [applicationNumber, setApplicationNumber] = useState('');

  console.log("LOAN ID:", loanID);
  console.log("Application ID:", applicationNumber);

  const handleNavigation = () => {
    //console.log("loan ID:", loanData)
    setKey('loanInfo')
  }

  const handleChange = (e: any) => {
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
      newErrors.purposeOfLoan = 'Please select purpose of Loan';
    }

    if (!formData.edbranch) {
      newErrors.edbranch = 'Please select the branch';
    }

    console.log("Error object:", newErrors)
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

    myLoan.userid = user.userId;
    myLoan.status = "Draft";

    console.log("Json Form Data:", myLoan);


  };


  const SubmitData = async () => {

    try {

      if (checkValidation()) {
        console.log("Form submitted");

        updateLoanJson();

        setLoading(true);


        const headers = {
          "Authorization": "Bearer " + user.token,
          "Content-Type": "application/json"
        }

        const config: AxiosRequestConfig = {
          headers: headers
        };
        const response: AxiosResponse = await axios.post(
          process.env.REACT_APP_API_URL + "/app/reach",
          myLoan,
          config
        );
        console.log("Loan api response: ", response.data)

        setLoanData(response.data);
        //setLoanID(response.data.id);
        //setApplicationNumber(response.data.applicationnumber)
        setLoading(false);


        if (key === 'loanInfo') {
          setKey('personal');

        }


      }


    }
    catch (error) {
      console.log("Error response:", error);
      setErrorMsg("failed api call");
      setLoading(false);
    }

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

              <img style={{ display: loading ? 'block' : 'none' }} className="loading-img" src={`${process.env.PUBLIC_URL}/loading-wheel.gif`} alt="" width="90" height="90" />

              <div className="container mt-5">
                <h3>Loan Summary</h3>
                <hr></hr>
                <Form>
                  <Row className="mb-3">
                    <Col md={3}>
                      <Form.Group controlId="loanAmountRequested">
                        <Form.Label className="custom-form-label">Loan Amount Requested *</Form.Label>
                        <Form.Control name="loanAmountRequested" onChange={handleChange} style={{ fontSize: '16px', height: '40px' }} type="number" min="15000" value={formData.loanAmountRequested} />
                        {errors.loanAmountRequested && <p style={{ color: 'red' }}>{errors.loanAmountRequested}</p>}
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="customerAffordableEmi">
                        <Form.Label className="custom-form-label">Customer Affordable EMI *</Form.Label>
                        <Form.Control name="customerAffordableEmi" onChange={handleChange} style={{ fontSize: '16px', height: '40px' }} type="number" min="800" value={formData.customerAffordableEmi} />
                        {errors.customerAffordableEmi && <p style={{ color: 'red' }}>{errors.customerAffordableEmi}</p>}
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="purposeOfLoan">
                        <Form.Label className="custom-form-label">Purpose of Loan *</Form.Label>
                        <Form.Select name="purposeOfLoan" onChange={handleChange} size="lg" style={{ fontSize: '16px', height: '40px' }} aria-label="Select Purpose of loan">
                          <option></option>
                          {
                            loanPurposes.map((item, i) => (<option key={i} value={item.key}>{item.value}</option>)
                            )
                          }
                        </Form.Select>
                        {errors.purposeOfLoan && <p style={{ color: 'red' }}>{errors.purposeOfLoan}</p>}

                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="branch">
                        <Form.Label className="custom-form-label">Branch *</Form.Label>
                        <Form.Select name="edbranch" onChange={handleChange} style={{ fontSize: '16px', height: '40px' }} size="lg" aria-label="Select the branch">
                          <option value=""></option>
                          {
                            edbranchList.map((item, i) => (<option key={i} value={item.type}>{item.type}</option>)
                            )
                          }
                        </Form.Select>
                        {errors.edbranch && <p style={{ color: 'red' }}>{errors.edbranch}</p>}

                      </Form.Group>
                    </Col>

                  </Row>


                </Form>
              </div>


            </div>

            <div style={{ marginTop: '100px' }}>
              <span style={{ marginTop: '30px' }}>Applicant Number</span> | <span style={{ marginTop: '30px' }}>Login Date</span>
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
                                <input type="checkbox" name="primary" onChange={handleChange} className="custom-form-label form-check-input" id="Active" />
                                <label className="custom-form-label form-check-label" htmlFor="Active">Primary Applicant</label>
                              </div>
                            </div>
                          </div>

                          <Form className="page-section">
                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="">
                                  <Form.Label className="custom-form-label">On Application For*:</Form.Label>

                                  <Form.Select className="form-control" onChange={handleChange} name="applicantfor" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.applicantsFor.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Label className="custom-form-label" >Applicant Type*:</Form.Label>
                                <Form.Select className="form-control" onChange={handleChange} name="type" >
                                  <option value=""></option>

                                </Form.Select>
                              </Col>
                              <Col md={3}>
                                <Form.Group className="form-check mt-4">
                                  <FormControl type="checkbox" onChange={handleChange} name="familyHead" className="form-check-input" />
                                  <Form.Label className="custom-form-label form-check-label mx-2" htmlFor="Active">Head Of Family</Form.Label>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="qualification">
                                  <Form.Label className="custom-form-label" >Qualification *</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="qualification" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.QUALIFICATION.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="firstname">
                                  <Form.Label className="custom-form-label">First Name</Form.Label>
                                  <FormControl type="text" onChange={handleChange} name="firstname" value={formData.firstname} />
                                </Form.Group>
                              </Col>

                              <Col md={3}>
                                <Form.Group controlId="lastName">
                                  <Form.Label className="custom-form-label" >Last Name</Form.Label>
                                  <FormControl type="text" name="lastname" onChange={handleChange} value={formData.lastname} />
                                </Form.Group>
                              </Col>

                              <Col md={3}>
                                <Form.Group controlId="dob">
                                  <Form.Label className="custom-form-label" >Date Of Birth:</Form.Label>
                                  <FormControl type="date" className="form-control" name="dob" onChange={handleChange} value={formData.dob} />
                                </Form.Group>
                              </Col>

                              <Col md={3}>
                                <Form.Group controlId="lastName">
                                  <Form.Label className="custom-form-label" >Gender</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="gender" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.Gender.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={4}>
                                <Form.Group controlId="pincode">
                                  <Form.Label className="custom-form-label">Pin Code</Form.Label>
                                  <FormControl type="number" min="0" className="form-control" onChange={handleChange} name="zipcode" value={formData.zipcode} />
                                </Form.Group>
                              </Col>
                              <Col md={2} >
                                <Form.Group controlId="fetch">
                                  <Button className="form-control" style={{ color: "#fff", backgroundColor: "#ed1d25", borderColor: "#df121a", marginTop: "33px", marginLeft: "18px", width: "100px" }} >Fetch</Button>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={4}>
                                <Form.Group controlId="address1">
                                  <Form.Label className="custom-form-label">Address Line 1 *</Form.Label>
                                  <FormControl type="text" name="address1" onChange={handleChange} value={formData.address1} />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group controlId="address2">
                                  <Form.Label className="custom-form-label">Address Line 2 *</Form.Label>
                                  <FormControl type="text" name="address2" onChange={handleChange} value={formData.address2} />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group controlId="state">
                                  <Form.Label className="custom-form-label">State / Union Territory *</Form.Label>
                                  <FormControl type="number" name="state" onChange={handleChange} value={formData.state} />
                                </Form.Group>
                              </Col>

                            </Row>

                            <Row className="mt-3">
                              <Col md={4}>
                                <Form.Group controlId="city">
                                  <Form.Label className="custom-form-label">City / Village *</Form.Label>
                                  <FormControl type="text" name="city" onChange={handleChange} value={formData.city} />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group controlId="district">
                                  <Form.Label className="custom-form-label">District *</Form.Label>
                                  <FormControl type="text" name="district" onChange={handleChange} value={formData.district} />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group controlId="locality">
                                  <Form.Label className="custom-form-label">Locality *</Form.Label>
                                  <FormControl type="text" name="locality" onChange={handleChange} value={formData.locality} />
                                </Form.Group>
                              </Col>

                            </Row>

                            <Row className="mt-3">
                              <Form.Group controlId="distance" className="form-check mt-4">
                                <FormControl name="distance" onChange={handleChange} type="checkbox" className="form-check-input" />
                                <Form.Label className="custom-form-label form-check-label mx-2" >Select to calculate the distance between the proposed property and the current residence.</Form.Label>
                              </Form.Group>
                            </Row>

                            <Row className="mt-3">
                              <Form.Group controlId="dependents" className="form-check mt-4">
                                <FormControl name="dependents" onChange={handleChange} type="checkbox" className="form-check-input" />
                                <Form.Label className="custom-form-label form-check-label mx-2" >Dependents?</Form.Label>
                              </Form.Group>
                            </Row>

                            <Row className="mt-3">
                              <Col md={2}>
                                <Form.Group controlId="spouse">
                                  <Form.Label className="custom-form-label">Spouse (Number)</Form.Label>
                                  <FormControl type="number" onChange={handleChange} min="0" name="spouse" />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group controlId="parent">
                                  <Form.Label className="custom-form-label">Parents (Number)</Form.Label>
                                  <FormControl type="number" onChange={handleChange} min="0" name="parent" />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group controlId="brother">
                                  <Form.Label className="custom-form-label">Brother (Number)</Form.Label>
                                  <FormControl type="number" onChange={handleChange} min="0" name="brother" />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group controlId="sister">
                                  <Form.Label className="custom-form-label">Sister (Number)</Form.Label>
                                  <FormControl type="number" onChange={handleChange} min="0" name="sister" />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group controlId="children">
                                  <Form.Label className="custom-form-label">Brother (Number)</Form.Label>
                                  <FormControl type="number" onChange={handleChange} min="0" name="children" />
                                </Form.Group>
                              </Col>
                              <Col md={2}>
                                <Form.Group controlId="others">
                                  <Form.Label className="custom-form-label">Others (Number)</Form.Label>
                                  <FormControl type="number" onChange={handleChange} min="0" name="others" />
                                </Form.Group>
                              </Col>

                            </Row>

                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="earningnumbers">
                                  <Form.Label className="custom-form-label" >Earning Members</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="earningnumbers" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.members.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="totalmembers">
                                  <Form.Label className="custom-form-label" >Total Members</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="totalmembers" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.members.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="yearsincurrentresidence">
                                  <Form.Label className="custom-form-label" >Current Residence (Yrs) *</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="yearsincurrentresidence" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.yearsresidence.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="monthincurrentresidence">
                                  <Form.Label className="custom-form-label" >Current Residence (Mths) *</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="monthincurrentresidence" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.monthsresidence.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="yearsincurrentcity">
                                  <Form.Label className="custom-form-label" >Residence in Current City (Yrs) *</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="yearsincurrentcity" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.yearsresidence.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="monthincurrentcity">
                                  <Form.Label className="custom-form-label" >Residence in Current City (Mths) *</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="monthincurrentcity" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.monthsresidence.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="residencetype">
                                  <Form.Label className="custom-form-label" >Residence Type *</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="residencetype" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.residenceTypes.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="distancework">
                                  <Form.Label className="custom-form-label" >Distance from Work Place</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="distancework" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.distanceRange.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="residenceownership">
                                  <Form.Label className="custom-form-label" >Residence Ownership *</Form.Label>
                                  <Form.Select className="form-control" onChange={handleChange} name="residenceownership" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.ownership.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="residencearea">
                                  <Form.Label className="custom-form-label" >Residence Premise Area (sq ft) *</Form.Label>
                                  <FormControl type="number" onChange={handleChange} min="0" name="residencearea" value={formData.residencearea} />
                                </Form.Group>
                              </Col>
                            </Row>


                            <Row className="mt-3">
                              <Col md={3}>
                                <Form.Group controlId="vehiclesOwned">
                                  <Form.Label className="custom-form-label" >Vehicle Owned</Form.Label>
                                  <Form.Select onChange={handleChange} name="vehiclesOwned" >
                                    <option value=""></option>
                                    {
                                      dropDownLists.vehicleOwned.map((item, i) => (<option key={i} value={item.code}>{item.type}</option>))
                                    }
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="spouseaware" className="form-check mt-4">
                                  <FormControl name="spouseaware" onChange={handleChange} type="checkbox" className="form-check-input" />
                                  <Form.Label className="custom-form-label form-check-label mx-2" >
                                    Spouse Aware of the Transaction?
                                  </Form.Label>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="isillness" className="form-check mt-4">
                                  <FormControl onChange={handleChange} name="isillness" type="checkbox" className="form-check-input" />
                                  <Form.Label className="custom-form-label form-check-label mx-2" >
                                    Major illnesses during last 3 years?
                                  </Form.Label>
                                </Form.Group>
                              </Col>
                              <Col md={3}>
                                <Form.Group controlId="illnessReason">
                                  <Form.Label className="custom-form-label" >Please Specify *</Form.Label>
                                  <FormControl type="text" name="illnessReason" />
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Form.Group controlId="earningmembers">
                                <Form.Label className="custom-form-label" >Remarks</Form.Label>
                                <FormControl onChange={handleChange} as="textarea" rows={6}
                                  style={{ width: '100%', height: '120px' }}
                                />

                              </Form.Group>
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

      </div>

      <div style={{ float: 'right' }}>
        <Button variant="danger"><span style={{ borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block', width: '23px', height: '23px' }} onClick={handleNavigation}><i className="fa fa-arrow-left text-danger"></i></span> Cancel</Button>
        <Button onClick={SubmitData} style={{ background: '#ffe600', margin: '3px', borderColor: '#ffe600' }}>Save & Continue <span style={{ borderRadius: '50%', backgroundColor: '#fff', color: '#ffe600', display: 'inline-block', width: '23px', height: '23px' }}><i className="fa fa-arrow-right text-yellow"></i></span></Button>
        <Button variant="success">Finalize <span style={{ borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block', width: '23px', height: '23px' }}><i className="fa fa-arrow-right text-success"></i></span></Button>

      </div>
    </>
  );
}

export default LoanCreationPhases;
import React, { useState, useEffect, useRef } from 'react';
import SideMenu from './Layout/SideMenu';
import DataTable from './Layout/DataTable';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import axios, { AxiosRequestConfig } from "axios";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

interface UserData {
  token: string;
  userId: string;
  usertype: string;
  role: string;
  // Add other fields if necessary
}

interface Header {
  Authorization: string;
  "Content-Type": string;
}


const PersonalDiscussion = () => {
  
  const navigate = useNavigate();

  const goToApplicant = () => {
    navigate('/loan');
  };

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [reset, setRest] = useState(false);
  //const pageSize = 10;

  const firstname = useRef<HTMLInputElement>(null);
  const lastname = useRef<HTMLInputElement>(null);
  const fileno = useRef<HTMLInputElement>(null);
  const fromdate = useRef<HTMLInputElement>(null);
  const todate = useRef<HTMLInputElement>(null);
  const status = useRef<HTMLSelectElement>(null);

  const handleTableChange = (
    type: TableChangeType,
    { page, sizePerPage, sortField, sortOrder }: TableChangeState<any>
  ) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const handleChange = (e: any) => {
    
    if (data.length) {
      setPage(0);
    }

  };

  const handleReset = () => {
    //setFilterData(initialFilterData);
    if (firstname.current) firstname.current.value = '';
    if (lastname.current) lastname.current.value = '';
    if (status.current) status.current.value = '';
    if (fileno.current) fileno.current.value = '';
    if (fromdate.current) fromdate.current.value = '';
    if (todate.current) todate.current.value = '';
    setPage(1);
    setData([]);
    setTotalSize(0);
    setRest(true)
    //console.log("Reset Form Data:", filterdata)


  };


  useEffect(() => {
    if (totalSize > 0) {
    fetchData();
    }
  }, [page, sizePerPage]);




  const fetchData = async () => {

    if (!reset) {
      try {

        const userData = localStorage.getItem("user_data");
        if (!userData) {
          throw new Error("No user data found in local storage");
        }

        const user: UserData = JSON.parse(userData);

        const headers = {
          "Authorization": "Bearer " + user.token,
          "Content-Type": "application/json"
        }

        const config: AxiosRequestConfig = {
          headers: headers
        };

        setLoading(true);
        const filterData = {
          "userid": user.userId,
          "fileno": fileno.current?.value ?? '',
          "status": status.current?.value ?? '',
          "fromdate": fromdate.current?.value ? fromdate.current?.value + 'T18:30:00.000Z' : '',
          "todate": todate.current?.value ? todate.current?.value + 'T18:30:00.000Z' : '',
          "role": user.role,
          "page": page ? (page - 1) : page,
          "size": sizePerPage,
          "usertype": user.usertype,
          "edbranch": null,
          "firstname": firstname.current?.value ?? '',
          "lastname": lastname.current?.value ?? ''
        }

        const response = await axios.post(
          "https://3.7.159.34/rightprofile/api/app/list",
          filterData,
          config
        );



        filterData.size = 2147483647;
        filterData.page = 0;

        const countResponse = await axios.post(
          "https://3.7.159.34/rightprofile/api/app/countbysearch",
          filterData,
          config
        );

        console.log("API response", response.data);
        setData(response.data);

        console.log("Count API response", countResponse);
        setTotalSize(countResponse.data);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

  };

  const columns = [
    { dataField: "File_No", text: "File Number", sort: true },
    { dataField: "Name", text: "Applicant Name", sort: true },
    { dataField: "Loan_Amount", text: "Loan Amount", sort: true },
    { dataField: "Reach_Status", text: "Status", sort: true },
    { dataField: "User_Id", text: "USER ID", sort: true },
    { dataField: "LOGIN_DATE", text: "Login Data", sort: true },
  ];



  const paginationOptions = {
    page,
    sizePerPage: sizePerPage,
    totalSize,
    onPageChange: (selectedPage: number) => { 
      console.log("selected page:", page)
      setPage(selectedPage);
      console.log("after selected page:", selectedPage)


    },
    onSizePerPageChange: (sizePerPage: number) => setSizePerPage(sizePerPage),

  };

  return (
    <>
      <SideMenu />
      <div className="content-wrapper mt-3">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col-md-4 col-lg-6 mb-2 mt-1">
              <div className="title-header">
                <h2>Personal Discussions</h2>
              </div>
            </div>
            <div className="col-md-8 col-lg-6 text-right header-btns">
              {/* <a href="#">Download <span className="icon-cloud-download"></span></a> */}
            </div>
          </div>
        </div>

        
        <section className="widget">
          <Form className="page-section" >
            <h5><strong>Search</strong></h5>
            <Row className="mb-3">
              <Col xs={1}>First name:</Col>
              <Col xs={3} className="form-group">
                <Form.Control type="text" onChange={handleChange} placeholder="Enter first name" ref={firstname} />
              </Col>
              <Col xs={1} className="form-group">
                <Form.Label htmlFor="fname">Last name:</Form.Label>
              </Col>
              <Col xs={3} className="form-group">
                <Form.Control type="text" onChange={handleChange} placeholder="Enter last name" ref={lastname} />
              </Col>
              <Col xs={1} className="form-group">
                <Form.Label htmlFor="fname">File number:</Form.Label>
              </Col>
              <Col xs={3} className="form-group">
                <Form.Control type="text" onChange={handleChange} placeholder="Enter file number" ref={fileno} />
              </Col>
            </Row>
            <Row>
              <Col xs={1} className="label-end">Status :</Col>
              <Col xs={3} className="form-group">
                <Form.Control as="select" onChange={handleChange} ref={status} >
                  <option value="">--All--</option>
                  <option value="PD_COMPLETED">Completed</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ERROR">Error</option>
                  <option value="RIGHTPROFILE_GENERATED">RightProfile™ Generated</option>
                  <option value="REPORT_GENERATED">PDF Report Generated (final)</option>
                </Form.Control>
              </Col>
              <Col xs={1} className="form-group">
                <Form.Label htmlFor="fname">Start :</Form.Label>
              </Col>
              <Col xs={3} className="form-group">
                <Form.Control type="date" onChange={handleChange} ref={fromdate} placeholder="DD/MM/YYYY" />
              </Col>
              <Col xs={1} className="form-group">
                <Form.Label htmlFor="fname">End :</Form.Label>
              </Col>
              <Col xs={3} className="form-group">
                <Form.Control type="date" onChange={handleChange} ref={todate} placeholder="DD/MM/YYYY" />
              </Col>
            </Row>
            <div className="form-actions">
              <Row className="justify-content-center">
                <Col sm={12} className="text-center">
                  <Button variant="danger" type="button" onClick={fetchData}>Search</Button>&nbsp;
                  <Button variant="secondary" onClick={handleReset}>Cancel</Button>
                </Col>
              </Row>
            </div>
          </Form>
        </section>

       



        <div className="container mt-5">
          <div style={{marginBottom:'2px'}}>
          <strong>Applications <a  style={{ cursor: "pointer", textDecoration: 'none',color:'blue' }}>
          <Link to="/loan"><i className="fa fa-plus fa-lg" aria-hidden="true"></i></Link></a></strong>
          </div>
          <img style={{ display: loading ? 'block' : 'none' }} className="loading-img" src={`${process.env.PUBLIC_URL}/loading-wheel.gif`} alt="" width="90" height="90" />
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            pagination={paginationFactory(paginationOptions)}
            remote={{ pagination: true }}
            onTableChange={handleTableChange}

          />
        </div>


      </div>


    </>
  )
}

export default PersonalDiscussion;
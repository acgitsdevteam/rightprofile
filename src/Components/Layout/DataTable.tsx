import React, {useEffect, useState} from 'react';
import BootstrapTable,{TableChangeState,TableChangeType} from 'react-bootstrap-table-next';
import paginationFactory from "react-bootstrap-table2-paginator";
//import overlayFactory from 'react-bootstrap-table2-overlay';

import axios, {AxiosRequestConfig} from "axios";
//import "bootstrap/dist/css/bootstrap.min.css";

interface UserData {
  token: string;
  // Add other fields if necessary
}

interface Header {
  Authorization: string;
  "Content-Type": string;
}

const BASE_URL=process.env.BACKEND_URL;

const DataTable = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalSize, setTotalSize] = useState(70);
    const [sizePerPage, setSizePerPage] = useState(100);
    const pageSize = 10;

    

    const handleTableChange = (
      type: TableChangeType,
      { page, sizePerPage, sortField, sortOrder }: TableChangeState<any>
    ) => {
      setPage(page);
      setSizePerPage(sizePerPage);
    };
  
  
    useEffect(() => {
      fetchData(page,sizePerPage);
    }, [page,sizePerPage]);
  
    const fetchData = async (selectedPage:number,sizePerPage:number) => {
      
      try {
        //const response = await axios.get(
          //`https://jsonplaceholder.typicode.com/posts?_page=${selectedPage}&_limit=${sizePerPage}`
        //);

        const filterData = {
          "userid":"psivaraju",
        "fileno":"",
        "status":"DRAFT",
        "fromdate":"","todate":null,
        "role":"U1VQRVJfVVNFUg==",
        "page":1,
        "size":10,
        "usertype":"Test",
        "edbranch":null
        }

        const userData = localStorage.getItem("user_data");
        if (!userData) {
          throw new Error("No user data found in local storage");
        }

    const user: UserData = JSON.parse(userData);

        const headers = {
          "Authorization": "Bearer " +user.token,
          "Content-Type": "application/json"
        }

        const config: AxiosRequestConfig = {
          headers: headers
        };
        const response = await axios.post(
          "https://3.7.159.34/rightprofile/api/app/list", 
          filterData,
          config
        );

        console.log("API response", response.data);
        setData(response.data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
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
      sizePerPage: pageSize,
      totalSize,
      onPageChange: (selectedPage:number) => {
        alert(selectedPage)
        console.log("selected page:", page)
        setPage(selectedPage);
        console.log("after selected page:", selectedPage)


      },
      onSizePerPageChange: (sizePerPage:number) => setSizePerPage(sizePerPage),
      
    };

    // const paginationOptions = {
    //   custom: true,
    //   totalSize: data.length,
    //   sizePerPage: 5,
    //   page: 1,
    //   sizePerPageList: [
    //     { text: '5', value: 5 },
    //     { text: '10', value: 10 },
    //     { text: 'All', value: data.length }
    //   ],
    //   onPageChange: (page:any, sizePerPage:any) => {
    //     console.log('Page:', page);
    //     console.log('Size Per Page:', sizePerPage);
    //   },
    //   onSizePerPageChange: (sizePerPage:any, page:any) => {
    //     console.log('Size Per Page:', sizePerPage);
    //     console.log('Page:', page);
    //   }
    // };
  
    return (
      <div className="container mt-5">
        
        <BootstrapTable
          keyField="id"
          data={data}
          columns={columns}
          pagination={paginationFactory(paginationOptions)}
          remote={{ pagination: true }}
          onTableChange={handleTableChange}

        />
      </div>
    );
}

export default DataTable
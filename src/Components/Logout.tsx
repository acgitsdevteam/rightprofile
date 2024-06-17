import React from 'react';


const Logout = () => {
    
    localStorage.removeItem("token-info");
    //navigate("/");
    return(<></>);
}

export default Logout;
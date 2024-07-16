// import React from 'react';
//
// const Logout = () => {
//     return (
//         <></>
//     );
// };
//
// export default Logout;


import {redirect} from "react-router-dom";

// 컴포넌트인데 실제 컴포넌트가 없는 경우
// 반드시 redirect코드가 필요
export const logoutAction = () => {
    localStorage.removeItem('userData');
    // setItem했을때 이름 localStorage.setItem('userData', JSON.stringify(responseData))
    return redirect('/')
};
import React from 'react';
import LoginForm from "../components/auth/LoginForm";
import Main from "../components/auth/Main";
import {useLoaderData, useRouteLoaderData} from "react-router-dom";

const WelcomePage = () => {

    // 상위 라우트 페이지의 loader 데이터 불러오기
    // 파라미터로 id를 넣어준다.
    const userData = useRouteLoaderData('user-data');
    console.log(userData)

    return (
        <>
            {!userData && <LoginForm/>}
            {userData && <Main/>}
        </>
    );
};

export default WelcomePage;
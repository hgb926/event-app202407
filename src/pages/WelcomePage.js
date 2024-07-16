import React, {useEffect, useState} from 'react';
import LoginForm from "../components/auth/LoginForm";
import Main from "../components/auth/Main";

const WelcomePage = () => {

    console.log("WelcomePage ^^ 😃");

    return (
        <>
            { <LoginForm/>}
            { <Main/>}
        </>
    );
};

export default WelcomePage;
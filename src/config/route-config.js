import React from "react";
import {createBrowserRouter} from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import EventLayout from "../layout/EventLayout";
import Events from "../pages/Events";
import EventDetail, {action as deleteAction, loader as eventDetailLoader} from "../pages/EventDetail";
import EditPage from "../pages/EditPage";
import {action as manipulateAction} from "../components/EventForm";
import NewEvent from "../pages/NewEvent";
import WelcomePage from "../pages/WelcomePage";
import SignUpPage from "../pages/SignUpPage";
import { loginAction } from "../components/auth/LoginForm";
import {authCheckLoader, userDataLoader} from "./auth";
import {logoutAction} from "../pages/Logout";
import EventProvider from "../components/context/EventProvider"
import VoiceChat from "../pages/VoiceChat";

// 라우터 설정

const eventsRouter = [
    {
        index: true,
        element: <Events/>,
        // loader: authCheckLoader
    },
    {
        path: ':eventId',
        loader: eventDetailLoader,
        // element: <EventDetail />,
        // loader가 children에게 직접적으로 연결되지 않아
        // EventDetail에서 loader를 사용하지 못하고 있음.
        id: 'event-detail', // loader에게 ID 부여
        children: [
            {
                index: true,
                element: <EventDetail/>,
                action: deleteAction
            },
            {
                path: 'edit',
                element: <EditPage/>,
                action: manipulateAction
            },
        ]
    },
    {
        path: 'new',
        element: <NewEvent/>,
        // 서버에 갱신데이터요청을 보낼 때 트리거
        action: manipulateAction
    },
]

const homeRouter = [
    {
        index: true,
        element: <WelcomePage />,
        action: loginAction
    }, // 웰컴페이지 (로그인화면 or 로그인완료화면)
    {
        path: 'sign-up',
        element: <SignUpPage />
    }, // 회원가입 페이지
    {
        path: 'logout',
        action: logoutAction // url이 /logout 일때 발동
    },
    {
        path: "/voice-chat",
        element: <VoiceChat/>
    }
];


export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        errorElement: <ErrorPage/>,
        loader: userDataLoader,
        id: 'user-data',
        children: [
            {
             path: "/",
             element: <Home/>,
             children: homeRouter
            },
            {
                path: 'events',
                element: (
                    <EventProvider>
                        <EventLayout/>
                    </EventProvider>
                ),
                loader: authCheckLoader,
                children: eventsRouter
            },
        ]
    },
]);
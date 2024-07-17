import React, {useContext, useEffect} from 'react';
import EventForm from '../components/EventForm';
import EventContext from "../components/context/event-context";
import {useNavigate, useRouteLoaderData} from "react-router-dom";

const NewEvent = () => {

  const navigate = useNavigate();
  const { totalEventCount } = useContext(EventContext);
  const userData = useRouteLoaderData('user-data');

  // 라우트 가드 (권한, 개수 검증)
  // 렌더링 되기 직전에!
  useEffect(() => {
    if (
        totalEventCount >= 4
        && userData.role === "COMMON"
    ) {
      alert("일반 회원은 이벤트 생성이 4개로 제한됩니다.");
      navigate("/events")
    }
  }, [totalEventCount]);

  return <EventForm method="post" />;
};


export default NewEvent;


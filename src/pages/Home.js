import React from 'react';
import {Link, Outlet} from 'react-router-dom';

const Home = () => {
  console.log('home!');

  return (
    <>
      <h1>My Home Page</h1>
      <Outlet />
    </>
  );
};

export default Home;

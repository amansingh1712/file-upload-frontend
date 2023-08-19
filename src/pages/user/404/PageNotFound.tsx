import React from "react";
import { Link } from "react-router-dom";
const PageNotFound = () => {
  return (
    <>
      <h2>Oops! Page not found.</h2>
      <h1>404</h1>
      <p>We can't find the page you're looking for.</p>
      <button>
        <Link to="/">Go back home</Link>
      </button>
    </>
  );
};

export default PageNotFound;

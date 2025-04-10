// src/protected_routes.js
import React, { useEffect, useState } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = sessionStorage.getItem("authToken");

  // Checking if token exists
  if (!token) {
    message.error("Kindly Login First");
    return <Redirect to="/auth/signin" />;
  }

  // Start rendering component if token exists
  return (
    <Route
      {...rest}
      render={(props) => (
        <AuthVerifier token={token}>
          <Component {...props} />
        </AuthVerifier>
      )}
    />
  );
};

// Verify token in background
const AuthVerifier = ({ children, token }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [redirectReason, setRedirectReason] = useState("");
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/verify-session`,
          {},
          { headers: { Authorization: token } }
        );
        setIsValid(true);
      } catch (error) {
        console.log("Token invalid:", error);
        console.log("Redirect Reason: ", error.response.data.message);
        setRedirectReason(error.response.data.message);
        setIsValid(false);

        // sessionStorage.removeItem('authToken');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, location.pathname]);

  // If verification failed, redirect
  if (!isVerifying && !isValid) {
    message.error(redirectReason);
    return <Redirect to="/auth/signin" />;
  }

  // Otherwise render original
  return children;
};

export default ProtectedRoute;

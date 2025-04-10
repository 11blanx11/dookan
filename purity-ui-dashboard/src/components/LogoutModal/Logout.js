import { React, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useColorModeValue } from "@chakra-ui/system";

Modal.setAppElement("#root");

function LogoutModal({ isOpen, onRequestClose }) {
  const userName = sessionStorage.getItem("userName") || "";
  const userEmail = sessionStorage.getItem("email") || "";
  const [LogoutStatus, setLogoutStatus] = useState(false);
  const textColor = useColorModeValue("gray.700", "black")
  const emailColor = useColorModeValue("gray.400", "gray.700")

  const handleLogout = async () => {
    console.log("Logging out.....");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/logout`,
        {},
        {
          headers: {
            Authorization: sessionStorage.getItem("authToken"),
          },
        }
      );
      setLogoutStatus(true);
      sessionStorage.clear();
    } catch (error) {
      console.log("Logout Failed due to: ", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Logout Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 1000,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          width: "320px",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          border: "none",
        },
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            margin: "0 auto 16px",
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: "bold",
            color: "white"
          }}
          >
          {userName ? userName.charAt(0).toUpperCase() : "U"}
        </div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            margin: "0 0 8px",
            color:"black"
          }}
        >
          User Profile
        </h2>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "500",
            margin: "0 0 4px",
            color:"black"
          }}
        >
          {userName}
        </p>
        <p
          style={{
            fontSize: "14px",
            color:"gray",
            margin: "0 0 24px",
          }}
        >
          {userEmail}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <button
            onClick={onRequestClose}
            style={{
              flex: 1,
              padding: "10px",
              background: "#cccaca",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Cancel
          </button>
          <button
            style={{
              flex: 1,
              padding: "10px",
              background: "#e53e3e",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      {LogoutStatus && <Redirect to="/auth/signin" />}
    </Modal>
  );
}

export default LogoutModal;

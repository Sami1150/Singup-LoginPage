import React from "react";
import axios from "axios";

const Logout = () => {
  // Function to get the CSRF token from a cookie
  const getCsrfToken = () => {
    const name = "XSRF-TOKEN"; // Change this to your actual CSRF token cookie name
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
    return null;
  };

  // Function to perform the logout
  const handleLogout = async () => {
    try {
      // Step 1: Send a GET request to /logout
      const response = await axios.get("/logout");

      if (response.status === 200) {
        // Step 2: Get the CSRF token from the cookie
        const csrfToken = getCsrfToken();

        if (!csrfToken) {
          console.error("CSRF token not found in cookies.");
          return;
        }

        // Step 3: Send a POST request to /logout with the CSRF token
        const postResponse = await axios.post(
          "/logout",
          {},
          {
            headers: {
              "X-XSRF-TOKEN": csrfToken, // Include the CSRF token in the headers
            },
          }
        );

        if (postResponse.status === 200) {
          // Logout was successful
          console.log("User logged out successfully.");
        } else {
          console.error("Logout failed. Server returned an error.");
        }
      } else {
        console.error("Logout failed. Server returned an error.");
      }
    } catch (error) {
      console.error("Error occurred during logout:", error);
    }
  };

  return (
    <div>
      <h1>The button Element</h1>
      <button type="button" onClick={handleLogout}>
        Click Me!
      </button>
    </div>
  );
};

export default Logout;

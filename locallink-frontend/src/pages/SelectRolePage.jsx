import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";

const SelectRolePage = () => {
  const { getAccessToken } = useAuthContext();

  const handleSelect = async (role) => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch("http://localhost:3001/api/assign-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        alert("Role assigned successfully!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const refreshedToken = await getAccessToken({ force: true });
        window.location.href = "#/dashboard"; 
      } else {
        const data = await response.json();
        alert(`Failed to assign role: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      alert("Network error occurred. Check the console.");
    }
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Welcome to LocalLink</h1>
      <p className="mb-6">Please select your role to continue:</p>
      <button
        onClick={() => handleSelect("Customer")}
        className="bg-blue-500 text-white px-6 py-2 m-2 rounded"
      >
        I am a Customer
      </button>
      <button
        onClick={() => handleSelect("Service Provider")}
        className="bg-green-500 text-white px-6 py-2 m-2 rounded"
      >
        I am a Service Provider
      </button>
    </div>
  );
};

export default SelectRolePage;

// import React from "react";
// import { useAuthContext } from "@asgardeo/auth-react";

// const SelectRolePage = () => {
//   const { getAccessToken } = useAuthContext();

//   const handleSelect = async (role) => {
//     try {
//       const accessToken = await getAccessToken();
//       const response = await fetch("http://localhost:3001/api/assign-role", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({ role }),
//       });

//       if (response.ok) {
//         alert("Role assigned successfully!");
//         window.location.href = "#/dashboard"; 
//       } else {
//         const data = await response.json();
//         alert(`Failed to assign role: ${data.message || "Unknown error"}`);
//       }
//     } catch (error) {
//       console.error("Error assigning role:", error);
//       alert("Network error occurred. Check the console.");
//     }
//   };

//   return (
//     <div className="text-center mt-10">
//       <h1 className="text-2xl font-bold mb-4">Welcome to LocalLink</h1>
//       <p className="mb-6">Please select your role to continue:</p>
//       <button
//         onClick={() => handleSelect("Customer")}
//         className="bg-blue-500 text-white px-6 py-2 m-2 rounded"
//       >
//         I am a Customer
//       </button>
//       <button
//         onClick={() => handleSelect("Service Provider")}
//         className="bg-green-500 text-white px-6 py-2 m-2 rounded"
//       >
//         I am a Service Provider
//       </button>
//     </div>
//   );
// };

// export default SelectRolePage;

import React from 'react';
import { useAuthContext } from "@asgardeo/auth-react";

function Header() {
  const { state, signIn, signOut } = useAuthContext();
  console.log("Auth state: ", state);
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/#" className="text-2xl font-bold text-gray-800">LocalLink</a>
        <div>
          {state.isAuthenticated ? (
            <>
              <a href="/#/dashboard" className="text-gray-600 hover:text-blue-500 mr-4">Dashboard</a>
              <a href="/#/profile" className="text-gray-600 hover:text-blue-500 mr-4">My Profile</a>
              <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => signIn()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
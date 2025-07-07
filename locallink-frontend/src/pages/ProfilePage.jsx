import React, { useState, useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";

function ProfilePage() {
  const { getBasicUserInfo, getAccessToken } = useAuthContext();
  const [userInfo, setUserInfo] = useState(null);
  const [form, setForm] = useState({ givenName: '', familyName: '', phone_number: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch('http://localhost:3001/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok) {
          const profile = data.data;
          const formattedUser = {
            givenName: profile.name?.givenName || '',
            familyName: profile.name?.familyName || '',
            phone_number: profile.phoneNumbers?.[0]?.value || '',
            email: profile.emails?.[0]?.value || profile.userName,
            roles: profile.roles?.map(role => role.display) || [],
            // groups: profile.groups?.map(group => group.display) || [],
          };
          setUserInfo(formattedUser);
          setForm(formattedUser);
        } else {
          console.error('Failed to fetch full profile:', data.message);
        }
      } catch (err) {
        console.error('Error fetching profile from backend:', err);
      }
    };

    fetchUserProfile();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const body = {
      givenName: form.givenName,
      familyName: form.familyName,
      phone_number: form.phone_number,
      email: userInfo.email || userInfo.username,
    };

    try {
      const token = await getAccessToken();
      const res = await fetch('http://localhost:3001/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Profile updated successfully!");
        setIsEditing(false);

        const updatedUserFromAPI = data.data;
        const newInfo = {
          ...userInfo, 
          givenName: updatedUserFromAPI.name?.givenName,
          familyName: updatedUserFromAPI.name?.familyName,
          phone_number: updatedUserFromAPI.phoneNumbers?.[0]?.value
        };

        sessionStorage.setItem('updatedUserInfo', JSON.stringify(newInfo));

        setUserInfo(newInfo);
        setForm({
          givenName: newInfo.givenName || '',
          familyName: newInfo.familyName || '',
          phone_number: newInfo.phone_number || ''
        });

      } else {
        setMessage("Error: " + (data.message || "Update failed"));
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  if (!userInfo) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      
      <div className="space-y-2">
        {isEditing ? (
          <>
            {/* Form in Edit Mode */}
            <div>
              <label className="font-semibold">First Name:</label>
              <input type="text" name="givenName" value={form.givenName} onChange={handleChange} className="border p-2 w-full mt-1" />
            </div>
            <div>
              <label className="font-semibold">Last Name:</label>
              <input type="text" name="familyName" value={form.familyName} onChange={handleChange} className="border p-2 w-full mt-1" />
            </div>
            <div>
              <label className="font-semibold">Phone Number:</label>
              <input type="text" name="phone_number" value={form.phone_number} onChange={handleChange} className="border p-2 w-full mt-1" placeholder="e.g., +94771234567" />
            </div>
            <button onClick={handleUpdate} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
            <button onClick={() => setIsEditing(false)} className="mt-4 ml-2 text-gray-600">Cancel</button>
          </>
        ) : (
          <>
            {/* Display View */}
            <p><strong>First Name:</strong> {userInfo.givenName || 'N/A'}</p>
            <p><strong>Last Name:</strong> {userInfo.familyName || 'N/A'}</p>
            <p><strong>Phone Number:</strong> {userInfo.phone_number || 'N/A'}</p>
            <p><strong>Email:</strong> {userInfo.email || userInfo.username}</p>
            <p><strong>Role:</strong> {userInfo.roles?.join(', ') || 'N/A'}</p>
            <button onClick={() => setIsEditing(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit Profile</button>
          </>
        )}
      </div>

      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
    </div>
  );
}

export default ProfilePage;

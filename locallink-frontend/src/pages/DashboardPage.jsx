import React, { useState, useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";

const hasRole = (roles, roleName) => roles && roles.includes(roleName);

function DashboardPage() {
  const { getBasicUserInfo, getAccessToken } = useAuthContext();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [adminData, setAdminData] = useState({ customers: [], providers: [] });
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [editingServiceId, setEditingServiceId] = useState(null);

  useEffect(() => {
    getBasicUserInfo()
      .then((info) => {
        setUserInfo(info);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch user info:", error);
        setIsLoading(false);
      });
  }, [getBasicUserInfo]);

  const fetchMyServices = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch('http://localhost:3001/api/my-services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllServices = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/services');
      const data = await res.json();
      setAllServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch('http://localhost:3001/api/admin-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAdminData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userInfo) return;
    if (hasRole(userInfo.roles, 'service_provider')) fetchMyServices();
    if (hasRole(userInfo.roles, 'customer')) fetchAllServices();
    if (hasRole(userInfo.roles, 'admin')) fetchAdminData();
  }, [userInfo]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = await getAccessToken();
      const url = editingServiceId
        ? `http://localhost:3001/api/services/${editingServiceId}`
        : 'http://localhost:3001/api/services';
      const method = editingServiceId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price)
        })
      });

      if (res.ok) {
        setForm({ name: '', description: '', price: '' });
        setEditingServiceId(null);
        fetchMyServices();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save service');
    }
  };

  const handleEditClick = (service) => {
    setEditingServiceId(service._id);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price.toString()
    });
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setForm({ name: '', description: '', price: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = await getAccessToken();
      const res = await fetch(`http://localhost:3001/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) fetchMyServices();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading dashboard...</div>;
  if (!userInfo) return <div>Could not load user information.</div>;

  const { givenName, roles } = userInfo;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {givenName || 'User'}!</h1>

      {/* SERVICE PROVIDER DASHBOARD */}
      {hasRole(roles, 'service_provider') && (
        <>
          <h2 className="text-xl font-semibold mb-2">
            {editingServiceId ? 'Edit Service' : 'Create a New Service'}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mb-6 bg-white p-4 rounded shadow"
          >
            {/* Service Name Input */}
            <div className="mb-2">
              <label className="block font-medium mb-1" htmlFor="name">Service Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                placeholder="e.g. Plumbing Service"
                required
              />
            </div>

            {/* Description Input */}
            <div className="mb-2">
              <label className="block font-medium mb-1" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                placeholder="Brief description"
                required
              />
            </div>

            {/* Price Input */}
            <div className="mb-2">
              <label className="block font-medium mb-1" htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                placeholder="Amount (number only)"
                required
              />
            </div>

            {/* Buttons */}
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingServiceId ? 'Update Service' : 'Create Service'}
              </button>

              {editingServiceId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* This part remains the same */}
          <h2 className="text-xl font-semibold mb-4">My Services</h2>
          <ul className="space-y-4">
            {services.map(service => (
              <li key={service._id} className="border rounded p-4 bg-white shadow flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  <p className="text-gray-700">{service.description}</p>
                  <p className="mt-1 font-semibold">Price: {service.price}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditClick(service)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm text-white"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* CUSTOMER DASHBOARD */}
      {hasRole(roles, 'customer') && (
        <>
          <h2 className="text-xl font-semibold mb-4">Available Services</h2>
          <ul className="space-y-4">
            {allServices.map(service => (
              <li key={service._id} className="border p-4 bg-white rounded shadow">
                <h3 className="font-bold">{service.name}</h3>
                <p>{service.description}</p>
                <p>Price: {service.price}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ADMIN DASHBOARD */}
      {hasRole(roles, 'admin') && (
        <>
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          <ul className="space-y-2">
            {adminData.customers.map(user => (
              <li key={user.id} className="p-3 border bg-white rounded">
                {user.givenName} {user.familyName} – {user.email}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">Service Providers & Their Services</h2>
          {adminData.providers.map(provider => (
            <div key={provider.id} className="border p-4 rounded bg-white shadow mb-4">
              <h3 className="font-bold">{provider.givenName} {provider.familyName}</h3>
              <p>{provider.email}</p>
              <ul className="list-disc pl-6 mt-2">
                {provider.services.map(s => (
                  <li key={s._id}><strong>{s.name}</strong> – {s.description} (Rs.{s.price})</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default DashboardPage;

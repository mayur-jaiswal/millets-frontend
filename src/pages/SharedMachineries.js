import React, { useState, useEffect } from "react";
import Header from "../components/Header"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "../components/ProfileDropdown";

const SharedMachineries = () => {
  const [machineries, setMachineries] = useState([]);
  const [filters, setFilters] = useState({ type: "", availability: "" });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMachinery, setNewMachinery] = useState({
    name: "",
    image: "",
    description: "",
    type: "Tractor",
    availability: "Available",
    rentalPrice: 0,
  });
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  useEffect(() => {
    fetchUserAndMachineries();
  }, []); // Runs only once on mount
  
  useEffect(() => {
    if (user?.state && user?.district) {
      fetchMachineries(user.state, user.district);
    }
  }, [user]); // Runs only when user is updated  
  const logoutUser = () => {
    localStorage.removeItem("username");
    window.location.href = "/";
};

  const fetchUserAndMachineries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to access this page.");
        return;
      }
  
      const userResponse = await axios.get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const userData = userResponse.data;
      setUser(userData);
  
      // Fetch machineries only if user data is complete
      if (userData?.state && userData?.district) {
        fetchMachineries(userData.state, userData.district);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Authentication failed. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Error fetching user or machineries:", err);
    } finally {
      setLoading(false);
    }
  };    

  const fetchMachineries = async (state, district) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/machineries?state=${state}&district=${district}`
      );
      console.log(response.data);
      setMachineries(response.data);
    } catch (error) {
      console.error("Error fetching machineries:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredMachineries = machineries.filter((machine) =>
    (filters.type ? machine.type === filters.type : true) &&
    (filters.availability ? machine.availability === filters.availability : true)
  );

  const handleAddMachinery = () => {
    setShowAddForm(true);
  };

  const handleFormChange = (e) => {
    setNewMachinery({ ...newMachinery, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/machineries", {
        ...newMachinery,
        state: user.state,
        district: user.district,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddForm(false);
      fetchMachineries(user.state, user.district); // Refresh listings
      setNewMachinery({
        name: "",
        image: "",
        description: "",
        type: "Tractor",
        availability: "Available",
        rentalPrice: 0,
      });
    } catch (error) {
      console.error("Error posting machinery:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading User data...</div>;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-hidden shadow-md">
      <div className="layout-container flex h-full flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 flex items-center justify-between w-full px-8 py-3 text-sm bg-gradient-to-r from-purple-300 to-green-300 shadow-md">
          {/* Left Side: Logo + Title */}
          <div className="flex items-center gap-3 text-[#1C160C]">
            <div className="size-5">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-[#1C160C] text-lg font-bold tracking-tight">
              <a href="/home">Millets</a>
            </h2>
          </div>
  
          <nav className="hidden md:flex items-center gap-6 text-xs text-[#1C160C] ml-auto">
            <a href="/home">Chatbot</a>
            <a href="/news">News</a>
            <a href="/shared">Shared Machineries</a>
            <a href="/collab">Collaborative Farming</a>
            <a href="/help" className="mr-6">Help & Support</a>
          </nav>
  
          <div className="flex items-center gap-6">
            <div className="relative group">
              <a href="/calendar" className="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/512/747/747310.png" alt="Calendar Icon" className="size-5" />
              </a>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Farming Calendar
              </div>
            </div>
            <div className="relative group">
              <a href="/tracker" className="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/512/833/833314.png" alt="Finance Icon" className="size-5" />
              </a>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Finance Tracker
              </div>
            </div>
            <ProfileDropdown logoutUser={logoutUser} />
          </div>
        </header>
      <div className="fade-content">
      <h1 className="text-2xl font-bold">Shared Machineries</h1>

      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleAddMachinery}
      >
        Add Machinery
      </button>

      {/* Add Machinery Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <input type="text" name="name" placeholder="Name" value={newMachinery.name} onChange={handleFormChange} className="border p-2 mb-2 w-full" />
          <input type="text" name="image" placeholder="Image URL" value={newMachinery.image} onChange={handleFormChange} className="border p-2 mb-2 w-full" />
          <textarea name="description" placeholder="Description" value={newMachinery.description} onChange={handleFormChange} className="border p-2 mb-2 w-full" />
          <select name="type" value={newMachinery.type} onChange={handleFormChange} className="border p-2 mb-2 w-full">
            <option value="Tractor">Tractor</option>
            <option value="Harvester">Harvester</option>
            <option value="Seeder">Seeder</option>
          </select>
          <select name="availability" value={newMachinery.availability} onChange={handleFormChange} className="border p-2 mb-2 w-full">
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Reserved">Reserved</option>
          </select>
          <input type="number" name="rentalPrice" placeholder="Rental Price" value={newMachinery.rentalPrice} onChange={handleFormChange} className="border p-2 mb-2 w-full" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
          <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded ml-2">Cancel</button>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-4 mt-4">
        <select name="type" onChange={handleFilterChange}>
          <option value="">Select Type</option>
          <option value="Tractor">Tractor</option>
          <option value="Harvester">Harvester</option>
          <option value="Seeder">Seeder</option>
        </select>
        <select name="availability" onChange={handleFilterChange}>
          <option value="">Availability</option>
          <option value="Available">Available</option>
          <option value="In Use">In Use</option>
          <option value="Reserved">Reserved</option>
        </select>
      </div>

      {/* Machinery Listings */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {filteredMachineries.map((machine) => (
          <div key={machine._id} className="border p-4 rounded shadow">
            <img
              src={machine.image}
              alt={machine.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="font-semibold">{machine.name}</h2>
            <p>{machine.description}</p>
            <p className="text-sm text-gray-500">
              Name: "ajay deshmukh"
            </p>
            <p className="text-sm text-gray-500">
              Availability: {machine.availability}
            </p>
            <p className="text-sm text-gray-500">
              State: {machine.location.state}
            </p>
            <p className="text-sm text-gray-500">
              District: {machine.location.district}
            </p>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => alert("Request sent to ajay deshmukh successfully")}>
              Request
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
    </div>
  );
};

export default SharedMachineries;
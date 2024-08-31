import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './app3.css';
import CourseList from './CourseList';
import UserInfo from './purchased-admin';

const AdminDashboard = () => {
  const [user, setUser] = useState({ 'id': '', 'name': '', 'email': '', 'password': '', 'type': '' });
  const [purchases, setPurchases] = useState([]);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/purchases-admin');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched purchases:', data);
      setPurchases(data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
    fetchPurchases();
  }, []);

  const handlePurchaseComplete = () => {
    console.log('Purchase complete. Fetching purchases...');
    fetchPurchases();  // Re-fetch purchases after successful purchase
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>Admin Dashboard</h1>
      </header>
      <div className="content">
        <div className="left-column">
          <UserInfo boughtCourses={purchases} />
        </div>
        <div className="right-column">
          <CourseList status='verified' />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

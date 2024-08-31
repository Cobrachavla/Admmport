import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import CollegeInfo from './CollegeInfo';
//import LoginModal from './components/LoginModal';
import AddCourse from './AddCourse';
import CourseSelector from './CourseSelector';
import './App2.css'


const Colldash = () => {
  const [user, setUser] = useState({'id': '', 'name': '', 'email': '', 'college': '','password': '', 'type': ''});
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ branches: [], districts: [] });
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        //console.log(data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    
    fetchUser();
    
  }, [] );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">	
      <div className="row user-info">
        <CollegeInfo user={user} 
        />
      </div>
      
      <div className="row main-content c">
        <div className="addcourse">
        <h3>Add Course</h3>
          <AddCourse />
        </div>
        <div className="removecourse">
        <h3>remove Course</h3>
          <CourseSelector />
        </div>
      </div>
   </div> 
  );
};

export default Colldash;


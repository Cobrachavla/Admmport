import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Filter.module.css';
import { useProduct } from '../Context/ProductContext'; // Import useProduct hook

const Filter = () => {
  const [branches, setBranches] = useState([]);
  const [districts, setDistricts] = useState([]);
  const { setFilters } = useProduct(); // Get setFilters function from context

  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/filters');
        setBranches(response.data.branches || []);
        setDistricts(response.data.districts || []);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    // Update filters in context when either branch or district changes
    setFilters({ branch: selectedBranch, district: selectedDistrict });
  }, [selectedBranch, selectedDistrict, setFilters]);

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <label htmlFor="district-select">Select District:</label>
        <select id="district-select" value={selectedDistrict} onChange={handleDistrictChange}>
          <option value="">All Districts</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label htmlFor="branch-select">Select Branch:</label>
        <select id="branch-select" value={selectedBranch} onChange={handleBranchChange}>
          <option value="">All Branches</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;

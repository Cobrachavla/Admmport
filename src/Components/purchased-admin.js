import React from 'react';
import './purchases.css';

const UserInfo = ({ boughtCourses }) => {
  return (
    <div>
      <div className="modal-content">
        <div className="purchases">
          <h2>All Purchases</h2>
          {boughtCourses.length > 0 ? (
            boughtCourses.map((purchase, index) => (
              <div key={index}>
                <p><b>User ID: {purchase.user.id}</b></p>
                <p><b><i>Purchase {index + 1}</i></b></p>
                <p><i>Course ID: {purchase.course.id}</i></p>
                <p><i>Course: {purchase.course.title}</i></p>
                <p><i>Branch: {purchase.course.branch}</i></p>
                <p><i>Invoice: {purchase.invoice}</i></p>
              </div>
            ))
          ) : (
            <p>No purchases available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

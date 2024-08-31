import React from 'react';

const CourseCard = ({ course, handleChange }) => {
    return (
        <div className="course-card">
            <p><b>{course.title}</b></p><br />
            <p><b>{course.branch}</b></p><br />
            <p><b>{course.college}</b></p><br />
            <p>{course.description}</p>
            <label>
                <input
                    type="radio"
                    name={`status-${course.id}`}
                    value="verified"
                    defaultChecked={course.status === 'verified'}
                    onChange={handleChange}
                />
                Verified
            </label>
            <label>
                <input
                    type="radio"
                    name={`status-${course.id}`}
                    value="unverified"
                    defaultChecked={course.status === 'unverified'}
                    onChange={handleChange}
                />
                Unverified
            </label>
        </div>
    );
};

export default CourseCard;

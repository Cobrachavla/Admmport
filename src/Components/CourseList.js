import React, { useEffect, useState } from 'react';
import './app4.css';
import CourseCard from './CourseCard';

const CourseList = ({ status }) => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/courses-admin')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const updatedCourses = courses.map(course => ({
            ...course,
            status: formData.get(`status-${course.id}`),
        }));
        alert('Do you want to continue?');
        fetch('http://localhost:5000/api/courses-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCourses),
        })
        .then(res => res.text())
        .then(data => {
            setCourses(updatedCourses);
            alert(data);
        })
        .catch(err => console.error(err));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCourses(prevCourses =>
            prevCourses.map(course =>
                `status-${course.id}` === name ? { ...course, status: value } : course
            )
        );
    };

    return (
        <div className='appp'>
            <form onSubmit={handleSubmit} className="f1">
                <div className='content'>
                    <div className='left-columnn'>
                        <h3>{status}<br /></h3>
                        {courses.map(course => course.status === status && (
                            <CourseCard key={course.id} course={course} handleChange={handleChange} />
                        ))}
                    </div>
                    <div className='right-columnn'>
                        <h3>un{status}<br /></h3>
                        {courses.map(course => course.status !== status && (
                            <CourseCard key={course.id} course={course} handleChange={handleChange} />
                        ))}
                    </div>
                </div>
                <button type="submit" id="fixed">Submit</button>
            </form>
        </div>
    );
};

export default CourseList;

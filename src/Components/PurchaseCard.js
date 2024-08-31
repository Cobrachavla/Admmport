import React from 'react';
import './purchases.css';  // Ensure you have your styles here

const PurchaseCard = ({ purchase, index }) => {
    return (
        <div className="purchase-card">
            <p><b>User ID: {purchase.user.id}</b></p>
            <p><b><i>Purchase {index + 1}</i></b></p>
            <p><i>Course ID: {purchase.course.id}</i></p>
            <p><i>Course: {purchase.course.title}</i></p>
            <p><i>Branch: {purchase.course.branch}</i></p>
            <p><i>Invoice: {purchase.invoice}</i></p>
        </div>
    );
};

export default PurchaseCard;

import React from 'react';
import { ShoppingCartIcon, TrashIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { useUser } from './UserContext'; // Import the hook
import styles from "./styles.module.css";

const Cart = ({ onPurchaseComplete }) => {
  const { items, removeFromCart } = useCart();
  const { user } = useUser();  // Get user info from context

  const subtotal = items.reduce((acc, obj) => acc + obj.cost, 0).toFixed(2);
  const platformFee = 50;
  const gstRate = 0.12;
  const gst = (gstRate * subtotal).toFixed(2);
  const total = (parseFloat(subtotal) + platformFee + parseFloat(gst)).toFixed(2);

  const handleBuyNow = async () => {
    const numItems = items.length;
    const invtotal = parseFloat(total);
    let invoice;

    if (numItems === 1) {
      invoice = `paid Rs ${invtotal} for this course on XX/XX/XX`;
    } else if (numItems > 1) {
      invoice = `paid Rs ${invtotal} for this course and ${numItems - 1} others on XX/XX/XX`;
    }

    console.log('Sending purchase data to server:', { user, course: items[0], invoice });

    try {
      const response = await fetch('http://localhost:5000/api/purchasesp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, course: items[0], invoice }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert('Purchase successful!');

      // Empty the cart (remove all items)
      items.forEach(item => removeFromCart(item.id));

      // Trigger the callback to update purchases in AdminDashboard
      console.log('Purchase complete, calling onPurchaseComplete...');
      onPurchaseComplete();  // This triggers the re-fetch of purchases

    } catch (error) {
      console.error('Error during purchase:', error);
      alert('Error during purchase. Please try again.');
    }
  };

  return (
    <div>
      {items.length < 1 ? (
        <div className="flex flex-wrap max-w-7xl mx-auto my-4">
          <div className="w-full sm:w-2/2 md:w-2/2 xl:w-5/5 p-4 h-[500px] my-auto">
            <div className={styles.cardBg}>
              <ShoppingCartIcon className="h-40 w-40 mx-auto mt-10" />
              <p className="text-xl font-extralight tracking-widest text-center pt-6">
                There are no products in your cart.
              </p>
              <p className="text-center mt-2 font-bold tracking-wide">
                Add the products you like to the cart and buy.
              </p>
              <Link to="/">
                <div className={styles.continueButton}>
                  <button className={styles.button}>
                    <div className="flex flex-col self-center">
                      <span className={styles.buttonText}>
                        Continue Shopping
                      </span>
                    </div>
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap max-w-7xl mx-auto my-4">
          <div className="flex flex-col flex-1">
            {items.map((item) => (
              <div
                className="w-full sm:w-2/2 md:w-2/2 xl:w-5/5 p-4 my-auto"
                key={item.id}
              >
                <div className={styles.bgCart}>
                  <div className="flex flex-row h-48">
                    <img
                      className="w-32 my-auto p-4 object-contain"
                      src={item.image}
                      alt="Cart Item"
                    />
                    <div className="flex flex-col ml-2 mt-2">
                      <Link to={`/product/${item.id}`}>
                        <h2 className="text-sm title-font text-zinc-900 tracking-widest hover:text-blue-600 mt-2">
                          Course
                        </h2>
                        <p className="font-extralight">{item.title}</p>
                      </Link>
                      <h2 className="text-sm title-font text-zinc-900 tracking-widest hover:text-blue-600 mt-2">
                        College
                      </h2>
                      <p className="font-extralight">{item.college}</p>
                      <h2 className="text-sm title-font text-zinc-900 tracking-widest hover:text-blue-600 mt-2">
                        Branch
                      </h2>
                      <p className="font-extralight">{item.branch}</p>
                      <p className="mt-auto mb-4 font-extralight text-xl">
                        Rs {item.cost}
                      </p>
                    </div>

                    <div className="flex flex-row ml-auto">
                      <button className="w-5 h-5 ml-auto m-4 hover:text-red-500" onClick={() => removeFromCart(item.id)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full h-full sm:w-2/2 md:w-2/2 xl:w-1/5 p-4">
            <div className={styles.bgCart}>
              <div className="flex flex-col p-4">
                <span className="text-xl mb-4 font-semibold">
                  Order Summary
                </span>
                <span className="text-sm my-2 font-extralight flex">
                  Subtotal <span className="ml-auto font-normal">Rs {subtotal}</span>
                </span>
                <span className="text-sm my-2 font-extralight flex">
                  Platform Fee <span className="ml-auto font-normal">Rs {platformFee}</span>
                </span>
                <span className="text-sm my-2 font-extralight flex">
                  GST (12%) <span className="ml-auto font-normal">Rs {gst}</span>
                </span>
                <span className="text-md my-2 font-normal flex">
                  Order Total <span className="ml-auto">Rs {total}</span>
                </span>
                <button className={styles.buyNowButton} onClick={handleBuyNow} disabled={items.length === 0}>
                  Buy Now
                </button>
                <Link to="/">
                  <button className={styles.dashboardButton}>
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

import styles from './styles.module.css';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';

const Card = ({
  item,
  addToFavorite,
  findFavoriteItem,
  addToCart,
  findCartItem,
}) => {
  return (
    <div key={`${item.id}-item`} className={styles.card} title={item.title} style={{ width: '200px', padding: '10px' }}>
      <div className={styles.cardLink}>
        <button
          className={
            !findFavoriteItem ? styles.favButton : styles.removeFavButton
          }
          onClick={() => {
            addToFavorite(item, findFavoriteItem);
          }}
        >
        </button>
        <Link to={`/product/${item.id}`}>
          <div className={styles.cardHeader}>
            {/* Image has been removed */}
          </div>
        </Link>
        <div className={styles.cardBody}>
          <div>
            <p className={styles.cardTitle} title={item.title}>
              <span className={styles.brand} title="Brand">
                {item.college},
              </span>{" "}
              {item.branch}
            </p>
          </div>
          <div className={styles.rating} title={item.status}>
            <p className="text-xs ml-1 font-light mt-0.5">({item.status})</p>
          </div>
          <div>
            <div className="my-auto" title={`$${item.cost}`}>
              <span className={styles.priceSub}>$</span>
              <span className={styles.priceTop}>{Math.trunc(item.cost)}</span>
              {parseInt((item.cost % 1).toFixed(2).substring(2)) !== 0 ? (
                <span className={styles.priceSub}>
                  {parseInt((item.cost % 1).toFixed(2).substring(2))}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className={styles.addToCart}>
            <button
              className={
                !findCartItem ? styles.addToCartButton : styles.removeButton
              }
              onClick={() => addToCart(item, findCartItem)}
            >
              <ShoppingCartIcon
                className={styles.shoppingCartIcon}
                aria-hidden="true"
              />
              <div className="flex flex-col self-center">
                <span className={styles.buttonText}>
                  {findCartItem ? "Remove from cart" : "Add to Cart"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

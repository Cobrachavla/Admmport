import React, { useEffect } from 'react';
import { useProduct } from '../../Context/ProductContext';
import styles from './styles.module.css';
import Spinner from '../../Components/Spinner';
import { useParams } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { useFavorite } from '../../Context/FavoriteContext';
import Card from '../../Components/Card';
import Filter from '../../Components/Filter';

const Products = () => {
  const { addToCart, items } = useCart();
  const { addToFavorite, favoriteItems } = useFavorite();

  const { productList, loading, setProductID, setCategory } = useProduct();

  const { category_id } = useParams();

  useEffect(() => {
    setCategory(category_id);
  }, [category_id, setCategory]);

  return (
    <div>
      <Filter />
      <div className={styles.cardGroup}>
        {!loading ? (
          productList.length > 0 ? (
            productList.map((item, index) => {
              console.log('Rendering Product:', item);
              const findCartItem = items.find((cart_item) => cart_item.id === item.id);
              const findFavoriteItem = favoriteItems.find((favorite_item) => favorite_item.id === item.id);
              return (
                <Card
                  key={`product-${index}`}
                  item={item}
                  setProductID={setProductID}
                  findCartItem={findCartItem}
                  findFavoriteItem={findFavoriteItem}
                  addToCart={addToCart}
                  addToFavorite={addToFavorite}
                />
              );
            })
          ) : (
            <p>No products found.</p>
          )
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
  };

export default Products;

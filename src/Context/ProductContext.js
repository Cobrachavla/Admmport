import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [productList, setProductList] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState("/products")
  const [productID, setProductID] = useState("")
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ branch: '', district: '' }); // Updated filters state

  useEffect(() => {
    setLoading(true);
    const getProductData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        const filteredProducts = response.data.filter((product) => {
          return (
            (!filters.branch || product.branch === filters.branch) &&
            (!filters.district || product.district === filters.district)
          );
        });
        setProductList(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
  
    getProductData();
  }, [category, filters]); // Ensure `filters` is properly updated
    
  useEffect(() => {
    setLoading(true)
    const getProductDetail = async () => {
      productID && productID.length > 0 && await axios.get(``).then(
        (res) => {
          setProduct(res.data)
          setLoading(false)
        }
      )
    }
    getProductDetail()
  }, [productID])

  const values = {
    product,
    productList,
    productID,
    setProductID,
    categories,
    setCategory,
    setFilters, // Provide the ability to set filters
    loading,
  }

  return (
    <ProductContext.Provider value={values}>{children}</ProductContext.Provider>
  )
}

export const useProduct = () => useContext(ProductContext)

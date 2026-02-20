import { useState, useEffect } from "react";
import "./BeautyStore.css";
import { beautyProducts, categories } from "./products";
import { HiShoppingBag, HiHeart, HiStar, HiX } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Transition from "../../components/Transition/Transition";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const BeautyStore = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(beautyProducts);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Ensure products are visible
    gsap.set(".product-card", { opacity: 1, y: 0 });

    // Animate products on scroll
    const cards = document.querySelectorAll(".product-card");
    if (cards.length > 0) {
      ScrollTrigger.batch(".product-card", {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          });
        },
        start: "top 90%",
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [filteredProducts]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(beautyProducts);
    } else {
      setFilteredProducts(
        beautyProducts.filter((product) => product.category === selectedCategory)
      );
    }
  }, [selectedCategory]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="beauty-store">
      <NavBar />
      
      <div className="store-header">
        <div className="container">
          <Link to="/sooziva" className="back-link">
            <IoIosArrowBack size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="store-title">Beauty Collection</h1>
          <p className="store-subtitle">Discover luxury makeup essentials</p>
        </div>
      </div>

      <div className="store-content">
        <div className="container">
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found in this category.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        console.error("Image failed to load:", product.image);
                        e.target.style.display = "none";
                      }}
                    />
                  {product.featured && (
                    <span className="featured-badge">Featured</span>
                  )}
                  {product.originalPrice && (
                    <span className="sale-badge">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                  <button
                    className="wishlist-btn"
                    onClick={() => toggleWishlist(product)}
                  >
                    <HiHeart
                      size={20}
                      className={
                        wishlist.find((item) => item.id === product.id)
                          ? "wishlisted"
                          : ""
                      }
                    />
                  </button>
                </div>
                <div className="product-info">
                  <p className="product-brand">{product.brand}</p>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating) ? "filled" : ""}
                      />
                    ))}
                    <span className="rating-value">{product.rating}</span>
                  </div>
                  <div className="product-price">
                    <span className="current-price">${product.price}</span>
                    {product.originalPrice && (
                      <span className="original-price">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Shopping Cart */}
      <div className={`cart-overlay ${showCart ? "active" : ""}`}>
        <div className="cart-sidebar">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button className="close-cart" onClick={() => setShowCart(false)}>
              <HiX size={24} />
            </button>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <HiShoppingBag size={48} />
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-brand">{item.brand}</p>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <HiX size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-price">${getTotalPrice().toFixed(2)}</span>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Button */}
      <button
        className="cart-toggle-btn"
        onClick={() => setShowCart(true)}
      >
        <HiShoppingBag size={24} />
        {cartItemCount > 0 && (
          <span className="cart-badge">{cartItemCount}</span>
        )}
      </button>
    </div>
  );
};

export default Transition(BeautyStore);


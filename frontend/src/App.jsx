import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Heart, ArrowLeft, CheckCircle, X } from 'lucide-react';
import Auth from './Auth';
import Dashboard from './Dashboard';
import './index.css';

// Components
const Navbar = ({ cartCount, onCartClick }) => (
  <nav className="navbar">
    <Link to="/" className="nav-brand">MYNTRA CLONE</Link>
    <div className="nav-links">
      <Link to="/category/men" className="nav-link">Men</Link>
      <Link to="/category/women" className="nav-link">Women</Link>
      <Link to="/category/kids" className="nav-link">Kids</Link>
      <Link to="/category/home-living" className="nav-link">Home & Living</Link>
      <Link to="/category/beauty" className="nav-link">Beauty</Link>
      <Link to="/category/studio" className="nav-link">Studio <sup style={{color: 'var(--accent)', marginLeft: '2px'}}>NEW</sup></Link>
    </div>
    <div className="nav-search">
      <Search size={16} className="search-icon" />
      <input type="text" placeholder="Search for products, brands and more" />
    </div>
    <div className="nav-actions">
      <Link to="/dashboard" className="icon-btn">
        <User size={20} />
        <span>Profile</span>
      </Link>
      <Link to="/wishlist" className="icon-btn">
        <Heart size={20} />
        <span>Wishlist</span>
      </Link>
      <button onClick={onCartClick} className="icon-btn" style={{position: 'relative'}}>
        <ShoppingBag size={20} />
        <span>Bag</span>
        <span style={{
          position: 'absolute', top: '-6px', right: '4px', 
          background: 'var(--accent)', color: '#fff', 
          fontSize: '0.7rem', fontWeight: 'bold',
          width: '18px', height: '18px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>{cartCount}</span>
      </button>
    </div>
  </nav>
);

const CartDrawer = ({ isOpen, onClose, cart, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + (item.discount_percent ? Math.round(item.price - (item.price * (item.discount_percent / 100))) : item.price), 0);

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
          opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }} 
      />
      <div 
        style={{
          position: 'fixed', top: 0, right: 0, width: '400px', height: '100%',
          backgroundColor: '#fff', zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Shopping Bag ({cart.length})</h2>
           <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
             <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <ShoppingBag size={64} color="var(--gray-border)" />
                <p style={{ marginTop: '1rem', color: 'var(--text-medium)' }}>Your bag is empty!</p>
             </div>
          ) : (
             <div style={{ display: 'grid', gap: '1.5rem' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                     <img src={item.image_url} style={{ width: '80px', height: '100px', objectFit: 'cover' }} />
                     <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.brand || 'Brand'}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{item.title}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-medium)', marginBottom: '0.5rem' }}>Size: {item.size}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ fontWeight: '700' }}>Rs. {item.discount_percent ? Math.round(item.price - (item.price * (item.discount_percent / 100))) : item.price}</span>
                           <button onClick={() => removeFromCart(idx)} style={{ border: 'none', background: 'none', color: 'var(--text-medium)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Remove</button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          )}
        </div>

        {cart.length > 0 && (
           <div style={{ padding: '1.5rem', borderTop: '1px solid var(--gray-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: '700', fontSize: '1.1rem' }}>
                 <span>Total Amount</span>
                 <span>Rs. {total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" onClick={onClose} className="btn-primary" style={{ width: '100%', padding: '1rem', display: 'block', textAlign: 'center', background: '#ff3f6c' }}>
                PLACE ORDER
              </Link>
           </div>
        )}
      </div>
    </>
  );
};

const Hero = () => (
  <section className="hero">
    <div className="container hero-content animate-fade-in" style={{textAlign: 'center', margin: '0 auto'}}>
      <h1 className="premium-title" style={{color: '#fff', fontSize: '4rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>FASHION BIGGEST SALE</h1>
      <p className="subtitle" style={{color: '#f0f0f0', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '500'}}>
        50-80% OFF on Top Brands
      </p>
      <Link to="/category/men" className="btn-primary" style={{background: '#fff', color: 'var(--accent)'}}>Shop Now</Link>
    </div>
    <div style={{
      position: 'absolute', left: '0', top: '0', width: '100%', height: '100%',
      background: 'linear-gradient(45deg, #ff3f6c, #ff9a8b)', opacity: '0.8', zIndex: '0'
    }} />
  </section>
);

const ProductCard = ({ id, title, price, brand, discount_percent, image_url }) => {
  const finalPrice = discount_percent ? Math.round(price - (price * (discount_percent / 100))) : price;
  
  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="product-img-wrapper" style={{background: '#f5f5f5'}}>
        {image_url ? (
          <img src={image_url.startsWith('http') ? image_url : `http://127.0.0.1:8000/${image_url}`} alt={title} />
        ) : (
          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa'}}>
            <ShoppingBag size={48} opacity={0.2} />
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-brand">{brand || 'Brand'}</h3>
        <p className="product-title">{title}</p>
        <div className="product-price">
          <span>Rs. {finalPrice}</span>
          {discount_percent > 0 && (
            <>
              <span className="price-mrp">Rs. {price}</span>
              <span className="price-discount">({discount_percent}% OFF)</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

const WeeklyOffers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/products?is_weekly_offer=true')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <section className="container" style={{padding: '4rem 2rem'}}>
      <h2 style={{textAlign: 'center', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700'}}>Top Weekly Offers</h2>
      <p className="subtitle" style={{textAlign: 'center', marginBottom: '3rem'}}>Grab these incredible deals before they expire</p>
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '2rem'}}>Loading offers...</div>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </section>
  );
};

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        if (data.size) setSelectedSize(data.size.split(',').map(s => s.trim())[0]);
        if (data.color) setSelectedColor(data.color.split(',').map(c => c.trim())[0]);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container" style={{padding: '4rem 2rem', textAlign: 'center'}}>Loading product...</div>;
  if (error) return <div className="container" style={{padding: '4rem 2rem', textAlign: 'center', color: 'red'}}>{error}</div>;

  return (
    <div className="container" style={{padding: '4rem 2rem', minHeight: '60vh'}}>
      <button onClick={() => navigate(-1)} style={{background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--gray-dark)'}}>
        <ArrowLeft size={20} /> Back
      </button>
      
      <div style={{display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '4rem', alignItems: 'start'}}>
        <div style={{background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden'}}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} style={{width: '100%', height: 'auto', display: 'block'}} />
          ) : (
            <div style={{width: '100%', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa'}}>
              <ShoppingBag size={64} opacity={0.2} />
            </div>
          )}
        </div>
        
        <div>
          <h1 className="product-brand" style={{fontSize: '2rem', marginBottom: '0.2rem'}}>{product.brand || 'Brand'}</h1>
          <p style={{fontSize: '1.2rem', color: 'var(--text-medium)', marginBottom: '1rem'}}>{product.title}</p>
          <div style={{display: 'flex', alignItems: 'baseline', gap: '1rem', borderTop: '1px solid var(--gray-border)', paddingTop: '1rem', marginBottom: '1rem'}}>
            <span style={{fontSize: '1.5rem', fontWeight: '700'}}>Rs. {product.discount_percent ? Math.round(product.price - (product.price * (product.discount_percent / 100))) : product.price}</span>
            {product.discount_percent > 0 && (
              <>
                <span style={{fontSize: '1.2rem', color: 'var(--text-light)', textDecoration: 'line-through'}}>MRP Rs. {product.price}</span>
                <span style={{fontSize: '1.2rem', color: 'var(--danger)', fontWeight: '700'}}>({product.discount_percent}% OFF)</span>
              </>
            )}
          </div>
          <p style={{color: '#03a685', fontWeight: '700', fontSize: '0.85rem', marginBottom: '2rem'}}>inclusive of all taxes</p>
          
          <div style={{display: 'flex', gap: '2rem', marginBottom: '2rem'}}>
            {product.size && (
              <div>
                <h4 style={{marginBottom: '1rem', fontSize: '1rem'}}>SELECT SIZE</h4>
                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                  {product.size.split(',').map(s => s.trim()).filter(Boolean).map(sz => (
                    <button 
                      key={sz} 
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: '0.8rem', 
                        width: '50px',
                        height: '50px',
                        border: selectedSize === sz ? '1px solid var(--accent)' : '1px solid var(--gray-border)', 
                        borderRadius: '50%', 
                        color: selectedSize === sz ? 'var(--accent)' : 'var(--text-dark)',
                        fontWeight: '700',
                        background: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div style={{display: 'flex', gap: '1rem', marginBottom: '3rem'}}>
            <button 
              className="btn-primary" 
              style={{flex: '2', padding: '1rem', fontSize: '1.1rem'}}
              onClick={() => {
                addToCart({ 
                  ...product, 
                  cartItemId: Date.now(),
                  size: selectedSize || product.size,
                  color: selectedColor || product.color
                });
              }}
              disabled={product.stock === 0}
            >
              <ShoppingBag size={20} style={{marginRight: '8px'}} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
            <button 
              className="btn-outline" 
              style={{flex: '1', padding: '1rem', fontSize: '1.1rem', borderRadius: '4px', borderColor: 'var(--gray-border)', color: 'var(--text-dark)', fontWeight: '700'}}
              onClick={() => {
                fetch('http://127.0.0.1:8000/wishlist', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({ product_id: product.id })
                }).then(res => {
                  if (res.ok) alert('Added to Wishlist!');
                  else alert('Please sign in to use the Wishlist.');
                });
              }}
            >
              <Heart size={20} style={{marginRight: '8px', color: 'var(--text-light)'}} />
              Wishlist
            </button>
          </div>

          <div style={{paddingTop: '2rem', borderTop: '1px solid var(--gray-border)'}}>
            <h4 style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>PRODUCT DETAILS</h4>
            <p style={{color: 'var(--text-medium)', lineHeight: '1.6'}}>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ cart, removeFromCart, clearCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container" style={{padding: '4rem 2rem', minHeight: '60vh'}}>
      <h1 className="premium-title" style={{marginBottom: '2rem'}}>Your Cart</h1>
      
      {cart.length === 0 ? (
        <div>
          <p className="subtitle" style={{marginBottom: '2rem'}}>Your cart is currently empty.</p>
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'minmax(400px, 2fr) minmax(300px, 1fr)', gap: '3rem'}}>
          <div>
            {cart.map((item, idx) => (
              <div key={idx} style={{display: 'flex', gap: '1.5rem', padding: '1.5rem 0', borderBottom: '1px solid #eee'}}>
                <div style={{width: '100px', height: '120px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden'}}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa'}}>
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                    <h3 style={{fontSize: '1.1rem', margin: 0}}>{item.title}</h3>
                    <p style={{fontWeight: 'bold', margin: 0}}>${item.price}</p>
                  </div>
                  <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '1rem'}}>{item.color && `${item.color} | `}Size {item.size}</p>
                  <div>
                    <button onClick={() => removeFromCart(idx)} style={{background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline'}}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <div style={{background: '#f9f9f9', padding: '2rem', borderRadius: '8px', position: 'sticky', top: '100px'}}>
              <h3 style={{marginBottom: '1.5rem'}}>Order Summary</h3>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                <span>Subtotal ({cart.length} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>
              <div style={{borderTop: '1px solid #ddd', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
                <span style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Total</span>
                <span style={{fontWeight: 'bold', fontSize: '1.2rem'}}>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn-primary" style={{width: '100%', padding: '1rem', display: 'block', textAlign: 'center'}}>Proceed to Checkout</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Home = () => (
  <>
    <Hero />
    <WeeklyOffers />
  </>
);

const CategoryPage = () => {
  const { id } = useParams();
  const categoryMap = {
    'new-arrivals': 'New Arrivals',
    'men': 'Men',
    'women': 'Women',
    'accessories': 'Accessories'
  };
  const displayCategory = categoryMap[id] || (id ? id.replace('-', ' ').toUpperCase() : 'Category');
  const queryCategory = id === 'new-arrivals' ? '' : displayCategory;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterBrands = ['HRX by Hrithik Roshan', 'Roadster', 'Puma', 'Mango', 'DressBerry'];
  
  useEffect(() => {
    setLoading(true);
    let url = 'http://127.0.0.1:8000/products';
    if (queryCategory) {
      url += `?category=${queryCategory}`;
    }
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, [id, queryCategory]);
  
  return (
    <div className="container" style={{padding: '2rem 2rem', minHeight: '60vh'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem'}}>
        <span style={{fontSize: '0.9rem', color: 'var(--text-medium)'}}>Home /</span>
        <span style={{fontSize: '0.9rem', fontWeight: '700'}}>{displayCategory}</span>
      </div>
      <h1 className="premium-title" style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>{displayCategory} - {products.length} items</h1>
      
      <div className="category-layout">
        <aside className="sidebar">
          <div className="filter-section" style={{borderTop: 'none', paddingTop: 0}}>
            <h4 className="filter-title">Filters</h4>
          </div>
          <div className="filter-section">
            <h4 className="filter-title">Brand</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {filterBrands.map(brand => (
                <label key={brand} style={{display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-dark)', cursor: 'pointer'}}>
                  <input type="checkbox" style={{accentColor: 'var(--accent)', width: '16px', height: '16px'}} />
                  {brand}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <h4 className="filter-title">Discount Range</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-dark)', cursor: 'pointer'}}>
                <input type="radio" name="discount" style={{accentColor: 'var(--accent)'}} /> 10% and above
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-dark)', cursor: 'pointer'}}>
                <input type="radio" name="discount" style={{accentColor: 'var(--accent)'}} /> 30% and above
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-dark)', cursor: 'pointer'}}>
                <input type="radio" name="discount" style={{accentColor: 'var(--accent)'}} /> 50% and above
              </label>
            </div>
          </div>
        </aside>

        <div className="products-area">
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem'}}>
            <select style={{padding: '0.5rem 1rem', border: '1px solid var(--gray-border)', borderRadius: '4px', background: '#fff', fontSize: '0.9rem'}}>
              <option>Sort by: Recommended</option>
              <option>Price: High to Low</option>
              <option>Price: Low to High</option>
              <option>Customer Rating</option>
            </select>
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '2rem'}}>Loading products...</div>
          ) : error ? (
            <div style={{textAlign: 'center', padding: '2rem', color: 'red'}}>{error}</div>
          ) : products.length === 0 ? (
            <p className="subtitle" style={{textAlign: 'center'}}>No products found in this category.</p>
          ) : (
            <div className="product-grid">
              {products.map(p => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const CheckoutPage = ({ cart, clearCart }) => {
  const [purchased, setPurchased] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const navigate = useNavigate();

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'payu') {
      const txnid = "txnid" + Date.now();
      const productinfo = "Clothing Order";
      const firstname = e.target.elements[0].value || "Guest";
      const email = "test@example.com";
      
      const res = await fetch('http://127.0.0.1:8000/payu/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           txnid,
           amount: total.toFixed(2),
           productinfo,
           firstname,
           email
        })
      });
      const { hash } = await res.json();
      
      const form = document.createElement('form');
      form.method = 'post';
      form.action = 'https://test.payu.in/_payment';
      
      const appendInput = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };
      
      appendInput('key', 'XuE4SI');
      appendInput('txnid', txnid);
      appendInput('amount', total.toFixed(2));
      appendInput('productinfo', productinfo);
      appendInput('firstname', firstname);
      appendInput('email', email);
      appendInput('phone', '9999999999');
      appendInput('surl', 'http://127.0.0.1:8000/payu/success');
      appendInput('furl', 'http://127.0.0.1:8000/payu/fail');
      appendInput('hash', hash);
      
      document.body.appendChild(form);
      form.submit();
      
      return;
    }

    setTimeout(() => {
      clearCart();
      setPurchased(true);
    }, 1500);
  };

  if (!cart.length && !purchased) {
    return (
      <div className="container" style={{padding: '6rem 2rem', minHeight: '60vh', textAlign: 'center'}}>
        <p className="subtitle" style={{marginBottom: '2rem'}}>Your cart is empty.</p>
        <Link to="/" className="btn-primary">Return to Store</Link>
      </div>
    );
  }

  if (purchased) {
    return (
      <div className="container" style={{padding: '6rem 2rem', minHeight: '60vh', textAlign: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
          <CheckCircle size={64} color="var(--success)" />
        </div>
        <h1 className="premium-title">Thank you for your order!</h1>
        <p className="subtitle" style={{marginBottom: '2rem'}}>Your stylish pieces are being prepared for shipping.</p>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{padding: '4rem 2rem', minHeight: '60vh'}}>
      <h1 className="premium-title" style={{marginBottom: '2rem'}}>Checkout</h1>
      
      <div style={{display: 'grid', gridTemplateColumns: 'minmax(400px, 2fr) minmax(300px, 1fr)', gap: '3rem'}}>
        <div>
          <form id="checkout-form" onSubmit={handleCheckoutSubmit} style={{background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #eee'}}>
            <h3 style={{marginBottom: '1.5rem'}}>Shipping Details</h3>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
              <input type="text" placeholder="First Name" required style={{padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px'}} />
              <input type="text" placeholder="Last Name" required style={{padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px'}} />
            </div>
            <input type="text" placeholder="Address" required style={{width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem'}} />
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '2rem'}}>
              <input type="text" placeholder="City" required style={{padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px'}} />
              <input type="text" placeholder="State" required style={{padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px'}} />
              <input type="text" placeholder="ZIP" required style={{padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px'}} />
            </div>

            <h3 style={{marginBottom: '1.5rem'}}>Payment Information</h3>
            <div style={{marginBottom: '1rem', display: 'flex', gap: '2rem'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                Credit Card
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                Cash on Delivery
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                <input type="radio" name="paymentMethod" value="payu" checked={paymentMethod === 'payu'} onChange={() => setPaymentMethod('payu')} />
                PayU
              </label>
            </div>
            
            {paymentMethod === 'card' && (
              <>
                <input type="text" placeholder="Card Number" required style={{width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem'}} />
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                  <input type="text" placeholder="MM/YY" required style={{padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px'}} />
                  <input type="text" placeholder="CVC" required style={{padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px'}} />
                </div>
              </>
            )}
            
            {paymentMethod === 'cod' && (
              <div style={{padding: '1rem', background: '#f5f5f5', borderRadius: '4px', marginBottom: '1rem'}}>
                <p style={{margin: 0, color: 'var(--gray-dark)', fontSize: '0.9rem'}}>You will pay for your items in cash when they arrive at your shipping address.</p>
              </div>
            )}
            {paymentMethod === 'payu' && (
              <div style={{padding: '1rem', background: '#f5f5f5', borderRadius: '4px', marginBottom: '1rem'}}>
                <p style={{margin: 0, color: 'var(--gray-dark)', fontSize: '0.9rem'}}>You will be redirected to PayU to complete your payment securely.</p>
              </div>
            )}
          </form>
        </div>
        
        <div>
          <div style={{background: '#f9f9f9', padding: '2rem', borderRadius: '8px', position: 'sticky', top: '100px'}}>
            <h3 style={{marginBottom: '1.5rem'}}>Order Summary</h3>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
              <span>Subtotal ({cart.length} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>
              <div style={{borderTop: '1px solid #ddd', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
                <span style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Total Amount</span>
                <span style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Rs. {total.toFixed(2)}</span>
              </div>
              <button form="checkout-form" type="submit" className="btn-primary" style={{width: '100%', padding: '1rem', background: '#ff3f6c'}}>PLACE ORDER</button>
            </div>
          </div>
        </div>
      </div>
  );
};

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/wishlist', {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.detail) {
          setLoading(false);
          return;
        }
        setWishlist(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container" style={{padding: '4rem 2rem', minHeight: '60vh'}}>
      <h1 className="premium-title" style={{fontSize: '1.5rem', marginBottom: '2rem'}}>My Wishlist <span style={{fontWeight: '400', fontSize: '1.2rem', color: 'var(--text-medium)'}}>{wishlist.items?.length || 0} items</span></h1>
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '2rem'}}>Loading wishlist...</div>
      ) : !wishlist.items || wishlist.items.length === 0 ? (
        <div style={{textAlign: 'center', padding: '4rem 0'}}>
          <p className="subtitle" style={{marginBottom: '2rem'}}>Your wishlist is empty.</p>
          <Link to="/" className="btn-outline">Continue Shopping</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.items.map(item => (
            <ProductCard key={item.product_id} {...item.product} />
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, idx) => idx !== indexToRemove));
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <div className="app">
        <Navbar cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart} 
          removeFromCart={removeFromCart} 
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

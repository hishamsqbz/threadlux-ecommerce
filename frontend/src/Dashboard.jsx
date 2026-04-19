import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProductForm = ({ token, onProductAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    brand: '',
    discount_percent: '0',
    gender_category: 'Men',
    sub_category: 'T-Shirts',
    is_weekly_offer: false,
    category: 'Men',
    size: 'M',
    color: '',
    stock: '1'
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', parseFloat(formData.price));
      data.append('brand', formData.brand);
      data.append('discount_percent', parseInt(formData.discount_percent));
      data.append('gender_category', formData.gender_category);
      data.append('sub_category', formData.sub_category);
      data.append('is_weekly_offer', formData.is_weekly_offer);
      data.append('category', formData.category);
      data.append('size', formData.size);
      data.append('color', formData.color);
      data.append('stock', parseInt(formData.stock));
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await fetch('http://127.0.0.1:8000/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!res.ok) {
        const errData = await res.json();
        const errMsg = Array.isArray(errData.detail) ? errData.detail.map(e => `${e.loc.slice(-1)[0]}: ${e.msg}`).join(', ') : errData.detail;
        throw new Error(errMsg || 'Failed to add product');
      }
      
      const newProduct = await res.json();
      onProductAdded(newProduct);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem' };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fcfcfc', padding: '2rem', borderRadius: '8px', border: '1px solid #eee', marginTop: '1rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Add New Product</h3>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Title</label>
          <input name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Price ($)</label>
          <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>
      
      <div>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required style={{...inputStyle, height: '80px'}} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Brand</label>
          <input name="brand" value={formData.brand} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Discount Percent</label>
          <input name="discount_percent" type="number" value={formData.discount_percent} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Weekly Offer?</label>
          <div style={{...inputStyle, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <input name="is_weekly_offer" type="checkbox" checked={formData.is_weekly_offer} onChange={handleChange} style={{width: '20px', height: '20px'}} />
            Yes
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Gender</label>
          <select name="gender_category" value={formData.gender_category} onChange={handleChange} required style={inputStyle}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Beauty">Beauty</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Sub Category</label>
          <input name="sub_category" value={formData.sub_category} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Category Filter</label>
          <select name="category" value={formData.category} onChange={handleChange} required style={inputStyle}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Size</label>
          <input name="size" value={formData.size} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Color</label>
          <input name="color" value={formData.color} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Stock Quantity</label>
          <input name="stock" type="number" value={formData.stock} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Product Image (Optional)</label>
          <input name="image" type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>{loading ? 'Adding...' : 'Add Product'}</button>
        <button type="button" onClick={onCancel} className="btn-primary" style={{ flex: 1, background: '#eee', color: '#333' }}>Cancel</button>
      </div>
    </form>
  );
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [myProducts, setMyProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }

    fetch('http://127.0.0.1:8000/users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    })
    .then(data => setUser(data))
    .catch(() => {
      localStorage.removeItem('token');
      navigate('/auth');
    });
  }, [navigate, token]);

  useEffect(() => {
    if (user && (role === 'merchant' || role === 'admin')) {
      fetch('http://127.0.0.1:8000/products/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMyProducts(data);
        } else {
          setMyProducts([]);
        }
      })
      .catch(console.error);
    }
  }, [user, role, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/auth');
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setMyProducts(prev => prev.filter(p => p.id !== id));
        setSuccessMsg('Product deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductAdded = () => {
    setShowForm(false);
    setSuccessMsg('Product added successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (!user) return <div style={{textAlign: 'center', padding: '4rem'}}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '4rem 2rem', minHeight: '60vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="premium-title">Dashboard</h1>
        <button onClick={handleLogout} className="btn-primary" style={{ background: 'black', color: 'white' }}>Logout</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1rem' }}>Profile</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'var(--accent)', color: 'var(--primary)', display: 'inline-block', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {role ? role.toUpperCase() : 'CUSTOMER'}
          </div>
        </div>
        
        <div>
          {role === 'merchant' || role === 'admin' ? (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h2 className="premium-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Merchant Controls</h2>
              <p style={{ marginBottom: '1rem' }}>Manage your products and view inventory here.</p>
              
              {successMsg && <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>{successMsg}</div>}
              
              {!showForm ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Your Products</h3>
                    <button onClick={() => setShowForm(true)} className="btn-primary">Add New Product</button>
                  </div>
                  {myProducts.length === 0 ? (
                    <p style={{ color: '#666' }}>You haven't listed any products yet.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {myProducts.map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee', borderRadius: '4px', padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                             {p.image_url ? <img src={p.image_url} alt={p.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /> : <div style={{width:'50px',height:'50px',background:'#eee',borderRadius:'4px'}}></div>}
                             <div>
                                <h4 style={{ margin: 0 }}>{p.title}</h4>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>${p.price} | Stock: {p.stock}</p>
                             </div>
                          </div>
                          <button onClick={() => handleDeleteProduct(p.id)} className="btn-outline" style={{ padding: '0.4rem 1rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>Delete</button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <AddProductForm 
                  token={token} 
                  onProductAdded={(p) => {
                    handleProductAdded();
                    setMyProducts(prev => [...prev, p]);
                  }} 
                  onCancel={() => setShowForm(false)} 
                />
              )}
            </div>
          ) : (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h2 className="premium-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Order History</h2>
              <p>You have no recent orders.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

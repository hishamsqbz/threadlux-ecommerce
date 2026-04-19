import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from './CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product details');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>Loading product...</div>;
  if (error) return <div className="container" style={{padding: '4rem', textAlign: 'center', color: 'red'}}>{error}</div>;
  if (!product) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>Product not found</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--gray-dark)' }}>
        <ArrowLeft size={16} /> Back to Shop
      </Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Product Image */}
        <div style={{ background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', aspectRatio: '3/4', position: 'relative' }}>
          {product.image_url ? (
            <img 
              src={product.image_url.startsWith('http') ? product.image_url : `http://127.0.0.1:8000/${product.image_url}`} 
              alt={product.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
              <ShoppingBag size={64} opacity={0.2} />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--gray-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {product.category}
            </span>
          </div>
          
          <h1 className="premium-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.title}</h1>
          <p className="product-price" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>${product.price}</p>
          
          <p style={{ color: 'var(--gray-dark)', lineHeight: '1.8', marginBottom: '2rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
            {product.size && (
              <div>
                <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Size</strong>
                <span style={{ display: 'inline-block', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                  {product.size}
                </span>
              </div>
            )}
            {product.color && (
              <div>
                <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Color</strong>
                <span style={{ display: 'inline-block', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                  {product.color}
                </span>
              </div>
            )}
            <div>
              <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Availability</strong>
              <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: added ? 'var(--success)' : '' }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {added ? 'Added to Bag' : 'Add to Bag'}
          </button>
          
          <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-dark)' }}>
            <p style={{ marginBottom: '0.5rem' }}>✓ Free shipping on orders over $150</p>
            <p>✓ 30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

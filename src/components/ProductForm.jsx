import React, { useState, useEffect, useCallback } from 'react';
import './ProductForm.css';

const ProductForm = () => {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/products');
            if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
                throw new Error('Error fetching products');
            }
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const method = editingProduct ? 'PUT' : 'POST';
        const url = `http://localhost:3000/api/products${editingProduct ? `/${editingProduct.id}` : ''}`;
        
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingProduct?.id || Date.now(), name: productName }),
            });
            if (!response.ok) throw new Error(`Error ${editingProduct ? 'Actualizar' : 'Agregar'} product`);

            setProductName('');
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            setError(error.message);
        }
    }, [productName, editingProduct, fetchProducts]);

    const handleEdit = useCallback((product) => {
        setProductName(product.name);
        setEditingProduct(product);
    }, []);

    const handleDelete = useCallback(async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar el producto');

            fetchProducts();
        } catch (error) {
            setError(error.message);
        }
    }, [fetchProducts]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Nombre del producto"
                />
                <button type="submit" disabled={!productName}>
                    {editingProduct ? 'Actualizar' : 'Agregar'}
                </button>
            </form>

            {loading ? (
                <p>Cargando productos...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <ul>
                    {products.length ? (
                        products.map((product) => (
                            <li key={product.id}>
                                {product.name}
                                <button onClick={() => handleEdit(product)}>Editar</button>
                                <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                            </li>
                        ))
                    ) : (
                        <li>Productos no disponibles</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default ProductForm;

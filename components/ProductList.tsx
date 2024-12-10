'use client';

import { useEffect, useState } from 'react';

interface Product {
  name: string;
  price: number;
  active: boolean;
  imagenes: { url: string }[];
}

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);

  }, [initialProducts]);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.name}
          className="flex flex-col items-center justify-center gap-4 p-4 border rounded-lg shadow-md"
        >
          <img
            src={`http://191.101.1.86:1337${product.imagenes[0]?.url || "/placeholder.png"}`}
            alt={product.name}
            className="w-40 h-40 object-cover rounded-lg"
          />
          <h2 className="text-2xl font-bold text-center">{product.name}</h2>
          <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
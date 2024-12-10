'use server';
import { GraphQLClient } from 'graphql-request';

interface Product {
  name: string;
  price: number;
  active: boolean;
  imagenes: { url: string }[];
}

const GET_PRODUCTS = `
  query getProducts($page: Int, $pageSize: Int) {
    products(pagination: { page: $page, pageSize: $pageSize }) {
      name
      price
      active
      imagenes {
        url
      }
    }
    products_connection {
      pageInfo {
        total
      }
    }
  }
`;

export async function getProducts(page: number = 1, pageSize: number = 2) {
  const client = new GraphQLClient("http://191.101.1.86:1337/graphql");
  try {
    const data = await client.request<{
      products: Product[];
      products_connection: { pageInfo: { total: number } };
    }>(GET_PRODUCTS, { page, pageSize });

    return {
      products: data.products,
      total: data.products_connection.pageInfo.total,
      page
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0, page };
  }
}

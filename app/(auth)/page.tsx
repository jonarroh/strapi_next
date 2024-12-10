
import ProductList from "@/components/ProductList";
import ProductPagination from "@/components/PageChanger";
import { getProducts } from "../actions/getProducts";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 2;

  const { products, total } = await getProducts(page, pageSize);

  const jwt = (await cookies()).get('token');
  if (!jwt) return redirect('/login');


  return (
    <div className="container mx-auto px-4 py-8">
      <ProductList initialProducts={products} />
      <ProductPagination
        currentPage={page}
        pageSize={pageSize}
        totalProducts={total}
      />
    </div>
  );
}
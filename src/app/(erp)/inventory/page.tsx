import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase";
import { Package, AlertTriangle } from "lucide-react";
import AddProductButton from "@/app/(erp)/inventory/AddProductButton";
import EditProductButton from "@/app/(erp)/inventory/EditProductButton";
import DeleteProductButton from "@/app/(erp)/inventory/DeleteProductButton";
import SearchBar from "@/app/(erp)/inventory/SearchBar";
import FilterBar from "@/app/(erp)/inventory/FilterBar";
import { Suspense } from "react";

async function getProducts(search?: string, category?: string) {
  const supabase = createClient();
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
  }

  if (category && category !== "الكل") {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return data ?? [];
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;
  const products = await getProducts(search, category);

  return (
    <div>
      <Header title="المخزون" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            إجمالي المنتجات:{" "}
            <span className="font-semibold text-gray-800">
              {products.length}
            </span>
          </p>
          <AddProductButton />
        </div>

        <Suspense fallback={null}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <FilterBar />
            <SearchBar placeholder="بحث بالاسم أو الكود..." />
          </div>
        </Suspense>

        <div className="lg:hidden space-y-3">
          {products.length === 0 ? (
            <p className="text-center py-12 text-gray-400 text-sm">
              لا توجد منتجات
            </p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Package size={14} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        {product.sku}
                      </p>
                    </div>
                  </div>
                  {product.quantity === 0 ? (
                    <span className="badge-red">نفذ</span>
                  ) : product.quantity < 10 ? (
                    <span className="badge-red">منخفض</span>
                  ) : (
                    <span className="badge-green">متاح</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">الفئة:</span>
                    <span className="badge-blue">{product.category ?? "—"}</span>
                  </div>
                  <span className="font-bold text-primary-700">
                    {Number(product.price).toLocaleString("ar-EG")} ج.م
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-500">الكمية:</span>
                  {product.quantity < 10 && (
                    <AlertTriangle size={14} className="text-red-500" />
                  )}
                  <span
                    className={
                      product.quantity < 10 ? "text-red-600 font-medium" : "text-gray-800"
                    }
                  >
                    {product.quantity}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-1 border-t border-gray-100">
                  <EditProductButton product={product} />
                  <DeleteProductButton id={product.id} />
                </div>
              </div>
            ))
          )}
        </div>


        <div className="hidden lg:block table-container table-wrapper">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="table-header">المنتج</th>
                <th className="table-header">الكود</th>
                <th className="table-header">الفئة</th>
                <th className="table-header">السعر</th>
                <th className="table-header">الكمية</th>
                <th className="table-header">الحالة</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    لا توجد منتجات
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Package size={14} className="text-primary-600" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="font-mono text-gray-500">
                        {product.sku}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="badge-blue">
                        {product.category ?? "—"}
                      </span>
                    </td>
                    <td className="table-cell font-medium">
                      {Number(product.price).toLocaleString("ar-EG")} ج.م
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        {product.quantity < 10 && (
                          <AlertTriangle size={14} className="text-red-500" />
                        )}
                        <span
                          className={
                            product.quantity < 10
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {product.quantity}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      {product.quantity === 0 ? (
                        <span className="badge-red">نفذ</span>
                      ) : product.quantity < 10 ? (
                        <span className="badge-red">منخفض</span>
                      ) : (
                        <span className="badge-green">متاح</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <EditProductButton product={product} />
                        <DeleteProductButton id={product.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
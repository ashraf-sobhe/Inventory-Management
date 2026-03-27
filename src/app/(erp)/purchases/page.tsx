import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase";
import { ShoppingCart } from "lucide-react";
import AddPurchaseButton from "@/app/(erp)/purchases/AddPurchaseButton";
import DeletePurchaseButton from "@/app/(erp)/purchases/DeletePurchaseButton";

async function getPurchases() {
  const supabase = createClient();
  const { data } = await supabase
    .from("purchases")
    .select("*, products(name)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function PurchasesPage() {
  const purchases = await getPurchases();
  const total = purchases.reduce((sum, p) => sum + Number(p.total_cost), 0);

  return (
    <div>
      <Header title="المشتريات" />
      <div className="p-6 space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} className="text-green-600" />
            <p className="text-sm text-gray-500">
              إجمالي المشتريات:
              <span className="font-semibold text-gray-800 mr-1">
                {total.toLocaleString("ar-EG")} ج.م
              </span>
            </p>
          </div>
          <AddPurchaseButton />
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {purchases.length === 0 ? (
            <p className="text-center py-12 text-gray-400 text-sm">
              لا توجد مشتريات بعد
            </p>
          ) : (
            purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
              >
                {/* Row 1: Product name + Cost */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {purchase.products?.name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(purchase.created_at).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                  <span className="font-bold text-green-700">
                    {Number(purchase.total_cost).toLocaleString("ar-EG")} ج.م
                  </span>
                </div>

                {/* Row 2: Supplier + Quantity */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">المورد:</span>
                    <span className="text-gray-800">
                      {purchase.supplier_name ?? "—"}
                    </span>
                  </div>
                  <span className="badge-blue">الكمية: {purchase.quantity}</span>
                </div>

                {/* Row 3: Delete */}
                <div className="flex items-center justify-end pt-1 border-t border-gray-100">
                  <DeletePurchaseButton id={purchase.id} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block table-container table-wrapper">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="table-header">المنتج</th>
                <th className="table-header">المورد</th>
                <th className="table-header">الكمية</th>
                <th className="table-header">التكلفة</th>
                <th className="table-header">التاريخ</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    لا توجد مشتريات بعد
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase.id} className="table-row">
                    <td className="table-cell font-medium text-gray-900">
                      {purchase.products?.name ?? "—"}
                    </td>
                    <td className="table-cell text-gray-600">
                      {purchase.supplier_name ?? "—"}
                    </td>
                    <td className="table-cell">
                      <span className="badge-blue">{purchase.quantity}</span>
                    </td>
                    <td className="table-cell font-semibold text-green-700">
                      {Number(purchase.total_cost).toLocaleString("ar-EG")} ج.م
                    </td>
                    <td className="table-cell text-gray-400 text-xs">
                      {new Date(purchase.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="table-cell">
                      <DeletePurchaseButton id={purchase.id} />
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
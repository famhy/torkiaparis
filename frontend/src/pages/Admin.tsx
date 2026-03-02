import { useState, useEffect, useCallback } from "react";
import { fetchCategories, fetchProducts } from "../api/client";
import type { ApiCategory } from "../api/client";
import type { ApiProduct } from "../api/client";
import {
  fetchOrders,
  createCategory,
  updateCategory,
  deleteCategory,
  createProduct,
  uploadImage,
  updateOrderStatus,
  ORDER_STATUSES,
  type AdminOrder,
  type AdminOrderItem,
  type CreateCategoryBody,
  type UpdateCategoryBody,
  type CreateProductBody,
  type OrderStatusId,
  updateProduct,
  UpdateProductBody,
  deleteProduct,
} from "../api/admin";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useMenu } from "../context/MenuContext";

type Tab = "orders" | "categories" | "products";

export default function Admin() {
  const { isAdmin, login, logout } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const loadOrders = useCallback(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  const loadCategories = useCallback(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const loadProducts = useCallback(() => {
    fetchProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  const { refetch: refetchMenu } = useMenu();
  const refreshCategoriesAndMenu = useCallback(() => {
    loadCategories();
    refetchMenu();
  }, [loadCategories, refetchMenu]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    Promise.all([fetchOrders(), fetchCategories(), fetchProducts()])
      .then(([o, c, p]) => {
        setOrders(Array.isArray(o) ? o : []);
        setCategories(Array.isArray(c) ? c : []);
        setProducts(Array.isArray(p) ? p : []);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Erreur chargement"),
      )
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (login(password)) return;
    setLoginError("Mot de passe incorrect");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-card)] p-6 sm:p-8">
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-primary)] mb-2">
            Connexion admin
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Entrez le mot de passe pour accéder au tableau de bord.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              autoFocus
            />
            {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-2.5 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary)]/90"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems: { id: Tab; label: string }[] = [
    { id: "orders", label: "Commandes" },
    { id: "categories", label: "Catégories" },
    { id: "products", label: "Produits" },
  ];

  const closeMobileSidebar = () => setMobileSidebarOpen(false);
  const openMobileSidebar = () => setMobileSidebarOpen(true);

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)] min-w-0">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden
        />
      )}

      {/* Sidebar: drawer on mobile, static on md+ */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 sm:w-56 md:w-56 shrink-0 flex flex-col border-r border-gray-200 bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] min-h-screen transition-transform duration-200 ease-out md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h1 className="font-[var(--font-heading)] text-lg sm:text-xl font-semibold text-[var(--color-primary)]">
            Tableau de bord
          </h1>
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="md:hidden p-2 rounded-[var(--radius-card)] hover:bg-gray-100 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fermer le menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="p-2 flex-1">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveTab(id);
                closeMobileSidebar();
              }}
              className={`w-full text-left px-4 py-3 rounded-[var(--radius-card)] font-medium transition-colors min-h-[48px] flex items-center ${
                activeTab === id
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-gray-100">
          <button
            type="button"
            onClick={logout}
            className="w-full text-left px-4 py-3 text-sm text-gray-500 hover:text-gray-700 min-h-[48px] flex items-center"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-w-0">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
          {/* Mobile: menu button */}
          <button
            type="button"
            onClick={openMobileSidebar}
            className="md:hidden mb-4 p-3 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium flex items-center gap-2 min-h-[44px]"
            aria-label="Ouvrir le menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Menu
          </button>
          {error && (
            <p className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </p>
          )}

          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              loading={loading}
              onRefresh={loadOrders}
            />
          )}

          {activeTab === "categories" && (
            <CategoriesTab
              categories={categories}
              loading={loading}
              onRefresh={refreshCategoriesAndMenu}
            />
          )}

          {activeTab === "products" && (
            <ProductsTab
              products={products}
              categories={categories}
              loading={loading}
              onRefresh={loadProducts}
            />
          )}
        </div>
      </main>
    </div>
  );
}

/** Normalize backend status to our board columns (pending -> nouvelle) */
function orderStatusForBoard(status: string | undefined): OrderStatusId {
  const s = (status ?? "pending").toLowerCase();
  if (s === "en_preparation" || s === "en preparation") return "en_preparation";
  if (s === "pret" || s === "ready") return "pret";
  return "nouvelle";
}

function OrdersTab({
  orders,
  loading,
  onRefresh,
}: {
  orders: AdminOrder[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const ordersByStatus = (statusId: OrderStatusId) =>
    orders.filter((o) => orderStatusForBoard(o.status) === statusId);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatusId,
  ) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      onRefresh();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }
    } catch {
      // keep current state on error
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-primary)]">
          Commandes
        </h2>
        <button
          type="button"
          onClick={onRefresh}
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          Actualiser
        </button>
      </div>

      {loading ? (
        <p className="p-6 text-gray-500">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ORDER_STATUSES.map(({ id, label }) => (
            <div
              key={id}
              className="rounded-[var(--radius-card)] bg-gray-100/80 border border-gray-200 min-h-[200px] flex flex-col"
            >
              <div className="p-3 border-b border-gray-200 bg-white/80 rounded-t-[var(--radius-card)]">
                <h3 className="font-semibold text-gray-800">{label}</h3>
                <span className="text-sm text-gray-500">
                  {ordersByStatus(id).length} commande
                  {ordersByStatus(id).length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="p-2 flex-1 overflow-y-auto space-y-2">
                {ordersByStatus(id).length === 0 ? (
                  <p className="text-sm text-gray-400 p-2">Aucune</p>
                ) : (
                  ordersByStatus(id).map((o) => (
                    <OrderCard
                      key={o.id}
                      order={o}
                      currentStatus={id}
                      onStatusChange={handleStatusChange}
                      onViewDetails={() => setSelectedOrder(o)}
                      updating={updatingId === o.id}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          currentStatus={orderStatusForBoard(selectedOrder.status)}
          onStatusChange={(status) =>
            handleStatusChange(selectedOrder.id, status)
          }
          onClose={() => setSelectedOrder(null)}
          updating={updatingId === selectedOrder.id}
        />
      )}
    </div>
  );
}

function OrderCard({
  order,
  currentStatus,
  onStatusChange,
  onViewDetails,
  updating,
}: {
  order: AdminOrder;
  currentStatus: OrderStatusId;
  onStatusChange: (orderId: string, status: OrderStatusId) => void;
  onViewDetails: () => void;
  updating: boolean;
}) {
  return (
    <div className="rounded-lg bg-[var(--color-bg-card)] border border-gray-200 shadow-sm p-3 hover:shadow-[var(--shadow-soft)] transition-shadow">
      <button
        type="button"
        onClick={onViewDetails}
        className="w-full text-left block"
      >
        <p className="font-medium text-[var(--color-primary)]">{order.nom}</p>
        {order.telephone && (
          <p className="text-xs text-gray-500 mt-0.5">{order.telephone}</p>
        )}
        <p className="text-xs text-gray-500 mt-0.5">
          {new Date(order.createdAt).toLocaleString("fr-FR")}
        </p>
        <p className="text-sm font-semibold text-[var(--color-secondary)] mt-1">
          {Number(order.total).toFixed(2)}€
        </p>
      </button>
      <div className="mt-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onViewDetails}
          className="text-xs text-[var(--color-primary)] hover:underline mb-1"
        >
          Voir le détail
        </button>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Changer le statut
        </label>
        <select
          value={currentStatus}
          onChange={(e) =>
            onStatusChange(order.id, e.target.value as OrderStatusId)
          }
          disabled={updating}
          className="w-full text-sm rounded border border-gray-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function OrderDetailModal({
  order,
  currentStatus,
  onStatusChange,
  onClose,
  updating,
}: {
  order: AdminOrder;
  currentStatus: OrderStatusId;
  onStatusChange: (status: OrderStatusId) => void;
  onClose: () => void;
  updating: boolean;
}) {
  const itemName = (it: AdminOrderItem) =>
    it.name ?? it.label ?? it.item?.name ?? "Article";
  const itemPrice = (it: AdminOrderItem) => {
    const q = it.quantity || 1;
    const p = it.price ?? it.item?.price ?? 0;
    return q * Number(p);
  };
  const deliveryLabel =
    order.deliveryType === "click_collect"
      ? "Click & Collect"
      : order.deliveryType === "livraison"
        ? "Livraison"
        : (order.deliveryType ?? "—");
  const paymentLabel =
    order.paymentMethod === "card"
      ? "Carte bancaire"
      : order.paymentMethod === "livraison"
        ? "À la livraison"
        : (order.paymentMethod ?? "—");

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal
        aria-labelledby="order-detail-title"
      >
        <div
          className="relative w-full max-w-lg rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-[var(--color-bg-card)] border-b border-gray-100 p-4 flex items-center justify-between shrink-0">
            <h2
              id="order-detail-title"
              className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-primary)]"
            >
              Détail de la commande
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-[var(--radius-card)] hover:bg-gray-100 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Fermer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Client
              </h3>
              <p className="font-medium text-[var(--color-primary)]">
                {order.nom}
              </p>
              {order.telephone && (
                <p className="text-sm text-gray-600 mt-0.5">
                  <a
                    href={`tel:${order.telephone}`}
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    {order.telephone}
                  </a>
                </p>
              )}
            </div>

            {(order.adresse || order.codePostal) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Adresse
                </h3>
                <p className="text-gray-700">
                  {order.adresse}
                  {order.codePostal && <br />}
                  {order.codePostal && <span>{order.codePostal}</span>}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Retrait
                </h3>
                <p className="text-gray-700">{deliveryLabel}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Paiement
                </h3>
                <p className="text-gray-700">{paymentLabel}</p>
              </div>
            </div>

            {order.instructions && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Instructions
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {order.instructions}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Articles
              </h3>
              <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center px-3 py-2 bg-gray-50/50"
                    >
                      <span className="text-gray-800">
                        {itemName(item)} × {item.quantity}
                      </span>
                      <span className="font-medium text-[var(--color-secondary)]">
                        {itemPrice(item).toFixed(2)}€
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-500 text-sm">
                    Aucun détail
                  </li>
                )}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-1">
              {order.subtotal != null && (
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{Number(order.subtotal).toFixed(2)}€</span>
                </div>
              )}
              {order.deliveryFee != null && Number(order.deliveryFee) > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Frais de livraison</span>
                  <span>{Number(order.deliveryFee).toFixed(2)}€</span>
                </div>
              )}
              {order.promoCode &&
                order.promoDiscount != null &&
                Number(order.promoDiscount) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Réduction ({order.promoCode})</span>
                    <span>−{Number(order.promoDiscount).toFixed(2)}€</span>
                  </div>
                )}
              <div className="flex justify-between font-semibold text-[var(--color-primary)] pt-2">
                <span>Total</span>
                <span>{Number(order.total).toFixed(2)}€</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={currentStatus}
                onChange={(e) =>
                  onStatusChange(e.target.value as OrderStatusId)
                }
                disabled={updating}
                className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CategoriesTab({
  categories,
  loading,
  onRefresh,
}: {
  categories: ApiCategory[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [editing, setEditing] = useState<ApiCategory | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: CreateCategoryBody = {
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
      order,
    };
    setSubmitting(true);
    setMessage(null);
    try {
      await createCategory(body);
      setMessage({ type: "ok", text: "Catégorie ajoutée." });
      setName("");
      setSlug("");
      setOrder(categories.length);
      onRefresh();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Erreur",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c: ApiCategory) => {
    setEditing(c);
    setEditName(c.name);
    setEditSlug(c.slug);
    setEditOrder(c.order);
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const body: UpdateCategoryBody = {
        name: editName.trim(),
        slug:
          editSlug.trim() || editName.trim().toLowerCase().replace(/\s+/g, "-"),
        order: editOrder,
      };
      await updateCategory(editing.id, body);
      setMessage({ type: "ok", text: "Catégorie mise à jour." });
      setEditing(null);
      onRefresh();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Erreur",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (c: ApiCategory) => {
    if (
      !window.confirm(
        `Supprimer la catégorie « ${c.name} » ? Les produits de cette catégorie seront aussi supprimés.`,
      )
    )
      return;
    setDeletingId(c.id);
    setMessage(null);
    try {
      await deleteCategory(c.id);
      setMessage({ type: "ok", text: "Catégorie supprimée." });
      onRefresh();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Erreur",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] p-6">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary)] mb-4">
          Ajouter une catégorie
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug)
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }}
              required
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="ex: Kaskrout"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="ex: kaskrout"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordre
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              min={0}
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          {message && !editing && (
            <p
              className={
                message.type === "ok"
                  ? "text-green-600 text-sm"
                  : "text-red-600 text-sm"
              }
            >
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary)]/90 disabled:opacity-50"
          >
            {submitting ? "Envoi..." : "Ajouter la catégorie"}
          </button>
        </form>
      </div>

      <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] overflow-hidden">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary)] p-4 border-b border-gray-100">
          Catégories existantes (synchro avec le menu)
        </h2>
        {message && editing && (
          <p
            className={`px-4 py-2 text-sm border-b border-gray-100 ${message.type === "ok" ? "text-green-600" : "text-red-600"}`}
          >
            {message.text}
          </p>
        )}
        {loading ? (
          <p className="p-6 text-gray-500">Chargement...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-gray-500">Aucune catégorie.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 font-semibold text-gray-700">Nom</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Slug
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Ordre
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50"
                  >
                    {editing?.id === c.id ? (
                      <>
                        <td colSpan={4} className="p-4">
                          <form
                            onSubmit={handleUpdate}
                            className="flex flex-wrap items-end gap-3"
                          >
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-0.5">
                                Nom
                              </label>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                required
                                className="w-40 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-0.5">
                                Slug
                              </label>
                              <input
                                type="text"
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value)}
                                className="w-32 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-0.5">
                                Ordre
                              </label>
                              <input
                                type="number"
                                value={editOrder}
                                onChange={(e) =>
                                  setEditOrder(
                                    parseInt(e.target.value, 10) || 0,
                                  )
                                }
                                min={0}
                                className="w-16 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={submitting}
                              className="px-3 py-1.5 rounded bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50"
                            >
                              Enregistrer
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 text-sm"
                            >
                              Annuler
                            </button>
                          </form>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3 text-gray-600">{c.slug}</td>
                        <td className="px-4 py-3 text-gray-600">{c.order}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => startEdit(c)}
                            className="px-2 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 mr-1"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c)}
                            disabled={deletingId === c.id}
                            className="px-2 py-1 rounded border border-red-200 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === c.id
                              ? "Suppression..."
                              : "Supprimer"}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductsTab({
  products,
  categories,
  loading,
  onRefresh,
}: {
  products: ApiProduct[];
  categories: ApiCategory[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [isBestseller, setIsBestseller] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editIsBestseller, setEditIsBestseller] = useState(false);
  const [editIsAvailable, setEditIsAvailable] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (categories.length && !categoryId) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price.replace(",", "."));
    if (Number.isNaN(numPrice) || numPrice < 0) {
      setMessage({ type: "err", text: "Prix invalide" });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      let finalImageUrl = imageUrl.trim() || undefined;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }
      const body: CreateProductBody = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: numPrice,
        imageUrl: finalImageUrl,
        categoryId: categoryId || categories[0]?.id,
        isBestseller,
        isAvailable,
      };
      await createProduct(body);
      setMessage({ type: "ok", text: "Produit ajouté." });
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setImageFile(null);
      setIsBestseller(false);
      setIsAvailable(true);
      onRefresh();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Erreur",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (p: ApiProduct) => {
    setEditing(p);
    setEditName(p.name);
    setEditDescription(p.description ?? "");
    const priceValue =
      typeof p.price === "string" ? p.price : Number(p.price).toFixed(2);
    setEditPrice(priceValue);
    setEditImageUrl(p.imageUrl ?? "");
    setEditCategoryId(p.categoryId);
    setEditIsBestseller(Boolean(p.isBestseller));
    setEditIsAvailable(Boolean(p.isAvailable));
    setEditImageFile(null);
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditImageFile(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const numPrice = parseFloat(editPrice.replace(",", "."));
    if (Number.isNaN(numPrice) || numPrice < 0) {
      setMessage({ type: "err", text: "Prix invalide" });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      let finalImageUrl = editImageUrl.trim() || editing.imageUrl || undefined;
      if (editImageFile) {
        finalImageUrl = await uploadImage(editImageFile);
      }
      const body: UpdateProductBody = {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        price: numPrice,
        imageUrl: finalImageUrl,
        categoryId: editCategoryId || categories[0]?.id,
        isBestseller: editIsBestseller,
        isAvailable: editIsAvailable,
      };
      await updateProduct(editing.id, body);
      setMessage({ type: "ok", text: "Produit mis à jour." });
      setEditing(null);
      setEditImageFile(null);
      onRefresh();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Erreur",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (p: ApiProduct) => {
    if (!window.confirm(`Supprimer le produit « ${p.name} » ?`)) return;
    setDeletingId(p.id);
    setMessage(null);
    try {
      await deleteProduct(p.id);
      setMessage({ type: "ok", text: "Produit supprimé." });
      onRefresh();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Erreur",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] p-6">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary)] mb-4">
          Ajouter un produit
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="ex: Le Classique"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Optionnel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix (€)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="9.90"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image — affichée sur le menu
            </label>
            <div className="flex flex-wrap gap-4 items-start">
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setImageFile(f || null);
                    if (!f) return;
                    setImageUrl("");
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-[var(--radius-card)] file:border-0 file:text-sm file:font-medium file:bg-[var(--color-primary)] file:text-white file:cursor-pointer hover:file:bg-[var(--color-primary)]/90"
                />
                <p className="mt-1 text-xs text-gray-500">
                  JPEG, PNG, GIF ou WebP — max 5 Mo
                </p>
              </div>
              <span className="text-gray-400 text-sm">ou</span>
              <div className="flex-1 min-w-[200px]">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageFile(null);
                  }}
                  className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="URL (ex: https://exemple.com/image.jpg)"
                />
              </div>
            </div>
            {(imageUrl.trim() || imageFile) && (
              <div className="mt-2 w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={imageUrl.trim()}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={({ currentTarget }) => {
                      currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
              />
              <span className="text-sm">Best-seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
              <span className="text-sm">Disponible</span>
            </label>
          </div>
          {message && (
            <p
              className={
                message.type === "ok"
                  ? "text-green-600 text-sm"
                  : "text-red-600 text-sm"
              }
            >
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary)]/90 disabled:opacity-50"
          >
            {submitting ? "Envoi..." : "Ajouter le produit"}
          </button>
        </form>
      </div>

      <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] overflow-hidden">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary)] p-4 border-b border-gray-100">
          Produits existants
        </h2>
        {loading ? (
          <p className="p-6 text-gray-500">Chargement...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-gray-500">Aucun produit.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 font-semibold text-gray-700 w-20">
                    Image
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Nom</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 max-w-[200px]">
                    Description
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Prix
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Best-seller
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Disponible
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const imgUrl = p.imageUrl?.trim() || null;
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50"
                    >
                      {editing?.id === p.id ? (
                        <td colSpan={8} className="px-4 py-3">
                          <form
                            onSubmit={handleUpdate}
                            className="flex flex-wrap items-end gap-3"
                          >
                            <div className="flex items-start gap-3">
                              <div>
                                <div className="w-14 h-14 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 mb-2">
                                  {editImageFile ? (
                                    <img
                                      src={URL.createObjectURL(editImageFile)}
                                      alt={editName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : editImageUrl.trim() ? (
                                    <img
                                      src={editImageUrl.trim()}
                                      alt={editName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : imgUrl ? (
                                    <img
                                      src={imgUrl}
                                      alt={p.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <svg
                                      className="w-6 h-6 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/gif,image/webp"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    setEditImageFile(f || null);
                                    if (f) setEditImageUrl("");
                                  }}
                                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-2 file:rounded-[var(--radius-card)] file:border-0 file:text-xs file:font-medium file:bg-[var(--color-primary)] file:text-white file:cursor-pointer hover:file:bg-[var(--color-primary)]/90"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-0.5">
                                Nom
                              </label>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                required
                                className="w-40 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-0.5">
                                Description
                              </label>
                              <input
                                type="text"
                                value={editDescription}
                                onChange={(e) =>
                                  setEditDescription(e.target.value)
                                }
                                className="w-52 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-0.5">
                                Catégorie
                              </label>
                              <select
                                value={editCategoryId}
                                onChange={(e) =>
                                  setEditCategoryId(e.target.value)
                                }
                                className="w-32 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              >
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-0.5">
                                Prix (€)
                              </label>
                              <input
                                type="text"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-0.5">
                                Image (URL)
                              </label>
                              <input
                                type="url"
                                value={editImageUrl}
                                onChange={(e) => {
                                  setEditImageUrl(e.target.value);
                                  setEditImageFile(null);
                                }}
                                className="w-52 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-1 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editIsBestseller}
                                  onChange={(e) =>
                                    setEditIsBestseller(e.target.checked)
                                  }
                                />
                                <span>Best-seller</span>
                              </label>
                              <label className="flex items-center gap-1 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editIsAvailable}
                                  onChange={(e) =>
                                    setEditIsAvailable(e.target.checked)
                                  }
                                />
                                <span>Disponible</span>
                              </label>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button
                                type="submit"
                                disabled={submitting}
                                className="px-3 py-1.5 rounded bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50"
                              >
                                Enregistrer
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 text-sm"
                              >
                                Annuler
                              </button>
                            </div>
                          </form>
                        </td>
                      ) : (
                        <>
                          <td className="px-4 py-2">
                            <div className="w-14 h-14 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">{p.name}</td>
                          <td
                            className="px-4 py-3 text-gray-600 text-sm max-w-[200px] truncate"
                            title={p.description ?? ""}
                          >
                            {p.description ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {p.category?.name ?? p.categoryId}
                          </td>
                          <td className="px-4 py-3 text-[var(--color-secondary)] font-medium">
                            {typeof p.price === "string"
                              ? p.price
                              : Number(p.price).toFixed(2)}
                            €
                          </td>
                          <td className="px-4 py-3">
                            {p.isBestseller ? "Oui" : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {p.isAvailable ? "Oui" : "Non"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => startEdit(p)}
                              className="px-2 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 mr-1"
                            >
                              Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(p)}
                              disabled={deletingId === p.id}
                              className="px-2 py-1 rounded border border-red-200 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === p.id
                                ? "Suppression..."
                                : "Supprimer"}
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

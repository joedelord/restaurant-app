import { useEffect, useMemo, useState } from "react";
import CategoryForm from "../../components/admin/CategoryForm";
import CategoryList from "../../components/admin/CategoryList";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/categoryService";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    try {
      setError("");
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Kategorioiden haku epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (payload) => {
    const created = await createCategory(payload);
    setCategories((prev) =>
      [...prev, created].sort(
        (a, b) =>
          a.display_order - b.display_order || a.name.localeCompare(b.name),
      ),
    );
    setMessage("Kategoria lisättiin onnistuneesti.");
    setError("");
  };

  const handleUpdate = async (payload) => {
    if (!editingCategory) return;

    const updated = await updateCategory(editingCategory.id, payload);

    setCategories((prev) =>
      prev
        .map((item) => (item.id === editingCategory.id ? updated : item))
        .sort(
          (a, b) =>
            a.display_order - b.display_order || a.name.localeCompare(b.name),
        ),
    );

    setEditingCategory(null);
    setMessage("Kategoria päivitettiin onnistuneesti.");
    setError("");
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Haluatko varmasti poistaa kategorian "${item.name}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteCategory(item.id);
      setCategories((prev) => prev.filter((cat) => cat.id !== item.id));

      if (editingCategory?.id === item.id) {
        setEditingCategory(null);
      }

      setMessage("Kategoria poistettiin onnistuneesti.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Kategorian poistaminen epäonnistui.");
    }
  };

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return categories;

    return categories.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(query);
      const descMatch = item.description?.toLowerCase().includes(query);
      return nameMatch || descMatch;
    });
  }, [categories, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kategorioiden hallinta</h1>
          <p className="text-gray-500 mt-1">
            Lisää, muokkaa ja poista ruokalistan kategorioita.
          </p>
        </div>

        <div className="w-full lg:w-80">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hae kategorioita
          </label>
          <input
            type="text"
            placeholder="Hae nimellä tai kuvauksella"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-3">
            {editingCategory ? "Muokkaa kategoriaa" : "Lisää uusi kategoria"}
          </h2>

          <CategoryForm
            initialData={editingCategory}
            submitText={
              editingCategory ? "Päivitä kategoria" : "Lisää kategoria"
            }
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            onCancel={
              editingCategory ? () => setEditingCategory(null) : undefined
            }
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-3">Yhteenveto</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Kategorioita yhteensä</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Hakutuloksia</p>
              <p className="text-2xl font-bold">{filteredCategories.length}</p>
            </div>
          </div>

          {editingCategory && (
            <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <p className="font-medium text-orange-800">
                Muokkaustila aktiivinen
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Muokkaat parhaillaan kategoriaa:{" "}
                <strong>{editingCategory.name}</strong>
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Kategoriat</h2>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <p className="text-gray-500">Ladataan kategorioita...</p>
          </div>
        ) : (
          <CategoryList
            items={filteredCategories}
            onEdit={(item) => {
              setEditingCategory(item);
              setMessage("");
              setError("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
};

export default AdminCategories;

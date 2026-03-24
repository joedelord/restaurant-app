import { useState } from "react";

const getFormValues = (initialData) => ({
  name: initialData?.name ?? "",
  description: initialData?.description ?? "",
  display_order: initialData?.display_order ?? 0,
});

const CategoryForm = ({
  onSubmit,
  initialData = null,
  submitText = "Tallenna",
  onCancel,
}) => {
  const [formData, setFormData] = useState(() => getFormValues(initialData));
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "display_order" ? value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Kategorian nimi on pakollinen.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      display_order: Number(formData.display_order) || 0,
    };

    try {
      await onSubmit(payload);

      if (!initialData) {
        setFormData(getFormValues(null));
      }
    } catch (err) {
      console.error(err);
      setError("Tallennus epäonnistui.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategorian nimi
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Esim. Alkuruoat"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kuvaus
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Kirjoita kategorian kuvaus"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Järjestys
          </label>
          <input
            type="number"
            name="display_order"
            value={formData.display_order}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-white font-medium hover:bg-orange-600"
          >
            {submitText}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-50"
            >
              Peruuta
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;

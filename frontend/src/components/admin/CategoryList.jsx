const CategoryList = ({ items, onEdit, onDelete }) => {
  if (!items.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <p className="text-gray-500">Kategorioita ei löytynyt.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-sm text-gray-600">
              <th className="px-4 py-3 font-medium">Nimi</th>
              <th className="px-4 py-3 font-medium">Kuvaus</th>
              <th className="px-4 py-3 font-medium">Järjestys</th>
              <th className="px-4 py-3 font-medium">Toiminnot</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 last:border-b-0"
              >
                <td className="px-4 py-4 font-medium text-gray-900">
                  {item.name}
                </td>

                <td className="px-4 py-4 text-gray-700">
                  {item.description || "-"}
                </td>

                <td className="px-4 py-4 text-gray-700">
                  {item.display_order}
                </td>

                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Muokkaa
                    </button>

                    <button
                      onClick={() => onDelete(item)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                    >
                      Poista
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;

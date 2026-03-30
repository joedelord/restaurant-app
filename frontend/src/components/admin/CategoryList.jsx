import Button from "../ui/Button";

const CategoryList = ({ items, onEdit, onDelete }) => {
  if (!items.length) {
    return (
      <div className="mx-auto w-full rounded-md border border-black p-5">
        <p className="text-sm text-body">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full rounded-md border border-black p-5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-default-medium">
            <tr className="text-heading">
              <th className="px-3 py-3 font-medium">Name (EN / FI)</th>
              <th className="px-3 py-3 font-medium">Description (EN / FI)</th>
              <th className="px-3 py-3 font-medium">Order</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-default-medium last:border-b-0"
              >
                <td className="px-3 py-4 font-medium text-heading">
                  <div>{item.name_en || "-"}</div>
                  <div className="text-sm text-body">{item.name_fi || "-"}</div>
                </td>

                <td className="px-3 py-4 text-body">
                  <div>{item.description_en || "-"}</div>
                  <div className="text-sm">{item.description_fi || "-"}</div>
                </td>

                <td className="px-3 py-4 text-body">{item.display_order}</td>

                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(item)}
                    >
                      Delete
                    </Button>
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

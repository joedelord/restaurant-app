import Button from "../ui/Button";

const MenuItemList = ({ items, onEdit, onDelete }) => {
  if (!items.length) {
    return (
      <div className="mx-auto w-full rounded-md border-2 border-black p-5">
        <p className="text-sm text-body">No menu items found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full rounded-md border-2 border-black p-5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-default-medium">
            <tr className="text-heading">
              <th className="px-3 py-3 font-medium">Name</th>
              <th className="px-3 py-3 font-medium">Category</th>
              <th className="px-3 py-3 font-medium">Price</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-default-medium last:border-b-0"
              >
                <td className="px-3 py-4">
                  <div className="font-medium text-heading">{item.name}</div>
                  <div className="text-sm text-body">
                    {item.description || "-"}
                  </div>
                </td>

                <td className="px-3 py-4 text-body">
                  {item.category_name || item.category || "-"}
                </td>

                <td className="px-3 py-4 text-body">
                  €{Number(item.price).toFixed(2)}
                </td>

                <td className="px-3 py-4 text-body">
                  {item.is_available ? "Available" : "Unavailable"}
                </td>

                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
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

export default MenuItemList;

import Button from "../ui/Button";
import { formatCurrency } from "../../utils/currency";

const MenuItemList = ({ items, onEdit, onDelete }) => {
  if (!items.length) {
    return (
      <div className="mx-auto w-full rounded-md border-2 border-black p-5">
        <p className="text-sm text-body">No menu items found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full rounded-md border-2 border-black p-4 sm:p-5">
      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-default-medium p-4"
          >
            <div className="mb-2">
              <h3 className="font-medium text-heading">{item.name}</h3>
              <p className="mt-1 text-sm text-body">
                {item.description || "-"}
              </p>
            </div>

            <div className="space-y-1 text-sm text-body">
              <p>
                <span className="font-medium text-heading">Category:</span>{" "}
                {item.category_name || item.category || "-"}
              </p>
              <p>
                <span className="font-medium text-heading">Price:</span> €
                {Number(item.price).toFixed(2)}
              </p>
              <p>
                <span className="font-medium text-heading">Status:</span>{" "}
                {item.is_available ? "Available" : "Unavailable"}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
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
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
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
                  {formatCurrency(item.price)}
                </td>

                <td className="px-3 py-4 text-body">
                  {item.is_available ? "Available" : "Unavailable"}
                </td>

                <td className="px-3 py-4">
                  <div className="flex gap-2">
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

export default MenuItemList;

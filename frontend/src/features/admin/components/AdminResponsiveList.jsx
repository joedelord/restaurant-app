/**
 * AdminResponsiveList
 *
 * Reusable responsive list component for admin views.
 *
 * Responsibilities:
 * - Displays items in a table layout on desktop
 * - Displays items as cards on mobile
 * - Accepts dynamic columns and render functions
 * - Keeps admin UI consistent across different resources
 */

import { Button } from "@/components";

const AdminResponsiveList = ({
  items = [],
  columns = [],
  emptyText = "No items found.",
  renderTableRow,
  renderMobileCard,
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
}) => {
  if (!items.length) {
    return (
      <div className="mx-auto w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-body">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* 📱 Mobile */}
      <div className="space-y-4 md:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-default-medium p-4 bg-white"
          >
            {renderMobileCard(item)}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => onEdit(item)}
              >
                {editLabel}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() => onDelete(item)}
              >
                {deleteLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 🖥 Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-default-medium">
            <tr className="text-heading">
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-3 font-medium">
                  {column.label}
                </th>
              ))}
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-default-medium last:border-b-0"
              >
                {renderTableRow(item).map((cell, index) => (
                  <td key={index} className="px-3 py-4 text-body">
                    {cell}
                  </td>
                ))}

                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(item)}
                    >
                      {editLabel}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(item)}
                    >
                      {deleteLabel}
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

export default AdminResponsiveList;

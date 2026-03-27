import MenuItemCard from "./MenuItemCard";

const MenuSection = ({ category, items }) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>

        {category.description && (
          <p className="mt-1 text-sm text-gray-600">{category.description}</p>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid gap-4">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
          No items in this category.
        </div>
      )}
    </section>
  );
};

export default MenuSection;

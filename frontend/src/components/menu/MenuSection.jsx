import MenuItemCard from "./MenuItemCard";

const MenuSection = ({ category, items }) => {
  return (
    <section className="rounded-3xl border border-default-medium bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-heading sm:text-3xl">
          {category.localizedName || "-"}
        </h2>

        <div className="mx-auto mt-3 h-px w-16 bg-black/20" />

        {category.localizedDescription && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-body">
            {category.localizedDescription}
          </p>
        )}
      </div>

      <div className="divide-y divide-default-medium">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;

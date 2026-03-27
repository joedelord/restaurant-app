const MenuItemCard = ({ item }) => {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-32 w-full rounded-xl object-cover sm:w-40"
          />
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400 sm:w-40">
            No image
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.name}
              </h3>

              <span className="whitespace-nowrap text-base font-bold text-orange-600">
                €{Number(item.price).toFixed(2)}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              {item.description || "No description available."}
            </p>
          </div>

          <div className="mt-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                item.is_available
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.is_available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MenuItemCard;

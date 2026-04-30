/**
 * MenuItemCard
 *
 * Displays a single menu item in the public menu view.
 *
 * Responsibilities:
 * - Shows the localized menu item name and description
 * - Displays the item image when available
 * - Formats and displays the item price
 * - Shows fallback text when description is missing
 */

import { useTranslation } from "react-i18next";

import { formatCurrency } from "@/utils";
import {
  getLocalizedMenuItemDescription,
  getLocalizedMenuItemName,
} from "../utils/menuHelpers";

const MenuItemCard = ({ item }) => {
  const { t, i18n } = useTranslation();

  const language = i18n.language?.startsWith("fi") ? "fi" : "en";

  const localizedName = getLocalizedMenuItemName(item, language);
  const localizedDescription = getLocalizedMenuItemDescription(item, language);

  return (
    <article className="py-5 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={localizedName}
            className="h-24 w-full rounded-2xl object-cover sm:h-24 sm:w-28"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-heading sm:text-xl">
                {localizedName}
              </h3>

              <p className="mt-2 text-sm leading-6 text-body">
                {localizedDescription || t("menu.noDescription")}
              </p>
            </div>

            <div className="shrink-0 pl-2 text-right">
              <span className="inline-block text-lg font-semibold text-heading sm:text-xl">
                {formatCurrency(item.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MenuItemCard;

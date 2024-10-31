import React from "react";
import { useTranslation } from "react-i18next";

interface SortControlsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortBy,
  onSortChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="text-gray-400">{t("movies.sortBy")}:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-gray-800 text-gray-100 rounded px-4 py-2 border border-gray-700"
      >
        <option value="popularity">{t("movies.sortOptions.popularity")}</option>
        <option value="rating">{t("movies.sortOptions.rating")}</option>
        <option value="newest">{t("movies.sortOptions.newest")}</option>
      </select>
    </div>
  );
};

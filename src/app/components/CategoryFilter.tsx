import { ChangeEvent } from 'react'

export type NewsCategory = 'general' | 'business' | 'technology' | 'entertainment' | 'health' | 'science' | 'sports';

interface CategoryFilterProps {
  onCategoryChange: (category: NewsCategory) => void;
  selectedCategory: NewsCategory;
}

const categories: NewsCategory[] = [
  'general',
  'business',
  'technology',
  'entertainment',
  'health',
  'science',
  'sports'
];

const CategoryFilter = ({ onCategoryChange, selectedCategory }: CategoryFilterProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value as NewsCategory);
  };

  return (
    <div className="relative inline-block">
      <select 
        value={selectedCategory} 
        onChange={handleChange}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg pl-4 pr-10 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors duration-200"
      >
        {categories.map(category => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
};

export default CategoryFilter;

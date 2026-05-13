import type { ServiceCategory } from "@/types/services";

type ServiceCategoryListProps = {
  categories: ServiceCategory[];
  onSelect: (category: string) => void;
  onViewAll: () => void;
};

const images: Record<string, string> = {
  Photographer: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80",
  Decoration: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=300&q=80",
  Choreographer: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=300&q=80",
  "Dress Shop": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=300&q=80",
  "Makeup Artist": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=300&q=80",
  "DJ / Music": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300&q=80",
};

const labels: Record<string, string> = {
  Photographer: "Photographer/Videographer",
  Decoration: "Decorators",
  Choreographer: "Choreographers",
  "Dress Shop": "Designers",
  "Makeup Artist": "Makeup Artists",
  "DJ / Music": "Bar Services",
};

export default function ServiceCategoryList({ categories, onSelect, onViewAll }: ServiceCategoryListProps) {
  const visible = categories.filter((category) => labels[category.name]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-9 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Service Categories</h2>
        <button type="button" onClick={onViewAll} className="text-sm font-medium text-stone-700 hover:text-black">
          View All
        </button>
      </div>
      <div className="grid grid-cols-2 gap-9 sm:grid-cols-4 lg:grid-cols-7">
        {visible.map((category) => (
          <button key={category.id} type="button" onClick={() => onSelect(category.name)} className="text-center">
            <img src={images[category.name]} alt={labels[category.name]} className="mx-auto h-24 w-24 rounded-full object-cover" />
            <span className="mt-3 block text-sm font-medium">{labels[category.name]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

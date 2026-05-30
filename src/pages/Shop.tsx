import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { categoryLabels, ProductCategory } from "@/data/products";
import { useAllProducts } from "@/hooks/useAllProducts";

const categories: { value: string; label: string }[] = [
  { value: "All", label: "All" },
  { value: "signature-scents", label: "Signature Scents" },
  { value: "beauty-essentials", label: "Beauty Essentials" },
  { value: "everyday-style", label: "Everyday Style" },
  { value: "footwear-apparel", label: "Footwear & Apparel" },
  { value: "comfort-care", label: "Comfort Care" },
];

const genderFilters: { value: string; label: string }[] = [
  { value: "all", label: "All Scents" },
  { value: "mens-collection", label: "Men's Collection" },
  { value: "womens-collection", label: "Women's Collection" },
];

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Rating"] as const;

const ITEMS_PER_PAGE = 24;

const Shop = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("Featured");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { products } = useAllProducts();

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.family.toLowerCase().includes(search.toLowerCase()) || p.subcategory.toLowerCase().includes(search.toLowerCase());
      let matchCat = category === "All" || p.category === category;
      let matchGender = true;
      if (category === "signature-scents" && genderFilter !== "all") {
        if (genderFilter === "mens-collection") {
          matchGender = p.gender === "men" || p.gender === "unisex";
        } else if (genderFilter === "womens-collection") {
          matchGender = p.gender === "women" || p.gender === "unisex";
        }
      }
      return matchSearch && matchCat && matchGender;
    });

    switch (sort) {
      case "Price: Low to High": result.sort((a, b) => a.price - b.price); break;
      case "Price: High to Low": result.sort((a, b) => b.price - a.price); break;
      case "Rating": result.sort((a, b) => b.rating - a.rating); break;
    }

    return result;
  }, [search, category, genderFilter, sort, products]);

  // Reset page when filters change
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const paginatedProducts = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleFilterChange = (newCategory: string) => {
    setCategory(newCategory);
    setGenderFilter("all");
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handleGenderChange = (value: string) => {
    setGenderFilter(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("ellipsis");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading
            subtitle="The Collection"
            title="Our Products"
            description="Explore our curated collection of signature scents, everyday style accessories, and comfort care essentials."
          />

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search products..." value={search} onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-sm font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-3 border border-border rounded-sm text-sm font-body text-foreground">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <select value={sort} onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-3 bg-card border border-border rounded-sm font-body text-sm text-foreground focus:outline-none focus:border-accent">
              {sortOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Category Filters */}
          <div className={`${showFilters ? "block" : "hidden"} md:block mb-6`}>
            <span className="text-xs letter-spacing-luxury uppercase font-body text-muted-foreground mb-3 block">Category</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c.value} onClick={() => handleFilterChange(c.value)}
                  className={`px-4 py-2 text-xs letter-spacing-wide uppercase font-body font-medium rounded-sm border transition-all duration-300 ${
                    category === c.value
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-border hover:border-foreground"
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Sub-Filters (only for Signature Scents) */}
          {category === "signature-scents" && (
            <div className={`${showFilters ? "block" : "hidden"} md:block mb-10`}>
              <span className="text-xs letter-spacing-luxury uppercase font-body text-muted-foreground mb-3 block">Collection</span>
              <div className="flex flex-wrap gap-2">
                {genderFilters.map((g) => (
                  <button key={g.value} onClick={() => handleGenderChange(g.value)}
                    className={`px-4 py-2 text-xs letter-spacing-wide uppercase font-body font-medium rounded-sm border transition-all duration-300 ${
                      genderFilter === g.value
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-transparent text-foreground border-border hover:border-accent"
                    }`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground font-body mb-8">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            {totalPages > 1 && ` · Page ${safePage} of ${totalPages}`}
          </p>

          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {paginatedProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="pagination" className="flex justify-center items-center gap-1 mt-12">
                  <button
                    onClick={() => goToPage(safePage - 1)}
                    disabled={safePage <= 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-body text-foreground border border-border rounded-sm hover:border-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>

                  <div className="flex items-center gap-1 mx-2">
                    {getPageNumbers().map((page, idx) =>
                      page === "ellipsis" ? (
                        <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">…</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-9 h-9 flex items-center justify-center text-sm font-body rounded-sm border transition-all duration-300 ${
                            safePage === page
                              ? "bg-foreground text-background border-foreground"
                              : "bg-transparent text-foreground border-border hover:border-foreground"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => goToPage(safePage + 1)}
                    disabled={safePage >= totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-body text-foreground border border-border rounded-sm hover:border-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </nav>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="font-heading text-2xl text-foreground mb-2">No products found</p>
              <p className="text-muted-foreground font-body">Try adjusting your filters or search terms.</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;

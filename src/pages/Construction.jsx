import ServiceCategoryListPage from "../components/ServiceCategoryListPage";

export default function Construction() {
  return (
    <ServiceCategoryListPage
      categorySlug="construction"
      fallbackHero="/images/services/construction.webp"
    />
  );
}

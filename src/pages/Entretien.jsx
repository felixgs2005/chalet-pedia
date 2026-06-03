import ServiceCategoryListPage from "../components/ServiceCategoryListPage";

export default function Entretien() {
  return (
    <ServiceCategoryListPage
      categorySlug="entretien"
      fallbackHero="/images/services/entretien.webp"
    />
  );
}

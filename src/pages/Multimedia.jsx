import ServiceCategoryListPage from "../components/ServiceCategoryListPage";

export default function Multimedia() {
  return (
    <ServiceCategoryListPage
      categorySlug="multimedia"
      fallbackHero="/images/services/multimedia.webp"
    />
  );
}

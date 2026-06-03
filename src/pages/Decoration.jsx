import ServiceCategoryListPage from "../components/ServiceCategoryListPage";

export default function Decoration() {
  return (
    <ServiceCategoryListPage
      categorySlug="decoration"
      fallbackHero="/images/services/decoration.webp"
    />
  );
}

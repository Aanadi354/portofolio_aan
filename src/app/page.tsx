import { LandingPage } from "@/components/public/landing-page";
import { getPublicPortfolioData } from "@/services/public-portfolio";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPublicPortfolioData();

  return <LandingPage data={data} />;
}

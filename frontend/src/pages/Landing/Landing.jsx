import MainLayout from "../../layouts/MainLayout";

import Hero from "../../components/Hero/Hero";
import LatestJobs from "../../components/LatestJobs/LatestJobs";
import LatestEvent from "../../components/LatestEvent/LatestEvent";
import HRContact from "../../components/HRContact/HRContact";
import Footer from "../../components/Footer/Footer";

function Landing() {
  return (
    <MainLayout>
      <Hero />

      <LatestJobs />

      <LatestEvent />

      <HRContact />

      <Footer />
    </MainLayout>
  );
}

export default Landing;
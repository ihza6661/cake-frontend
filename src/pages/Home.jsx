import { useEffect } from "react";
import Categories from "../components/Categories";
import LatestColletion from "../components/LatestColletion";
import Hero from "../components/Hero";
import FeaturesSection from "../components/FeaturesSection";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";

const Home = () => {
  useEffect(() => {
    document.title = "Yulita Cakes";
  }, []);

  return (
    <div className="page-transition">
      <Hero />
      <LatestColletion />
      <Categories />
      <FeaturesSection />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;

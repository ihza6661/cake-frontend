import { useEffect } from "react";
import Categories from "../components/Categories";
import LatestProduct from "../components/LatestProduct";
import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";

const Home = () => {
  useEffect(() => {
    document.title = "Yulita Cakes";
  }, []);

  return (
    <div className="page-transition">
      <Hero />
      <LatestProduct />
      <Categories />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;

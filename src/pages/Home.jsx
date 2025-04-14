import { useEffect } from "react";
import Categories from "../components/Categories";
import LatestColletion from "../components/LatestColletion";
import Hero from "../components/Hero";

const Home = () => {
  useEffect(() => {
    document.title = "Yulita Cakes";
  }, []);
  return (
    <div className="">
      <Hero />
      <LatestColletion />
      <Categories />
    </div>
  );
};

export default Home;

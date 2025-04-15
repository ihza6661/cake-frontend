import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="h-[100vh] bg-cover bg-center transition-all duration-300
                 bg-[url('https://images.unsplash.com/photo-1602630209855-dceac223adfe?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] 
                 dark:bg-[#3B1E2E]"
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-black/60 flex flex-col justify-center items-center text-center p-6">
          <h1
            className="text-5xl md:text-6xl font-extrabold mb-4 
                       text-white dark:text-pink-300 tracking-wide drop-shadow-lg"
          >
            Kue Lezat & Segar
          </h1>
          <p
            className="text-lg md:text-xl mb-6 max-w-2xl 
                      text-gray-200 dark:text-pink-100 leading-relaxed md:leading-loose"
          >
            Nikmati kelezatan kue terbaik yang dibuat dengan cinta dan bahan
            segar, cocok untuk setiap momen spesial.
          </p>
          <Link to="/kue">
            <Button className="font-semibold rounded-full" size="lg">
              Pesan Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

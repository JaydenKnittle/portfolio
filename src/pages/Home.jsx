import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Games from '../components/Games';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Projects from '../components/Projects';
import Skills from '../components/Skills';

function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Games />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;
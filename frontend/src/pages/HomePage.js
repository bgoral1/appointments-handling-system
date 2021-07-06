import React, {useState, useEffect} from 'react';
import { NavHashLink } from 'react-router-hash-link';

import './HomePage.scss';

import Header from '../components/Header/Header';
import TopBar from '../components/TopBar/TopBar';
import Hero from '../components/HeroSection/Hero';


const HomePage = () => {
  const [scroll, setScroll] = useState("");

    useEffect(()=> {
      window.addEventListener('scroll', () => {
        let activeClass = '';
        if(window.scrollY > 20){
            activeClass = 'showBackToTop';
        }
        setScroll(activeClass);
      });
    }, []);
    
  return (
    <>
      <TopBar/>
      <Header isHome/>
      <main id="home" className="mainHome">
        <Hero />
      <section id="about">O nas</section>
      <section id="services">Usługi</section>
      <section id="time">Godzny</section>
      <section id="dentists">Dentyści</section>
      <section id="gallery">Galeria</section>
      </main>
      <footer>  
          <NavHashLink to="/#home" className={`back-to-top d-flex btn-primary align-items-center justify-content-center ${scroll}`}>
          <i class="bi bi-arrow-up-short"></i>
        </NavHashLink></footer>
    </>
  );
};

export default HomePage;

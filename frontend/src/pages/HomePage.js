import React, {useState, useEffect} from 'react';

import './HomePage.scss';


import Header from '../components/Header/Header';
import TopBar from '../components/TopBar/TopBar';
import Hero from '../components/HeroSection/Hero';

const HomePage = () => {
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
    </>
  );
};

export default HomePage;

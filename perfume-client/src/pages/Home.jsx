import React from 'react';
import Hero from '../components/Hero';
import FeaturedCollections from '../components/FeaturedCollections';
import TopSellers from '../components/TopSellers';
import Craftsmanship from '../components/Craftsmanship';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <TopSellers />
      <Craftsmanship />
      <Newsletter />
    </>
  );
};

export default Home;

import React from 'react';
import TopSellers from '../components/TopSellers';

const TopSellersPage = () => {
  return (
    <div className="pt-24 min-h-screen bg-[#F9F8F6]">
      <TopSellers showViewAll={false} />
    </div>
  );
};

export default TopSellersPage;

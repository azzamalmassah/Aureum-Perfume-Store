import React from 'react';
import FeaturedCollections from '../components/FeaturedCollections';

const CollectionsPage = () => {
  return (
    <div className="pt-24 min-h-screen bg-paper">
      <FeaturedCollections showViewAll={false} />
    </div>
  );
};

export default CollectionsPage;

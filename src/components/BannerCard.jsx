import React from 'react';
import "../components/styles/BannerCard.css";

const BannerCard = () => {
  return (
    <div className="banner-card">
      <img 
        src="/images/foto-produtor-8.png" 
        alt="Banner do Portal" 
        loading="lazy" 
      />
    </div>
  );
};

export default BannerCard;

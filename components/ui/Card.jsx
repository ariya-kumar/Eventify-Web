import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`glass rounded-2xl overflow-hidden card-hover ${className || ''}`}>
      {children}
    </div>);
};

export default Card;
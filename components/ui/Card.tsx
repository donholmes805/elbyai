
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-1' : ''} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;

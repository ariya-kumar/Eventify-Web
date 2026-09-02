import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ to, variant = 'primary', size = 'md', children, className, ...props }) => {
  
  const baseClasses = "inline-block text-center font-semibold rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: 'btn-gradient border-0 focus:ring-indigo-500',
    secondary: 'bg-white text-indigo-600 border border-gray-200 hover:bg-gray-50 focus:ring-indigo-500',
    outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500'
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-6'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {children}
      </Link>);

  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>);

};

export default Button;
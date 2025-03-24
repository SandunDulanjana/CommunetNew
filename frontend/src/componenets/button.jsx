// src/components/button.jsx
import React from 'react';

const Button = ({ children, onClick, variant = 'default', className = '' }) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-semibold focus:outline-none';

    const variantStyles = {
        default: 'bg-blue-500 text-white hover:bg-blue-600',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;

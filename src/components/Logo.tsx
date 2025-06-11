// components/Logo.tsx

import React from 'react';

interface LogoProps {
  small?: boolean;
  inline?: boolean;
  className?: string;
}

export function Logo({ small = false, inline = false, className = '' }: LogoProps) {
  // Base size: large text; small -> reduce font size
  const sizeClass = small ? 'text-2xl' : 'text-4xl';
  const container = inline ? 'inline-flex' : 'flex';

  return (
    <div className={`${container} items-center ${className}`}>  
      {/* Simple text-based logo; replace with SVG if you have one */}
      <span className={`font-cal font-bold text-emphasis ${sizeClass}`}>Cal.com</span>
    </div>
  );
}

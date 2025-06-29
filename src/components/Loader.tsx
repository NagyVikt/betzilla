// components/Loader.tsx

import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}


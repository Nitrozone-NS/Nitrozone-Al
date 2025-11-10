import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C10.866 6.33 12.83 5.25 15 5.25c1.75 0 3.322.613 4.545 1.624a.75.75 0 01-1.09 1.032A5.25 5.25 0 0015 6.75c-1.635 0-3.07.754-4.095 1.845a.75.75 0 01-1.09-1.032zM10.875 12a4.5 4.5 0 118.25 0 .75.75 0 01-1.5.043 3 3 0 10-5.25 0 .75.75 0 01-1.5-.043zM4.185 10.125a.75.75 0 01.536.219c.754 1.02 1.83 1.83 3.06 2.375a.75.75 0 01-.536 1.378c-1.54-.66-2.83-1.748-3.596-2.964a.75.75 0 01.536-1.008z"
      clipRule="evenodd"
    />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-brand-secondary" />
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            AI Assistant
          </h1>
        </div>
      </div>
    </header>
  );
};
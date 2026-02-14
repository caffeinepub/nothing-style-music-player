import React from 'react';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ children, className = '' }: SectionCardProps) {
  return (
    <div className={`border border-border bg-card ${className}`}>
      {children}
    </div>
  );
}


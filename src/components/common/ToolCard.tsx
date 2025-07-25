import React from 'react';

interface ToolCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, children }) => {
  return (
    <div className="tool-card">
      <div className="mb-4">
        <h3 className="text-lg font-cyber font-bold text-cyber-green mb-2">
          {title}
        </h3>
        <p className="text-cyber-green/70 text-sm">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
};

export default ToolCard;
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-cyber-dark border-t border-cyber-green/30 mt-12 text-cyber-green text-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="mb-2 font-bold">
            Developed by Manoj Kumar | cybergodfather
          </p>
          <p className="mb-2">
            Red Team toy - Professional Security Testing Suite
          </p>
          <p className="text-xs text-cyber-green/70">
            Remember: With great power comes great responsibility. 
            Use these tools ethically and within legal boundaries.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
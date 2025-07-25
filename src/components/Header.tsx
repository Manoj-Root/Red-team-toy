import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-cyber-gray border-b border-cyber-green/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🛡️</div>
            <div>
              <h1 className="text-3xl font-cyber font-bold text-cyber-green animate-glow">
                Red Team Toy
              </h1>
              <p className="text-cyber-green/70 text-sm">
                Professional Security Testing & Research Tools
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-warning-red text-sm font-bold mb-1">
              ⚠️ AUTHORIZED USE ONLY
            </div>
            <div className="text-cyber-green/70 text-xs">
              Educational & Professional Use
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-warning-red/10 border border-warning-red/30 rounded">
          <p className="text-warning-red text-sm">
            <strong>DISCLAIMER:</strong> These tools are for authorized penetration testing, 
            security research, and educational purposes only. Unauthorized use is prohibited 
            and may be illegal. Always obtain proper authorization before testing.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
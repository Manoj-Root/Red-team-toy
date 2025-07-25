import React from 'react';

interface Tab {
  id: string;
  name: string;
  icon: string;
}

interface NavigationTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="bg-cyber-gray border-b border-cyber-green/30">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`tab-button whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id ? 'active' : 'text-cyber-green/60'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationTabs;
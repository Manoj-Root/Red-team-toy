import { useState } from 'react';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import ReconTools from './components/tools/ReconTools';
import NetworkTools from './components/tools/NetworkTools';
import PayloadTools from './components/tools/PayloadTools';
import CryptoTools from './components/tools/CryptoTools';
import WebTools from './components/tools/WebTools';
import UtilityTools from './components/tools/UtilityTools';
import Footer from './components/Footer';

const tabs = [
  { id: 'recon', name: 'Reconnaissance', icon: '🔍' },
  { id: 'network', name: 'Network', icon: '🌐' },
  { id: 'payloads', name: 'Payloads', icon: '💥' },
  { id: 'crypto', name: 'Cryptography', icon: '🔐' },
  { id: 'web', name: 'Web Tools', icon: '🕷️' },
  { id: 'utilities', name: 'Utilities', icon: '🛠️' }
];

function App() {
  const [activeTab, setActiveTab] = useState('recon');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'recon':
        return <ReconTools />;
      case 'network':
        return <NetworkTools />;
      case 'payloads':
        return <PayloadTools />;
      case 'crypto':
        return <CryptoTools />;
      case 'web':
        return <WebTools />;
      case 'utilities':
        return <UtilityTools />;
      default:
        return <ReconTools />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      <Header />
      <NavigationTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderActiveTab()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
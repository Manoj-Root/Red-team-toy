import React, { useState } from 'react';
import ToolCard from '../common/ToolCard';
import TerminalOutput from '../common/TerminalOutput';

const ReconTools: React.FC = () => {
  const [subdomainTarget, setSubdomainTarget] = useState('');
  const [subdomainOutput, setSubdomainOutput] = useState('');
  const [whoisTarget, setWhoisTarget] = useState('');
  const [whoisOutput, setWhoisOutput] = useState('');
  const [dnsTarget, setDnsTarget] = useState('');
  const [dnsOutput, setDnsOutput] = useState('');
  const [geoIp, setGeoIp] = useState('');
  const [geoOutput, setGeoOutput] = useState('');

  const runSubdomainEnum = () => {
    if (!subdomainTarget) return;
    setSubdomainOutput('Starting subdomain enumeration...\n');
    
    // Simulate subdomain enumeration
    const subdomains = [
      'www', 'mail', 'ftp', 'admin', 'test', 'dev', 'staging', 'api', 
      'blog', 'shop', 'secure', 'vpn', 'remote', 'portal', 'support'
    ];
    
    let output = `[*] Target: ${subdomainTarget}\n[*] Scanning for subdomains...\n\n`;
    
    subdomains.forEach((sub, index) => {
      setTimeout(() => {
        const found = Math.random() > 0.7;
        if (found) {
          output += `[+] Found: ${sub}.${subdomainTarget}\n`;
          setSubdomainOutput(output);
        }
      }, index * 200);
    });
    
    setTimeout(() => {
      output += '\n[*] Enumeration complete.';
      setSubdomainOutput(output);
    }, subdomains.length * 200 + 500);
  };

  const runWhoisLookup = () => {
    if (!whoisTarget) return;
    setWhoisOutput('Performing WHOIS lookup...\n');
    
    setTimeout(() => {
      const mockWhois = `
Domain Name: ${whoisTarget.toUpperCase()}
Registry Domain ID: 123456789_DOMAIN_COM
Registrar WHOIS Server: whois.registrar.com
Creation Date: 2020-01-01T00:00:00Z
Registry Expiry Date: 2025-01-01T00:00:00Z
Registrar: Example Registrar, Inc.
Registrar IANA ID: 1234
Domain Status: clientTransferProhibited
Name Server: ns1.example.com
Name Server: ns2.example.com

[*] WHOIS lookup complete.`;
      setWhoisOutput(mockWhois);
    }, 1000);
  };

  const runDnsEnum = () => {
    if (!dnsTarget) return;
    setDnsOutput('Starting DNS enumeration...\n');
    
    const records = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];
    let output = `[*] Target: ${dnsTarget}\n[*] Querying DNS records...\n\n`;
    
    records.forEach((record, index) => {
      setTimeout(() => {
        const found = Math.random() > 0.3;
        if (found) {
          let value = '';
          switch (record) {
            case 'A': value = `192.168.1.${Math.floor(Math.random() * 255)}`; break;
            case 'MX': value = `10 mail.${dnsTarget}`; break;
            case 'NS': value = `ns1.${dnsTarget}`; break;
            case 'TXT': value = '"v=spf1 include:_spf.google.com ~all"'; break;
            default: value = `example.${dnsTarget}`;
          }
          output += `[+] ${record}: ${value}\n`;
          setDnsOutput(output);
        }
      }, index * 300);
    });
    
    setTimeout(() => {
      output += '\n[*] DNS enumeration complete.';
      setDnsOutput(output);
    }, records.length * 300 + 500);
  };

  const lookupGeolocation = async () => {
    if (!geoIp) {
      setGeoOutput('[!] Please enter an IP address.');
      return;
    }
    setGeoOutput('[*] Looking up geolocation...');
    try {
      const res = await fetch(`https://ip-api.io/json/${geoIp}`);
      const data = await res.json();
      if (data && data.country_name) {
        setGeoOutput(
          `[*] IP: ${geoIp}
Country: ${data.country_name}
Region: ${data.region_name}
City: ${data.city}
ISP: ${data.isp}
Latitude: ${data.latitude}
Longitude: ${data.longitude}
Timezone: ${data.timezone}
Org: ${data.org}`
        );
      } else {
        setGeoOutput('[!] No geolocation data found for this IP.');
      }
    } catch {
      setGeoOutput('[!] Failed to fetch geolocation data.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-cyber font-bold text-cyber-green mb-2">
          🔍 Reconnaissance Tools
        </h2>
        <p className="text-cyber-green/70">
          Information gathering and target enumeration utilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subdomain Enumeration */}
        <ToolCard title="Subdomain Enumeration" description="Discover subdomains for a target domain">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="example.com"
              value={subdomainTarget}
              onChange={(e) => setSubdomainTarget(e.target.value)}
              className="cyber-input w-full"
            />
            <button onClick={runSubdomainEnum} className="cyber-button w-full">
              Start Enumeration
            </button>
            <TerminalOutput content={subdomainOutput} />
          </div>
        </ToolCard>

        {/* WHOIS Lookup */}
        <ToolCard title="WHOIS Lookup" description="Retrieve domain registration information">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="example.com"
              value={whoisTarget}
              onChange={(e) => setWhoisTarget(e.target.value)}
              className="cyber-input w-full"
            />
            <button onClick={runWhoisLookup} className="cyber-button w-full">
              Lookup WHOIS
            </button>
            <TerminalOutput content={whoisOutput} />
          </div>
        </ToolCard>

        {/* DNS Enumeration */}
        <ToolCard title="DNS Enumeration" description="Enumerate DNS records for a domain">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="example.com"
              value={dnsTarget}
              onChange={(e) => setDnsTarget(e.target.value)}
              className="cyber-input w-full"
            />
            <button onClick={runDnsEnum} className="cyber-button w-full">
              Enumerate DNS
            </button>
            <TerminalOutput content={dnsOutput} />
          </div>
        </ToolCard>

        {/* IP Geolocation - now functional */}
        <ToolCard title="IP Geolocation" description="Get geographical information for an IP address">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="8.8.8.8"
              value={geoIp}
              onChange={e => setGeoIp(e.target.value)}
              className="cyber-input w-full"
            />
            <button className="cyber-button w-full" onClick={lookupGeolocation}>
              Lookup Location
            </button>
            <TerminalOutput content={geoOutput || "Click 'Lookup Location' to get IP geolocation data..."} />
          </div>
        </ToolCard>
      </div>
    </div>
  );
};

export default ReconTools;
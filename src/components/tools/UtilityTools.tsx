import React, { useState } from 'react';
import ToolCard from '../common/ToolCard';
import TerminalOutput from '../common/TerminalOutput';

const UtilityTools: React.FC = () => {
  const [ipInput, setIpInput] = useState('');
  const [ipOutput, setIpOutput] = useState('');
  
  const [logInput, setLogInput] = useState('');
  const [logOutput, setLogOutput] = useState('');

  const [urlInput, setUrlInput] = useState('');
  const [urlOutput, setUrlOutput] = useState('');

  const [randomType, setRandomType] = useState('string');
  const [randomQty, setRandomQty] = useState(1);
  const [randomOutput, setRandomOutput] = useState('');

  const [networkInput, setNetworkInput] = useState('');
  const [networkOutput, setNetworkOutput] = useState('');

  const [uaType, setUaType] = useState('chrome');
  const [uaOutput, setUaOutput] = useState('');

  const analyzeIp = () => {
    if (!ipInput) return;

    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ipInput.match(ipRegex);

    if (!match) {
      setIpOutput('[!] Invalid IP address format');
      return;
    }

    const [, a, b, c, d] = match;
    const aNum = Number(a), bNum = Number(b), cNum = Number(c), dNum = Number(d);

    let classification = '';
    let notes = '';

    if (aNum === 10) {
      classification = 'Private (Class A)';
      notes = 'RFC 1918 - Private network';
    } else if (aNum === 172 && bNum >= 16 && bNum <= 31) {
      classification = 'Private (Class B)';
      notes = 'RFC 1918 - Private network';
    } else if (aNum === 192 && bNum === 168) {
      classification = 'Private (Class C)';
      notes = 'RFC 1918 - Private network';
    } else if (aNum === 127) {
      classification = 'Loopback';
      notes = 'Local host loopback address';
    } else if (aNum >= 224 && aNum <= 239) {
      classification = 'Multicast';
      notes = 'Multicast address range';
    } else if (aNum >= 240) {
      classification = 'Reserved';
      notes = 'Reserved for future use';
    } else {
      classification = 'Public';
      notes = 'Routable public IP address';
    }

    const binary = [aNum, bNum, cNum, dNum].map(octet =>
      octet.toString(2).padStart(8, '0')
    ).join('.');

    const hex = [aNum, bNum, cNum, dNum].map(octet =>
      octet.toString(16).padStart(2, '0').toUpperCase()
    ).join(':');

    const output = `
[*] IP Address Analysis: ${ipInput}

Classification: ${classification}
Notes: ${notes}

Binary: ${binary}
Hexadecimal: ${hex}
Decimal: ${(aNum << 24) + (bNum << 16) + (cNum << 8) + dNum}

Network Information:
- First Octet: ${aNum} (${aNum.toString(2).padStart(8, '0')})
- Second Octet: ${bNum} (${bNum.toString(2).padStart(8, '0')})
- Third Octet: ${cNum} (${cNum.toString(2).padStart(8, '0')})
- Fourth Octet: ${dNum} (${dNum.toString(2).padStart(8, '0')})

[*] Analysis complete.`;

    setIpOutput(output);
  };

  const analyzeLog = () => {
    if (!logInput) return;
    
    const lines = logInput.split('\n').filter(line => line.trim());
    const ipRegex = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g;
    const httpStatusRegex = /\b(1\d{2}|2\d{2}|3\d{2}|4\d{2}|5\d{2})\b/g;
    const methodRegex = /\b(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH)\b/g;
    
    const ips = new Set();
    const statuses = new Map();
    const methods = new Map();
    const suspicious: string[] = [];
    
    lines.forEach((line, index) => {
      // Extract IPs
      const ipMatches = line.match(ipRegex);
      if (ipMatches) {
        ipMatches.forEach(ip => ips.add(ip));
      }
      
      // Extract HTTP status codes
      const statusMatches = line.match(httpStatusRegex);
      if (statusMatches) {
        statusMatches.forEach(status => {
          statuses.set(status, (statuses.get(status) || 0) + 1);
        });
      }
      
      // Extract HTTP methods
      const methodMatches = line.match(methodRegex);
      if (methodMatches) {
        methodMatches.forEach(method => {
          methods.set(method, (methods.get(method) || 0) + 1);
        });
      }
      
      // Detect suspicious patterns
      if (line.includes('404') || line.includes('403')) {
        if (line.includes('admin') || line.includes('wp-') || line.includes('.php') || line.includes('config')) {
          suspicious.push(`Line ${index + 1}: Potential reconnaissance - ${line.substring(0, 100)}...`);
        }
      }
      
      if (line.includes('SELECT') || line.includes('UNION') || line.includes('OR 1=1')) {
        suspicious.push(`Line ${index + 1}: Potential SQL injection - ${line.substring(0, 100)}...`);
      }
      
      if (line.includes('<script>') || line.includes('javascript:') || line.includes('onerror=')) {
        suspicious.push(`Line ${index + 1}: Potential XSS attempt - ${line.substring(0, 100)}...`);
      }
    });
    
    let output = `[*] Log Analysis Results\n\n`;
    output += `Total Lines: ${lines.length}\n`;
    output += `Unique IPs: ${ips.size}\n\n`;
    
    if (ips.size > 0) {
      output += `[*] IP Addresses Found:\n`;
      Array.from(ips).slice(0, 10).forEach(ip => {
        output += `  - ${ip}\n`;
      });
      if (ips.size > 10) output += `  ... and ${ips.size - 10} more\n`;
      output += '\n';
    }
    
    if (statuses.size > 0) {
      output += `[*] HTTP Status Codes:\n`;
      Array.from(statuses.entries()).forEach(([status, count]) => {
        output += `  - ${status}: ${count} occurrences\n`;
      });
      output += '\n';
    }
    
    if (methods.size > 0) {
      output += `[*] HTTP Methods:\n`;
      Array.from(methods.entries()).forEach(([method, count]) => {
        output += `  - ${method}: ${count} requests\n`;
      });
      output += '\n';
    }
    
    if (suspicious.length > 0) {
      output += `[!] Suspicious Activity Detected:\n`;
      suspicious.slice(0, 5).forEach(entry => {
        output += `  ${entry}\n`;
      });
      if (suspicious.length > 5) output += `  ... and ${suspicious.length - 5} more suspicious entries\n`;
    } else {
      output += `[+] No obvious suspicious activity detected\n`;
    }
    
    output += '\n[*] Analysis complete.';
    setLogOutput(output);
  };

  // URL Parser
  const parseUrl = () => {
    try {
      const url = new URL(urlInput);
      let output = `[*] URL Analysis: ${urlInput}\n\n`;
      output += `Protocol: ${url.protocol}\n`;
      output += `Host: ${url.host}\n`;
      output += `Pathname: ${url.pathname}\n`;
      output += `Search: ${url.search}\n`;
      output += `Hash: ${url.hash}\n\n`;
      if (url.searchParams && Array.from(url.searchParams).length > 0) {
        output += '[*] Query Parameters:\n';
        url.searchParams.forEach((value, key) => {
          output += `  - ${key}: ${value}\n`;
        });
      } else {
        output += '[*] No query parameters found.\n';
      }
      setUrlOutput(output);
    } catch {
      setUrlOutput('[!] Invalid URL');
    }
  };

  // Random Data Generator
  const generateRandomData = () => {
    let output = '';
    let qty = Math.max(1, Math.min(100, Number(randomQty)));
    for (let i = 0; i < qty; i++) {
      switch (randomType) {
        case 'string':
          output += Math.random().toString(36).slice(2, 12) + '\n';
          break;
        case 'email':
          output += `user${Math.floor(Math.random()*10000)}@example.com\n`;
          break;
        case 'phone':
          output += `+1-${Math.floor(100+Math.random()*900)}-${Math.floor(100+Math.random()*900)}-${Math.floor(1000+Math.random()*9000)}\n`;
          break;
        case 'uuid':
          output += 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          }) + '\n';
          break;
        case 'mac':
          output += Array(6).fill(0).map(() => Math.floor(Math.random()*256).toString(16).padStart(2, '0')).join(':') + '\n';
          break;
        default:
          output += 'N/A\n';
      }
    }
    setRandomOutput(output.trim());
  };

  // Network Calculator (CIDR)
  const calculateNetwork = () => {
    try {
      const [ip, mask] = networkInput.split('/');
      if (!ip || !mask) throw new Error();
      const octets = ip.split('.').map(Number);
      if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) throw new Error();
      const maskNum = Number(mask);
      if (isNaN(maskNum) || maskNum < 0 || maskNum > 32) throw new Error();

      const ipNum = octets.reduce((acc, o) => (acc << 8) + o, 0);
      const netmask = maskNum === 0 ? 0 : 0xFFFFFFFF << (32 - maskNum) >>> 0;
      const network = ipNum & netmask;
      const broadcast = network | (~netmask >>> 0);
      const firstHost = maskNum === 32 ? network : network + 1;
      const lastHost = maskNum === 32 ? network : broadcast - 1;
      const hosts = maskNum >= 31 ? 0 : (lastHost - firstHost + 1);

      function numToIp(n: number) {
        return [n >>> 24, (n >> 16) & 255, (n >> 8) & 255, n & 255].join('.');
      }

      let output = `[*] Network Calculation: ${networkInput}\n\n`;
      output += `Network Address: ${numToIp(network)}\n`;
      output += `Broadcast Address: ${numToIp(broadcast)}\n`;
      output += `Netmask: ${numToIp(netmask)}\n`;
      output += `First Host: ${numToIp(firstHost)}\n`;
      output += `Last Host: ${numToIp(lastHost)}\n`;
      output += `Total Hosts: ${hosts}\n`;
      setNetworkOutput(output);
    } catch {
      setNetworkOutput('[!] Invalid CIDR notation');
    }
  };

  // User-Agent Generator
  const generateUserAgent = () => {
    let ua = '';
    switch (uaType) {
      case 'chrome':
        ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
        break;
      case 'firefox':
        ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0';
        break;
      case 'safari':
        ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15';
        break;
      case 'mobile':
        ua = 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';
        break;
      case 'bot':
        ua = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
        break;
      case 'random':
        const uas = [
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',
          'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        ];
        ua = uas[Math.floor(Math.random() * uas.length)];
        break;
      default:
        ua = 'N/A';
    }
    setUaOutput(ua);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-cyber font-bold text-cyber-green mb-2">
          🛠️ Utility Tools
        </h2>
        <p className="text-cyber-green/70">
          General purpose security and analysis utilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ToolCard title="IP Address Analyzer" description="Analyze IP addresses and network information">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="192.168.1.1"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              className="cyber-input w-full"
            />
            <button onClick={analyzeIp} className="cyber-button w-full">
              Analyze IP
            </button>
            <TerminalOutput content={ipOutput} />
          </div>
        </ToolCard>

        <ToolCard title="Log Analyzer" description="Analyze log files for security events">
          <div className="space-y-4">
            <textarea
              placeholder="Paste log entries here..."
              value={logInput}
              onChange={(e) => setLogInput(e.target.value)}
              className="cyber-input w-full h-32 resize-none"
            />
            <button onClick={analyzeLog} className="cyber-button w-full">
              Analyze Logs
            </button>
            <TerminalOutput content={logOutput} />
          </div>
        </ToolCard>

        <ToolCard title="URL Parser" description="Parse and analyze URLs for security testing">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="https://example.com/path?param=value"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              className="cyber-input w-full"
            />
            <button className="cyber-button w-full" onClick={parseUrl}>
              Parse URL
            </button>
            <TerminalOutput content={urlOutput || "Enter a URL and click 'Parse URL' to extract components and parameters..."} />
          </div>
        </ToolCard>

        <ToolCard title="Random Data Generator" description="Generate random data for testing">
          <div className="space-y-4">
            <select className="cyber-input w-full" value={randomType} onChange={e => setRandomType(e.target.value)}>
              <option value="string">Random String</option>
              <option value="email">Email Address</option>
              <option value="phone">Phone Number</option>
              <option value="uuid">UUID</option>
              <option value="mac">MAC Address</option>
            </select>
            <input
              type="number"
              placeholder="Quantity (default: 1)"
              min="1"
              max="100"
              value={randomQty}
              onChange={e => setRandomQty(Number(e.target.value))}
              className="cyber-input w-full"
            />
            <button className="cyber-button w-full" onClick={generateRandomData}>
              Generate Data
            </button>
            <TerminalOutput content={randomOutput || "Select data type and click 'Generate Data' to create random test data..."} />
          </div>
        </ToolCard>

        <ToolCard title="Network Calculator" description="Calculate network ranges and subnets">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="192.168.1.0/24"
              value={networkInput}
              onChange={e => setNetworkInput(e.target.value)}
              className="cyber-input w-full"
            />
            <button className="cyber-button w-full" onClick={calculateNetwork}>
              Calculate Network
            </button>
            <TerminalOutput content={networkOutput || "Enter a network in CIDR notation and click 'Calculate Network' to get subnet information..."} />
          </div>
        </ToolCard>

        <ToolCard title="User-Agent Generator" description="Generate various User-Agent strings">
          <div className="space-y-4">
            <select className="cyber-input w-full" value={uaType} onChange={e => setUaType(e.target.value)}>
              <option value="chrome">Chrome (Latest)</option>
              <option value="firefox">Firefox (Latest)</option>
              <option value="safari">Safari (Latest)</option>
              <option value="mobile">Mobile Browser</option>
              <option value="bot">Search Bot</option>
              <option value="random">Random</option>
            </select>
            <button className="cyber-button w-full" onClick={generateUserAgent}>
              Generate User-Agent
            </button>
            <TerminalOutput content={uaOutput || "Select browser type and click 'Generate User-Agent' to create User-Agent strings..."} />
          </div>
        </ToolCard>
      </div>
    </div>
  );
};

export default UtilityTools;
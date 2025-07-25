import React, { useState } from 'react';
import ToolCard from '../common/ToolCard';
import TerminalOutput from '../common/TerminalOutput';

const NetworkTools: React.FC = () => {
  const [portScanTarget, setPortScanTarget] = useState('');
  const [portScanOutput, setPortScanOutput] = useState('');
  const [pingTarget, setPingTarget] = useState('');
  const [pingOutput, setPingOutput] = useState('');
  const [tracerouteTarget, setTracerouteTarget] = useState('');
  const [tracerouteOutput, setTracerouteOutput] = useState('');

  const runPortScan = () => {
    if (!portScanTarget) return;
    setPortScanOutput('Starting port scan...\n');
    
    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306];
    let output = `[*] Target: ${portScanTarget}\n[*] Scanning common ports...\n\n`;
    
    commonPorts.forEach((port, index) => {
      setTimeout(() => {
        const isOpen = Math.random() > 0.8;
        const status = isOpen ? 'OPEN' : 'CLOSED';
        const service = isOpen ? getServiceName(port) : '';
        output += `[${isOpen ? '+' : '-'}] ${port}/tcp ${status} ${service}\n`;
        setPortScanOutput(output);
      }, index * 100);
    });
    
    setTimeout(() => {
      output += '\n[*] Port scan complete.';
      setPortScanOutput(output);
    }, commonPorts.length * 100 + 500);
  };

  const getServiceName = (port: number): string => {
    const services: { [key: number]: string } = {
      21: 'ftp',
      22: 'ssh',
      23: 'telnet',
      25: 'smtp',
      53: 'dns',
      80: 'http',
      110: 'pop3',
      143: 'imap',
      443: 'https',
      993: 'imaps',
      995: 'pop3s',
      3389: 'rdp',
      5432: 'postgresql',
      3306: 'mysql'
    };
    return services[port] || 'unknown';
  };

  const runPing = () => {
    if (!pingTarget) return;
    setPingOutput(`PING ${pingTarget}:\n`);
    
    let output = `PING ${pingTarget}:\n`;
    for (let i = 1; i <= 4; i++) {
      setTimeout(() => {
        const time = (Math.random() * 50 + 10).toFixed(1);
        output += `Reply from ${pingTarget}: bytes=32 time=${time}ms TTL=64\n`;
        setPingOutput(output);
        
        if (i === 4) {
          setTimeout(() => {
            output += '\nPing statistics:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)';
            setPingOutput(output);
          }, 100);
        }
      }, i * 1000);
    }
  };

  const runTraceroute = () => {
    if (!tracerouteTarget) return;
    setTracerouteOutput(`Tracing route to ${tracerouteTarget}:\n`);
    
    let output = `Tracing route to ${tracerouteTarget}:\n\n`;
    const hops = [
      '192.168.1.1',
      '10.0.0.1',
      '172.16.1.1',
      '203.0.113.1',
      tracerouteTarget
    ];
    
    hops.forEach((hop, index) => {
      setTimeout(() => {
        const time1 = (Math.random() * 50 + 10).toFixed(0);
        const time2 = (Math.random() * 50 + 10).toFixed(0);
        const time3 = (Math.random() * 50 + 10).toFixed(0);
        output += `${index + 1}    ${time1} ms    ${time2} ms    ${time3} ms    ${hop}\n`;
        setTracerouteOutput(output);
      }, index * 800);
    });
    
    setTimeout(() => {
      output += '\nTrace complete.';
      setTracerouteOutput(output);
    }, hops.length * 800 + 500);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-cyber font-bold text-cyber-green mb-2">
          🌐 Network Tools
        </h2>
        <p className="text-cyber-green/70">
          Network scanning and connectivity testing utilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ToolCard title="Port Scanner" description="Scan for open ports on a target system">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="192.168.1.1 or example.com"
              value={portScanTarget}
              onChange={(e) => setPortScanTarget(e.target.value)}
              className="cyber-input w-full"
            />
            <button onClick={runPortScan} className="cyber-button w-full">
              Start Port Scan
            </button>
            <TerminalOutput content={portScanOutput} />
          </div>
        </ToolCard>

        <ToolCard title="Ping Tool" description="Test connectivity to a target host">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="example.com or 8.8.8.8"
              value={pingTarget}
              onChange={(e) => setPingTarget(e.target.value)}
              className="cyber-input w-full"
            />
            <button onClick={runPing} className="cyber-button w-full">
              Send Ping
            </button>
            <TerminalOutput content={pingOutput} />
          </div>
        </ToolCard>

        <ToolCard title="Traceroute" description="Trace the network path to a destination">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="example.com or 8.8.8.8"
              value={tracerouteTarget}
              onChange={(e) => setTracerouteTarget(e.target.value)}
              className="cyber-input w-full"
            />
            <button onClick={runTraceroute} className="cyber-button w-full">
              Start Traceroute
            </button>
            <TerminalOutput content={tracerouteOutput} />
          </div>
        </ToolCard>

        <ToolCard title="Network Scanner" description="Scan network ranges for active hosts">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="192.168.1.0/24"
              className="cyber-input w-full"
            />
            <button className="cyber-button w-full">
              Scan Network
            </button>
            <TerminalOutput content="Enter a network range and click 'Scan Network' to discover active hosts..." />
          </div>
        </ToolCard>
      </div>
    </div>
  );
};

export default NetworkTools;
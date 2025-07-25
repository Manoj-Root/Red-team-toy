import React, { useState } from 'react';
import ToolCard from '../common/ToolCard';
import TerminalOutput from '../common/TerminalOutput';

const WebTools: React.FC = () => {
  const [dirBustTarget, setDirBustTarget] = useState('');
  const [dirBustOutput, setDirBustOutput] = useState('');
  
  const [headerTarget, setHeaderTarget] = useState('');
  const [headerOutput, setHeaderOutput] = useState('');

  const runDirBuster = () => {
    if (!dirBustTarget) return;
    setDirBustOutput('Starting directory enumeration...\n');
    
    const commonDirs = [
      'admin', 'administrator', 'login', 'wp-admin', 'dashboard', 'panel',
      'backup', 'backups', 'config', 'uploads', 'images', 'css', 'js',
      'api', 'test', 'dev', 'staging', 'temp', 'tmp', 'logs', 'log'
    ];
    
    let output = `[*] Target: ${dirBustTarget}\n[*] Starting directory brute force...\n\n`;
    
    commonDirs.forEach((dir, index) => {
      setTimeout(() => {
        const found = Math.random() > 0.7;
        const status = found ? '200' : '404';
        const size = found ? Math.floor(Math.random() * 10000) + 'B' : '-';
        output += `[${found ? '+' : '-'}] ${dirBustTarget}/${dir}/ (Status: ${status}) [Size: ${size}]\n`;
        setDirBustOutput(output);
      }, index * 150);
    });
    
    setTimeout(() => {
      output += '\n[*] Directory enumeration complete.';
      setDirBustOutput(output);
    }, commonDirs.length * 150 + 500);
  };

  const analyzeHeaders = () => {
    if (!headerTarget) return;
    setHeaderOutput('Analyzing HTTP headers...\n');
    
    setTimeout(() => {
      const mockHeaders = `
[*] Target: ${headerTarget}
[*] HTTP Response Headers:

HTTP/1.1 200 OK
Server: nginx/1.18.0
Date: ${new Date().toUTCString()}
Content-Type: text/html; charset=UTF-8
Content-Length: 12345
Connection: keep-alive
X-Powered-By: PHP/7.4.0
Set-Cookie: PHPSESSID=abc123; path=/
Cache-Control: no-cache, must-revalidate
Expires: Thu, 01 Jan 1970 00:00:00 GMT

[*] Security Headers Analysis:
[!] Missing: Strict-Transport-Security
[!] Missing: X-Content-Type-Options
[!] Missing: X-Frame-Options
[!] Missing: X-XSS-Protection
[+] Present: Content-Security-Policy
[!] Information Disclosure: X-Powered-By reveals PHP version

[*] Header analysis complete.`;
      setHeaderOutput(mockHeaders);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-cyber font-bold text-cyber-green mb-2">
          🕷️ Web Application Tools
        </h2>
        <p className="text-cyber-green/70">
          Web application security testing utilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ToolCard title="Directory Brute Forcer" description="Discover hidden directories and files">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="https://example.com"
              value={dirBustTarget}
              onChange={(e) => setDirBustTarget(e.target.value)}
              className="cyber-input w-full"
            />
            <button onClick={runDirBuster} className="cyber-button w-full">
              Start Directory Scan
            </button>
            <TerminalOutput content={dirBustOutput} />
          </div>
        </ToolCard>

        <ToolCard title="HTTP Header Analyzer" description="Analyze HTTP response headers for security issues">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="https://example.com"
              value={headerTarget}
              onChange={(e) => setHeaderTarget(e.target.value)}
              className="cyber-input w-full"
            />
            <button onClick={analyzeHeaders} className="cyber-button w-full">
              Analyze Headers
            </button>
            <TerminalOutput content={headerOutput} />
          </div>
        </ToolCard>

        <ToolCard title="SQL Injection Tester" description="Test for SQL injection vulnerabilities">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="https://example.com/page?id=1"
              className="cyber-input w-full"
            />
            <select className="cyber-input w-full">
              <option value="basic">Basic SQL Tests</option>
              <option value="union">UNION-based Tests</option>
              <option value="boolean">Boolean-based Tests</option>
              <option value="time">Time-based Tests</option>
            </select>
            <button className="cyber-button w-full">
              Test for SQLi
            </button>
            <TerminalOutput content="Enter a URL with parameters and click 'Test for SQLi' to check for SQL injection vulnerabilities..." />
          </div>
        </ToolCard>

        <ToolCard title="XSS Scanner" description="Scan for Cross-Site Scripting vulnerabilities">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="https://example.com/search?q="
              className="cyber-input w-full"
            />
            <select className="cyber-input w-full">
              <option value="reflected">Reflected XSS</option>
              <option value="stored">Stored XSS</option>
              <option value="dom">DOM-based XSS</option>
            </select>
            <button className="cyber-button w-full">
              Scan for XSS
            </button>
            <TerminalOutput content="Enter a URL and click 'Scan for XSS' to test for Cross-Site Scripting vulnerabilities..." />
          </div>
        </ToolCard>

        <ToolCard title="Cookie Analyzer" description="Analyze cookies for security attributes">
          <div className="space-y-4">
            <textarea
              placeholder="Paste cookies here (document.cookie format)"
              className="cyber-input w-full h-20 resize-none"
            />
            <button className="cyber-button w-full">
              Analyze Cookies
            </button>
            <TerminalOutput content="Paste cookies and click 'Analyze Cookies' to check for security attributes like HttpOnly, Secure, SameSite..." />
          </div>
        </ToolCard>

        <ToolCard title="CORS Tester" description="Test Cross-Origin Resource Sharing configuration">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="https://api.example.com"
              className="cyber-input w-full"
            />
            <input
              type="text"
              placeholder="Origin to test (https://attacker.com)"
              className="cyber-input w-full"
            />
            <button className="cyber-button w-full">
              Test CORS
            </button>
            <TerminalOutput content="Enter target URL and origin to test CORS policy configuration..." />
          </div>
        </ToolCard>
      </div>
    </div>
  );
};

export default WebTools;
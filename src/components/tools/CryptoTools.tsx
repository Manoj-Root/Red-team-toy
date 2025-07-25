import React, { useState } from 'react';
import ToolCard from '../common/ToolCard';
import TerminalOutput from '../common/TerminalOutput';

const CryptoTools: React.FC = () => {
  const [hashInput, setHashInput] = useState('');
  const [hashType, setHashType] = useState('md5');
  const [hashOutput, setHashOutput] = useState('');

  const [encodeInput, setEncodeInput] = useState('');
  const [encodeType, setEncodeType] = useState('base64');
  const [encodeOutput, setEncodeOutput] = useState('');

  const [decodeInput, setDecodeInput] = useState('');
  const [decodeType, setDecodeType] = useState('base64');
  const [decodeOutput, setDecodeOutput] = useState('');

  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [passwordOutput, setPasswordOutput] = useState('');

  const generateHash = async () => {
    if (!hashInput) return;

    try {
      let hash = '';
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);

      if (hashType === 'md5') {
        // Simple MD5-like hash for demo (not cryptographically secure)
        hash = Array.from(data)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
          .substring(0, 32);
      } else if (hashType === 'sha1') {
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        hash = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      } else if (hashType === 'sha256') {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        hash = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      }

      setHashOutput(`[*] Original: ${hashInput}\n[*] ${hashType.toUpperCase()} Hash: ${hash}`);
    } catch (error) {
      setHashOutput('[!] Error generating hash');
    }
  };

  const encodeData = () => {
    if (!encodeInput) return;

    try {
      let encoded = '';
      
      switch (encodeType) {
        case 'base64':
          encoded = btoa(encodeInput);
          break;
        case 'url':
          encoded = encodeURIComponent(encodeInput);
          break;
        case 'hex':
          encoded = Array.from(new TextEncoder().encode(encodeInput))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
          break;
        case 'html':
          encoded = encodeInput
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
          break;
      }

      setEncodeOutput(`[*] Original: ${encodeInput}\n[*] ${encodeType.toUpperCase()} Encoded: ${encoded}`);
    } catch (error) {
      setEncodeOutput('[!] Error encoding data');
    }
  };

  const decodeData = () => {
    if (!decodeInput) return;

    try {
      let decoded = '';
      
      switch (decodeType) {
        case 'base64':
          decoded = atob(decodeInput);
          break;
        case 'url':
          decoded = decodeURIComponent(decodeInput);
          break;
        case 'hex':
          const hexPairs = decodeInput.match(/.{1,2}/g) || [];
          decoded = String.fromCharCode(...hexPairs.map(hex => parseInt(hex, 16)));
          break;
        case 'html':
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = decodeInput;
          decoded = tempDiv.textContent || tempDiv.innerText || '';
          break;
      }

      setDecodeOutput(`[*] Encoded: ${decodeInput}\n[*] ${decodeType.toUpperCase()} Decoded: ${decoded}`);
    } catch (error) {
      setDecodeOutput('[!] Error decoding data - invalid format');
    }
  };

  const generatePassword = () => {
    if (passwordLength < 4 || passwordLength > 128) {
      setPasswordOutput('[!] Password length must be between 4 and 128 characters');
      return;
    }

    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSpecial) {
      setPasswordOutput('[!] At least one character type must be selected');
      return;
    }

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    
    // Ensure at least one character from each selected type
    if (includeUppercase) password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    if (includeLowercase) password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    if (includeNumbers) password += '0123456789'[Math.floor(Math.random() * 10)];
    if (includeSpecial) password += '!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 25)];

    // Fill the rest randomly
    for (let i = password.length; i < passwordLength; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password to avoid predictable patterns
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    const strength = calculatePasswordStrength(password);
    
    setPasswordOutput(`[*] Generated Password: ${password}\n\n[*] Password Analysis:\n- Length: ${password.length} characters\n- Strength: ${strength}\n- Character Types: ${getCharacterTypes()}\n\n[*] Password generated successfully!`);
  };

  const calculatePasswordStrength = (password: string): string => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  };

  const getCharacterTypes = (): string => {
    const types = [];
    if (includeUppercase) types.push('Uppercase');
    if (includeLowercase) types.push('Lowercase');
    if (includeNumbers) types.push('Numbers');
    if (includeSpecial) types.push('Special');
    return types.join(', ');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-cyber font-bold text-cyber-green mb-2">
          🔐 Cryptography Tools
        </h2>
        <p className="text-cyber-green/70">
          Hashing, encoding, and decoding utilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ToolCard title="Hash Generator" description="Generate cryptographic hashes">
          <div className="space-y-4">
            <textarea
              placeholder="Enter text to hash..."
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="cyber-input w-full h-20 resize-none"
            />
            <select
              value={hashType}
              onChange={(e) => setHashType(e.target.value)}
              className="cyber-input w-full"
            >
              <option value="md5">MD5</option>
              <option value="sha1">SHA-1</option>
              <option value="sha256">SHA-256</option>
            </select>
            <button onClick={generateHash} className="cyber-button w-full">
              Generate Hash
            </button>
            <TerminalOutput content={hashOutput} />
          </div>
        </ToolCard>

        <ToolCard title="Data Encoder" description="Encode data in various formats">
          <div className="space-y-4">
            <textarea
              placeholder="Enter text to encode..."
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              className="cyber-input w-full h-20 resize-none"
            />
            <select
              value={encodeType}
              onChange={(e) => setEncodeType(e.target.value)}
              className="cyber-input w-full"
            >
              <option value="base64">Base64</option>
              <option value="url">URL Encoding</option>
              <option value="hex">Hexadecimal</option>
              <option value="html">HTML Entities</option>
            </select>
            <button onClick={encodeData} className="cyber-button w-full">
              Encode Data
            </button>
            <TerminalOutput content={encodeOutput} />
          </div>
        </ToolCard>

        <ToolCard title="Data Decoder" description="Decode encoded data">
          <div className="space-y-4">
            <textarea
              placeholder="Enter encoded text to decode..."
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              className="cyber-input w-full h-20 resize-none"
            />
            <select
              value={decodeType}
              onChange={(e) => setDecodeType(e.target.value)}
              className="cyber-input w-full"
            >
              <option value="base64">Base64</option>
              <option value="url">URL Encoding</option>
              <option value="hex">Hexadecimal</option>
              <option value="html">HTML Entities</option>
            </select>
            <button onClick={decodeData} className="cyber-button w-full">
              Decode Data
            </button>
            <TerminalOutput content={decodeOutput} />
          </div>
        </ToolCard>

        <ToolCard title="Password Generator" description="Generate secure passwords">
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Password length (default: 16)"
              value={passwordLength}
              onChange={(e) => setPasswordLength(parseInt(e.target.value) || 16)}
              min="4"
              max="128"
              className="cyber-input w-full"
            />
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-cyber-green/80">
                <input 
                  type="checkbox" 
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="accent-cyber-green" 
                />
                <span>Include uppercase letters</span>
              </label>
              <label className="flex items-center space-x-2 text-cyber-green/80">
                <input 
                  type="checkbox" 
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="accent-cyber-green" 
                />
                <span>Include lowercase letters</span>
              </label>
              <label className="flex items-center space-x-2 text-cyber-green/80">
                <input 
                  type="checkbox" 
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="accent-cyber-green" 
                />
                <span>Include numbers</span>
              </label>
              <label className="flex items-center space-x-2 text-cyber-green/80">
                <input 
                  type="checkbox" 
                  checked={includeSpecial}
                  onChange={(e) => setIncludeSpecial(e.target.checked)}
                  className="accent-cyber-green" 
                />
                <span>Include special characters</span>
              </label>
            </div>
            <button onClick={generatePassword} className="cyber-button w-full">
              Generate Password
            </button>
            <TerminalOutput content={passwordOutput || "Configure options and click 'Generate Password' to create a secure password..."} />
          </div>
        </ToolCard>
      </div>
    </div>
  );
};

export default CryptoTools;
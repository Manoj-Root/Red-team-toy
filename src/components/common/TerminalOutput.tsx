import React from 'react';

interface TerminalOutputProps {
  content: string;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ content }) => {
  return (
    <div className="terminal-output">
      <pre className="whitespace-pre-wrap text-terminal-green">
        {content || 'Output will appear here...'}
      </pre>
    </div>
  );
};

export default TerminalOutput;
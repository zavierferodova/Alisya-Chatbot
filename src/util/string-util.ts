const removeIndentation = (str: string): string => {
    const lines = str.split('\n');
    const trimmedLines = lines.map(line => line.trimStart());
    return trimmedLines.join('\n').trim();
};

interface StackFrame {
    functionName: string;
    filePath: string;
    line: number;
    column: number;
}
  
interface StackTrace {
    message: string;
    frames: StackFrame[];
}

function parseStackTrace(trace?: string): StackTrace | null {
    if (!trace) {
      return null;
    }

    const lines = trace.trim().split('\n');
    const message = lines[0];
  
    const frameRegex = /^\s*at\s+(.*)\s+\((.*):(\d+):(\d+)\)$/;
    const frames: StackFrame[] = [];
  
    for (let i = 1; i < lines.length; i++) {
      const match = frameRegex.exec(lines[i]);
      if (match) {
        const [, functionName, filePath, line, column] = match;
        const frame: StackFrame = {
          functionName,
          filePath,
          line: parseInt(line, 10),
          column: parseInt(column, 10),
        };
        frames.push(frame);
      }
    }
  
    return { message, frames };
}  

export { removeIndentation, parseStackTrace }

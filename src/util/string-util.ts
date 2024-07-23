const removeIndentation = (str: string): string => {
    const lines = str.split('\n');
    const trimmedLines = lines.map(line => line.trimStart());
    return trimmedLines.join('\n').trim();
};

export { removeIndentation }

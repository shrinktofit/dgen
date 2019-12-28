import React from 'react';
import ReactMarkdown from 'react-markdown';

const DescriptionText: React.FC<{source: string}> = (properties) => {
    return (<ReactMarkdown source={properties.source} />);
};

export default DescriptionText;
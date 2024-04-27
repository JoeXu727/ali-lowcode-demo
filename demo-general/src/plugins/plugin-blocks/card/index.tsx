import * as React from 'react';

import './index.scss';

const { useState, useEffect } = React;

interface BlockCardProps {
    id: string,
    name: string,
    screenshot: string,
}

const BlockCard = (props: BlockCardProps) => {
    const { id, name, screenshot } = props;

    return <div className='block-card snippets' data-id={id}>
        <div className='block-card-screenshot'>
            <img src={screenshot} />
        </div>
        <span>
            {name}
        </span>
    </div>;
}

export default BlockCard;
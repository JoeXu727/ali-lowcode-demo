import * as React from 'react';
import { common, project, config, event } from '@alilc/lowcode-engine';

import { Loading, Box, Divider } from '@alifd/next';

import { default as BlockCard } from '../card';
import { default as store } from '../store';

const { useState, useEffect } = React;

export interface Block {

}

export interface BlockResponse {
    code: number;
    data: Block[];
}

export interface BlockPaneAPI {
    listBlocks: () => BlockResponse;
}

export interface BlockPaneProps {
    api: BlockPaneAPI;
}

export const BlockPane = (props: BlockPaneProps) => {

    const { api } = props;
    const [blocks, setBlocks] = useState();
    const { listBlocks } = api;

    useEffect(() => {
        const fetchBlocks = async () => {
            const res = await listBlocks();
            if (res?.code) {
                console.error('list block failed: ', res);
                return;
            }
            store.init(res);
            setBlocks(res);
        };

        fetchBlocks();
    }, []);

    const registerAdditive = (shell: HTMLDivElement | null) => {
        if (!shell || shell.dataset.registered) {
            return;
        }

        function getSnippetId(elem: any) {
            if (!elem) {
                return null;
            }
            while (shell !== elem) {
                if (elem.classList.contains('snippets')) {
                    return elem.dataset.id;
                }
                elem = elem.parentNode;
            }
            return null;
        }

        const _dragon = common.designerCabin.dragon
        if (!_dragon) {
            return;
        }

        // eslint-disable-next-line
        const click = (e: Event) => { };

        shell.addEventListener('click', click);

        _dragon.from(shell, (e: Event) => {
            const doc = project.getCurrentDocument();
            const id = getSnippetId(e.target);
            if (!doc || !id) {
                return false;
            }

            const dragTarget = {
                type: 'nodedata',
                data: store.get(id),
            };

            return dragTarget;
        });

        shell.dataset.registered = 'true';
    };

    if (!blocks?.length) {
        return <div className='block-pane-loading'><Loading /></div>
    }

    return <div className='block-pane' ref={registerAdditive}><Box direction='row' wrap>
        {
            blocks.map(item => <BlockCard id={item.id} title={item.title} screenshot={item.screenshot} />)
        }
    </Box>
    </div>;

}

export default BlockPane;
import * as React from 'react';
import { default as html2canvas } from 'html2canvas';
import { Node } from '@alilc/lowcode-engine';
import { Dialog, Form, Input } from '@alifd/next';
import { createBlock } from '../services/mockService';

import './index.scss';

const FormItem = Form.Item;

interface SaveAsBlockProps {
    node: Node;
}

const SaveAsBlock = (props: SaveAsBlockProps) => {
    const { node } = props;
    const [src, setSrc] = React.useState();
    React.useEffect(() => {
        const generateImage = async () => {
            let dom2 = node.getDOMNode();
            const canvas = await html2canvas?.(dom2, { scale: 0.5 });
            const dataUrl = canvas.toDataURL();
            setSrc(dataUrl);
        };

        generateImage();
    }, []);

    const save = async (values) => {
        const { name, title } = values;
        const { schema } = node;

        if (!name || !title) {
            return;
        }

        await createBlock({
            schemaId: schema.id,
            name,
            title,
            schema: JSON.stringify(schema),
            screenshot: src,
        })
    }

    return <div style={{ width: '450px' }}>
        <Form colon>
            <FormItem
                name="name"
                label="名称"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                required
                requiredMessage='please input name'>
                <Input />
            </FormItem>
            <FormItem
                name="title"
                label="简介"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                required
                requiredMessage='please input title'>
                <Input />
            </FormItem>
            <FormItem
                name="screenshot"
                label="缩略图"
            >
                <div className='block-screenshot'>
                    <img src={src} />
                </div>
                <Input value={src} style={{ display: 'none' }} />
            </FormItem>
            <FormItem
                label="" colon={false}>
                <Form.Submit
                    type="primary"
                    validate
                    onClick={save}
                    style={{ marginLeft: 26 }}>
                    保存
                </Form.Submit>
            </FormItem>

        </Form>
    </div>
}

export default {
    name: 'SaveAsBlock',
    content: {
        icon: {
            type: 'add',
            size: 'xs'
        },
        title: '保存为区块',
        action(node: Node) {
            Dialog.show({
                v2: true,
                title: '是否保存为区块?',
                content: <SaveAsBlock node={node} />,
                footer: false
            })

        }
    },
    important: true,
}
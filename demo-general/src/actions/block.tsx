import * as React from 'react';
import { Node } from '@alilc/lowcode-engine';
import { Dialog, Form, Input } from '@alifd/next';
import { createBlock } from '../services/mockService';

interface SaveAsBlockProps {
    node: Node;
}

const FormItem = Form.Item;

const SaveAsBlock = (props: SaveAsBlockProps) => {
    const { node } = props;

    const save = async (values) => {
        const { name, title } = values;
        const { schema } = node;

        const red = await createBlock({
            schemaId: schema.id,
            name,
            title,
            schema: JSON.stringify(schema)
        })

    }

    return <div>
        <Form colon>
            <FormItem
                name="name"
                label="名称"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                required
                requiredMessage='please input name'>
                <Input />
            </FormItem>
            <FormItem
                name="title"
                label="简介"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                required
                requiredMessage='please input title'>
                <Input />
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
        icon: 'add',
        title: '保存为区块',
        action(node: Node) {
            console.log('node', node);
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
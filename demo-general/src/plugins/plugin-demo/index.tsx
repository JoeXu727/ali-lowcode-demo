import * as React from 'react';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { Nav } from '@alifd/next';

import './index.scss';

const LowcodePluginPluginDemo = (ctx: IPublicModelPluginContext) => {
    let menuType = 'home';

    return {
        // 插件对外暴露的数据和方法
        exports() {
            return {
                data: '你可以把插件的数据这样对外暴露',
                func: () => {
                    console.log('方法也是一样');
                },
            };
        },
        // 插件的初始化函数，在引擎初始化之后会立刻调用
        async init() {
            // 你可以拿到其他插件暴露的方法和属性
            // const { data, func } = ctx.plugins.pluginA;
            // func();

            // console.log(options.name);

            const menuClick = (key = []) => {
                menuType = key[0];
                location.href = `${location.pathname}?page=${menuType}`
            };

            const { Item } = Nav;
            let config: any = {
                area: 'leftArea',
                name: 'LowcodePluginPluginDemoPane',
                type: 'PanelDock',
                props: {
                    description: '菜单',
                },
                content: () => {
                    return (
                        <Nav type="line" onSelect={menuClick}>
                            <Item key="home">Home</Item>
                            <Item key="user">UserInfo</Item>
                        </Nav>
                    );
                },
            };
            // 往引擎增加面板
            ctx.skeleton.add(config);

            ctx.logger.log('打个日志');
        },
    };
};

// 插件名，注册环境下唯一
LowcodePluginPluginDemo.pluginName = 'LowcodePluginPluginDemo';
LowcodePluginPluginDemo.meta = {
    // 依赖的插件（插件名数组）
    dependencies: [],
    engines: {
        lowcodeEngine: '^1.0.0', // 插件需要配合 ^1.0.0 的引擎才可运行
    },
};

export default LowcodePluginPluginDemo;
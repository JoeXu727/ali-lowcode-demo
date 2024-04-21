import { material, project } from '@alilc/lowcode-engine';
import { filterPackages } from '@alilc/lowcode-plugin-inject';
import { Message, Dialog } from '@alifd/next';
import { IPublicTypeProjectSchema, IPublicEnumTransformStage } from '@alilc/lowcode-types';
import DefaultPageSchema from './defaultPageSchema.json';
import DefaultI18nSchema from './defaultI18nSchema.json';

const generateProjectSchema = (pageSchema: any, i18nSchema: any): IPublicTypeProjectSchema => {
  return {
    componentsTree: [pageSchema],
    componentsMap: material.componentsMap as any,
    version: '1.0.0',
    i18n: i18nSchema,
  };
};

export const saveSchema = async (page_type: number = 1) => {
  // const defaultCurrentPage: string = config.get('currentPage') || 'home';
  const schema = project.exportSchema();
  const url = 'http://127.0.0.1:7001/admin';
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      page_schema: JSON.stringify(schema),
      page_type: page_type,
    })
  });
  Message.success('成功保存页面schema');
};

export const resetSchema = async (scenarioName: string = 'unknown') => {
  try {
    await new Promise<void>((resolve, reject) => {
      Dialog.confirm({
        content: '确定要重置吗？您所有的修改都将消失！',
        onOk: () => {
          resolve();
        },
        onCancel: () => {
          reject();
        },
      });
    });
  } catch (err) {
    return;
  }
  const defaultSchema = generateProjectSchema(DefaultPageSchema, DefaultI18nSchema);

  project.importSchema(defaultSchema as any);
  project.simulatorHost?.rerender();

  setProjectSchemaToLocalStorage(scenarioName);
  await setPackagesToLocalStorage(scenarioName);
  Message.success('成功重置页面');
};

const getLSName = (scenarioName: string, ns: string = 'projectSchema') => `${scenarioName}:${ns}`;

export const getProjectSchemaFromLocalStorage = (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  const localValue = window.localStorage.getItem(getLSName(scenarioName));
  if (localValue) {
    return JSON.parse(localValue);
  }
  return undefined;
};

const setProjectSchemaToLocalStorage = (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  window.localStorage.setItem(
    getLSName(scenarioName),
    JSON.stringify(project.exportSchema(IPublicEnumTransformStage.Save)),
  );
};

const setPackagesToLocalStorage = async (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  const packages = await filterPackages(material.getAssets().packages);
  window.localStorage.setItem(getLSName(scenarioName, 'packages'), JSON.stringify(packages));
};

export const getPackagesFromLocalStorage = (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  return JSON.parse(window.localStorage.getItem(getLSName(scenarioName, 'packages')) || '{}');
};

export const getProjectSchema = async (
  pageType: number = 1,
  scenarioName: string = 'unknown',
): Promise<IPublicTypeProjectSchema> => {
  const pageSchema = await getPageSchema(pageType, scenarioName);
  return generateProjectSchema(pageSchema, DefaultI18nSchema);
};

export const getPageSchema = async (
  pageType: number = 1,
  scenarioName: string = 'unknown',
) => {
  // const pageSchema = getProjectSchemaFromLocalStorage(scenarioName)?.componentsTree?.[0];
  const schema = await getFullSchema(pageType);
  return schema.componentsTree[0];

  // return DefaultPageSchema;
};

export const getFullSchema = async (pageType: number = 1) => {
  let pageSchema;
  let url = `http://127.0.0.1:7001/admin?page_type=${pageType}`;
  pageSchema = await fetchData(url).then((res) => {
    return JSON.parse(res.data.page_schema);
  });

  if (pageSchema) {
    return pageSchema;
  }
}

export const createBlock = async (block: any) => {
  const url = `http://127.0.0.1:7001/block`;

  // fetch(url, {
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ block })
  // })

  const res = await (await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ block })
  })).json()
  console.log('ressssssss', res);

  if (res.code) {
    console.error('create block failed: ', res);
    return;
  }
  Message.success(res.message);
}

// 调接口获取数据
const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getPreviewLocale = (scenarioName: string) => {
  const key = getLSName(scenarioName, 'previewLocale');
  return window.localStorage.getItem(key) || 'zh-CN';
};

export const setPreviewLocale = (scenarioName: string, locale: string) => {
  const key = getLSName(scenarioName, 'previewLocale');
  window.localStorage.setItem(key, locale || 'zh-CN');
  window.location.reload();
};
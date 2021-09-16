import type { IApi } from '@umijs/types';
import path from 'path';
import whyDidYouRender from '@welldone-software/why-did-you-render';

type TWdyrParameter1 = Parameters<typeof whyDidYouRender>[1];
// 这几个参数目前没办法用过stringify方式传递给runtime，暂时先忽略
export type TWdyrOptions = Omit<
  TWdyrParameter1,
  'trackExtraHooks' | 'notifier'
>;

/**
 * @see https://github.com/welldone-software/why-did-you-render
 */
export default (api: IApi) => {
  api.describe({
    key: 'whyDidYouRender',
    config: {
      schema(joi) {
        return joi.object<TWdyrOptions>({
          include: joi.array().items(joi.string()),
          exclude: joi.array().items(joi.string()),
          trackAllPureComponents: joi.boolean(),
          trackHooks: joi.boolean(),
          // trackExtraHooks: joi.array().items(joi.array().items(joi.string(), joi.string())),
          logOwnerReasons: joi.boolean(),
          logOnDifferentValues: joi.boolean(),
          hotReloadBufferMs: joi.number(),
          onlyLogs: joi.boolean(),
          collapseGroups: joi.boolean(),
          titleColor: joi.string(),
          diffNameColor: joi.string(),
          diffPathColor: joi.string(),
          // notifier: joi.any(),
          customName: joi.string(),
        });
      },
    },
    enableBy: api.EnableBy.config,
  });

  const options = api.userConfig?.whyDidYouRender;

  // 只针对dev开启
  if (api.env === 'development' && options) {
    api.modifyBabelPresetOpts((opts) => {
      return {
        ...opts,
        react: {
          ...opts.react,
          runtime: 'automatic',
          development: true,
          importSource: '@welldone-software/why-did-you-render',
        },
      };
    });

    api.addHTMLHeadScripts(() => [
      {
        content: `window.__WDYR__ = ${JSON.stringify(options)};`,
      },
    ]);

    // wdyr插入到entry最前面，越靠前越好
    // api.addEntryImportsAhead({
    api.addPolyfillImports({
      stage: 9999,
      name: 'wdyr',
      fn: () => [{ source: path.resolve(__dirname, './wdyr-runtime.js') }],
    });
  }
};

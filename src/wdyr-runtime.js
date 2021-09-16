import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  const options = window.__WDYR__ || {};

  // 将（字符串）配置转换成why-did-you-render所需的正则参数
  ['include', 'exclude'].forEach((key) => {
    const strArr = options[key];

    if (Array.isArray(strArr)) {
      options[key] = strArr.reduce((memo, str, i) => {
        try {
          memo.push(new RegExp(str));
        } catch (e) {
          console.warn(
            `[wdyr] config.whyDidYouRender.${key}[${i}]:${str} transforms to RegExp error`,
            e,
          );
        }
        return memo;
      }, []);
    }
  });
  console.log('[whyDidYouRender]', options);

  whyDidYouRender(React, options);
}

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 'scope-enum': [2, 'always', ['umi', 'docs']],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'chore',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'deps',
      ],
    ],
  },
};

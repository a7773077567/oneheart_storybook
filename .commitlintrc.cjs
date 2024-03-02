// 0 -> disable
// 1 -> warning
// 2 -> error
module.exports = { extends: ['@commitlint/config-angular'], rules: {
  'type-enum': [2, 'always', ['chore', 'build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']],
  'header-max-length': [2, 'always', 100],
} };

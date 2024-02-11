// import type { App } from 'vue';
import { z } from 'zod';

export default {
  install() {
    const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_type) {
        if (issue.expected === 'string') {
          return { message: '必填' };
        }
      }
      if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.type === 'string') {
          return { message: `至少需要${issue.minimum}個字元` };
        }
      }
      return { message: ctx.defaultError };
    };

    z.setErrorMap(customErrorMap);
  },
};

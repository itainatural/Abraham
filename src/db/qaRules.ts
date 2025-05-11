import { QARules } from './index';

export const qaRules: QARules = {
  validation: {
    requiredElements: [],
    minTextLength: {
      title: 1,
      body: 10,
      "cta-label": 2
    },
    maxTextLength: {
      title: 100,
      body: 500,
      "cta-label": 30
    }
  }
};

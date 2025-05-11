import { LayoutRules } from './index';

export const layoutRules: LayoutRules = {
  formats: {
    "1200x1200": {
      aspectRatio: 1,
      bg: { x: 0, y: 0, w: 1200, h: 1200 },
      overlay: { x: 0, y: 0, w: 1200, h: 1200 }
    },
    "960x1200": {
      aspectRatio: 0.8,
      bg: { x: 0, y: 0, w: 960, h: 1200 },
      overlay: { x: 0, y: 0, w: 960, h: 1200 }
    },
    "1200x628": {
      aspectRatio: 1.91,
      bg: { x: 0, y: 0, w: 1200, h: 628 },
      overlay: { x: 0, y: 0, w: 1200, h: 628 }
    }
  },
  layout: {
    autoLayout: {
      padding: {
        vertical: 64,
        horizontal: 40
      },
      spacing: 24
    },
    "content-group": {
      layout: "VERTICAL",
      alignment: "TOP_LEFT",
      padding: {
        vertical: 64,
        horizontal: 40
      },
      spacing: 24
    },
    "cta-group": {
      layout: "HORIZONTAL",
      padding: {
        vertical: 16,
        horizontal: 24
      }
    }
  }
};

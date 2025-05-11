import { layoutRules } from './layoutRules';
import { typographyRules } from './typographyRules';
import { qaRules } from './qaRules';

export interface LayoutRules {
  formats: {
    [key: string]: {
      aspectRatio: number;
      bg: { x: number; y: number; w: number; h: number };
      overlay: { x: number; y: number; w: number; h: number };
    };
  };
  layout: {
    autoLayout: {
      padding: { vertical: number; horizontal: number };
      spacing: number;
    };
    'content-group': {
      layout: string;
      alignment: string;
      padding: { vertical: number; horizontal: number };
      spacing: number;
    };
    'cta-group': {
      layout: string;
      padding: { vertical: number; horizontal: number };
    };
  };
}

export interface TypographyRules {
  formats: {
    [key: string]: {
      title: { font: string; weight: string; size: number };
      body: { font: string; weight: string; size: number };
      'cta-label': { font: string; weight: string; size: number };
    };
  };
}

export interface QARules {
  validation: {
    requiredElements: string[];
    minTextLength: { [key: string]: number };
    maxTextLength: { [key: string]: number };
  };
}

export const getLayoutRules = (): LayoutRules => layoutRules;
export const getTypographyRules = (): TypographyRules => typographyRules;
export const getQARules = (): QARules => qaRules;

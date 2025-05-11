// Node context types
export interface NodeContext {
  id: string;
  type: string;
  name: string;
  children?: NodeContext[];
  parent?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  text?: {
    content: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: number;
  };
}

// Mutation types
export interface BaseMutation {
  node_id: string;
  type: 'dimensions' | 'typography' | 'layout' | 'style';
}

export interface DimensionMutation extends BaseMutation {
  type: 'dimensions';
  new_dimensions: [number, number];
}

export interface TypographyMutation extends BaseMutation {
  type: 'typography';
  fontSize: number;
  fontFamily?: string;
  fontWeight?: number;
}

export interface LayoutMutation extends BaseMutation {
  type: 'layout';
  position?: [number, number];
  padding?: { vertical: number; horizontal: number };
  spacing?: number;
}

export interface StyleMutation extends BaseMutation {
  type: 'style';
  fills?: any[];
  strokes?: any[];
  effects?: any[];
}

export type Mutation = DimensionMutation | TypographyMutation | LayoutMutation | StyleMutation;

// QA types
export interface QAResult {
  passed: boolean;
  warnings: Array<{
    type: 'contrast' | 'overflow' | 'spacing' | 'typography';
    message: string;
    node_id: string;
    severity: 'error' | 'warning';
  }>;
}

// Policy types
export interface ResizePolicy {
  targetFormat: string;
  preserveAspectRatio: boolean;
  scaleContent: boolean;
  minFontSize: number;
}

/// <reference types="@figma/plugin-typings" />

// Type definitions
type Platform = 'Demand-Gen' | 'Facebook' | 'Native';

interface Fill {
  type: "SOLID";
  color: { r: number; g: number; b: number };
  opacity?: number;
}

interface Style {
  fills: Fill[];
}

interface Frame {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface Padding {
  vertical: number;
  horizontal: number;
}

interface ElementStyle {
  font: string;
  weight: string;
  color: { r: number; g: number; b: number };
}

interface TextElement {
  x: number;
  y: number;
  fontSize: number;
}

interface Background {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface AutoLayout {
  padding: Padding;
  spacing: number;
}

interface ContentGroup {
  layout: "VERTICAL" | "HORIZONTAL";
  alignment: string;
  padding: Padding;
  spacing: number;
}

interface CTAGroup {
  layout: "VERTICAL" | "HORIZONTAL";
  padding: Padding;
}

interface Layout {
  autoLayout: AutoLayout;
  'content-group': ContentGroup;
  'cta-group': CTAGroup;
}

interface FormatLayout {
  width: number;
  height: number;
  name: string;
  autoLayout?: AutoLayout;
  'content-group'?: ContentGroup;
  'cta-group'?: CTAGroup;
}

interface FormatStyle {
  font: string;
  weight: string;
  size: number;
  x?: number;
  y?: number;
}

interface FormatBackground {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

interface Format extends FormatLayout {
  aspectRatio: number;
  bg: FormatBackground;
  title: FormatStyle;
  body: FormatStyle;
  'cta-label': FormatStyle;
}

interface Guidelines {
  formats: { [key: string]: Format };
  layout: Layout;
}

interface UIMessage {
  type: 'generate';
  selectedSizes: string[];
}

interface PluginMessage {
  type: 'init';
  platform: Platform;
  selectedSizes: Format[];
}

interface Template {
  frame: {
    width: number;
    height: number;
    x: number;
    y: number;
    name: string;
    background: {
      type: string;
      cornerRadius: number;
      effects: any[];
      fills: any[];
      strokes: any[];
    };
  };
  layout: {
    'content-group': {
      x: number;
      y: number;
      width: number;
      height: number;
      spacing: number;
    };
    'cta-group': {
      x: number;
      y: number;
      width: number;
      height: number;
      spacing: number;
    };
  };
}

// Platform-specific formats
const formatsByPlatform: Record<Platform, Format[]> = {
  'Demand-Gen': [
    { name: "1200x1200", width: 1200, height: 1200, aspectRatio: 1, bg: { width: 1200, height: 1200 }, title: { font: "Inter", weight: "Bold", size: 72 }, body: { font: "Inter", weight: "Regular", size: 24 }, 'cta-label': { font: "Inter", weight: "Bold", size: 24 } },
    { name: "960x1200", width: 960, height: 1200, aspectRatio: 0.8, bg: { width: 960, height: 1200 }, title: { font: "Inter", weight: "Bold", size: 64 }, body: { font: "Inter", weight: "Regular", size: 24 }, 'cta-label': { font: "Inter", weight: "Bold", size: 24 } },
    { name: "1200x628", width: 1200, height: 628, aspectRatio: 1.91, bg: { width: 1200, height: 628 }, title: { font: "Inter", weight: "Bold", size: 56 }, body: { font: "Inter", weight: "Regular", size: 24 }, 'cta-label': { font: "Inter", weight: "Bold", size: 24 } }
  ],
  'Facebook': [
    { name: "1080x1350", width: 1080, height: 1350, aspectRatio: 0.8, bg: { width: 1080, height: 1350 }, title: { font: "Inter", weight: "Bold", size: 64 }, body: { font: "Inter", weight: "Regular", size: 24 }, 'cta-label': { font: "Inter", weight: "Bold", size: 24 } },
    { name: "1080x1920", width: 1080, height: 1920, aspectRatio: 0.5625, bg: { width: 1080, height: 1920 }, title: { font: "Inter", weight: "Bold", size: 64 }, body: { font: "Inter", weight: "Regular", size: 24 }, 'cta-label': { font: "Inter", weight: "Bold", size: 24 } }
  ],
  'Native': [
    { name: "300x250", width: 300, height: 250, aspectRatio: 1.2, bg: { width: 300, height: 250 }, title: { font: "Inter", weight: "Bold", size: 24 }, body: { font: "Inter", weight: "Regular", size: 14 }, 'cta-label': { font: "Inter", weight: "Bold", size: 14 } },
    { name: "320x50", width: 320, height: 50, aspectRatio: 6.4, bg: { width: 320, height: 50 }, title: { font: "Inter", weight: "Bold", size: 14 }, body: { font: "Inter", weight: "Regular", size: 12 }, 'cta-label': { font: "Inter", weight: "Bold", size: 12 } },
    { name: "728x90", width: 728, height: 90, aspectRatio: 8.09, bg: { width: 728, height: 90 }, title: { font: "Inter", weight: "Bold", size: 24 }, body: { font: "Inter", weight: "Regular", size: 14 }, 'cta-label': { font: "Inter", weight: "Bold", size: 14 } },
    { name: "300x600", width: 300, height: 600, aspectRatio: 0.5, bg: { width: 300, height: 600 }, title: { font: "Inter", weight: "Bold", size: 32 }, body: { font: "Inter", weight: "Regular", size: 16 }, 'cta-label': { font: "Inter", weight: "Bold", size: 16 } }
  ]
};

// Define guidelines
const guidelines: Guidelines = {
  formats: {
    "1200x1200": {
      name: "Square",
      width: 1200,
      height: 1200,
      aspectRatio: 1,
      bg: { width: 1200, height: 1200 },
      title: { font: "Inter", weight: "Bold", size: 72 },
      body: { font: "Inter", weight: "Regular", size: 24 },
      "cta-label": { font: "Inter", weight: "Bold", size: 24 }
    },
    "960x1200": {
      name: "Portrait",
      width: 960,
      height: 1200,
      aspectRatio: 0.8,
      bg: { width: 960, height: 1200 },
      title: { font: "Inter", weight: "Bold", size: 64 },
      body: { font: "Inter", weight: "Regular", size: 24 },
      "cta-label": { font: "Inter", weight: "Bold", size: 24 }
    },
    "1200x628": {
      name: "Landscape",
      width: 1200,
      height: 628,
      aspectRatio: 1.91,
      bg: { width: 1200, height: 628 },
      title: { font: "Inter", weight: "Bold", size: 56 },
      body: { font: "Inter", weight: "Regular", size: 24 },
      "cta-label": { font: "Inter", weight: "Bold", size: 24 }
    },
    "1080x1350": {
      name: "Instagram Portrait",
      width: 1080,
      height: 1350,
      aspectRatio: 0.8,
      bg: { width: 1080, height: 1350 },
      title: { font: "Inter", weight: "Bold", size: 64 },
      body: { font: "Inter", weight: "Regular", size: 24 },
      "cta-label": { font: "Inter", weight: "Bold", size: 24 }
    },
    "1080x1920": {
      name: "Story",
      width: 1080,
      height: 1920,
      aspectRatio: 0.5625,
      bg: { width: 1080, height: 1920 },
      title: { font: "Inter", weight: "Bold", size: 64 },
      body: { font: "Inter", weight: "Regular", size: 24 },
      "cta-label": { font: "Inter", weight: "Bold", size: 24 }
    },
    "300x250": {
      name: "Medium Rectangle",
      width: 300,
      height: 250,
      aspectRatio: 1.2,
      bg: { width: 300, height: 250 },
      title: { font: "Inter", weight: "Bold", size: 24 },
      body: { font: "Inter", weight: "Regular", size: 14 },
      "cta-label": { font: "Inter", weight: "Bold", size: 14 }
    },
    "320x50": {
      name: "Mobile Leaderboard",
      width: 320,
      height: 50,
      aspectRatio: 6.4,
      bg: { width: 320, height: 50 },
      title: { font: "Inter", weight: "Bold", size: 14 },
      body: { font: "Inter", weight: "Regular", size: 12 },
      "cta-label": { font: "Inter", weight: "Bold", size: 12 }
    },
    "728x90": {
      name: "Leaderboard",
      width: 728,
      height: 90,
      aspectRatio: 8.089,
      bg: { width: 728, height: 90 },
      title: { font: "Inter", weight: "Bold", size: 24 },
      body: { font: "Inter", weight: "Regular", size: 14 },
      "cta-label": { font: "Inter", weight: "Bold", size: 14 }
    },
    "300x600": {
      name: "Half Page",
      width: 300,
      height: 600,
      aspectRatio: 0.5,
      bg: { width: 300, height: 600 },
      title: { font: "Inter", weight: "Bold", size: 32 },
      body: { font: "Inter", weight: "Regular", size: 16 },
      "cta-label": { font: "Inter", weight: "Bold", size: 16 }
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
    'content-group': {
      layout: 'VERTICAL',
      alignment: 'TOP_LEFT',
      padding: {
        vertical: 64,
        horizontal: 40
      },
      spacing: 24
    },
    'cta-group': {
      layout: 'HORIZONTAL',
      padding: {
        vertical: 16,
        horizontal: 24
      }
    }
  }
};

const defaultTemplate: Template = {
  frame: {
    width: 1200,
    height: 1200,
    x: 0,
    y: 0,
    name: "Base Template",
    background: {
      type: "RECTANGLE",
      cornerRadius: 0,
      effects: [],
      fills: [],
      strokes: []
    }
  },
  layout: {
    'content-group': {
      x: 80,
      y: 80,
      width: 1040,
      height: 800,
      spacing: 40
    },
    'cta-group': {
      x: 80,
      y: 920,
      width: 1040,
      height: 200,
      spacing: 20
    }
  }
};

const supportedSizes: string[] = [
  "1200x1200",
  "960x1200",
  "1200x628",
  "1080x1350",
  "1080x1920",
  "300x250",
  "320x50",
  "728x90",
  "300x600"
];

const defaultColors = {
  black: { r: 0, g: 0, b: 0 },
  white: { r: 1, g: 1, b: 1 }
};

const defaultLayout: Layout = {
  autoLayout: {
    padding: {
      vertical: 64,
      horizontal: 40
    },
    spacing: 24
  },
  'content-group': {
    layout: 'VERTICAL',
    alignment: 'TOP_LEFT',
    padding: {
      vertical: 64,
      horizontal: 40
    },
    spacing: 24
  },
  'cta-group': {
    layout: 'HORIZONTAL',
    padding: {
      vertical: 16,
      horizontal: 24
    }
  }
};

// Function to generate variants
async function generateVariants(selectedSizes: string[]): Promise<void> {
  const selectedFrame = getSelectedFrame();
  
  if (!selectedFrame) {
    throw new Error('Please select a frame to use as template');
  }

  let xOffset = selectedFrame.x + selectedFrame.width + 100; // Start 100px to the right of original

  for (const size of selectedSizes) {
    const [width, height] = size.split('x').map(Number);
    const format = guidelines.formats[size];

    if (!format) continue;

    const variant = selectedFrame.clone();
    variant.name = `${selectedFrame.name} ${width}x${height}`;
    variant.resize(width, height);
    
    // Position to the right of the previous variant
    variant.x = xOffset;
    variant.y = selectedFrame.y;
    
    // Apply auto-layout rules
    applyAutoLayoutRules(variant, format);
    
    xOffset += width + 100; // Add spacing between variants
  }
}

// Show the UI
figma.showUI(__html__, { width: 240, height: 480 });

// Message handling
figma.ui.onmessage = async (msg: { type: string; selectedSizes?: string[] }) => {
  if (msg.type === 'generate' && msg.selectedSizes && msg.selectedSizes.length > 0) {
    try {
      const selectedFrame = getSelectedFrame();
      if (!selectedFrame) {
        throw new Error('Please select a frame to use as template');
      }
      
      await generateVariants(msg.selectedSizes);
      figma.notify(`Created ${msg.selectedSizes.length} variants`);
    } catch (err) {
      figma.notify('Error: ' + (err as Error).message);
    }
  }
};

// Function to handle figma.currentPage.selection
function getSelectedFrame(): FrameNode | null {
  const selectedNodes = figma.currentPage.selection;
  if (selectedNodes.length !== 1 || selectedNodes[0].type !== 'FRAME') {
    return null;
  }
  return selectedNodes[0] as FrameNode;
}

// Apply auto-layout adjustments based on knowledge base guidelines
function applyAutoLayoutRules(frame: FrameNode, format: Format): void {
  frame.layoutMode = 'VERTICAL';
  frame.paddingTop = 64;
  frame.paddingBottom = 64;
  frame.paddingLeft = 40;
  frame.paddingRight = 40;
  frame.itemSpacing = 24;

  frame.children.forEach(child => {
    if (child.type === 'FRAME' || child.type === 'COMPONENT' || child.type === 'INSTANCE') {
      const childFrame = child as FrameNode;
      if (childFrame.layoutMode === 'HORIZONTAL' || childFrame.layoutMode === 'VERTICAL') {
        applyAutoLayoutRules(childFrame, format);
      }
      if (childFrame.primaryAxisSizingMode === 'AUTO') {
        childFrame.layoutAlign = 'STRETCH';
      }
    }
  });
}

// Main function
async function main(): Promise<void> {
  try {
    // Initialize with default platform and sizes
    const initialPlatform: Platform = 'Demand-Gen';
    const initialSizes = formatsByPlatform[initialPlatform];

    // Initialize UI
    figma.ui.postMessage({
      type: 'init',
      platform: initialPlatform,
      selectedSizes: initialSizes
    } satisfies PluginMessage);

    // Set up UI
    figma.showUI(__html__, { width: 320, height: 280 });

    // Handle UI messages
    figma.ui.onmessage = async (msg: { type: string; selectedSizes?: string[] }) => {
      if (msg.type === 'generate' && msg.selectedSizes && msg.selectedSizes.length > 0) {
        try {
          await generateVariants(msg.selectedSizes);
          figma.notify(`Created ${msg.selectedSizes.length} variants`);
        } catch (err) {
          figma.notify('Error: ' + (err as Error).message);
        }
      }
    };

  } catch (error) {
    console.error('Error in main:', error);
    figma.notify('Error initializing plugin');
    figma.closePlugin();
  }
} 

main().catch(error => {
  console.error('Error:', error);
  figma.notify(`Error: ${error.message}`, { error: true });
});

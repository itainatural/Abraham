/// <reference types="@figma/plugin-typings" />

// Type definitions
type Platform = 'Demand-Gen' | 'Facebook' | 'Native';

interface Format {
  name: string;
  w: number;
  h: number;
}

interface UIMessage {
  type: 'generate';
  sizes: string[];
}

interface PluginMessage {
  type: 'init';
  platform: Platform;
  sizes: Format[];
}

interface ElementStyle {
  font: string;
  weight: string;
  color: { r: number; g: number; b: number };
  fill?: { type: string; color: { r: number; g: number; b: number } };
}

interface ElementPosition {
  x: number;
  y: number;
  fontSize?: number;
  w?: number;
  h?: number;
}

interface Background {
  w: number;
  h: number;
  x?: number;
  y?: number;
  fill?: { type: string; color: { r: number; g: number; b: number } };
}

interface FormatLayout {
  bg: Background;
  overlay?: Background;
  title: ElementPosition;
  body: ElementPosition;
  'cta-label': ElementPosition;
}

interface LayoutSettings {
  padding: { vertical: number; horizontal: number };
  spacing?: number;
  alignment?: string;
  layout?: string;
}

interface Guidelines {
  styles: { [key: string]: ElementStyle };
  formats: { [key: string]: FormatLayout };
  layout: { [key: string]: LayoutSettings };
}

// Platform-specific formats
const formatsByPlatform: Record<Platform, Format[]> = {
  'Demand-Gen': [
    { name: "1200x1200", w: 1200, h: 1200 },
    { name: "960x1200", w: 960, h: 1200 },
    { name: "1200x628", w: 1200, h: 628 }
  ],
  'Facebook': [
    { name: "1080x1350", w: 1080, h: 1350 },
    { name: "1080x1920", w: 1080, h: 1920 }
  ],
  'Native': [
    { name: "300x250", w: 300, h: 250 },   // Standard Display
    { name: "320x50", w: 320, h: 50 },     // Mobile Banner
    { name: "728x90", w: 728, h: 90 },     // Leaderboard
    { name: "300x600", w: 300, h: 600 }    // Half Page
  ]
};

// Show the UI
figma.showUI(__html__, { width: 240, height: 480 });

// Function to generate variants
async function generateVariants(sizes: string[]) {
  const selection = figma.currentPage.selection[0] as FrameNode;
  const parent = selection.parent;
  
  if (!parent) {
    throw new Error('Selected frame must be inside a parent frame or page');
  }
  
  let xOffset = selection.x + selection.width + 100; // Start 100px to the right of original
  
  for (const size of sizes) {
    const [width, height] = size.split('x').map(Number);
    const variant = selection.clone();
    variant.name = `${selection.name} ${width}x${height}`;
    variant.resize(width, height);
    variant.x = xOffset;
    variant.y = selection.y; // Keep same vertical position
    parent.appendChild(variant);
    
    xOffset += width + 100; // Add spacing between variants
  }
}

// Handle messages from the UI
figma.ui.onmessage = async (msg: UIMessage) => {
  try {
    if (msg.type === 'generate' && msg.sizes.length > 0) {
      const selection = figma.currentPage.selection;
      
      if (selection.length !== 1 || selection[0].type !== 'FRAME') {
        figma.notify('Please select a frame to use as template');
        return;
      }

      await generateVariants(msg.sizes);
      figma.notify('Variants generated successfully!');
      figma.closePlugin();
    }
  } catch (error) {
    console.error('Error generating variants:', error);
    figma.notify('Error generating variants');
    figma.closePlugin();
  }
};

// Define guidelines
const defaultGuidelines: Guidelines = {
  styles: {
    title: {
      font: 'Inter',
      weight: 'Bold',
      color: { r: 0, g: 0, b: 0 },
      fill: { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }
    },
    body: {
      font: 'Inter',
      weight: 'Regular',
      color: { r: 0, g: 0, b: 0 },
      fill: { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }
    },
    'cta-label': {
      font: 'Inter',
      weight: 'Bold',
      color: { r: 1, g: 1, b: 1 },
      fill: { type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }
    }
  },
  formats: {
    "1200x1200": {
      bg: { w: 1200, h: 1200, x: 0, y: 0 },
      overlay: { w: 1200, h: 1200, x: 0, y: 0, fill: { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } },
      title: { x: 100, y: 100, fontSize: 48 },
      body: { x: 100, y: 200, fontSize: 24 },
      'cta-label': { x: 100, y: 300, fontSize: 24 }
    },
    "960x1200": {
      bg: { w: 960, h: 1200, x: 0, y: 0 },
      overlay: { w: 960, h: 1200, x: 0, y: 0, fill: { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } },
      title: { x: 80, y: 100, fontSize: 40 },
      body: { x: 80, y: 200, fontSize: 20 },
      'cta-label': { x: 80, y: 300, fontSize: 20 }
    },
    "1200x628": {
      bg: { w: 1200, h: 628, x: 0, y: 0 },
      overlay: { w: 1200, h: 628, x: 0, y: 0, fill: { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } },
      title: { x: 100, y: 100, fontSize: 36 },
      body: { x: 100, y: 200, fontSize: 18 },
      'cta-label': { x: 100, y: 300, fontSize: 18 }
    },
    "1080x1920": {
      bg: { w: 1080, h: 1920, x: 0, y: 0 },
      overlay: { w: 1080, h: 1920, x: 0, y: 0, fill: { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } },
      title: { x: 90, y: 100, fontSize: 42 },
      body: { x: 90, y: 200, fontSize: 22 },
      'cta-label': { x: 90, y: 300, fontSize: 22 }
    }
  },
  layout: {
    'content-group': {
      padding: { vertical: 20, horizontal: 20 },
      spacing: 16,
      alignment: 'CENTER',
      layout: 'VERTICAL'
    },
    'cta-group': {
      padding: { vertical: 10, horizontal: 10 },
      spacing: 8,
      alignment: 'CENTER',
      layout: 'HORIZONTAL'
    }
  }
};

/** Check and fix overflow issues */
function handleOverflow(frame: FrameNode): void {
  if (!frame || !frame.children || frame.children.length === 0) return;

  frame.children.forEach(child => {
    if (child.type === 'TEXT') {
      const text = child as TextNode;
      if (text.height > frame.height) {
        // Apply knowledge base fix for text overflow
        text.textAutoResize = 'HEIGHT';
        if (typeof text.fontSize === 'number') {
          text.fontSize = Math.max(text.fontSize * 0.9, 12); // Reduce size but maintain legibility
        }
      }
    }
  });
}

/** Get or create a text node with the given name */
function getOrCreateTextNode(frame: FrameNode, name: string): TextNode {
  const existing = frame.findOne(n => n.name === name) as TextNode;
  if (existing && existing.type === 'TEXT') {
    return existing;
  }

  const text = figma.createText();
  text.name = name;
  frame.appendChild(text);
  return text;
}

/** Apply layout adjustments based on format */
async function applyLayout(frame: FrameNode, formatName: string): Promise<void> {
  // Load guidelines
  const storedGuidelines = await figma.clientStorage.getAsync('guidelines') || defaultGuidelines;
  if (!storedGuidelines || !storedGuidelines.formats[formatName]) {
    throw new Error(`No guidelines found for format ${formatName}`);
  }

  const formatGuide = storedGuidelines.formats[formatName];

  // Get all nodes
  const bgNode = frame.findOne((n: SceneNode) => n.name === 'bg') as RectangleNode;
  const overlayNode = frame.findOne((n: SceneNode) => n.name === 'overlay') as RectangleNode;
  const titleNode = frame.findOne((n: SceneNode) => n.name === 'title') as TextNode;
  const bodyNode = frame.findOne((n: SceneNode) => n.name === 'body') as TextNode;
  const ctaLabelNode = frame.findOne((n: SceneNode) => n.name === 'cta-label') as TextNode;

  // Resize background and overlay
  if (bgNode) {
    bgNode.resize(formatGuide.bg.w, formatGuide.bg.h);
    bgNode.x = formatGuide.bg.x || 0;
    bgNode.y = formatGuide.bg.y || 0;
  }

  if (overlayNode) {
    overlayNode.resize(formatGuide.bg.w, formatGuide.bg.h);
    overlayNode.x = formatGuide.bg.x || 0;
    overlayNode.y = formatGuide.bg.y || 0;
  }

  // Handle text nodes
  if (titleNode) {
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    titleNode.fontName = { family: "Inter", style: "Bold" };
    titleNode.x = formatGuide.title.x;
    titleNode.y = formatGuide.title.y;
    if (formatGuide.title.fontSize) {
      titleNode.fontSize = formatGuide.title.fontSize;
    }
  }

  if (bodyNode) {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    bodyNode.fontName = { family: "Inter", style: "Regular" };
    bodyNode.x = formatGuide.body.x;
    bodyNode.y = formatGuide.body.y;
    if (formatGuide.body.fontSize) {
      bodyNode.fontSize = formatGuide.body.fontSize;
    }
  }

  if (ctaLabelNode) {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    ctaLabelNode.fontName = { family: "Inter", style: "Regular" };
    ctaLabelNode.x = formatGuide['cta-label'].x;
    ctaLabelNode.y = formatGuide['cta-label'].y;
    if (formatGuide['cta-label'].fontSize) {
      ctaLabelNode.fontSize = formatGuide['cta-label'].fontSize;
    }
  }

  // Check and fix any overflow issues
  handleOverflow(frame);
}

// Check and fix any overflow issues
handleOverflow(frame);
}

// Base template structure for creating variants
const baseTemplate: {
  frame: {
    name: string;
    size: string;
    children: {
      name: string;
      type: string;
    }[];
  };
} = {
  frame: {
    name: "Template/1x1",
    size: "1200x1200",
    children: [
      {
        name: "bg",
        type: "RECTANGLE"
      },
      {
        name: "overlay",
        type: "RECTANGLE"
      }
    ]
  }
};
      weight: "Regular",
      color: { r: 1, g: 1, b: 1 }
    },
    bg: {
      fill: { type: 'SOLID', color: { r: 1, g: 1, b: 1 } }
    },
    overlay: {
      fill: { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, "opacity": 0.5 }
    }
  },
  formats: {
    "1200x1200": {
      bg: { w: 1200, h: 1200 },
      title: { x: 80, y: 100, fontSize: 56 },
      body: { x: 80, y: 200, fontSize: 28 },
      "cta-label": { x: 80, y: 1000, fontSize: 24 },
      bg: { x: 0, y: 0, w: 1200, h: 1200 },
      overlay: { x: 0, y: 0, w: 1200, h: 1200 }
    },
    "960x1200": {
      bg: { w: 960, h: 1200 },
      title: { x: 80, y: 100, fontSize: 56 },
      body: { x: 80, y: 200, fontSize: 28 },
      "cta-label": { x: 80, y: 1000, fontSize: 24 },
      bg: { x: 0, y: 0, w: 960, h: 1200 },
      overlay: { x: 0, y: 0, w: 960, h: 1200 }
    },
    "1200x628": {
      bg: { w: 1200, h: 628 },
      title: { x: 80, y: 80, fontSize: 48 },
      body: { x: 80, y: 160, fontSize: 24 },
      "cta-label": { x: 80, y: 500, fontSize: 24 },
      bg: { x: 0, y: 0, w: 1200, h: 628 },
      overlay: { x: 0, y: 0, w: 1200, h: 628 }
    },
    "1080x1920": {
      bg: { w: 1080, h: 1920 },
      title: { x: 80, y: 240, fontSize: 64 },
      body: { x: 80, y: 360, fontSize: 32 },
      "cta-label": { x: 80, y: 1700, fontSize: 28 },
      bg: { x: 0, y: 0, w: 1080, h: 1920 },
      overlay: { x: 0, y: 0, w: 1080, h: 1920 }
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
    contentGroup: {
      layout: "VERTICAL",
      alignment: "TOP_LEFT"
    },
    ctaGroup: {
      layout: "HORIZONTAL",
      padding: {
        vertical: 16,
        horizontal: 24
      }
    }
  }
};

// Function to generate variants
async function generateVariants(sizes: string[]) {
  const selection = figma.currentPage.selection;
  
  if (selection.length !== 1 || selection[0].type !== 'FRAME') {
    figma.notify('Please select a frame to use as template');
    return;
  }

  const template = selection[0] as FrameNode;
  const parent = template.parent;
  
  if (!parent) {
    throw new Error('Selected frame must be inside a parent frame or page');
  }
  
  // Load fonts if there are any text nodes
  const textNodes = template.findAll(node => node.type === 'TEXT') as TextNode[];
  if (textNodes.length > 0) {
    const fontPromises = textNodes.map(async node => {
      if (node.fontName === figma.mixed) {
        // Handle mixed fonts case
        const fonts = new Set<string>();
        const characters = node.characters;
        for (let i = 0; i < characters.length; i++) {
          const font = node.getRangeFontName(i, i + 1);
          if (font !== figma.mixed) {
            fonts.add(JSON.stringify(font));
          }
        }
        // Load all unique fonts
        for (const fontStr of fonts) {
          await figma.loadFontAsync(JSON.parse(fontStr));
        }
      } else {
        // Single font case
        await figma.loadFontAsync(node.fontName as FontName);
      }
    });
    await Promise.all(fontPromises);
  }
  
  // Create variants
  for (const size of sizes) {
    const [width, height] = size.split('x').map(Number);
    const variant = template.clone();
    variant.name = `${template.name} ${width}x${height}`;
    variant.resize(width, height);
    
    // Position below the original with some spacing
    variant.x = template.x;
    variant.y = template.y + template.height + 100;
    
    // Scale text nodes if any
    const scale = Math.min(width / template.width, height / template.height);
    const variantTextNodes = variant.findAll(node => node.type === 'TEXT') as TextNode[];
    
    variantTextNodes.forEach(node => {
      if (node.fontSize !== figma.mixed) {
        node.fontSize = Math.round(node.fontSize * scale);
      }
    });
    
    parent.appendChild(variant);
  }
}

// Handle messages from the UI
figma.ui.onmessage = async (msg: UIMessage) => {
  try {
    if (msg.type === 'generate' && msg.sizes.length > 0) {
      await generateVariants(msg.sizes);
      figma.notify('Variants generated successfully!');
      figma.closePlugin();
    }
  } catch (error) {
    console.error('Error generating variants:', error);
    figma.notify('Error generating variants');
    figma.closePlugin();
  }
};

/** ------------------------------------------
 *  MAIN
 *  ---------------------------------------- */
// Apply auto-layout adjustments based on knowledge base guidelines
function applyAutoLayoutRules(frame: FrameNode, targetFormat: Format): void {
  if (!frame || !targetFormat) return;

  // Return early if no children
  if (!frame.children || frame.children.length === 0) return;

  // Handle children based on their sizing modes
  frame.children.forEach(child => {
    if (child.type === 'FRAME' || child.type === 'COMPONENT' || child.type === 'INSTANCE') {
      const layoutMode = (child as FrameNode).layoutMode;
      if (layoutMode === 'HORIZONTAL' || layoutMode === 'VERTICAL') {
        // Apply auto-layout rules from knowledge base
        if (child.primaryAxisSizingMode === 'FIXED') {
          // Keep size fixed as per knowledge base
          return;
        } else if (child.primaryAxisSizingMode === 'AUTO') {
          // Let it hug contents
          child.layoutAlign = 'STRETCH';
        }
      }
    }
  });
}

async function main(): Promise<void> {
  try {
    // Load guidelines directly
    const guidelines = {
      "styles": {
        "title": {
          "font": "Inter",
          "weight": "Bold",
          "color": { "r": 0, "g": 0, "b": 0 }
        },
        "body": {
          "font": "Inter",
          "weight": "Regular",
          "color": { "r": 0.4, "g": 0.4, "b": 0.4 }
        },
        "cta-label": {
          "font": "Inter",
          "weight": "Regular",
          "color": { "r": 1, "g": 1, "b": 1 }
        },
        "bg": {
          "fill": { "type": "SOLID", "color": { "r": 1, "g": 1, "b": 1 } }
        },
        "overlay": {
          "fill": { "type": "SOLID", "color": { "r": 0, "g": 0, "b": 0 }, "opacity": 0.5 }
        }
      },
      "formats": {
        "1200x1200": {
          "aspectRatio": 1,
          "title": { "x": 80, "y": 100, "fontSize": 56 },
          "body": { "x": 80, "y": 200, "fontSize": 28 },
          "cta-label": { "x": 80, "y": 1000, "fontSize": 24 },
          "bg": { "x": 0, "y": 0, "w": 1200, "h": 1200 },
          "overlay": { "x": 0, "y": 0, "w": 1200, "h": 1200 }
        },
        "960x1200": {
          "aspectRatio": 0.8,
          "title": { "x": 80, "y": 100, "fontSize": 56 },
          "body": { "x": 80, "y": 200, "fontSize": 28 },
          "cta-label": { "x": 80, "y": 1000, "fontSize": 24 },
          "bg": { "x": 0, "y": 0, "w": 960, "h": 1200 },
          "overlay": { "x": 0, "y": 0, "w": 960, "h": 1200 }
        },
        "1200x628": {
          "aspectRatio": 1.91,
          "title": { "x": 80, "y": 80, "fontSize": 48 },
          "body": { "x": 80, "y": 160, "fontSize": 24 },
          "cta-label": { "x": 80, "y": 500, "fontSize": 24 },
          "bg": { "x": 0, "y": 0, "w": 1200, "h": 628 },
          "overlay": { "x": 0, "y": 0, "w": 1200, "h": 628 }
        },
        "1080x1920": {
          "aspectRatio": 0.5625,
          "title": { "x": 80, "y": 240, "fontSize": 64 },
          "body": { "x": 80, "y": 360, "fontSize": 32 },
          "cta-label": { "x": 80, "y": 1700, "fontSize": 28 },
          "bg": { "x": 0, "y": 0, "w": 1080, "h": 1920 },
          "overlay": { "x": 0, "y": 0, "w": 1080, "h": 1920 }
        }
      },
      "layout": {
        "autoLayout": {
          "padding": {
            "vertical": 64,
            "horizontal": 40
          },
          "spacing": 24
        },
        "contentGroup": {
          "layout": "VERTICAL",
          "alignment": "TOP_LEFT"
        },
        "ctaGroup": {
          "layout": "HORIZONTAL",
          "padding": {
            "vertical": 16,
            "horizontal": 24
          }
        }
      }
    };
    await figma.clientStorage.setAsync('guidelines', guidelines);

    figma.showUI(__html__, { width: 320, height: 280 });

    figma.ui.onmessage = async (msg: { type: string; sizes?: string[] }) => {
      if (msg.type === 'generate' && msg.sizes && msg.sizes.length > 0) {
        try {
          await generateVariants(msg.sizes);
          figma.notify(`Created ${msg.sizes.length} variants`);
        } catch (err) {
          figma.notify('Error: ' + (err as Error).message);
        }
      }
    };

    return Promise.resolve();
  } catch (err) {
    figma.notify((err as Error).message);
    console.error(err);
    return Promise.reject(err);
  }
}

main();

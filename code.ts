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
  baseSize?: number;
}

interface ElementPosition {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  fontSize?: number;
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
    { name: "1080x1920", w: 1080, h: 1920 },
    { name: "1080x1350", w: 1080, h: 1350 }
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

async function applyLayout(frame: FrameNode, formatName: string, data: any) {
  const guidelines = await loadGuidelines();
  const guideline = guidelines.formats[formatName];
  const styles = guidelines.styles;

  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" })
  ]);

  // Utility to apply text styles
  const applyTextProps = (textNode: TextNode, type: 'title' | 'body' | 'cta-label', content: string) => {
    const style = styles[type] as ElementStyle;
    const pos = guideline[type] as ElementPosition;

    if (!style || !pos) return;

    textNode.characters = content;
    const baseSize = style.baseSize ?? (type === 'title' ? 56 : type === 'body' ? 24 : 18);
    textNode.fontSize = baseSize * (fontScale[formatName as keyof typeof fontScale] ?? 1.0);
    textNode.fontName = { family: style.font ?? 'Inter', style: style.weight ?? 'Regular' };
    textNode.fills = [{ type: 'SOLID', color: style.color ?? { r: 0, g: 0, b: 0 } }];
    textNode.x = pos.x ?? 0;
    textNode.y = pos.y ?? 0;
    textNode.textAutoResize = "HEIGHT";
  };

  // Title
  const title = frame.findOne(n => n.name === 'title') as TextNode;
  if (title) applyTextProps(title, "title", data.title || "Default Title");

  // Body
  const body = frame.findOne(n => n.name === 'body') as TextNode;
  if (body) applyTextProps(body, "body", data.body || "Body copy here");

  // CTA
  const ctaLabel = frame.findOne(n => n.name === 'cta-label') as TextNode;
  if (ctaLabel) applyTextProps(ctaLabel, "cta-label", data.cta || "CTA");

  // Background
  const bg = frame.findOne(n => n.name === "bg");
  if (bg && "resize" in bg && guideline.bg) {
    const bgDims = guideline.bg;
    const width = safeNumber(bgDims.w, frame.width);
    const height = safeNumber(bgDims.h, frame.height);
    bg.resize(width, height);
    bg.x = safeNumber(bgDims.x, 0);
    bg.y = safeNumber(bgDims.y, 0);
  }

  // Overlay
  const overlay = frame.findOne(n => n.name === "overlay");
  if (overlay && "resize" in overlay && guideline.overlay) {
    const olDims = guideline.overlay;
    const width = safeNumber(olDims.w, frame.width);
    const height = safeNumber(olDims.h, frame.height);
    overlay.resize(width, height);
    overlay.x = safeNumber(olDims.x, 0);
    overlay.y = safeNumber(olDims.y, 0);
  }

  // Content group auto layout fallback
  const contentGroup = frame.findOne(n => n.name === "content-group") as FrameNode;
  if (contentGroup) {
    contentGroup.layoutMode = "VERTICAL";
    contentGroup.itemSpacing = safeNumber(guidelines.layout.autoLayout.spacing, 24);
    contentGroup.paddingTop = safeNumber(guidelines.layout.autoLayout.padding.vertical, 64);
    contentGroup.paddingBottom = safeNumber(guidelines.layout.autoLayout.padding.vertical, 64);
    contentGroup.paddingLeft = safeNumber(guidelines.layout.autoLayout.padding.horizontal, 40);
    contentGroup.paddingRight = safeNumber(guidelines.layout.autoLayout.padding.horizontal, 40);
  }

  // CTA group layout
  const ctaGroup = frame.findOne(n => n.name === "cta-group") as FrameNode;
  if (ctaGroup) {
    ctaGroup.layoutMode = "HORIZONTAL";
    ctaGroup.itemSpacing = safeNumber(guidelines.layout.ctaGroup.spacing, 24);
    ctaGroup.paddingTop = safeNumber(guidelines.layout.ctaGroup.padding.vertical, 16);
    ctaGroup.paddingBottom = safeNumber(guidelines.layout.ctaGroup.padding.vertical, 16);
    ctaGroup.paddingLeft = safeNumber(guidelines.layout.ctaGroup.padding.horizontal, 24);
    ctaGroup.paddingRight = safeNumber(guidelines.layout.ctaGroup.padding.horizontal, 24);
  }

  // Check and fix any overflow issues for frame elements
  const textNodes = frame.findAll(n => n.type === 'TEXT') as TextNode[];
  textNodes.forEach(text => {
    const parent = text.parent;
    if (parent && parent.type === 'FRAME') {
      fixOverflow(text, (parent as FrameNode).height);
    }
  });
}

// Helper to fix text overflow
// Load guidelines from disk
async function loadGuidelines(): Promise<Guidelines> {
  try {
    const response = await figma.clientStorage.getAsync('guidelines');
    if (response) {
      return response as Guidelines;
    }
  } catch (error) {
    console.error('Error loading guidelines:', error);
  }

  // If no guidelines found in storage, use default
  return defaultGuidelines;
}

// Helper to fix text overflow
function fixOverflow(text: TextNode, maxHeight: number) {
  if (typeof text.height !== 'number' || typeof text.fontSize !== 'number') return;
  while (text.height > maxHeight && text.fontSize > 12) {
    text.fontSize = Math.max(text.fontSize * 0.95, 12);
  }
}

// Font scale map for different formats
const fontScale = {
  "1200x1200": 1.0,
  "960x1200": 0.8944,
  "1200x628": 0.7234,
  "1080x1920": 1.2
} as const;

// Helper for safe number handling
function safeNumber(value: number | undefined, defaultValue: number): number {
  return typeof value === 'number' ? value : defaultValue;
}

// Base template structure for creating variants
const baseTemplate = {
  frame: {
    name: "template",
    type: "FRAME",
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
  
  let currentX = template.x + template.width + 100;
  
  for (const size of sizes) {
    const [width, height] = size.split('x').map(Number);
    const variant = template.clone();
    variant.name = `${template.name} ${width}x${height}`;
    
    // First resize the variant
    variant.resize(width, height);
    
    // Scale text nodes if any
    const scale = Math.min(width / template.width, height / template.height);
    const variantTextNodes = variant.findAll(node => node.type === 'TEXT') as TextNode[];
    variantTextNodes.forEach(node => {
      if (node.fontSize !== figma.mixed) {
        node.fontSize = Math.round(node.fontSize * scale);
      }
    });
    
    // Position after resize and before append
    variant.x = currentX;
    variant.y = template.y;
    
    // Log position for debugging
    console.log('Variant position:', {
      name: variant.name,
      x: variant.x,
      y: variant.y
    });
    
    // Add to parent and update position for next variant
    parent.appendChild(variant);
    currentX = variant.x + variant.width + 100;
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

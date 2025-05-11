/// <reference types="@figma/plugin-typings" />

// Basic imports
import { postLog } from './debug';

// Message interface
interface Message {
  type: string;
  format?: string;
  formats?: string[];
  preserveAspectRatio?: boolean;
  scaleContent?: boolean;
  fonts?: FontName[];
  [key: string]: any;
}

// Basic function to get dimensions from format name
function getDimensionsFromFormat(formatName: string): [number, number] | null {
  // Parse format like "1200x628"
  const match = formatName.match(/^(\d+)x(\d+)$/);
  if (match && match.length === 3) {
    return [parseInt(match[1]), parseInt(match[2])];
  }
  return null;
}

// Track variant positioning
let variantPositions: { x: number, y: number }[] = [];
let baseX = 0;
let baseY = 0;
let spacing = 50; // Default spacing between variants

// Reset variant positioning
function resetVariantPositioning() {
  variantPositions = [];
  baseX = 0;
  baseY = 0;
}

// Calculate positions for all variants before creating them
function calculateVariantPositions(templateNode: SceneNode, formats: string[]): { x: number, y: number }[] {
  const positions: { x: number, y: number }[] = [];
  
  // Get template position
  let templateX = 0;
  let templateY = 0;
  let templateWidth = 0;
  
  if ('x' in templateNode && 'y' in templateNode) {
    templateX = (templateNode as SceneNode & { x: number }).x;
    templateY = (templateNode as SceneNode & { y: number }).y;
    
    if ('width' in templateNode) {
      templateWidth = (templateNode as SceneNode & { width: number }).width;
    }
  }
  
  // Set the base position (to the right of the template)
  baseX = templateX + templateWidth + 200; // Start 200px to the right of the template
  baseY = templateY;
  
  // Calculate position for each variant with equal spacing
  let currentX = baseX;
  const equalSpacing = 300; // Increased spacing between variants to 300px
  
  // Calculate estimated widths for each format to ensure no overlap
  const estimatedWidths: number[] = formats.map(format => {
    const dimensions = getDimensionsFromFormat(format);
    return dimensions ? dimensions[0] : 300; // Default to 300px if can't parse dimensions
  });
  
  // Position each variant with enough space for its width plus spacing
  for (let i = 0; i < formats.length; i++) {
    positions.push({ x: currentX, y: baseY });
    
    // Move to next position based on this variant's width plus spacing
    const width = estimatedWidths[i];
    currentX += width + equalSpacing;
    
    postLog('POSITION_CALC', 'Format: ' + formats[i] + ', Position: ' + currentX + ', Width: ' + width);
  }
  
  return positions;
}

// Basic function to create a variant
async function generateVariant(templateNode: SceneNode, formatName: string, index: number = 0, positions?: { x: number, y: number }[]): Promise<SceneNode | null> {
  postLog('GENERATE_VARIANT', 'Creating variant for format: ' + formatName);
  
  // Check if node can be cloned
  if (!('clone' in templateNode)) {
    figma.notify('Cannot clone node of type ' + templateNode.type, { error: true });
    return null;
  }
  
  // Clone the node
  const clone = templateNode.clone();
  clone.name = templateNode.name + ' - ' + formatName;
  
  // Get dimensions for the clone
  let newWidth = 0;
  let newHeight = 0;
  
  // Resize the clone if it supports resize
  if ('resize' in clone) {
    const dimensions = getDimensionsFromFormat(formatName);
    if (dimensions) {
      newWidth = dimensions[0];
      newHeight = dimensions[1];
      postLog('RESIZE', 'Resizing to ' + newWidth + 'x' + newHeight);
      clone.resize(newWidth, newHeight);
    } else {
      postLog('RESIZE_ERROR', 'Could not parse dimensions from format: ' + formatName);
      if ('width' in clone && 'height' in clone) {
        newWidth = clone.width;
        newHeight = clone.height;
      }
    }
  } else {
    postLog('RESIZE_ERROR', 'Node does not support resize operation');
    return null;
  }
  
  // Position the clone using the pre-calculated position
  if (positions && positions.length > index && 'x' in clone && 'y' in clone) {
    const cloneWithPosition = clone as SceneNode & { x: number, y: number };
    const position = positions[index];
    
    cloneWithPosition.x = position.x;
    cloneWithPosition.y = position.y;
    
    postLog('POSITION', 'Positioned variant at x: ' + position.x + ', y: ' + position.y);
  } else {
    // Fallback positioning if no pre-calculated positions
    if ('x' in templateNode && 'y' in templateNode && 'width' in templateNode && 'x' in clone && 'y' in clone) {
      const templateWithProps = templateNode as SceneNode & { x: number, y: number, width: number };
      const cloneWithPosition = clone as SceneNode & { x: number, y: number };
      
      // Get the width of the clone for better spacing
      let cloneWidth = newWidth;
      if ('width' in clone) {
        cloneWidth = (clone as SceneNode & { width: number }).width;
      }
      
      // Position to the right of the template with spacing based on variant width
      const baseOffset = 200; // Match the 200px in calculateVariantPositions
      const variantSpacing = 300; // Match the 300px in calculateVariantPositions
      
      // For the first variant (index 0), position right of template
      // For subsequent variants, position based on index with enough space
      cloneWithPosition.x = templateWithProps.x + templateWithProps.width + baseOffset + (index * (cloneWidth + variantSpacing));
      cloneWithPosition.y = templateWithProps.y;
      
      postLog('POSITION_FALLBACK', 'Positioned variant at x: ' + cloneWithPosition.x + ', y: ' + cloneWithPosition.y + ', width: ' + cloneWidth);
    }
  }
  
  return clone;
}

// Show UI
figma.showUI(__html__, { width: 300, height: 450 });

// Log initialization
console.log('Plugin initialized');
postLog('MAIN_TS_INIT', 'Plugin initialized with basic variant generation.');

// Send a simple message to the UI
figma.ui.postMessage({ type: 'INITIALIZE_UI', message: 'Plugin initialized' });

// Message handler
figma.ui.onmessage = async (msg: Message) => {
  // Log the entire message for debugging
  console.log('Message received:', JSON.stringify(msg));
  postLog('MAIN_HANDLER', 'Received message type: ' + msg.type);
  
  if (msg.type === 'generate') {
    // Log all properties of the message
    for (const key in msg) {
      postLog('MSG_PROPERTY', key + ': ' + JSON.stringify(msg[key]));
    }
    
    // Handle variant generation
    const formatList = msg.formats ? msg.formats.join(', ') : 'none';
    postLog('GENERATE', 'Formats: ' + formatList);
    
    // Check for selectedSizes as an alternative property name
    const selectedSizes = msg.selectedSizes ? msg.selectedSizes.join(', ') : 'none';
    postLog('GENERATE', 'Selected Sizes: ' + selectedSizes);
    
    // Determine which formats to use
    const formatsToUse = msg.formats && msg.formats.length > 0 ? msg.formats : 
                        (msg.selectedSizes && msg.selectedSizes.length > 0 ? msg.selectedSizes : []);
    
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify('Please select a frame to use as template', { error: true });
      return;
    }
    
    // Use the first selected node as template
    const templateNode = selection[0];
    if (templateNode.type !== 'FRAME' && templateNode.type !== 'COMPONENT' && templateNode.type !== 'INSTANCE') {
      figma.notify('Please select a frame, component, or instance as template', { error: true });
      return;
    }
    
    // Generate variants for each format
    if (formatsToUse.length > 0) {
      // Reset variant positioning before generating new variants
      resetVariantPositioning();
      const generatedNodes: SceneNode[] = [];
      
      // Sort formats by width to create a more consistent layout
      const sortedFormats = [...formatsToUse].sort((a, b) => {
        const dimA = getDimensionsFromFormat(a);
        const dimB = getDimensionsFromFormat(b);
        if (dimA && dimB) {
          return dimA[0] - dimB[0]; // Sort by width
        }
        return 0;
      });
      
      // Pre-calculate all variant positions for equal spacing
      const positions = calculateVariantPositions(templateNode, sortedFormats);
      postLog('POSITIONS_CALCULATED', 'Pre-calculated positions for ' + sortedFormats.length + ' variants');
      
      // Generate all variants with pre-calculated positions
      for (let i = 0; i < sortedFormats.length; i++) {
        const format = sortedFormats[i];
        try {
          postLog('GENERATING', 'Creating variant for format: ' + format + ' (index: ' + i + ')');
          const variant = await generateVariant(templateNode, format, i, positions);
          if (variant) {
            generatedNodes.push(variant);
            figma.notify('Generated ' + format + ' variant');
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          figma.notify('Error generating ' + format + ': ' + message, { error: true });
          console.error('Error:', error);
        }
      }
      
      // Select all generated variants
      if (generatedNodes.length > 0) {
        figma.currentPage.selection = generatedNodes;
        figma.notify('Created ' + generatedNodes.length + ' variants');
      }
    } else {
      figma.notify('No formats selected for generation', { error: true });
    }
  } else if (msg.type === 'INITIALIZE_UI') {
    // Respond to UI initialization
    postLog('INIT_UI', 'UI initialized');
    
    // Send available formats to UI
    const availableFormats = ['1200x1200', '960x1200', '1200x628'];
    figma.ui.postMessage({
      type: 'AVAILABLE_FORMATS',
      formats: availableFormats
    });
  } else {
    // Handle other message types
    postLog('OTHER_MSG', 'Received message type: ' + msg.type);
  }
};

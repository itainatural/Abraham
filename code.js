var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/// <reference types="@figma/plugin-typings" />
// Platform-specific formats
const formatsByPlatform = {
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
const guidelines = {
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
const defaultTemplate = {
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
const supportedSizes = [
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
const defaultLayout = {
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
function generateVariants(selectedSizes) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectedFrame = getSelectedFrame();
        if (!selectedFrame) {
            throw new Error('Please select a frame to use as template');
        }
        let xOffset = selectedFrame.x + selectedFrame.width + 100; // Start 100px to the right of original
        for (const size of selectedSizes) {
            const [width, height] = size.split('x').map(Number);
            const format = guidelines.formats[size];
            if (!format)
                continue;
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
    });
}
// Show the UI
figma.showUI(__html__, { width: 240, height: 480 });
// Message handling
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (msg.type === 'generate' && msg.selectedSizes && msg.selectedSizes.length > 0) {
        try {
            const selectedFrame = getSelectedFrame();
            if (!selectedFrame) {
                throw new Error('Please select a frame to use as template');
            }
            yield generateVariants(msg.selectedSizes);
            figma.notify(`Created ${msg.selectedSizes.length} variants`);
        }
        catch (err) {
            figma.notify('Error: ' + err.message);
        }
    }
});
// Function to handle figma.currentPage.selection
function getSelectedFrame() {
    const selectedNodes = figma.currentPage.selection;
    if (selectedNodes.length !== 1 || selectedNodes[0].type !== 'FRAME') {
        return null;
    }
    return selectedNodes[0];
}
// Apply auto-layout adjustments based on knowledge base guidelines
function applyAutoLayoutRules(frame, format) {
    // Set frame size according to format
    frame.resize(format.bg.width, format.bg.height);
    // Find and update title
    const titleNode = frame.findOne(node => node.name === 'Title');
    if (titleNode) {
        titleNode.x = format.title.x || 0;
        titleNode.y = format.title.y || 0;
        titleNode.fontSize = format.title.size;
    }
    // Find and update body
    const bodyNode = frame.findOne(node => node.name === 'Body');
    if (bodyNode) {
        bodyNode.x = format.body.x || 0;
        bodyNode.y = format.body.y || 0;
        bodyNode.fontSize = format.body.size;
    }
    // Find and update CTA
    const ctaNode = frame.findOne(node => node.name === 'CTA');
    if (ctaNode) {
        ctaNode.x = format['cta-label'].x || 0;
        ctaNode.y = format['cta-label'].y || 0;
        ctaNode.fontSize = format['cta-label'].size;
    }
}
// Main function
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Initialize with default platform and sizes
            const initialPlatform = 'Demand-Gen';
            const initialSizes = formatsByPlatform[initialPlatform];
            // Initialize UI
            figma.ui.postMessage({
                type: 'init',
                platform: initialPlatform,
                selectedSizes: initialSizes
            });
            // Set up UI
            figma.showUI(__html__, { width: 320, height: 280 });
            // Handle UI messages
            figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
                if (msg.type === 'generate' && msg.selectedSizes && msg.selectedSizes.length > 0) {
                    try {
                        yield generateVariants(msg.selectedSizes);
                        figma.notify(`Created ${msg.selectedSizes.length} variants`);
                    }
                    catch (err) {
                        figma.notify('Error: ' + err.message);
                    }
                }
            });
        }
        catch (error) {
            console.error('Error in main:', error);
            figma.notify('Error initializing plugin');
            figma.closePlugin();
        }
    });
}
main().catch(error => {
    console.error('Error:', error);
    figma.notify(`Error: ${error.message}`, { error: true });
});

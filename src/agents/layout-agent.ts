/// <reference types="@figma/plugin-typings" />

import { LayoutRules } from '../db';
import { Mutation, NodeContext, ResizePolicy, LayoutMutation, DimensionMutation } from '../types';
import { postLog } from '../debug';

export async function layoutAgent(
  ctx: NodeContext,
  policy: ResizePolicy,
  rules: LayoutRules
): Promise<Mutation[]> {
  postLog('LAYOUT_AGENT', `Processing ${ctx.name} for format ${policy.targetFormat}`);
  postLog('LAYOUT_AGENT', `Context: ${JSON.stringify(ctx)}`); // Log context
  postLog('LAYOUT_AGENT', `Policy: ${JSON.stringify(policy)}`); // Log policy
  const mutations: Mutation[] = [];

  try {
    // Handle frame resizing
    if (ctx.type === 'FRAME') {
      const format = rules.formats[policy.targetFormat];
      postLog('LAYOUT_AGENT', `Retrieved format rules: ${JSON.stringify(format)}`); // Log retrieved format
      if (!format) {
        postLog('LAYOUT_AGENT', `Error: Unknown format ${policy.targetFormat}`); // Log if format is not found
        throw new Error(`Unknown format: ${policy.targetFormat}`);
      }

      // Apply new dimensions
      const dimensionMutation: DimensionMutation = {
        node_id: ctx.id,
        type: 'dimensions',
        new_dimensions: [format.bg.w, format.bg.h]
      };
      postLog('LAYOUT_AGENT', `Dimension mutation created: ${JSON.stringify(dimensionMutation)}`); // Log dimension mutation
      mutations.push(dimensionMutation);
      postLog('LAYOUT', `Resizing to ${format.bg.w}x${format.bg.h}`);

      // Apply auto-layout rules
      const layoutMutation: LayoutMutation = {
        node_id: ctx.id,
        type: 'layout',
        padding: rules.layout.autoLayout.padding,
        spacing: rules.layout.autoLayout.spacing
      };
      mutations.push(layoutMutation);
      postLog('LAYOUT', `Applied auto-layout with padding ${rules.layout.autoLayout.padding.vertical}px vertical, ${rules.layout.autoLayout.padding.horizontal}px horizontal`);
    }

    // Handle content groups
    if (ctx.type === 'GROUP' && ctx.name.includes('content-group')) {
      const groupRules = rules.layout['content-group'];
      mutations.push({
        node_id: ctx.id,
        type: 'layout',
        padding: groupRules.padding,
        spacing: groupRules.spacing
      });
    }

    // Handle CTA groups
    if (ctx.type === 'GROUP' && ctx.name.includes('cta-group')) {
      const ctaRules = rules.layout['cta-group'];
      mutations.push({
        node_id: ctx.id,
        type: 'layout',
        padding: ctaRules.padding
      });
    }

    // Recursively process children
    if (ctx.children) {
      for (const child of ctx.children) {
        const childMutations = await layoutAgent(child, policy, rules);
        mutations.push(...childMutations);
      }
    }

    return mutations;
  } catch (error) {
    console.error('Layout agent error:', error);
    throw error;
  }
}

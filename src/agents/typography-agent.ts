/// <reference types="@figma/plugin-typings" />

import { TypographyRules } from '../db';
import { Mutation, NodeContext, ResizePolicy, TypographyMutation } from '../types';
import { postLog } from '../debug';

export async function typographyAgent(
  ctx: NodeContext,
  policy: ResizePolicy,
  rules: TypographyRules
): Promise<Mutation[]> {
  postLog('TYPO', `Processing typography for ${ctx.name}`);
  const mutations: Mutation[] = [];

  try {
    // Process text nodes
    if (ctx.type === 'TEXT' && ctx.text) {
      const format = rules.formats[policy.targetFormat];
      if (!format) {
        throw new Error(`Unknown format: ${policy.targetFormat}`);
      }

      // Determine text role (title, body, cta-label)
      const role = determineTextRole(ctx);
      if (!role) {
        return mutations;
      }

      const textRules = format[role];
      const scaledFontSize = Math.max(
        policy.minFontSize,
        textRules.size * (policy.scaleContent ? calculateScaleFactor(ctx, policy) : 1)
      );

      const typographyMutation: TypographyMutation = {
        node_id: ctx.id,
        type: 'typography',
        fontSize: scaledFontSize,
        fontFamily: textRules.font,
        fontWeight: getFontWeight(textRules.weight)
      };
      mutations.push(typographyMutation);
      postLog('TYPO', `Adjusted ${role} text: ${scaledFontSize}px ${textRules.font} (weight: ${textRules.weight})`);
    }

    // Recursively process children
    if (ctx.children) {
      for (const child of ctx.children) {
        const childMutations = await typographyAgent(child, policy, rules);
        mutations.push(...childMutations);
      }
    }

    return mutations;
  } catch (error) {
    console.error('Typography agent error:', error);
    throw error;
  }
}

function determineTextRole(ctx: NodeContext): 'title' | 'body' | 'cta-label' | null {
  const name = ctx.name.toLowerCase();
  if (name.includes('title')) return 'title';
  if (name.includes('body')) return 'body';
  if (name.includes('cta')) return 'cta-label';
  return null;
}

function getFontWeight(weight: string): number {
  switch (weight.toLowerCase()) {
    case 'bold': return 700;
    case 'medium': return 500;
    case 'regular': return 400;
    case 'light': return 300;
    default: return 400;
  }
}

function calculateScaleFactor(ctx: NodeContext, policy: ResizePolicy): number {
  if (!ctx.parent || !ctx.dimensions) return 1;
  const parentNode = figma.getNodeById(ctx.parent);
  if (!parentNode || !('width' in parentNode)) return 1;
  return Math.min(parentNode.width / ctx.dimensions.width, parentNode.height / ctx.dimensions.height);
}

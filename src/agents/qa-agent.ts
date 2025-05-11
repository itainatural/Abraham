/// <reference types="@figma/plugin-typings" />

import { QARules } from '../db';
import { Mutation, QAResult } from '../types';
import { postLog } from '../debug';

export async function qaAgent(mutations: Mutation[], rules: QARules): Promise<QAResult> {
  postLog('QA', 'Starting QA checks...');
  const warnings: QAResult['warnings'] = [];
  try {
    // Check required elements
    const requiredElements = rules.validation.requiredElements;
    if (requiredElements.length > 0) {
      const missingElements = requiredElements.filter(id => !mutations.some(m => m.node_id.toLowerCase().includes(id)));
      
      if (missingElements.length > 0) {
        warnings.push({
          type: 'typography',
          message: `Missing optional elements: ${missingElements.join(', ')}`,
          node_id: 'root',
          severity: 'warning'
        });
      }
    }

    // Check text length constraints
    for (const mutation of mutations) {
      if (mutation.type === 'typography') {
        const node = figma.getNodeById(mutation.node_id);
        if (node && node.type === 'TEXT') {
          const text = node.characters;
          const role = determineTextRole(node.name);
          
          if (role && rules.validation.minTextLength[role]) {
            const minLength = rules.validation.minTextLength[role];
            const maxLength = rules.validation.maxTextLength[role];

            if (text.length < minLength) {
              warnings.push({
                type: 'typography',
                message: `Text too short for ${role}: ${text.length} chars (min: ${minLength})`,
                node_id: mutation.node_id,
                severity: 'warning'
              });
            }

            if (text.length > maxLength) {
              warnings.push({
                type: 'typography',
                message: `Text too long for ${role}: ${text.length} chars (max: ${maxLength})`,
                node_id: mutation.node_id,
                severity: 'warning'
              });
            }
          }
        }
      }
    }

    // Check for overflow issues
    const dimensionMutations = mutations.filter(m => m.type === 'dimensions') as Array<Mutation & { new_dimensions: [number, number] }>;
    for (const mutation of dimensionMutations) {
      const node = await figma.getNodeByIdAsync(mutation.node_id);
      if (node && 'width' in node) {
        if (node.width > mutation.new_dimensions[0] || node.height > mutation.new_dimensions[1]) {
          warnings.push({
            type: 'overflow',
            message: `Content may overflow in ${node.name}`,
            node_id: mutation.node_id,
            severity: 'warning'
          });
        }
      }
    }

    const qa = {
      passed: warnings.every(w => w.severity !== 'error'),
      warnings
    };
    if (qa.warnings.length) {
      postLog('WARN', qa.warnings);
    }
    postLog('QA', qa);
    return qa;
  } catch (error) {
    console.error('QA agent error:', error);
    const qa: QAResult = {
      passed: false,
      warnings: [{
        type: 'typography' as const,
        message: `QA check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        node_id: 'root',
        severity: 'error' as const
      }]
    };
    postLog('QA', qa);
    return qa;
  }
}

function determineTextRole(name: string): string | null {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('title')) return 'title';
  if (lowercaseName.includes('body')) return 'body';
  if (lowercaseName.includes('cta')) return 'cta-label';
  return null;
}

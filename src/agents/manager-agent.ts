/// <reference types="@figma/plugin-typings" />

import { getLayoutRules, getTypographyRules, getQARules } from '../db';
import { layoutAgent } from './layout-agent';
import { typographyAgent } from './typography-agent';
import { qaAgent } from './qa-agent';
import { Mutation, NodeContext, ResizePolicy, QAResult } from '../types';
import { postLog } from '../debug';

const DEV_MODE = process.env.NODE_ENV === 'development';

export async function managerAgent(
  context: NodeContext,
  policy: ResizePolicy
): Promise<{ mutations: Mutation[]; qa: QAResult }> {
  postLog('MANAGER', 'Received context & policy');
  try {
    // Load rules
    const layoutRules = getLayoutRules();
    const typographyRules = getTypographyRules();
    const qaRules = getQARules();

    // Log context in dev mode
    if (DEV_MODE) {
      console.log('Context:', context);
      console.log('Policy:', policy);
    }

    // Dispatch to specialist agents
    const layoutMutations = await layoutAgent(context, policy, layoutRules);
    postLog('LAYOUT', layoutMutations);
    const typographyMutations = await typographyAgent(context, policy, typographyRules);

    // Merge mutations (last-write wins for same node_id)
    const mutations = [...layoutMutations, ...typographyMutations]
      .reverse()
      .filter((mutation, index, self) => 
        index === self.findIndex(m => m.node_id === mutation.node_id)
      )
      .reverse();

    // Run QA checks
    const qa = await qaAgent(mutations, qaRules);

    // Log results in dev mode
    if (DEV_MODE) {
      console.log('Mutations:', mutations);
      console.log('QA Results:', qa);
    }

    return { mutations, qa };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    figma.notify(`Error in manager agent: ${message}`, { error: true });
    console.error('Manager agent error:', error);
    throw error;
  }
}

import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';

const DEFAULT_NODE_WIDTH = 220;
const DEFAULT_NODE_HEIGHT = 120;

/**
 * Returns nodes with positions computed by dagre for a horizontal (left-to-right) layout.
 */
export function getHorizontalLayout<N extends Node>(
  nodes: N[],
  edges: Edge[]
): N[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 80, ranksep: 100 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    const width =
      typeof node.measured?.width === 'number'
        ? node.measured.width
        : DEFAULT_NODE_WIDTH;
    const height =
      typeof node.measured?.height === 'number'
        ? node.measured.height
        : DEFAULT_NODE_HEIGHT;
    g.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes.map((node) => {
    const dagreNode = g.node(node.id);
    if (!dagreNode) return node;
    // Dagre gives center position; React Flow expects top-left
    return {
      ...node,
      position: {
        x: dagreNode.x - dagreNode.width / 2,
        y: dagreNode.y - dagreNode.height / 2,
      },
    };
  });
}

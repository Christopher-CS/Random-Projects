import type { Node } from '@xyflow/react';

const DEFAULT_NODE_WIDTH = 220;
const DEFAULT_NODE_HEIGHT = 120;

/** Padding between nodes when resolving collision */
const PADDING = 16;

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getNodeRect(node: Node): Rect {
  const w = typeof node.measured?.width === 'number' ? node.measured.width : DEFAULT_NODE_WIDTH;
  const h = typeof node.measured?.height === 'number' ? node.measured.height : DEFAULT_NODE_HEIGHT;
  return {
    x: node.position.x,
    y: node.position.y,
    width: w,
    height: h,
  };
}

export function rectsOverlap(a: Rect, b: Rect, padding = PADDING): boolean {
  return (
    a.x + a.width + padding > b.x &&
    b.x + b.width + padding > a.x &&
    a.y + a.height + padding > b.y &&
    b.y + b.height + padding > a.y
  );
}

/** Find the nearest position for `movingRect` so it no longer overlaps `fixedRect`. */
function resolveOverlap(movingRect: Rect, fixedRect: Rect, padding = PADDING): { x: number; y: number } {
  const overlapLeft = movingRect.x + movingRect.width + padding - fixedRect.x;
  const overlapRight = fixedRect.x + fixedRect.width + padding - movingRect.x;
  const overlapTop = movingRect.y + movingRect.height + padding - fixedRect.y;
  const overlapBottom = fixedRect.y + fixedRect.height + padding - movingRect.y;

  let dx = 0;
  let dy = 0;

  if (overlapLeft > 0 && overlapRight > 0) {
    dx = overlapLeft <= overlapRight ? -overlapLeft : overlapRight;
  }
  if (overlapTop > 0 && overlapBottom > 0) {
    dy = overlapTop <= overlapBottom ? -overlapTop : overlapBottom;
  }

  return {
    x: movingRect.x + dx,
    y: movingRect.y + dy,
  };
}

/**
 * Given the dragged node and all other nodes, return the nearest position
 * where the dragged node does not overlap any other (with padding).
 */
export function getNearestFreePosition(
  draggedNode: Node,
  allNodes: Node[]
): { x: number; y: number } {
  const others = allNodes.filter((n) => n.id !== draggedNode.id);
  let rect = getNodeRect(draggedNode);
  let position = { x: rect.x, y: rect.y };

  const maxIterations = 50;
  let iterations = 0;

  while (iterations < maxIterations) {
    let overlapping: Node | null = null;
    for (const other of others) {
      const otherRect = getNodeRect({ ...other, position: other.position });
      if (rectsOverlap(rect, otherRect)) {
        overlapping = other;
        break;
      }
    }
    if (!overlapping) break;

    const otherRect = getNodeRect({ ...overlapping, position: overlapping.position });
    position = resolveOverlap(rect, otherRect);
    rect = { ...rect, x: position.x, y: position.y };
    iterations++;
  }

  return position;
}

/** Check if the given node overlaps any other node in the list. */
export function hasOverlap(node: Node, allNodes: Node[]): boolean {
  const nodeRect = getNodeRect(node);
  return allNodes.some(
    (n) => n.id !== node.id && rectsOverlap(nodeRect, getNodeRect({ ...n, position: n.position }))
  );
}

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type OnConnect,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import {
  initialNodes,
  nodeTypes,
  NODE_TYPE_OPTIONS,
  getDefaultNodeData,
} from './nodes';
import type { AppNode } from './nodes/types';
import { initialEdges, edgeTypes } from './edges';
import { ContextMenu } from './components/ContextMenu';
import { getNearestFreePosition } from './utils/collision';
import { getHorizontalLayout } from './utils/layout';

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{
    flowPosition: { x: number; y: number };
    screenPosition: { x: number; y: number };
  } | null>(null);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => {
        // Remove any existing edge from the same source (and sourceHandle) so
        // each output handle has at most one edge; new connection replaces old.
        const sourceHandle = connection.sourceHandle ?? null;
        const withoutSameSource = eds.filter(
          (e) =>
            !(
              e.source === connection.source &&
              (e.sourceHandle ?? null) === sourceHandle
            )
        );
        return addEdge(connection, withoutSameSource);
      });
    },
    [setEdges]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, draggedNode: AppNode) => {
      setNodes((nodes) => {
        const nodesWithDroppedPosition = nodes.map((n) =>
          n.id === draggedNode.id
            ? { ...n, position: draggedNode.position }
            : n
        );
        const nearest = getNearestFreePosition(
          { ...draggedNode, position: draggedNode.position },
          nodesWithDroppedPosition
        );
        if (
          nearest.x === draggedNode.position.x &&
          nearest.y === draggedNode.position.y
        )
          return nodes;
        return nodes.map((n) =>
          n.id === draggedNode.id ? { ...n, position: nearest } : n
        );
      });
    },
    [setNodes]
  );

  const handleAddNode = useCallback(
    (nodeType: string) => {
      if (!contextMenu) return;
      const id = `${nodeType}-${Date.now()}`;
      const newNode = {
        id,
        type: nodeType,
        position: contextMenu.flowPosition,
        data: getDefaultNodeData(nodeType as (typeof NODE_TYPE_OPTIONS)[number]['type']),
      } as AppNode;
      setNodes((nds) => [...nds, newNode]);
      setContextMenu(null);
    },
    [contextMenu, setNodes]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      // Only open menu when right-clicking the pane (not on a node)
      const target = (e.target as HTMLElement) ?? document.body;
      if (target.closest?.('.react-flow__node')) return;
      e.preventDefault();
      e.stopPropagation();
      const x = 'clientX' in e ? e.clientX : 0;
      const y = 'clientY' in e ? e.clientY : 0;
      setContextMenu({
        flowPosition: screenToFlowPosition({ x, y }),
        screenPosition: { x, y },
      });
    },
    [screenToFlowPosition]
  );

  const handleLayoutHorizontal = useCallback(() => {
    setNodes((nds) => getHorizontalLayout(nds, edges));
    setTimeout(() => fitView({ padding: 0.2 }), 100);
  }, [edges, setNodes, fitView]);

  return (
    <>
      <div
        className="react-flow-wrapper"
        onContextMenu={handleContextMenu}
        style={{ width: '100vw', height: '100vh', position: 'relative' }}
      >
        <button
          type="button"
          onClick={handleLayoutHorizontal}
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 5,
            padding: '8px 12px',
            fontSize: 13,
            fontWeight: 500,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 6,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          Layout horizontal
        </button>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeDragStop={onNodeDragStop}
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneContextMenu={handleContextMenu}
          fitView
          panOnDrag={[1]}
          selectionOnDrag
          deleteKeyCode="Delete"
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>

      {contextMenu && (
        <ContextMenu
          position={contextMenu.screenPosition}
          options={NODE_TYPE_OPTIONS.map((o) => ({ type: o.type, label: o.label }))}
          onSelect={handleAddNode}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}

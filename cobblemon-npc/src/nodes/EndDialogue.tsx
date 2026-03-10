import { Handle, Position, type NodeProps } from '@xyflow/react';

import { type EndDialogueNode } from './types';

export function EndDialogueNode({
}: NodeProps<EndDialogueNode>) {

    return (
        // We add this class to use the same styles as React Flow's default nodes.
        <div className="react-flow__node-default end-dialogue-node">
            {<div className="end-dialogue-node__label">End Dialogue</div>}
            <Handle type="target" position={Position.Left} />
        </div>
    );
}

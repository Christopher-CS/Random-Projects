import { useCallback } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

import { type BasicDialogueNode } from './types';
import { useSpeakerOptions } from './useSpeakerOptions';

const character_limit = 100;

export function BasicDialogueNode({ id, data }: NodeProps<BasicDialogueNode>) {
  const { setNodes } = useReactFlow();
  const speakerOptions = useSpeakerOptions();

  const updateSpeakerId = useCallback(
    (speakerId: string) => {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, speakerId } } : n
        )
      );
    },
    [id, setNodes]
  );

  return (
    <div className="react-flow__node-default basic-dialogue-node">
      <div className="basic-dialogue-node__speaker-row">
        <label className="basic-dialogue-node__speaker-label">Speaker</label>
        <select
          value={data.speakerId ?? ''}
          onChange={(e) => updateSpeakerId(e.target.value)}
          className="basic-dialogue-node__select"
        >
          <option value="">Select speaker</option>
          {speakerOptions.map((s) => (
            <option key={s.speakerid} value={s.speakerid}>
              {s.name || s.speakerid || '—'}
            </option>
          ))}
        </select>
      </div>
      {data.label && <div className="basic-dialogue-node__label">{data.label}</div>}
      <textarea
        placeholder="Dialogue Text"
        className="basic-dialogue-node__input"
        maxLength={character_limit}
        rows={4}
      />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

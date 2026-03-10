import { useCallback } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

import { type StartDialogueNode, type Speaker } from './types';

/** Hidden ID used for the player speaker (not shown in UI). */
export const PLAYER_SPEAKER_ID = 'player';

/** Derive speaker ID from name: first word, lowercased. */
function speakerIdFromName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? '';
  return first.toLowerCase();
}

const DEFAULT_NPC: Speaker = { speakerid: '', name: '', face: 'npc' };
const DEFAULT_PLAYER: Speaker = {
  speakerid: PLAYER_SPEAKER_ID,
  name: 'Player',
  face: 'player',
};

function getSpeakers(data: StartDialogueNode['data']): [Speaker, Speaker] {
  const list = data.speakers;
  const npc =
    list?.[0] != null
      ? { ...list[0], face: 'npc' as const }
      : { ...DEFAULT_NPC };
  const player =
    list?.[1] != null
      ? { ...list[1], speakerid: PLAYER_SPEAKER_ID, face: 'player' as const }
      : { ...DEFAULT_PLAYER };
  return [npc, player];
}

export function StartDialogueNode({ id, data }: NodeProps<StartDialogueNode>) {
  const { setNodes } = useReactFlow();
  const [npc, player] = getSpeakers(data);

  const updateSpeakers = useCallback(
    (next: [Speaker, Speaker]) => {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, speakers: next } } : n
        )
      );
    },
    [id, setNodes]
  );

  const updateNpcName = useCallback(
    (name: string) => {
      updateSpeakers([
        { ...npc, name, speakerid: speakerIdFromName(name) },
        player,
      ]);
    },
    [npc, player, updateSpeakers]
  );

  return (
    <div className="react-flow__node-default start-dialogue-node">
      {data.label && <div className="start-dialogue-node__label">{data.label}</div>}

      <div className="start-dialogue-node__speakers">
        <div className="start-dialogue-node__speaker">
          <div className="start-dialogue-node__speaker-header">
            <span>NPC</span>
          </div>
          <input
            type="text"
            placeholder="Name"
            value={npc.name}
            onChange={(e) => updateNpcName(e.target.value)}
            className="start-dialogue-node__input"
          />
          <div className="start-dialogue-node__speaker-id">
            Speaker ID: <span className="start-dialogue-node__speaker-id-text">{npc.speakerid || '—'}</span>
          </div>
        </div>

        <div className="start-dialogue-node__speaker start-dialogue-node__speaker--player">
          <div className="start-dialogue-node__speaker-header">
            <span>Player</span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

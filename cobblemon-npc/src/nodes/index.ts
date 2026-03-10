import type { NodeTypes } from '@xyflow/react';

import { BasicDialogueNode } from './BasicDialogue';
import { DialogueChoiceNode } from './DialogueChoice';
import { StartDialogueNode } from './StartDialogue';
import { EndDialogueNode } from './EndDialogue';
import { PLAYER_SPEAKER_ID } from './StartDialogue';
import type { AppNode } from './types';

/** Used by the context menu to list addable node types. */
export const NODE_TYPE_OPTIONS = [
  { type: 'start-dialogue', label: 'Start Dialogue' },
  { type: 'basic-dialogue', label: 'Basic Dialogue' },
  { type: 'dialogue-choice', label: 'Dialogue Choice' },
  { type: 'end-dialogue', label: 'End Dialogue' },
] as const;

export function getDefaultNodeData(
  type: (typeof NODE_TYPE_OPTIONS)[number]['type']
): Record<string, unknown> {
  switch (type) {
    case 'start-dialogue':
      return {
        label: 'Start Dialogue',
        speakers: [
          { speakerid: '', name: '', face: 'npc' },
          { speakerid: PLAYER_SPEAKER_ID, name: 'Player', face: 'player' },
        ],
      };
    case 'basic-dialogue':
      return { label: 'Basic Dialogue', speakerId: '' };
    case 'dialogue-choice':
      return {
        label: 'Dialogue Choice',
        dialogue: '',
        speakerId: '',
        choices: [{ text: '', value: '', response: '' }],
      };
    default:
      return { label: 'Node' };
  }
}

export const initialNodes: AppNode[] = [
  {
    id: 'a',
    type: 'start-dialogue',
    position: { x: 0, y: 0 },
    data: {
      label: 'Start Dialogue',
      speakers: [
        { speakerid: '', name: '', face: 'npc' },
        { speakerid: PLAYER_SPEAKER_ID, name: 'Player', face: 'player' },
      ],
    },
  }
];

export const nodeTypes = {
  'basic-dialogue': BasicDialogueNode,
  'dialogue-choice': DialogueChoiceNode,
  'start-dialogue': StartDialogueNode,
  'end-dialogue': EndDialogueNode,
} satisfies NodeTypes;

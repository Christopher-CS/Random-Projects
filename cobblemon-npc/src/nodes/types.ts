import type { Node, BuiltInNode } from '@xyflow/react';

export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type BasicDialogueNode = Node<{ label: string; speakerId?: string }, 'basic-dialogue'>;
export type EndDialogueNode = Node<{ label: string }, 'end-dialogue'>;
export type Choice = {
  text: string;
  value: string;
  response: string;
};

export type DialogueChoiceNode = Node<
  { label?: string; dialogue?: string; speakerId?: string; choices: Choice[] },
  'dialogue-choice'
>;

/** Face option for a speaker (customize the two options as needed). */
export type SpeakerFace = 'player' | 'npc';

export type Speaker = {
  speakerid: string;
  name: string;
  face: SpeakerFace;
};

export type StartDialogueNode = Node<
  { label?: string; speakers: Speaker[] },
  'start-dialogue'
>;
export type AppNode = BuiltInNode | PositionLoggerNode | BasicDialogueNode | StartDialogueNode | DialogueChoiceNode | EndDialogueNode;

import { useReactFlow } from '@xyflow/react';
import type { Speaker } from './types';
import { PLAYER_SPEAKER_ID } from './StartDialogue';

/** Speaker option for the dropdown: NPC or Player. */
export type SpeakerOption = { speakerid: string; name: string };

/**
 * Returns exactly two options for the speaker dropdown: the NPC speaker (from the
 * first Start Dialogue node) and the Player.
 */
export function useSpeakerOptions(): SpeakerOption[] {
  const { getNodes } = useReactFlow();
  const nodes = getNodes();
  const startNodes = nodes.filter((n) => n.type === 'start-dialogue');
  const speakers = (startNodes[0]?.data as { speakers?: Speaker[] } | undefined)
    ?.speakers;

  const npc = speakers?.[0];
  const npcOption: SpeakerOption = {
    speakerid: npc?.speakerid ?? '',
    name: npc?.name?.trim() ? npc.name : 'NPC',
  };

  const playerOption: SpeakerOption = {
    speakerid: PLAYER_SPEAKER_ID,
    name: 'Player',
  };

  return [npcOption, playerOption];
}

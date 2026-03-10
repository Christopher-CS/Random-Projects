import { useCallback } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';

import { type DialogueChoiceNode, type Choice } from './types';
import { useSpeakerOptions } from './useSpeakerOptions';

const MIN_CHOICES = 1;
const MAX_CHOICES = 5;

const text_limit = 15;
const response_limit = 100;
const dialogue_limit = 200;

/** Derive value from button label: first word, lowercased. */
function valueFromText(text: string): string {
  const first = text.trim().split(/\s+/)[0] ?? '';
  return first.toLowerCase();
}

const defaultChoice: Choice = {
  text: '',
  value: '',
  response: '',
};

export function DialogueChoiceNode({ id, data }: NodeProps<DialogueChoiceNode>) {
  const { setNodes } = useReactFlow();
  const speakerOptions = useSpeakerOptions();
  const choices = data.choices?.length ? data.choices : [defaultChoice];

  const updateChoices = useCallback(
    (next: Choice[]) => {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, choices: next } } : n
        )
      );
    },
    [id, setNodes]
  );

  const addChoice = useCallback(() => {
    if (choices.length >= MAX_CHOICES) return;
    updateChoices([...choices, { ...defaultChoice }]);
  }, [choices, updateChoices]);

  const removeChoice = useCallback(
    (index: number) => {
      if (choices.length <= MIN_CHOICES) return;
      updateChoices(choices.filter((_, i) => i !== index));
    },
    [choices, updateChoices]
  );

  const updateChoice = useCallback(
    (index: number, field: keyof Choice, value: string) => {
      const next = [...choices];
      if (field === 'text') {
        next[index] = {
          ...next[index],
          text: value,
          value: valueFromText(value),
        };
      } else {
        next[index] = { ...next[index], [field]: value };
      }
      updateChoices(next);
    },
    [choices, updateChoices]
  );

  const updateDialogue = useCallback(
    (value: string) => {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, dialogue: value } } : n
        )
      );
    },
    [id, setNodes]
  );

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
    <div className="react-flow__node-default dialogue-choice-node">
      <div className="dialogue-choice-node__speaker-row">
        <label className="dialogue-choice-node__speaker-label">Speaker</label>
        <select
          value={data.speakerId ?? ''}
          onChange={(e) => updateSpeakerId(e.target.value)}
          className="dialogue-choice-node__select"
        >
          <option value="">Select speaker</option>
          {speakerOptions.map((s) => (
            <option key={s.speakerid} value={s.speakerid}>
              {s.name || s.speakerid || '—'}
            </option>
          ))}
        </select>
      </div>
      {data.label && (
        <div className="dialogue-choice-node__label">{data.label}</div>
      )}
      <textarea
        placeholder="Dialogue Text"
        value={data.dialogue ?? ''}
        onChange={(e) => updateDialogue(e.target.value)}
        className="dialogue-choice-node__input dialogue-choice-node__dialogue"
        maxLength={dialogue_limit}
        rows={2}
        style={{ marginBottom: '10px' }}
      />

      <div className="dialogue-choice-node__choices">
        {choices.map((choice, i) => (
          <div key={i} className="dialogue-choice-node__choice">
            <div className="dialogue-choice-node__choice-header">
              <span>Choice {i + 1}</span>
              {choices.length > MIN_CHOICES && (
                <button
                  type="button"
                  className="dialogue-choice-node__remove"
                  onClick={() => removeChoice(i)}
                  aria-label={`Remove choice ${i + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Text (button label)"
              value={choice.text}
              onChange={(e) => updateChoice(i, 'text', e.target.value)}
              className="dialogue-choice-node__input"
              maxLength={text_limit}
            />
            <div className="dialogue-choice-node__value">
              Value: <span className="dialogue-choice-node__value-text">{choice.value || '—'}</span>
            </div>
            <textarea
              placeholder="Response (player reply)"
              value={choice.response}
              onChange={(e) => updateChoice(i, 'response', e.target.value)}
              className="dialogue-choice-node__input dialogue-choice-node__textarea"
              maxLength={response_limit}
              rows={2}
            />
          </div>
        ))}
      </div>

      {choices.length < MAX_CHOICES && (
        <button
          type="button"
          className="button-primary dialogue-choice-node__add"
          onClick={addChoice}
        >
          Add Choice
        </button>
      )}

      <Handle type="target" position={Position.Left} />
      {/* One output handle per choice; each handle allows only one edge (enforced in onConnect) */}
      {choices.map((_, i) => (
        <Handle
          key={i}
          type="source"
          position={Position.Right}
          id={`choice-${i}`}
          style={{
            top: `${((i + 1) / (choices.length + 1)) * 100}%`,
            left: undefined,
            right: 0,
            bottom: undefined,
          }}
        />
      ))}
    </div>
  );
}

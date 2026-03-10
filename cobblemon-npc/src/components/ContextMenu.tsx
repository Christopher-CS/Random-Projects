import { useEffect } from 'react';

export type NodeTypeOption = {
  type: string;
  label: string;
};

type ContextMenuProps = {
  position: { x: number; y: number };
  options: NodeTypeOption[];
  onSelect: (nodeType: string) => void;
  onClose: () => void;
};

export function ContextMenu({
  position,
  options,
  onSelect,
  onClose,
}: ContextMenuProps) {
  useEffect(() => {
    const handleClick = () => onClose();
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onClose();
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onClose]);

  return (
    <>
      <div
        className="context-menu-backdrop"
        role="presentation"
        onClick={onClose}
      />
      <div
        className="context-menu"
        style={{ left: position.x, top: position.y }}
        role="menu"
      >
        <div className="context-menu__title">Add node</div>
        {options.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            className="context-menu__item"
            onClick={() => onSelect(type)}
            role="menuitem"
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

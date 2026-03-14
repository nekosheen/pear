import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleDown} from "@fortawesome/free-solid-svg-icons/faAngleDown";

export type SelectOption = {
  value: string;
  label: string;
  title?: string;
  disabled?: boolean;
  description?: string;
  icon?: IconDefinition;
  iconTooltip?: string;
  iconColor?: string;
};

type CustomSelectProps = {
  id?: string;
  value: string | null;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  menuClassName?: string;
  optionClassName?: string;
  activeOptionClassName?: string;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  ariaLabel,
  className,
  menuClassName,
  optionClassName,
  activeOptionClassName,
}) => {
  const generatedId = useId();
  const selectId = id ?? `custom-select-${generatedId}`;
  const listboxId = `${selectId}-listbox`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex >= 0 ? selectedIndex : 0);

  useEffect(() => {
    if (selectedIndex >= 0) {
      setHighlightedIndex(selectedIndex);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isOpen]);

  const moveHighlight = (direction: 1 | -1) => {
    if (options.length === 0) return;

    let nextIndex = highlightedIndex;
    for (let i = 0; i < options.length; i += 1) {
      nextIndex = (nextIndex + direction + options.length) % options.length;
      if (!options[nextIndex].disabled) {
        setHighlightedIndex(nextIndex);
        break;
      }
    }
  };

  const commitOption = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;

    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      moveHighlight(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      moveHighlight(-1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        commitOption(highlightedIndex);
      }
      return;
    }

    if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
      return;
    }

    if (event.key === 'Tab' && isOpen) {
      setIsOpen(false);
    }
  };

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;
  const activeDescendantId = isOpen ? `${selectId}-option-${highlightedIndex}` : undefined;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        className={
          className ??
          'flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900'
        }
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={activeDescendantId}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={selectedOption ? '' : 'text-gray-500'} title={selectedOption?.title} >
          {selectedOption?.label ?? placeholder}
        </span>
        <span aria-hidden="true" className="ml-2 text-xs">
          <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={selectId}
          className={
            menuClassName ??
            'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg'
          }
        >
          {options.map((option, index) => {
            const isHighlighted = highlightedIndex === index;
            const isSelected = value === option.value;
            const optionId = `${selectId}-option-${index}`;

            return (
              <li
                id={optionId}
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                className={
                  option.disabled
                    ? 'cursor-not-allowed px-3 py-2 text-sm text-gray-400'
                    : isHighlighted
                      ? activeOptionClassName ?? 'cursor-pointer bg-blue-50 px-3 py-2 text-sm text-gray-900'
                      : optionClassName ?? 'cursor-pointer px-3 py-2 text-sm text-gray-900'
                }
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commitOption(index)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate" title={option.title}>{option.label}</div>
                    {option.description && (
                      <div className="mt-0.5 text-xs leading-4 text-gray-700">{option.description}</div>
                    )}
                  </div>

                  {option.icon && (
                    <span
                      className="mt-0.5 shrink-0 text-gray-500"
                      title={option.iconTooltip}
                      aria-label={option.iconTooltip}
                    >
                      <FontAwesomeIcon icon={option.icon} aria-hidden="true" color={option.iconColor} />
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CustomSelect, { SelectOption } from '../components/react/custom/CustomSelect';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const options: SelectOption[] = [
  {
    description:"Official mistral-large-2512 Mistral AI model",
    label:"mistral-large-latest",
    value:"mistral-large-latest",
    iconColor: "hsl(204, 80%, 40%)",
    icon: faCircleInfo,
    iconTooltip: 'temperature 0.3',
  },
  {
    value: 'mistral-medium-2505',
    label: 'mistral-medium-2505',
    description: 'multimodal model released May 2025',
  },
];

describe('CustomSelect', () => {
  it('renders placeholder and opens list on click', () => {
    render(
      <CustomSelect
        value={null}
        options={options}
        onChange={vi.fn()}
        placeholder="Choose one"
      />,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Choose one')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('mistral-medium-2505')).toBeInTheDocument();
    expect(screen.getByText('multimodal model released May 2025')).toBeInTheDocument();
  });

  it('selects an option on click and calls onChange', () => {
    const onChange = vi.fn();

    render(
      <CustomSelect
        value={null}
        options={options}
        onChange={onChange}
        placeholder="Choose one"
      />,
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('mistral-large-latest'));

    expect(onChange).toHaveBeenCalledWith('mistral-large-latest');
  });

  it('renders icon tooltip when provided', () => {
    render(
      <CustomSelect
        value="mistral-large-latest"
        options={options}
        onChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByTitle('temperature 0.3')).toBeInTheDocument();
  });
});

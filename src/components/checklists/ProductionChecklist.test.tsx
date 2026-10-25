import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductionChecklist } from './ProductionChecklist';
import { ProductionChecklist as IChecklist } from '../../types';

describe('ProductionChecklist Component', () => {
  const initialChecklist: IChecklist = {
    research: true,
    scripting: true,
    recording: false,
    editing: false,
    thumbnails: false,
    captions: false,
    published: false,
  };

  it('renders progress bar and correct initial percentage', () => {
    const handleToggle = vi.fn();
    render(
      <ProductionChecklist
        contentId="c-1"
        checklist={initialChecklist}
        onToggle={handleToggle}
      />
    );

    // 2 out of 7 completed = 29%
    expect(screen.getByText('29% Done (2/7)')).toBeInTheDocument();
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '29');
  });

  it('renders all 7 production milestones', () => {
    const handleToggle = vi.fn();
    render(
      <ProductionChecklist
        contentId="c-1"
        checklist={initialChecklist}
        onToggle={handleToggle}
      />
    );

    expect(screen.getByText('Research & Angle')).toBeInTheDocument();
    expect(screen.getByText('Script & Talking Points')).toBeInTheDocument();
    expect(screen.getByText('A/B-Roll Footage')).toBeInTheDocument();
    expect(screen.getByText('Rough Cut & Sound Design')).toBeInTheDocument();
    expect(screen.getByText('Thumbnail Variants')).toBeInTheDocument();
    expect(screen.getByText('Captions & Metadata')).toBeInTheDocument();
    expect(screen.getByText('Publish to Platform')).toBeInTheDocument();
  });

  it('calls onToggle callback when clicking a milestone button', () => {
    const handleToggle = vi.fn();
    render(
      <ProductionChecklist
        contentId="c-1"
        checklist={initialChecklist}
        onToggle={handleToggle}
      />
    );

    const recordingButton = screen.getByRole('button', {
      name: /Mark A\/B-Roll Footage as completed/i,
    });
    fireEvent.click(recordingButton);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith('c-1', 'recording');
  });
});

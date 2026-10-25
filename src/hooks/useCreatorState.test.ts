import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCreatorState } from './useCreatorState';

describe('useCreatorState Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with seed data and default metrics', () => {
    const { result } = renderHook(() => useCreatorState());
    expect(result.current.state.content.length).toBeGreaterThan(0);
    expect(result.current.state.tasks.length).toBeGreaterThan(0);
    expect(result.current.state.notes.length).toBeGreaterThan(0);
    expect(result.current.state.settings.theme).toBe('dark');
    expect(result.current.metrics.totalContent).toBeGreaterThan(0);
  });

  it('adds a new content project and updates metrics', () => {
    const { result } = renderHook(() => useCreatorState());
    const initialCount = result.current.state.content.length;

    act(() => {
      result.current.addContent({
        title: 'Brand New Coding Reel',
        platform: 'instagram',
        stage: 'idea',
        dueDate: '2026-11-15',
        tags: ['React', 'CSS'],
        checklist: {
          research: false,
          scripting: false,
          recording: false,
          editing: false,
          thumbnails: false,
          captions: false,
          published: false,
        },
      });
    });

    expect(result.current.state.content.length).toBe(initialCount + 1);
    expect(result.current.state.content[0].title).toBe('Brand New Coding Reel');
    expect(result.current.state.content[0].platform).toBe('instagram');
  });

  it('updates an existing content project', () => {
    const { result } = renderHook(() => useCreatorState());
    const firstId = result.current.state.content[0].id;

    act(() => {
      result.current.updateContent(firstId, {
        title: 'Updated Video Title',
        stage: 'recording',
      });
    });

    const updated = result.current.state.content.find((c) => c.id === firstId);
    expect(updated?.title).toBe('Updated Video Title');
    expect(updated?.stage).toBe('recording');
  });

  it('toggles checklist milestones on content items', () => {
    const { result } = renderHook(() => useCreatorState());
    const firstId = result.current.state.content[0].id;
    const initialResearch = result.current.state.content[0].checklist.research;

    act(() => {
      result.current.toggleChecklistItem(firstId, 'research');
    });

    const updated = result.current.state.content.find((c) => c.id === firstId);
    expect(updated?.checklist.research).toBe(!initialResearch);
  });

  it('adds, toggles, and deletes a task', () => {
    const { result } = renderHook(() => useCreatorState());
    let newTaskId = '';

    act(() => {
      const task = result.current.addTask({
        title: 'Test Production Task',
        priority: 'urgent',
        dueDate: '2026-10-30',
        completed: false,
      });
      newTaskId = task.id;
    });

    expect(result.current.state.tasks.some((t) => t.id === newTaskId)).toBe(true);
    expect(result.current.state.tasks.find((t) => t.id === newTaskId)?.completed).toBe(false);

    // Toggle completion
    act(() => {
      result.current.toggleTaskCompletion(newTaskId);
    });
    expect(result.current.state.tasks.find((t) => t.id === newTaskId)?.completed).toBe(true);

    // Delete task
    act(() => {
      result.current.deleteTask(newTaskId);
    });
    expect(result.current.state.tasks.some((t) => t.id === newTaskId)).toBe(false);
  });

  it('updates settings and theme preference', () => {
    const { result } = renderHook(() => useCreatorState());

    act(() => {
      result.current.updateSettings({ theme: 'light', defaultPlatform: 'instagram' });
    });

    expect(result.current.state.settings.theme).toBe('light');
    expect(result.current.state.settings.defaultPlatform).toBe('instagram');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  validateStateData, 
  loadStateFromStorage, 
  saveStateToStorage, 
  STORAGE_KEY 
} from './storage';
import { createInitialSeedData } from './seedData';

describe('Storage & Validation Layer', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should validate valid seed data successfully', () => {
    const seed = createInitialSeedData();
    const result = validateStateData(seed);
    expect(result.isValid).toBe(true);
    expect(result.cleanData).toBeDefined();
    expect(result.cleanData?.content.length).toBe(seed.content.length);
  });

  it('should reject non-object data', () => {
    expect(validateStateData(null).isValid).toBe(false);
    expect(validateStateData('string data').isValid).toBe(false);
    expect(validateStateData(12345).isValid).toBe(false);
  });

  it('should reject data missing content, tasks, or notes arrays', () => {
    expect(validateStateData({ tasks: [], notes: [] }).isValid).toBe(false);
    expect(validateStateData({ content: [], notes: [] }).isValid).toBe(false);
    expect(validateStateData({ content: [], tasks: [] }).isValid).toBe(false);
  });

  it('should sanitize malformed item values safely', () => {
    const malformed = {
      content: [
        {
          id: 'test-1',
          title: 'Test Video',
          platform: 'invalid-platform', // should fallback to youtube
          stage: 'unknown-stage', // should fallback to idea
          dueDate: '2026-11-01',
          checklist: null, // should provide fallback checklist
        }
      ],
      tasks: [],
      notes: [],
    };

    const res = validateStateData(malformed);
    expect(res.isValid).toBe(true);
    expect(res.cleanData?.content[0].platform).toBe('youtube');
    expect(res.cleanData?.content[0].stage).toBe('idea');
    expect(res.cleanData?.content[0].checklist.research).toBe(false);
  });

  it('should save and load state from localStorage correctly', () => {
    const seed = createInitialSeedData();
    const saveRes = saveStateToStorage(seed);
    expect(saveRes.success).toBe(true);

    const loaded = loadStateFromStorage();
    expect(loaded.content.length).toBe(seed.content.length);
    expect(loaded.tasks.length).toBe(seed.tasks.length);
  });

  it('should recover gracefully when localStorage is empty or contains invalid JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, '{ invalid json');
    const recovered = loadStateFromStorage();
    expect(recovered).toBeDefined();
    expect(recovered.content.length).toBeGreaterThan(0);
  });
});

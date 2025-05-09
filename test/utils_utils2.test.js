import { describe, it, expect } from 'vitest';
import * as utils from '../src/utils/utils.js';

describe('utils.js (root utils)', () => {
  it('should be defined', () => {
    expect(utils).toBeDefined();
  });
}); 
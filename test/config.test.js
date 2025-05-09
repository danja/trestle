import { describe, it, expect } from 'vitest';
import config from '../src/js/config.js';

describe('config.js', () => {
  it('should be defined', () => {
    expect(config).toBeDefined();
  });
}); 
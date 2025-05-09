import { describe, it, expect } from 'vitest';
import * as errorTypes from '../src/core/errors/error-types.js';

describe('error-types.js', () => {
  it('should be defined', () => {
    expect(errorTypes).toBeDefined();
  });
}); 
import {sum} from '../Controller/sum.js'
import { describe, it, expect } from 'vitest'

describe('sum', () => {
    it('should return the sum of two numbers', () => {
        expect(sum(2, 3)).toBe(5);
        expect(sum(-1, 1)).toBe(0);
        expect(sum(0, 0)).toBe(0);
    });
});
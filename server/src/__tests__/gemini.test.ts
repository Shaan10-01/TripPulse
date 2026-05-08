import { describe, it, expect } from 'vitest';
import { sanitizeJsonResponse } from '../services/gemini';

describe('sanitizeJsonResponse', () => {
  it('should return clean JSON unchanged', () => {
    const input = '{"days": []}';
    expect(sanitizeJsonResponse(input)).toBe('{"days": []}');
  });

  it('should strip markdown code fences', () => {
    const input = '```json\n{"days": []}\n```';
    expect(sanitizeJsonResponse(input)).toBe('{"days": []}');
  });

  it('should extract JSON from surrounding text', () => {
    const input = 'Here is the response:\n{"days": [{"day": 1}]}\nEnd of response';
    const result = sanitizeJsonResponse(input);
    expect(JSON.parse(result)).toEqual({ days: [{ day: 1 }] });
  });

  it('should handle JSON arrays', () => {
    const input = '[{"id": 1}, {"id": 2}]';
    expect(sanitizeJsonResponse(input)).toBe('[{"id": 1}, {"id": 2}]');
  });

  it('should handle whitespace-padded responses', () => {
    const input = '\n\n  {"days": []}  \n\n';
    const result = sanitizeJsonResponse(input);
    expect(JSON.parse(result)).toEqual({ days: [] });
  });

  it('should handle triple backticks without json label', () => {
    const input = '```\n{"result": true}\n```';
    expect(sanitizeJsonResponse(input)).toBe('{"result": true}');
  });
});

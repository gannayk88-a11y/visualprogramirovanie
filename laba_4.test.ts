import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fsPromises from 'node:fs/promises';
import { createUser, createBook, calculateArea, getStatusColor, capitalize, trimAndUpper, getFirstElement, findById, csvToJSON, formatCSVFileToJSONFile } from './laba_4'; 

// Подменяем модуль fs/promises заглушками
vi.mock('node:fs/promises');

describe('TypeScript Lab 4 Tests', () => {
  
  // --- Тесты из Лабораторной №2 ---

  it('1. createUser should create a valid user', () => {
    const user = createUser(1, 'Ivan');
    expect(user).toEqual({ id: 1, name: 'Ivan', email: undefined, isActive: true });
  });

  it('2. createBook should return book object without optional year', () => {
    const book = { title: '1984', author: 'Orwell', genre: 'fiction' as const };
    expect(createBook(book)).toBe(book);
    expect(book.year).toBeUndefined();
  });

  it('3. calculateArea should calculate circle and square areas', () => {
    expect(calculateArea('circle', 10)).toBeCloseTo(314.15, 1);
    expect(calculateArea('square', 5)).toBe(25);
  });

  it('4. getStatusColor should return correct colors', () => {
    expect(getStatusColor('active')).toBe('green');
    expect(getStatusColor('inactive')).toBe('red');
    expect(getStatusColor('new')).toBe('blue');
  });

  it('5. StringFormatter: capitalize and trimAndUpper', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(trimAndUpper('  spaced  ', true)).toBe('SPACED');
    expect(trimAndUpper('  spaced  ', false)).toBe('spaced');
  });

  it('6. getFirstElement should work with number and string arrays', () => {
    expect(getFirstElement([10, 20])).toBe(10);
    expect(getFirstElement(['a', 'b'])).toBe('a');
    expect(getFirstElement([])).toBeUndefined();
  });

  it('7. findById should find item by id', () => {
    const items = [{ id: 1, name: 'A' }, { id: 10, name: 'B' }];
    expect(findById(items, 10)).toEqual({ id: 10, name: 'B' });
    expect(findById(items, 99)).toBeUndefined();
  });

  // --- Новые тесты для Лабораторной №3 (CSV и Mocks) ---

  it('Basic tests still work', () => {
    expect(createUser(1, 'Ivan').name).toBe('Ivan');
    expect(getFirstElement([10, 20])).toBe(10);
  });

  describe('8. csvToJSON logic', () => {
    it('should correctly convert CSV to JSON array', () => {
        const input = ["p1;p2;p3;p4", "1;A;b;c", "2;B;v;d"];
        const res = csvToJSON(input, ';');
        expect(res).toEqual([
            { p1: 1, p2: 'A', p3: 'b', p4: 'c' },
            { p1: 2, p2: 'B', p3: 'v', p4: 'd' }
        ]);
    });

    it('should throw error if row length does not match headers', () => {
        const input = ["p1;p2", "1;A", "2"];
        expect(() => csvToJSON(input, ';')).toThrow();
    });
  });

  describe('9. formatCSVFileToJSONFile with stubs', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('should use readFile and writeFile correctly', async () => {
        const mockCSVContent = "id;name\n1;Ivan";
        vi.mocked(fsPromises.readFile).mockResolvedValue(mockCSVContent);

        await formatCSVFileToJSONFile('in.csv', 'out.json', ';');

        expect(fsPromises.readFile).toHaveBeenCalled();
        expect(fsPromises.writeFile).toHaveBeenCalled();
    });
  });
});
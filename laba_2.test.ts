import { describe, it, expect } from 'vitest';
import { 
    createUser, 
    createBook, 
    calculateArea, 
    getStatusColor, 
    capitalize, 
    trimAndUpper, 
    getFirstElement, 
    findById 
} from './laba_2'; 

describe('TypeScript Lab 2 Tests', () => {
  
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
});

// laba_7.test.ts
import { describe, it, expect, vi, beforeEach, expectTypeOf } from 'vitest';
import * as fsPromises from 'node:fs/promises';
import { 
    createUser, 
    createBook, 
    calculateArea, 
    getStatusColor, 
    capitalizeString, 
    trimAndUpper, 
    getFirstElement, 
    findById, 
    csvToJSON, 
    formatCSVFileToJSONFile,
    query,
    where,
    sort,
    groupBy,
    having,
    WhereOp,
    GroupByOp,
    HavingOp,
    SortOp,
    DeepReadonly,
    PickedByType,
    EventHandlers,
    // Лаба 7
    getBookCoverBlob,
    APIBook
} from './laba_7';

vi.mock('node:fs/promises');

// Глобальный мок для fetch
global.fetch = vi.fn();

type UserData = {
    id: number;
    name: string;
    surname: string;
    age: number;
    city: string;
};

const testUsers: UserData[] = [
    { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
    { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
    { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
    { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
];

describe('TypeScript Comprehensive Lab Tests (1-7)', () => {

  // --- ЛАБЫ 1-3 ---
  it('1. createUser should create a valid user', () => {
    const user = createUser(1, 'Ivan');
    expect(user).toEqual({ id: 1, name: 'Ivan', email: undefined, isActive: true });
  });

  it('2. createBook should return book object', () => {
    const book = { title: '1984', author: 'Orwell', genre: 'fiction' as const };
    expect(createBook(book)).toBe(book);
  });

  it('3. calculateArea should work', () => {
    expect(calculateArea('circle', 10)).toBeCloseTo(314.15, 1);
    expect(calculateArea('square', 5)).toBe(25);
  });

  it('4. getStatusColor should return correct colors', () => {
    expect(getStatusColor('active')).toBe('green');
  });

  it('5. StringFormatter functions', () => {
    expect(capitalizeString('hello')).toBe('Hello');
    expect(trimAndUpper('  hi  ', true)).toBe('HI');
  });

  it('6. getFirstElement should work correctly', () => {
    expect(getFirstElement([10, 20])).toBe(10);
  });

  it('7. findById should find item by id', () => {
    const items = [{ id: 1, name: 'A' }];
    expect(findById(items, 1)).toEqual({ id: 1, name: 'A' });
  });

  // --- Лаба 3-CSV ---
  describe('8. csvToJSON logic', () => {
    it('should correctly convert CSV to JSON array', () => {
        const input = ["p1;p2", "1;A", "2;B"];
        expect(csvToJSON(input, ';')).toEqual([{p1: 1, p2: 'A'}, {p1: 2, p2: 'B'}]);
    });
  });

  describe('9. formatCSVFileToJSONFile', () => {
    beforeEach(() => { vi.clearAllMocks(); });
    it('should call file functions', async () => {
        vi.mocked(fsPromises.readFile).mockResolvedValue("id;name\n1;Ivan");
        await formatCSVFileToJSONFile('in.csv', 'out.json', ';');
        expect(fsPromises.readFile).toHaveBeenCalled();
        expect(fsPromises.writeFile).toHaveBeenCalled();
    });
  });

  // --- ЛАБЫ 4-5 ---
  describe('10. Query: Filtering and Sorting', () => {
    it('should filter John Doe and sort by age', () => {
        const search = query(where<UserData, 'name'>("name", "John"), sort<UserData, 'age'>("age"));
        const result = search(testUsers) as UserData[];
        expect(result[0].age).toBe(33);
    });
  });

  describe('11. Query: Grouping and Having', () => {
    it('should group by city', () => {
        const groupAndFilter = query<UserData, 'city'>(groupBy("city"), having(g => g.items.length > 1));
        expect(groupAndFilter(testUsers)).toHaveLength(2);
    });
  });

  describe('12. Type System Validation', () => {
    it('should verify strict operator types', () => {
        expectTypeOf(where<UserData, 'name'>('name', 'John')).toMatchTypeOf<WhereOp<UserData>>();
    });
  });

  // --- ЛАБА 6 ---
  describe('13. Advanced Utility Types (Lab 6)', () => {
    it('DeepReadonly should work recursively', () => {
        type User = { profile: { name: string } };
        expectTypeOf<DeepReadonly<User>>().toEqualTypeOf<{ readonly profile: { readonly name: string } }>();
    });
  });

  // --- ЛАБА 7 ---
  describe('14. React BookCard & API (Lab 7)', () => {
    
    it('should verify APIBook type structure', () => {
        expectTypeOf<APIBook>().toHaveProperty('isbn');
        expectTypeOf<APIBook>().toHaveProperty('authors');
        expectTypeOf<APIBook['imageBlob']>().toMatchTypeOf<Blob | null | undefined>();
    });

    it('getBookCoverBlob should fetch and return a Blob', async () => {
        const mockBlob = new Blob(['test'], { type: 'image/jpeg' });

        // Мокаем два fetch: 1-й JSON, 2-й картинка
        vi.mocked(fetch)
            .mockResolvedValueOnce({
                json: async () => ({
                    items: [{ volumeInfo: { imageLinks: { thumbnail: 'http://img.jpg' } } }]
                })
            } as any)
            .mockResolvedValueOnce({
                blob: async () => mockBlob
            } as any);

        const result = await getBookCoverBlob('1234567890');
        expect(result).toBeInstanceOf(Blob);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

  });

});
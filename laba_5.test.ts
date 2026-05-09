import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fsPromises from 'node:fs/promises';
import { 
    createUser, 
    createBook, 
    calculateArea, 
    getStatusColor, 
    capitalize, 
    trimAndUpper, 
    getFirstElement, 
    findById, 
    csvToJSON, 
    formatCSVFileToJSONFile,
    query,
    where,
    sort,
    groupBy,
    having
} from './laba_5'; 

// Подменяем модуль fs/promises заглушками
vi.mock('node:fs/promises');

// Данные для тестов Лабораторной №4
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

describe('TypeScript Lab 5 Tests', () => {
  
  // --- Тесты из Лабораторной №2 ---
  it('1. createUser should create a valid user', () => {
    const user = createUser(1, 'Ivan');
    expect(user).toEqual({ id: 1, name: 'Ivan', email: undefined, isActive: true });
  });

  it('2. createBook should return book object', () => {
    const book = { title: '1984', author: 'Orwell', genre: 'fiction' as const };
    expect(createBook(book)).toBe(book);
  });

  it('3. calculateArea should calculate circle and square areas', () => {
    expect(calculateArea('circle', 10)).toBeCloseTo(314.15, 1);
    expect(calculateArea('square', 5)).toBe(25);
  });

  it('4. getStatusColor should return correct colors', () => {
    expect(getStatusColor('active')).toBe('green');
    expect(getStatusColor('inactive')).toBe('red');
  });

  it('5. StringFormatter functions', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(trimAndUpper('  hi  ', true)).toBe('HI');
  });

  it('6. getFirstElement should work correctly', () => {
    expect(getFirstElement([10, 20])).toBe(10);
  });

  it('7. findById should find item by id', () => {
    const items = [{ id: 1, name: 'A' }];
    expect(findById(items, 1)).toEqual({ id: 1, name: 'A' });
  });

  // --- Тесты из Лабораторной №3 ---
  describe('8. csvToJSON logic', () => {
    it('should correctly convert CSV to JSON array', () => {
        const input = ["p1;p2", "1;A", "2;B"];
        expect(csvToJSON(input, ';')).toEqual([{p1: 1, p2: 'A'}, {p1: 2, p2: 'B'}]);
    });

    it('should throw error if row length is incorrect', () => {
        expect(() => csvToJSON(["p1", "1;2"], ";")).toThrow();
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

  // --- НОВЫЕ ТЕСТЫ: Лабораторная №4 (Pipeline) ---

  describe('10. Query: Filtering and Sorting', () => {
    it('should filter John Doe and sort by age', () => {
        const search = query<UserData>(
            where("name", "John"),
            where("surname", "Doe"),
            sort("age")
        );
        const result = search(testUsers) as UserData[];
        expect(result).toHaveLength(3);
        expect(result[0].age).toBe(33); // Сортировка: сначала самый молодой
        expect(result[2].age).toBe(35);
    });
  });

  describe('11. Query: Grouping and Having', () => {
    it('should group by city and filter groups by size', () => {
        const groupAndFilter = query<UserData>(
            groupBy("city"),
            having<UserData>((group) => group.items.length > 1)
        );
        const result = groupAndFilter(testUsers) as any[];
        // NY(2) и LA(2) проходят условие > 1
        expect(result).toHaveLength(2);
        expect(result.find(g => g.key === 'NY')).toBeDefined();
    });
  });

  describe('12. Query: Complex Pipeline', () => {
    it('should combine where, groupBy and having', () => {
        const pipeline = query<UserData>(
            where("surname", "Doe"),
            groupBy("city"),
            having<UserData>((group) => group.items.some((u) => u.age > 34))
        );
        const result = pipeline(testUsers) as any[];
        // Только LA имеет пользователей Doe старше 34
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe('LA');
    });
  });

});

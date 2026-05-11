import { describe, it, expect, vi, beforeEach, expectTypeOf } from 'vitest';
import * as fsPromises from 'node:fs/promises';
import { 
    createUser, 
    createBook, 
    calculateArea, 
    getStatusColor, 
    capitalizeString, // Используем обновленное имя
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
    // Новые типы шестой лабы
    DeepReadonly,
    PickedByType,
    EventHandlers
} from './laba_7'; 

vi.mock('node:fs/promises');

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

describe('TypeScript Comprehensive Lab Tests', () => {
  
  // --- БАЗОВЫЕ ФУНКЦИИ (ЛАБЫ 1-3) ---

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
    expect(getStatusColor('inactive')).toBe('red');
    expect(getStatusColor('new')).toBe('blue');
  });

  it('5. StringFormatter functions', () => {
    expect(capitalizeString('hello')).toBe('Hello');
    expect(trimAndUpper('  hi  ', true)).toBe('HI');
  });

  it('6. getFirstElement should work correctly', () => {
    expect(getFirstElement([10, 20])).toBe(10);
    expect(getFirstElement([])).toBeUndefined();
  });

  it('7. findById should find item by id', () => {
    const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
    expect(findById(items, 1)).toEqual({ id: 1, name: 'A' });
  });

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

  // --- QUERY PIPELINE (ЛАБА 4-5) ---

  describe('10. Query: Filtering and Sorting', () => {
    it('should filter John Doe and sort by age', () => {
        const search = query(
            where<UserData, 'name'>("name", "John"),
            where<UserData, 'surname'>("surname", "Doe"),
            sort<UserData, 'age'>("age")
        );
        const result = search(testUsers) as UserData[];
        expect(result).toHaveLength(3);
        expect(result[0].age).toBe(33);
    });
  });

  describe('11. Query: Grouping and Having', () => {
    it('should group by city and filter groups by size', () => {
        const groupAndFilter = query<UserData, 'city'>(
            groupBy("city"),
            having(group => group.items.length > 1)
        );
        const result = groupAndFilter(testUsers);
        expect(result).toHaveLength(2);
    });
  });

  describe('12. Query: Complex Pipeline', () => {
    it('should combine where, groupBy and having', () => {
        const pipeline = query<UserData, 'city'>(
            where("surname", "Doe"),
            groupBy("city"),
            having(group => group.items.some(u => u.age > 34))
        );
        const result = pipeline(testUsers);
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe('LA');
    });
  });

  // --- TYPE SYSTEM VALIDATION ---

  describe('13. Type System Validation (expectTypeOf)', () => {
    it('should verify strict operator types', () => {
        expectTypeOf(where<UserData, 'name'>('name', 'John')).toMatchTypeOf<WhereOp<UserData>>();
        expectTypeOf(groupBy<UserData, 'city'>('city')).toMatchTypeOf<GroupByOp<UserData, 'city'>>();
    });
  });

  // --- НОВЫЕ ТЕСТЫ ЛАБЫ 6 (META-PROGRAMMING) ---

  describe('14. Advanced Utility Types (Lab 6)', () => {
    it('DeepReadonly should work recursively', () => {
        type User = { id: number; profile: { name: string } };
        type Expected = { 
            readonly id: number; 
            readonly profile: { readonly name: string } 
        };
        
        // Сравниваем полученный тип с ожидаемым вручную
        expectTypeOf<DeepReadonly<User>>().toEqualTypeOf<Expected>();
    });

    it('PickedByType should filter properties', () => {
        type Example = { id: number; name: string; isActive: boolean };
        // Ожидаем, что останется только id (number)
        expectTypeOf<PickedByType<Example, number>>().toEqualTypeOf<{ id: number }>();
    });

    it('EventHandlers should generate on- prefixed handlers', () => {
        type Events = { click: { x: number } };
        type ExpectedHandler = { onClick: (event: { x: number }) => void };

        expectTypeOf<EventHandlers<Events>>().toEqualTypeOf<ExpectedHandler>();
    });
  });
});

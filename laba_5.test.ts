import { describe, it, expect, vi, beforeEach, expectTypeOf } from 'vitest';
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
    having,
    WhereOp,
    GroupByOp,
    HavingOp,
    SortOp
} from './laba_5'; 

// Подменяем модуль fs/promises заглушками
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

describe('TypeScript Lab 5 Tests', () => {
  
  // --- Тесты системы типов (Задание 5) ---
  describe('13. Type System Validation (expectTypeOf)', () => {
    it('should verify strict operator types', () => {
        expectTypeOf(where<UserData, 'name'>('name', 'John')).toMatchTypeOf<WhereOp<UserData>>();
        expectTypeOf(groupBy<UserData, 'city'>('city')).toMatchTypeOf<GroupByOp<UserData, 'city'>>();
        expectTypeOf(having<UserData, 'city'>(g => g.items.length > 0)).toMatchTypeOf<HavingOp<UserData, 'city'>>();
        expectTypeOf(sort<UserData, 'age'>('age')).toMatchTypeOf<SortOp<UserData>>();
    });

    it('should verify query return types', () => {
        const q = query<UserData, 'city'>(
            where('name', 'John'),
            groupBy('city')
        );
        const result = q(testUsers);
        expectTypeOf(result).toBeArray();
        // Проверяем структуру первого элемента группы
        expectTypeOf(result[0]).toHaveProperty('items');
        expectTypeOf(result[0]).toHaveProperty('key');
    });
  });

  // --- Функциональные тесты ---

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
  });

  it('4. getStatusColor should return correct colors', () => {
    expect(getStatusColor('active')).toBe('green');
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

  // laba_5.test.ts

  describe('10. Query: Filtering and Sorting', () => {
    it('should filter John Doe and sort by age', () => {
        const search = query(
            where<UserData, 'name'>("name", "John"), // Явно добавили UserData
            where<UserData, 'surname'>("surname", "Doe"),
            sort<UserData, 'age'>("age") // Теперь ошибка 'never' исчезнет
        );
        const result = search(testUsers) as UserData[];
        expect(result).toHaveLength(3);
        expect(result[0].age).toBe(33);
    });
  });

  describe('11. Query: Grouping and Having', () => {
    it('should group by city and filter groups by size', () => {
        // Указываем K ('city') вторым параметром, если нужно
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
        // Добавляем проверку типа для обращения к .key
        const firstGroup = result[0] as any;
        expect(firstGroup.key).toBe('LA');
    });
  });
});

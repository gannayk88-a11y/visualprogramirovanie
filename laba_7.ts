import { readFile, writeFile } from 'fs/promises';

// --- Лабы 1-3 ---
export interface User { id: number; name: string; email?: string; isActive: boolean; }
export function createUser(id: number, name: string, email?: string, isActive: boolean = true): User { return { id, name, email, isActive }; }
export interface Book { title: string; author: string; year?: number; genre: 'fiction' | 'non-fiction'; }
export function createBook(book: Book): Book { return book; }
export function calculateArea(shape: 'circle', radius: number): number;
export function calculateArea(shape: 'square', side: number): number;
export function calculateArea(shape: 'circle' | 'square', value: number): number {
    return shape === 'circle' ? Math.PI * value ** 2 : value ** 2;
}
export type Status = 'active' | 'inactive' | 'new';
export function getStatusColor(status: Status): string {
    const colors: Record<string, string> = { active: 'green', inactive: 'red', new: 'blue' };
    return colors[status] || 'gray';
}
export type StringFormatter = (str: string, uppercase?: boolean) => string;
// Переименовали, чтобы не мешать встроенному Capitalize в Лабе 6
export const capitalizeString: StringFormatter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const trimAndUpper: StringFormatter = (str, uppercase = false) => {
    const t = str.trim(); return uppercase ? t.toUpperCase() : t;
};
export function getFirstElement<T>(arr: T[]): T | undefined { return arr[0]; }
export interface HasId { id: number; }
export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}
export function csvToJSON(input: string[], delimiter: string): object[] {
    if (input.length < 2) return [];
    const headers = input[0].split(delimiter);
    return input.slice(1).map((line, rowIndex) => {
        const values = line.split(delimiter);
        if (values.length !== headers.length) throw new Error(`Row ${rowIndex + 2} does not match header length`);
        const obj: any = {};
        headers.forEach((h, i) => {
            const val = values[i];
            obj[h] = isNaN(Number(val)) || val.trim() === '' ? val : Number(val);
        });
        return obj;
    });
}
export async function formatCSVFileToJSONFile(input: string, output: string, delimiter: string): Promise<void> {
    const data = await readFile(input, 'utf-8');
    const lines = data.split(/\r?\n/).filter((line: string) => line.trim() !== '');
    const jsonResult = csvToJSON(lines, delimiter);
    await writeFile(output, JSON.stringify(jsonResult, null, 2));
}

// --- Лаба 4-5 (Строгий порядок) ---
export type Group<T, K extends keyof T> = { key: T[K]; items: T[]; };

export type WhereOp<T> = ((items: T[]) => T[]) & { _stage: 'where' };
export type GroupByOp<T, K extends keyof T> = ((items: T[]) => Group<T, K>[]) & { _stage: 'groupBy' };
export type HavingOp<T, K extends keyof T> = ((groups: Group<T, K>[]) => Group<T, K>[]) & { _stage: 'having' };
export type SortOp<T> = ((items: any[]) => any[]) & { _stage: 'sort' };

export const where = <T, K extends keyof T>(key: K, value: T[K]): WhereOp<T> => 
    ((data: T[]) => data.filter((item) => item[key] === value)) as WhereOp<T>;

export const sort = <T, K extends keyof T>(key: K): SortOp<T> => 
    ((data: any[]) => [...data].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0))) as SortOp<T>;

export const groupBy = <T, K extends keyof T>(key: K): GroupByOp<T, K> => 
    ((data: T[]) => Object.values(
        data.reduce((acc, item) => {
            const k = item[key] as unknown as string;
            (acc[k] ??= { key: item[key], items: [] }).items.push(item);
            return acc;
        }, {} as Record<string, Group<T, K>>),
    )) as GroupByOp<T, K>;

export const having = <T, K extends keyof T>(predicate: (group: Group<T, K>) => boolean): HavingOp<T, K> => 
    ((groups: Group<T, K>[]) => groups.filter(predicate)) as HavingOp<T, K>;

export function query<T>(...args: WhereOp<T>[]): (data: T[]) => T[];
export function query<T>(arg1: WhereOp<T>, arg2: SortOp<T>): (data: T[]) => T[];
export function query<T>(arg1: WhereOp<T>, arg2: WhereOp<T>, arg3: SortOp<T>): (data: T[]) => T[];
export function query<T, K extends keyof T>(...args: [...WhereOp<T>[], GroupByOp<T, K>]): (data: T[]) => Group<T, K>[];
export function query<T, K extends keyof T>(arg1: GroupByOp<T, K>, ...args: (HavingOp<T, K> | SortOp<any>)[]): (data: T[]) => any[];
export function query<T, K extends keyof T>(arg1: WhereOp<T>, arg2: GroupByOp<T, K>, ...args: (HavingOp<T, K> | SortOp<any>)[]): (data: T[]) => any[];
export function query<T>(...args: any[]) {
    return (data: T[]) => args.reduce((acc, stage) => (stage as any)(acc), data);
}

// --- Лаба 6 (Meta-programming и Mapped Types) ---

// 1. DeepReadonly<T>
// Рекурсивно делает все свойства объекта и вложенных объектов только для чтения
export type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// 2. PickedByType<T, U>
// Выбирает из T только те свойства, значения которых соответствуют типу U
export type PickedByType<T, U> = {
    [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// 3. EventHandlers<T>
// Генерирует имена обработчиков (напр. 'click' -> 'onClick')
export type EventHandlers<T> = {
    [K in keyof T as K extends string ? `on${Capitalize<K>}` : never]: (event: T[K]) => void;
};

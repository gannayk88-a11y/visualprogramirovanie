import { readFile, writeFile } from 'node:fs/promises';

// --- Лабораторная 1-2 ---
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
export const capitalize: StringFormatter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const trimAndUpper: StringFormatter = (str, uppercase = false) => {
    const t = str.trim(); return uppercase ? t.toUpperCase() : t;
};
export function getFirstElement<T>(arr: T[]): T | undefined { return arr[0]; }
export interface HasId { id: number; }
export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

// --- Лабораторная 3 (CSV) ---
export function csvToJSON(input: string[], delimiter: string): object[] {
    if (input.length < 2) return [];
    const headers = input[0].split(delimiter);
    return input.slice(1).map((line, rowIndex) => {
        const values = line.split(delimiter);
        if (values.length !== headers.length) {
            throw new Error(`Row ${rowIndex + 2} does not match header length`);
        }
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
    const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');
    const jsonResult = csvToJSON(lines, delimiter);
    await writeFile(output, JSON.stringify(jsonResult, null, 2));
}

// --- ЛАБОРАТОРНАЯ 4 (Pipeline & Generics) ---

// 1. Типы преобразований
export type Transform<T, R = T> = (items: T[]) => R[];

export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

export type Group<T, K extends keyof T> = {
    key: T[K];
    items: T[];
};

export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<T, Group<T, K>>;

export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

export type Having<T> = <K extends keyof T>(
    predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

// 2. Реализация функций конвейера
export const where: Where<any> = (key, value) => (data) =>
    data.filter((item) => item[key] === value);

export const sort: Sort<any> = (key) => (data) =>
    [...data].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        return av < bv ? -1 : av > bv ? 1 : 0;
    });

export const groupBy: GroupBy<any> = (key) => (data) =>
    Object.values(
        data.reduce((acc, item) => {
            const k = item[key] as unknown as string;
            (acc[k] ??= { key: item[key], items: [] }).items.push(item);
            return acc;
        }, {} as Record<string, Group<any, any>>),
    );

export const having: Having<any> = (predicate) => (groups) =>
    groups.filter(predicate);

// 3. Функция query (конвейер)
export function query<T>(...steps: Function[]) {
    return (data: T[]) => {
        return steps.reduce((currentData, step) => step(currentData), data);
    };
}

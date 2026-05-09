import { readFile, writeFile } from 'node:fs/promises';

// --- Функции из предыдущих работ (User, Book и т.д. оставляем без изменений) ---
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
    const colors = { active: 'green', inactive: 'red', new: 'blue' };
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

// --- НОВЫЕ ФУНКЦИИ (Лаба 3) ---

export function csvToJSON(input: string[], delimiter: string): object[] {
    if (input.length < 2) return [];
    const headers = input[0].split(delimiter); // Берем ПЕРВУЮ строку массива
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

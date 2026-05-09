// 1. Интерфейс User и функция createUser
export interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

export function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return { id, name, email, isActive };
}

// 2. Интерфейс Book и функция createBook
export interface Book {
    title: string;
    author: string;
    year?: number;
    genre: 'fiction' | 'non-fiction';
}

export function createBook(book: Book): Book {
    return book;
}

// Демонстрация: объект без поля year
export const myBook = createBook({
    title: "1984",
    author: "George Orwell",
    genre: "fiction"
});

// 3. Перегрузка функции calculateArea
export function calculateArea(shape: 'circle', radius: number): number;
export function calculateArea(shape: 'square', side: number): number;
export function calculateArea(shape: 'circle' | 'square', value: number): number {
    if (shape === 'circle') {
        return Math.PI * value ** 2;
    }
    return value ** 2;
}

// 4. Тип Status и функция getStatusColor
export type Status = 'active' | 'inactive' | 'new';

export function getStatusColor(status: Status): string {
    switch (status) {
        case 'active': return 'green';
        case 'inactive': return 'red';
        case 'new': return 'blue';
        default: return 'gray'; // Добавлено для безопасности типов
    }
}

// 5. Тип функции StringFormatter и реализации
export type StringFormatter = (str: string, uppercase?: boolean) => string;

export const capitalize: StringFormatter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const trimAndUpper: StringFormatter = (str, uppercase = false) => {
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

// 6. Generic функция getFirstElement
export function getFirstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

export const firstNum = getFirstElement([10, 20, 30]); // number
export const firstStr = getFirstElement(["apple", "banana"]); // string

// 7. Generic с ограничением (Constraint) findById
export interface HasId {
    id: number;
}

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

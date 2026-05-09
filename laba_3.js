export function createUser(id, name, email, isActive = true) {
    return { id, name, email, isActive };
}
export function createBook(book) {
    return book;
}
// Демонстрация: объект без поля year
export const myBook = createBook({
    title: "1984",
    author: "George Orwell",
    genre: "fiction"
});
export function calculateArea(shape, value) {
    if (shape === 'circle') {
        return Math.PI * value ** 2;
    }
    return value ** 2;
}
export function getStatusColor(status) {
    switch (status) {
        case 'active': return 'green';
        case 'inactive': return 'red';
        case 'new': return 'blue';
    }
}
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
export const trimAndUpper = (str, uppercase = false) => {
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};
// 6. Generic функция getFirstElement
export function getFirstElement(arr) {
    return arr[0];
}
export const firstNum = getFirstElement([10, 20, 30]); // number
export const firstStr = getFirstElement(["apple", "banana"]); // string
export function findById(items, id) {
    return items.find(item => item.id === id);
}

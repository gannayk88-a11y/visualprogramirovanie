"use strict";
function createUser(id, name, email, isActive = true) {
    return { id, name, email, isActive };
}
function createBook(book) {
    return book;
}
const myBook = createBook({
    title: "1984",
    author: "George Orwell",
    genre: "fiction"
});
function calculateArea(shape, value) {
    if (shape === 'circle') {
        return Math.PI * value ** 2;
    }
    return value ** 2;
}
function getStatusColor(status) {
    switch (status) {
        case 'active': return 'green';
        case 'inactive': return 'red';
        case 'new': return 'blue';
    }
}
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const trimAndUpper = (str, uppercase = false) => {
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};
function getFirstElement(arr) {
    return arr[0];
}
const firstNum = getFirstElement([10, 20, 30]); // number
const firstStr = getFirstElement(["apple", "banana"]); // string
function findById(items, id) {
    return items.find(item => item.id === id);
}

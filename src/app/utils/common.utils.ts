export const generateId = () => {
    return `${Math.floor(Math.random() * (1000000 - 1 + 1)) + 1}`;
}
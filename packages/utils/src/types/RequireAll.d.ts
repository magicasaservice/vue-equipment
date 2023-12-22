export type RequireAll<T> = {
    [P in keyof T]-?: T[P];
};

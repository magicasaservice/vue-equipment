type PickPartial<T, K extends keyof T> = {
    [P in K]: Partial<T[P]>;
};
export type { PickPartial };

export interface SlugifyOptions {
    separator?: string;
    trim?: boolean;
    remove?: RegExp;
    strict?: boolean;
    lowercase?: boolean;
}
export declare function slugify(string: string, options?: SlugifyOptions): string;

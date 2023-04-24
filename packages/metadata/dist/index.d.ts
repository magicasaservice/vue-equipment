interface PackageManifest {
    name: string;
    display: string;
    addon?: boolean;
    author?: string;
    description?: string;
    external?: string[];
    globals?: Record<string, string>;
    manualImport?: boolean;
    deprecated?: boolean;
    submodules?: boolean;
    build?: boolean;
    iife?: boolean;
    cjs?: boolean;
    mjs?: boolean;
    dts?: boolean;
    target?: string;
    utils?: boolean;
    copy?: string[];
}
interface VueEquipmentFunction {
    name: string;
    package: string;
    importPath?: string;
    lastUpdated?: number;
    category?: string;
    description?: string;
    docs?: string;
    deprecated?: boolean;
    internal?: boolean;
    component?: boolean;
    directive?: boolean;
    external?: string;
    alias?: string[];
    related?: string[];
}
interface VueEquipmentPackage extends PackageManifest {
    dir: string;
    docs?: string;
}
interface PackageIndexes {
    packages: Record<string, VueEquipmentPackage>;
    categories: string[];
    functions: VueEquipmentFunction[];
}

declare const metadata: PackageIndexes;
declare const functions: VueEquipmentFunction[];
declare const packages: Record<string, VueEquipmentPackage>;
declare const categories: string[];
declare const functionNames: string[];
declare const categoryNames: string[];
declare const coreCategoryNames: string[];
declare const addonCategoryNames: string[];
declare function getFunction(name: string): VueEquipmentFunction | undefined;

declare function getCategories(functions: VueEquipmentFunction[]): string[];
declare function uniq<T extends any[]>(a: T): any[];

export { PackageIndexes, PackageManifest, VueEquipmentFunction, VueEquipmentPackage, addonCategoryNames, categories, categoryNames, coreCategoryNames, functionNames, functions, getCategories, getFunction, metadata, packages, uniq };

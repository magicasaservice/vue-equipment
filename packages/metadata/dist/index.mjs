var packages$1 = {
	composables: {
		name: "composables",
		display: "VueEquipment Composables",
		description: "A magic collection of Vue composables",
		dir: "packages/composables"
	}
};
var categories$1 = [
];
var functions$1 = [
	{
		name: "useEasings",
		"package": "composables",
		lastUpdated: 1682095054000,
		docs: "https://maas.egineering/vue-equipment/composables/useEasings/",
		description: "easings as functions"
	},
	{
		name: "useScrollTo",
		"package": "composables",
		lastUpdated: 1682095054000,
		docs: "https://maas.egineering/vue-equipment/composables/useScrollTo/",
		description: "scroll to element"
	}
];
var _metadata = {
	packages: packages$1,
	categories: categories$1,
	functions: functions$1
};

const categoriesOrder = ["Composables", "Plugins"];
const metadata = _metadata;
const functions = functions$1;
const packages = packages$1;
const categories = categories$1;
const functionNames = functions.map((f) => f.name);
const categoryNames = Array.from(categories).sort((a, b) => categoriesOrder.indexOf(a) - categoriesOrder.indexOf(b)).sort((a, b) => a.startsWith("@") ? 1 : b.startsWith("@") ? -1 : 0);
const coreCategoryNames = categoryNames.filter((f) => !f.startsWith("@"));
const addonCategoryNames = categoryNames.filter((f) => f.startsWith("@"));
function getFunction(name) {
  return metadata.functions.find((f) => f.name === name);
}

function getCategories(functions) {
  return uniq(
    functions.filter((i) => !i.internal).map((i) => i.category).filter(Boolean)
  ).sort(
    (a, b) => a.startsWith("@") && !b.startsWith("@") ? 1 : b.startsWith("@") && !a.startsWith("@") ? -1 : a.localeCompare(b)
  );
}
function uniq(a) {
  return Array.from(new Set(a));
}

export { addonCategoryNames, categories, categoryNames, coreCategoryNames, functionNames, functions, getCategories, getFunction, metadata, packages, uniq };

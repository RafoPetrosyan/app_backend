import Users from "../models/Users.js";
import Categories from "../models/Categories.js";
import SubCategoryLanguages from "../models/SubCategoryLanguages.js";
import CategoryLanguages from "../models/CategoryLanguages.js";
import SubCategories from "../models/SubCategories.js";

async function main() {
    await Users.sync({alter: true});
    await CategoryLanguages.sync({alter: true});
    await Categories.sync({alter: true});
    await SubCategoryLanguages.sync({alter: true});
    await SubCategories.sync({alter: true});

    process.exit(0);
}

main().catch(console.error);

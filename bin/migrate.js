import Users from "../models/Users.js";
import Categories from "../models/Categories.js";
import SubCategories from "../models/SubCategories.js";

async function main() {
    await Users.sync({alter: true});
    await Categories.sync({alter: true});
    await SubCategories.sync({alter: true});

    process.exit(0);
}

main().catch(console.error);

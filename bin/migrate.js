import Users from "../models/Users.js";


async function main() {
    await Users.sync({alter: true});

    process.exit(0);
}

main().catch(console.error);

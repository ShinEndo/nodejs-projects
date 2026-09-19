import bcrypt from "bcrypt";
import promptModule from "prompt-sync";
import { MongoClient } from "mongodb";

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(dbUrl);
let hasPasswords = false;
let passwordsCollection, authCollection;
const dbName = "passwordManager";

const main = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    authCollection = db.collection("auth");
    passwordsCollection = db.collection("passwords");
    const hashedPassword = await authCollection.findOne({ type: "auth" });
    hasPasswords = !!hashedPassword;
  } catch (error) {
    console.log("Error connecting to the database:", error);
    process.exit(1);
  }
}

const prompt = promptModule();

const saveNewPassword = async (password) => {
  const hash = bcrypt.hashSync(password, 10);
  await authCollection.insertOne({ type: "auth", hash });
  console.log("Password has been saved!");
  await showMenu();
};

const compareHashedPassword = async (password) => {
  const { hash } = await authCollection.findOne({ type: "auth" });
  if (!hash) {
    throw new Error("No stored hash found.");
  }
  return await bcrypt.compare(password, hash);
};

const promptNewPassword = () => {
  const response = prompt("Enter a main password: ");
  saveNewPassword(response);
}

const promptOldPassword = async () => {
  let verified = false;
  while(!verified) {
    const response = prompt("Enter your password: ");
    const result = await compareHashedPassword(response);
    if(result) {
      console.log("Password verified.");
      verified = true;
      showMenu();
    } else {
      console.log("Password incorrect. Try again.");
    }
  }
}

const findPasswordBySource = async () => {
  const source = prompt("Enter source name to search: ");
  const result = await passwordsCollection.findOne( { source });
  if(result) {
    console.log(`${result.source} => ${result.password}`);
  } else {
    console.log("No password saved for tah soruce.");
  }
  await showMenu();
}

const showMenu = async () => {
  console.log(`
    1. View Passwords
    2. Manage new password
    3. Verify passwod
    4. Find password by source
    5. Exit`);
  const response = prompt(">");

  switch(response) {
    case "1":
      await viewPasswords();
      break;
    case "2":
      await promptManageNewPassword();
      break;
    case "3":
      await promptOldPassword();
      break;
    case "4":
      await findPasswordBySource();
      break;
    case "5":
      process.exit();
    default:
      console.log(`That's an invalid response.`);
      showMenu();
  }
}

const viewPasswords = async () => {
  const passwords = await passwordsCollection.find({}).toArray();
  passwords.forEach(({source, password}, index) => {
    console.log(`${index + 1}. ${source} => ${password}`);
  });
  await showMenu();
}

const promptManageNewPassword = async () => {
  const source = prompt("Enter name for password: ");
  const password = prompt("Enter password to save: ");
  await passwordsCollection.findOneAndUpdate(
    { source },
    { $set: { password }},
    {
      returnDocument: "after",
      upsert: true,
    }
  );
  console.log(`Password for ${source} has been saved!`);
  showMenu();
}

await main();
if(!hasPasswords) promptNewPassword();
else promptOldPassword();
import { appendFileSync } from "fs";
import { createInterface } from "readline";

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

const readLineAsync = (question) => {
    return new Promise((resolve) => readline.question(question, resolve));
};

class Person {
    constructor(name = "", number = "", email = "") {
        this.name = name;
        this.number = number;
        this.email = email;
    }
    saveToCSV() {
        const content = `${this.name},${this.number},${this.email}\n`;
        try {
            appendFileSync("./contacts.csv", content);
            console.log(`${this.name} Saved!`);
        } catch (err) {
            console.error(err);
        }
    }
}

const startApp = async () => {
    let shouldContinue = true;
    while (shouldContinue) {
        const name = await readLineAsync("Enter your Name: ");
        const number = await readLineAsync("Enter your Number: ");
        const email = await readLineAsync("Enter your Email: ");
        const person = new Person(name, number, email);
        await person.saveToCSV();

        const response = await readLineAsync("Do you want to add another contact? (y/n): ");
        shouldContinue = response.toLowerCase() === "y";
    }
    readline.close();
};

startApp();
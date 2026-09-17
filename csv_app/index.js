import fs from "node:fs";
import { createObjectCsvWriter } from "csv-writer";
import prompt from "prompt";

prompt.start();
prompt.message = "";

const path = "./contacts.csv";
const fileExistsAndNotEmpty = fs.existsSync(path) && fs.statSync(path).size > 0;
const csvWriter = createObjectCsvWriter({
    path: path,
    append: fileExistsAndNotEmpty,
    header: [
        { id: "name", title: "Name" },
        { id: "number", title: "Number" },
        { id: "email", title: "Email" }
    ]
});

class Person {
    constructor(name = "", number = "", email = "") {
        this.name = name;
        this.number = number;
        this.email = email;
    }
    async saveToCSV() {
        try {
            const {name, number, email} = this;
            await csvWriter.writeRecords([{name, number, email}]);
            console.log(`${name} Saved!`);
        } catch (err) {
            console.error("Error saving contact: ", err);
        }
    }
}

const startApp = async () => {
    const questions = [
        {
            name: "name",
            message: "Enter your Name: "
        },
        {
            name: "number",
            message: "Enter your Number: "
        },
        {
            name: "email",
            message: "Enter your Email: "
        }
    ];
    const answers = await prompt.get(questions);
    const person = new Person(answers.name, answers.number, answers.email);
    await person.saveToCSV();

    const { again } = await prompt.get([
        { name: "again", message: "Do you want to add another contact? (y/n): " },
    ]);

    if(again.toLowerCase() === "y") await startApp();
};

startApp();
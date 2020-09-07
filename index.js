//Declares all of the requirements of node for this generator
const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");

//Makes the writeFile a promise so that it can be used asynchronously
const writeFileAsync = util.promisify(fs.writeFile);

//Prompts the user for information in the command line
function promptUser(){
    return inquirer.prompt([
        {
            type: "input",
            name: "personName",
            message: "What is your first and last name?"
        },
        {
            type: "input",
            name: "email",
            message: "What is your email address?"
        },
        {
            type: "input",
            name: "userName",
            message: "What is your Github Username?"
        },
        {
            type: "input",
            name: "title",
            message: "What is the title of your project?"
        },
        {
            type: "input",
            name: "description",
            message: "Please write a short description of your project:"
        },
        {
            type: "input",
            name: "install",
            message: "Please write the installation instructions for your project:"
        },
        {
            type: "input",
            name: "usage",
            message: "Please write the usage instructions for your project:"
        },
        {
            type: "list",
            name: "license",
            message: "Please choose a license from the list:",
            choices: ["None", "MIT", "ISC"]
        },
        {
            type: "input",
            name: "contribute",
            message: "Please write the contribution guidlines for your project:"
        },
        {
            type: "input",
            name: "test",
            message: "Please write the testing instructions for your project:"
        }
    ]);
}

//Generates the markdown code filled in with all the amswers from the terminal prompts
function generateReadme(answers){
   return `${`# ${answers.title}

   [![Github](https://img.shields.io/badge/License-${answers.license}-brightgreen)](#License)

   ## Description
   ${answers.description}

   ## Table of Contents
   * [Instalation](#Installation)
   * [Usage](#Usage)
   * [License](#License)
   * [Contributing](#Contributing)
   * [Tests](#Tests)
   * [Questions](#Questions)
   
   ## Installation
   ${answers.install}

   ## Usage
   ${answers.usage}

   ## License
   ${generateLicenseInfo(answers)}

   ## Contributing
   ${answers.contribute}
   ### Contributors
   [![Contributor Image](https://github.com/${answers.userName}.png?size=75)](https://github.com/${answers.userName})

   ## Tests
   ${answers.test}

   ## Questions
   If you have any comments, questions, or concerns about this project, please post them [here](https://github.com/${answers.userName}/${repoTitle(answers)}/issues) and I will respond as soon as I am able.

   Otherwise, you can contact me through the following means:
   * Email: ${answers.email}
   * Github: [${answers.userName}](https://github.com/${answers.userName})`}
    `
}

//Replaces the spaces in the title with dashes so that it can be added to the github url and link directly to the intended repository
function repoTitle(answers){
    answers.title = answers.title.replace(/\s+/g, "-");
    return answers.title;
}

//Generates the information on the chosen license to be added in the License section
function generateLicenseInfo(answers){
    if (answers.license === "MIT"){
        let licenseInfo = `
        MIT License

        Copyright ${currentYear()} ${answers.personName}

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
        
        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
        
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;

        return licenseInfo;

    } else if (answers.license === "ISC"){
        let licenseInfo = `
        ISC License

        Copyright ${currentYear()} ${answers.personName}

        Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
        
        THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`;

        return licenseInfo;
    } else {
        let licenseInfo = "There is no license for this project";

        return licenseInfo;
    }
}

//Returns the current year so that the copyright will be updated based off when the code is run
function currentYear(){
    let date = new Date();
    let year = date.getFullYear();
    return year;
}

//This runs the promts and the writes the necessary info to a markdown file based on the answers to the promted questions
promptUser()
.then(function(answers){
    const readMe = generateReadme(answers);

    return writeFileAsync("Readme.md", readMe)
})
.then(function(){
    console.log("Wrote to new file!");
})
.catch(function(err){
    console.log(err);
});
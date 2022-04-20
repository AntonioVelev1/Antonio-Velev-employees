const fs = require('fs');

function extractEmployees() {
    let input = fs.readFileSync('data.txt', 'utf8');
    let data = parseData(input);

    return getPair(data);
}

(function show() {
    //let pairElement = document.getElementById('pair');

    let pair = extractEmployees();
    pair.map(x => {
        console.log(`Employee with id ${x[0]} and Employee with id ${x[1]} worked together on project ${x[2]} and have ${x[3]} days together`);
    })
    //pairElement.textContent = `Employee with id ${pair[0]} and Employee with id ${pair[1]} worked together on project ${pair[2]} ${pair[3]} days`;
})();

function getPair(employees) {
    let pairs = {};
    let days = {};
    if (employees)
        employees.forEach((currentEmployee) => {

            employees.slice(employees.indexOf(currentEmployee) + 1, employees.length).forEach((nextEmployee) => {
                if (currentEmployee[0] !== nextEmployee[0]) {
                    const currentEmployeeFrom = new Date(currentEmployee[2]);
                    const currentEmployeeTo = currentEmployee[3] === 'NULL' ? new Date() : new Date(currentEmployee[3]);
                    const nextEmployeeFrom = new Date(nextEmployee[2]);
                    const nextEmployeeTo = nextEmployee[3] === 'NULL' ? new Date() : new Date(nextEmployee[3]);

                    if (currentEmployee[1] === nextEmployee[1]) {
                        if (currentEmployeeFrom <= nextEmployeeTo && nextEmployeeFrom <= currentEmployeeTo) {
                            const start = currentEmployeeFrom <= nextEmployeeFrom ? nextEmployeeFrom : currentEmployeeFrom;
                            const end = currentEmployeeTo <= nextEmployeeTo ? currentEmployeeTo : nextEmployeeTo;

                            if (end >= nextEmployeeFrom) {
                                const diffTime = Math.abs(end - start);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                const x = `${currentEmployee[0]}${nextEmployee[0]}`;
                                if (!days[x]) {
                                    Object.assign(days, { [x]: 0 });
                                }
                                days[x] = 1 * days[x] + diffDays;
                                if (!pairs[x]) {
                                    Object.assign(pairs, { [x]: [] });
                                }
                                pairs[x] = [...pairs[x], [currentEmployee[0], nextEmployee[0], currentEmployee[1], diffDays]];
                            }
                        }
                    }
                }
            });
        });

    if (Object.keys(days).length === 0) {
        throw new Error('There are no employees');
    }

    return pairs[
        Object.keys(days).reduce((a, b) =>
            days[a] > days[b] ? a : b
        )
    ];
}


function parseData(input) {
    let data = [];
    let tokens = input.split('\n');
    for (let i = 0; i < tokens.length; i++) {
        data.push(tokens[i].split(','));
    }
    return data;
}
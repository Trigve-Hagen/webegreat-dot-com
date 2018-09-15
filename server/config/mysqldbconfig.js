module.exports = {
    host: 'localhost',
    user: 'trigve',
    pass: 'password',
    name: 'troops',
    usersTable: 'users',
    usersRows: [
        { // add your rows here
            id: {
                name: 'ID',
                type: 'int', // INT, VARCHAR, TEXT ect.. standard mysql..
                null: 'no', // yes, no
                unique: 'yes'
            },
            email: {
                name: 'email',
                type: 'varchar',
                null: 'no',
                chars: '255',
                unique: 'yes'
            },
            name: {
                name: 'name',
                type: 'varchar',
                null: 'no',
                chars: '255'
            },
            password: {
                name: 'password',
                type: 'varchar',
                null: 'no',
                chars: '255'
            }
        }
    ]
};
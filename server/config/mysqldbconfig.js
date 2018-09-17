module.exports = {
    connection: {
        host: 'localhost',
        user: 'trigve',
        pass: 'password',
        name: 'troops',
    },
    tables: [
        {
            table_name: 'users',
            table_fields: [
                {
                    Field: 'userid',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'email',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'name',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'password',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'usersessions',
            table_fields: [
                {
                    Field: 'usersessionid',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'created_at',
                    Type: 'date',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'updated_at',
                    Type: 'date',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'if_deleted',
                    Type: 'int(1)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'userroles',
            table_fields: [
                {
                    Field: 'userrolesid',
                    Type: 'int',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'name',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'role',
                    Type: 'int(1)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'products',
            table_fields: [
                {
                    Field: 'productid',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'created_at',
                    Type: 'date',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'updated_at',
                    Type: 'date',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'user_id',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: 'FOR',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'name',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'description',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'image',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'price',
                    Type: 'varchar(25)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        }/*,
        {
            table_name: 'notsup',
            table_fields: [
                {
                    Field: 'notsupid',
                    Type: 'int',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'name',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'role',
                    Type: 'int(1)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        },*/
    ]
};
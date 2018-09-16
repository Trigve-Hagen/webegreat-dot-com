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
                    Field: 'ID',
                    Type: 'int(11)',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'email',
                    Type: 'varchar(255)',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'name',
                    Type: 'varchar(255)',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'password',
                    Type: 'varchar(255)',
                    Null: 'no',
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
                    Field: 'ID',
                    Type: 'int(11)',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'created_at',
                    Type: 'date',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'updated_at',
                    Type: 'date',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'if_deleted',
                    Type: 'int(1)',
                    Null: 'no',
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
                    Field: 'ID',
                    Type: 'int',
                    Null: 'no',
                    Key: 'PRI',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'name',
                    Type: 'varchar(255)',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'role',
                    Type: 'int(1)',
                    Null: 'no',
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
                    Field: 'ID',
                    Type: 'int(11)',
                    Null: 'no',
                    Key: 'PRI',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'created_at',
                    Type: 'date',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'updated_at',
                    Type: 'date',
                    Null: 'yes',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'user_id',
                    Type: 'int(11)',
                    Null: 'no',
                    Key: 'FOR',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'name',
                    Type: 'varchar(255)',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'description',
                    Type: 'varchar(255)',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'image',
                    Type: 'varchar(255)',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'price',
                    Type: 'varchar(25)',
                    Null: 'no',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        }
    ]
};
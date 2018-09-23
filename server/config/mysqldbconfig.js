module.exports = {
    connection: {
        host: 'localhost',
        user: 'trigve',
        pass: 'password',
        name: 'troops',
    },
    tables: [
        {
            table_name: 'products', // 0
            table_fields: [
                {
                    Field: 'productid',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: 'AUTO_INCREMENT'
                },
                {
                    Field: 'created_at',
                    Type: 'TIMESTAMP',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT CURRENT_TIMESTAMP',
                    Extra: ''
                },
                {
                    Field: 'updated_at',
                    Type: 'TIMESTAMP',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT CURRENT_TIMESTAMP',
                    Extra: 'ON UPDATE CURRENT_TIMESTAMP'
                },
                {
                    Field: 'user_id',
                    Type: 'int(11)',
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
        },
        {
            table_name: 'userroles', // 1
            table_fields: [
                {
                    Field: 'userrolesid',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: 'AUTO_INCREMENT'
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
            table_name: 'users', // 2
            table_fields: [
                {
                    Field: 'userid',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: 'AUTO_INCREMENT'
                },
                {
                    Field: 'created_at',
                    Type: 'TIMESTAMP',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT CURRENT_TIMESTAMP',
                    Extra: ''
                },
                {
                    Field: 'updated_at',
                    Type: 'TIMESTAMP',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT CURRENT_TIMESTAMP',
                    Extra: 'ON UPDATE CURRENT_TIMESTAMP'
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
                    Field: 'email',
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
                },
                {
                    Field: 'role',
                    Type: 'int(1)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT 1',
                    Extra: ''
                },
                {
                    Field: 'avatar',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'store_visible',
                    Type: 'int(1)',
                    Null: 'NULL',
                    Key: '',
                    Default: 'DEFAULT 0',
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'usersessions', // 3
            table_fields: [
                {
                    Field: 'usersessionid',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: 'AUTO_INCREMENT'
                },
                {
                    Field: 'user_id',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'created_at',
                    Type: 'TIMESTAMP',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT CURRENT_TIMESTAMP',
                    Extra: ''
                },
                {
                    Field: 'updated_at',
                    Type: 'TIMESTAMP',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT CURRENT_TIMESTAMP',
                    Extra: 'ON UPDATE CURRENT_TIMESTAMP'
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
            table_name: 'paypal', // 4
            table_fields: [
                 {
                    Field: 'paypalid',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: 'AUTO_INCREMENT'
                },
                {
                    Field: 'user_id',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'created_at',
                    Type: 'TIMESTAMP',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT CURRENT_TIMESTAMP',
                    Extra: ''
                },
                {
                    Field: 'updated_at',
                    Type: 'TIMESTAMP',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT CURRENT_TIMESTAMP',
                    Extra: 'ON UPDATE CURRENT_TIMESTAMP'
                },
                {
                    Field: 'username',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'password',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'signature',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'appid',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'newsletter', // 4
            table_fields: [
                 {
                    Field: 'newsletterid',
                    Type: 'int(11)',
                    Null: 'NOT NULL',
                    Key: 'PRI',
                    Default: null,
                    Extra: 'AUTO_INCREMENT'
                },
                {
                    Field: 'created_at',
                    Type: 'TIMESTAMP',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT CURRENT_TIMESTAMP',
                    Extra: ''
                },
                {
                    Field: 'updated_at',
                    Type: 'TIMESTAMP',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT CURRENT_TIMESTAMP',
                    Extra: 'ON UPDATE CURRENT_TIMESTAMP'
                },
                {
                    Field: 'email',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        }
    ]
};
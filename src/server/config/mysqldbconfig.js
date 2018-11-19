module.exports = {
    paypal_urls: {
        success: '/success',
        cancel: '/cancel',
    },
    emailer_urls: {
        signup_complete: '/signup',
        order_complete: '/orders',
        order_shipped: '/shipped',
        thank_you: '/thanks'
    },
    emailer: {
        email: 'trigve.hagen@gmail.com',
        password: 'password'
    },
    patterns: {
        names: /^[\w\s.&$!-]+$/i,
        numbers: /^[0-9]+$/,
        emails: /^[\w.]+@[\w.]+.[A-Za-z]{2,}$/,
        passwords: /^[\w\W]+$/
    },
    connection: {
        host: 'localhost',
        user: 'trigve',
        pass: 'password',
        name: 'troops',
    },
    tables: [
       {
            table_name: 'a_products', // 0
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
                },
                {
                    Field: 'menu_location',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'stock',
                    Type: 'int(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'managed_stock',
                    Type: 'int(1)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT 0',
                    Extra: ''
                },
                {
                    Field: 'sku',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'metta',
                    Type: 'TEXT',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'b_userroles', // 1
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
            table_name: 'c_users', // 2
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
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT 0',
                    Extra: ''
                },
                {
                    Field: 'shipping_address',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'shipping_city',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'shipping_state',
                    Type: 'varchar(2)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'shipping_zip',
                    Type: 'varchar(25)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'd_usersessions', // 3
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
            table_name: 'e_paypal', // 4
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
                    Field: 'mode',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'client',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'secret',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'f_orders', // 5
            table_fields: [
                 {
                    Field: 'orderid',
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
                    Field: 'name',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'email',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'shipping_address',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'shipping_city',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'shipping_state',
                    Type: 'varchar(2)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'shipping_zip',
                    Type: 'varchar(25)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'product_ids',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'number_ofs',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'prices',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'paypal_paymentid',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'if_payment_complete',
                    Type: 'int(1)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'survey_id',
                    Type: 'int(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'items',
                    Type: 'TEXT',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'g_newsletter', // 6
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
                    Field: 'email',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'h_frontmenu', // 7
            table_fields: [
                 {
                    Field: 'menuid',
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
                    Field: 'level',
                    Type: 'int(1)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'parent',
                    Type: 'varchar(255)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'description',
                    Type: 'varchar(255)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'if_product',
                    Type: 'int(1)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'if_active',
                    Type: 'int(1)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT 0',
                    Extra: ''
                },
                {
                    Field: 'if_dropdown',
                    Type: 'int(1)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT 1',
                    Extra: ''
                }
            ]
        },
        {
            table_name: 'i_survey', // 8
            table_fields: [
                 {
                    Field: 'surveyid',
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
                    Extra: ''
                },
                {
                    Field: 'iffront',
                    Type: 'int(1)',
                    Null: 'NOT NULL',
                    Key: '',
                    Default: 'DEFAULT 0',
                    Extra: ''
                },
                {
                    Field: 'stars',
                    Type: 'int(1)',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                },
                {
                    Field: 'comment',
                    Type: 'text',
                    Null: 'NULL',
                    Key: '',
                    Default: null,
                    Extra: ''
                }
            ]
        }
    ]
};

import type { LongLesson } from './longLessons';

/**
 * Long-format lessons for the 1-Month SQL course (quest prefix `sql-mastery`), taught on PostgreSQL.
 * Days follow DATABASE_30_DAYS_CONFIGS in database30DayData.ts. Written for beginners, in plain words.
 * A class is about 20-30 minutes: at least 14 minutes of teaching plus running examples, "your turn"
 * changes and check questions (see estimateLessonMinutes).
 * Every `code` sample runs on PostgreSQL in the browser (PGlite), starting from an empty database, and
 * shows exactly its `output` (checked by tests/sql_long_lessons.test.ts).
 */
const lines = (...l: string[]) => l.join('\n');

/** The Canteen project database (Days 27-28), the same data as the Canteen practice tasks. */
const CANTEEN = lines(
  'CREATE TABLE menu_items (id serial PRIMARY KEY, name text NOT NULL UNIQUE, price numeric(8,2) NOT NULL CHECK (price > 0), is_veg boolean DEFAULT true);',
  "INSERT INTO menu_items (name, price, is_veg) VALUES ('Masala dosa', 60, true), ('Veg thali', 90, true), ('Chicken biryani', 140, false), ('Tea', 15, true), ('Samosa', 20, true);",
  'CREATE TABLE canteen_orders (id serial PRIMARY KEY, student_name text NOT NULL, ordered_at timestamp DEFAULT now());',
  "INSERT INTO canteen_orders (student_name, ordered_at) VALUES ('Asha', '2026-09-28 09:10'), ('Ravi', '2026-09-28 13:05'), ('Asha', '2026-09-28 16:30'), ('Priya', '2026-09-29 12:45');",
  'CREATE TABLE canteen_order_items (order_id int REFERENCES canteen_orders(id) ON DELETE CASCADE, item_id int REFERENCES menu_items(id), quantity int CHECK (quantity > 0), PRIMARY KEY (order_id, item_id));',
  'INSERT INTO canteen_order_items VALUES (1, 1, 1), (1, 4, 2), (2, 3, 1), (2, 5, 2), (3, 4, 1), (3, 5, 1), (4, 2, 1), (4, 4, 1);'
);

/** A small shop used by the join lessons (Days 11-15). Each example starts with it, so it runs on its own. */
const MINI_SHOP = lines(
  'CREATE TABLE customers (id int PRIMARY KEY, name text, city text);',
  "INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai'), (3, 'Priya', 'Pune'), (4, 'Meera', NULL);",
  'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id), ordered_on date, status text);',
  "INSERT INTO orders VALUES (101, 1, '2026-09-01', 'delivered'), (102, 2, '2026-09-03', 'delivered'), (103, 1, '2026-09-10', 'shipped'), (104, 3, '2026-09-12', 'pending');",
  'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
  "INSERT INTO products VALUES (1, 'Notebook', 60), (2, 'Pen', 10), (3, 'Backpack', 1200), (4, 'Stapler', 150);",
  'CREATE TABLE order_items (order_id int REFERENCES orders(id), product_id int REFERENCES products(id), quantity int, PRIMARY KEY (order_id, product_id));',
  'INSERT INTO order_items VALUES (101, 1, 3), (101, 2, 10), (102, 3, 1), (103, 2, 5), (104, 1, 1);'
);

export const SQL_LONG_LESSONS: LongLesson[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 1,
    title: 'What a Database Is: Tables, Rows and Your First SELECT',
    goal: 'You can explain what a database, a table, a row, a column and a primary key are, and read data with SELECT.',
    minutes: 28,
    parts: [
      {
        title: 'What a database is, and why apps need one',
        say: [
          'Welcome to the SQL course. Every app you use keeps information somewhere: your orders on a shopping app, your messages, your bank balance, the marks on a college portal. That information has to be stored safely, found quickly, and shared by thousands of people at the same time. The program that does this job is called a database.',
          'You might think: why not just use a spreadsheet, like Excel? Spreadsheets are great for one person. But imagine ten thousand people placing orders at the same second. A spreadsheet would get confused, overwrite changes, or become very slow. A database is built for exactly that: many users, lots of data, strict rules, and fast searching.',
          'The most common kind of database is a relational database. It stores information in tables, and the tables can be linked to each other. PostgreSQL, which you will use in this course, is one of the most popular relational databases in the world. Companies like Swiggy, Zomato and many banks and startups use PostgreSQL or databases very similar to it.',
          'To talk to a relational database, you use a language called SQL. People say it as "S-Q-L" or "sequel"; both are fine. SQL stands for Structured Query Language. A query is just a question you ask the database, like "show me all orders from today". SQL reads almost like English, which makes it one of the friendliest languages to start with.',
          'SQL is also one of the most useful skills in the job market. Backend developers, data analysts, testers and even product managers use it every week. By the end of this month, you will design your own database for a college canteen and write the reports a real manager would ask for.'
        ],
        example: 'Think of a college library. Books are not thrown into one big pile. They are arranged on shelves, each book has a number, and there is a register that says who borrowed which book. Because everything is organised, the librarian can answer "who has book 42?" in seconds. A database is that well-organised library for an app\'s information.',
        code: lines(
          'CREATE TABLE students (roll_no int, name text, city text);',
          "INSERT INTO students VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai');",
          'SELECT * FROM students;'
        ),
        output: lines(' roll_no | name | city', '---------+------+--------', '       1 | Asha | Pune', '       2 | Ravi | Mumbai', '(2 rows)'),
        codeNotes: [
          { line: 1, note: 'Create a table called students with three columns. You will learn this properly tomorrow.' },
          { line: 2, note: 'Add two rows of data.' },
          { line: 3, note: 'Ask the database to show every row. This is today\'s main topic.' }
        ],
        tryIt: "Add a third student to the INSERT line, for example (3, 'Priya', 'Pune'), and run it again. The result now shows 3 rows.",
        check: {
          question: 'What is SQL?',
          options: ['A language for asking a database questions and changing its data', 'A type of spreadsheet', 'A programming language only for websites'],
          answer: 0,
          why: 'SQL is the language used to talk to relational databases: to read, add, change and delete data.'
        }
      },
      {
        title: 'Tables, rows and columns',
        say: [
          'A table looks like a grid, just like a sheet in Excel. Each table holds one kind of thing: a students table holds students, a products table holds products, an orders table holds orders. Giving each kind of thing its own table keeps the data tidy.',
          'Each column is one piece of information that every row has. In a students table, the columns might be roll number, name and city. Each column has a name and a type. The type says what kind of value it holds: a whole number, some text, a date, and so on. The database will not let you put text into a number column, which prevents many mistakes.',
          'Each row is one item: one student, one product, one order. When a new student joins, you add a row. When a student changes city, you change their row. When a student leaves, you might delete their row.',
          'The number of columns in a table is fixed when you design it, but the number of rows grows and shrinks as the app is used. A real table might have 5 columns and 50 million rows. The database is built to search those millions of rows quickly.',
          'You will hear a few other words for the same things. Some people call a table a relation, a row a record, and a column a field or attribute. They mean the same things, so do not be confused if you see them in articles or interview questions.'
        ],
        example: 'An attendance register is a table. Each line is a row: one student. The printed headings at the top, like Roll No, Name and Signature, are the columns. Every line fills in the same headings, but with different values.',
        code: lines(
          'CREATE TABLE products (id int, name text, price numeric(8,2), in_stock boolean);',
          "INSERT INTO products VALUES (1, 'Notebook', 60, true), (2, 'Pen', 10, true), (3, 'Desk lamp', 899, false);",
          'SELECT * FROM products;'
        ),
        output: lines(
          ' id | name      | price  | in_stock',
          '----+-----------+--------+----------',
          '  1 | Notebook  |  60.00 | true',
          '  2 | Pen       |  10.00 | true',
          '  3 | Desk lamp | 899.00 | false',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 1, note: 'Four columns, each with a type: a whole number, text, money with 2 decimals, and true/false.' },
          { line: 3, note: 'Numbers are lined up on the right, like in a bank statement. Text is on the left.' }
        ],
        tryIt: "Add a fourth product (4, 'Water bottle', 350, true) to the INSERT line and run it. Count the rows and the columns in the result.",
        check: {
          question: 'In a products table, what is one row?',
          options: ['One product with all its details', 'One detail, like price, for all products', 'The whole table'],
          answer: 0,
          why: 'A row is one item. A column is one detail that every item has, like price.'
        }
      },
      {
        title: 'Primary keys: one unique id for every row',
        say: [
          'Two students can have the same name. Two products can have the same price. So how does the database know exactly which row you mean? Every well-designed table has a primary key: a column whose value is different for every row. Usually it is an id number.',
          'A primary key has two rules. It must be unique, so no two rows share the same id. And it can never be empty. PostgreSQL checks both rules every time a row is added or changed. If you try to break them, it refuses and shows an error.',
          'You mark a primary key when you create the table, with the words PRIMARY KEY after the column. From then on, the database protects it for you. This is much safer than hoping every programmer and every app remembers the rule.',
          'Other tables use the primary key to point to a row. An order, for example, stores the id of the customer who placed it, not their name. Names can change or repeat; ids do not. You will see this idea, called a foreign key, on Day 10.',
          'In the example below, we try to add a second student with roll number 1. Read the error carefully. PostgreSQL tells you exactly which rule was broken, and the name of the rule, students_pkey, which means "the primary key of students".'
        ],
        example: 'Your Aadhaar number is a primary key for people in India. Thousands of people are called Rahul Sharma, but each has a different Aadhaar number, and nobody has an empty one. When an office needs to be sure they have the right person, they use the number, not the name.',
        code: lines(
          'CREATE TABLE students (roll_no int PRIMARY KEY, name text);',
          "INSERT INTO students VALUES (1, 'Asha');",
          "INSERT INTO students VALUES (1, 'Rahul');",
          'SELECT * FROM students;'
        ),
        output: '[Error] duplicate key value violates unique constraint "students_pkey"',
        codeNotes: [
          { line: 1, note: 'roll_no is the primary key: unique and never empty.' },
          { line: 3, note: 'A second row with roll_no 1 breaks the rule, so PostgreSQL refuses.' }
        ],
        tryIt: 'Change the 1 on line 3 to 2 and run it again. Now both students are added and the SELECT shows them.',
        check: {
          question: 'Which column makes the best primary key for a students table?',
          options: ['roll_no, a number that is different for every student', 'name', 'city'],
          answer: 0,
          why: 'A primary key must be unique and never empty. Names and cities can repeat, but each roll number belongs to one student.'
        }
      },
      {
        title: 'SELECT and FROM: reading data',
        say: [
          'Now the most important command in SQL: SELECT. It reads data. The simplest form is SELECT, then the columns you want, then FROM and the table name. For example: SELECT name, price FROM products. Read it as "show the name and price from products".',
          'The star, as in SELECT *, means "every column". It is handy for a quick look at a table, but in real apps you usually list the columns you need. That makes the query clearer, faster, and safer if someone adds new columns to the table later.',
          'The columns come back in the order you list them, not the order in the table. So SELECT price, name shows the price first. You can also give a column a new name in the result with AS, like SELECT name AS product. This is called an alias, and it is very useful for making results easy to read.',
          'SELECT never changes the data. It only reads it. So you can experiment with SELECT as much as you like without any risk. That makes it the perfect place to start.',
          'You can also SELECT a calculation, like price * 2, or even a value without any table, like SELECT 5 + 5. The database works it out for each row and shows the answer.'
        ],
        example: 'SELECT is like asking a shopkeeper to read out certain details from their stock book: "just tell me the item names and prices". The book stays exactly as it was; you only asked to hear part of it.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(8,2), stock int);',
          "INSERT INTO products VALUES (1, 'Notebook', 60, 120), (2, 'Pen', 10, 500), (3, 'Backpack', 1200, 15);",
          'SELECT name, price FROM products;',
          'SELECT name AS product, price * 2 AS price_for_two FROM products;'
        ),
        output: lines(
          ' name     | price',
          '----------+---------',
          ' Notebook |   60.00',
          ' Pen      |   10.00',
          ' Backpack | 1200.00',
          '(3 rows)',
          '',
          ' product  | price_for_two',
          '----------+---------------',
          ' Notebook |        120.00',
          ' Pen      |         20.00',
          ' Backpack |       2400.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Only the two columns we asked for, in that order.' },
          { line: 4, note: 'AS renames a column in the result. price * 2 is worked out for every row.' }
        ],
        tryIt: 'Add a third query: SELECT name, stock FROM products; and run it. Then try SELECT stock, name and notice the column order changes.',
        check: {
          question: 'What does SELECT name, price FROM products do?',
          options: ['Shows the name and price of every product', 'Changes the name and price of products', 'Deletes the other columns'],
          answer: 0,
          why: 'SELECT only reads. It shows the listed columns for every row and never changes the table.'
        }
      },
      {
        title: 'The rules of writing SQL',
        say: [
          'SQL has a few simple writing rules. First, keywords like SELECT and FROM can be written in capitals or small letters; PostgreSQL does not mind. Many people write keywords in capitals so they stand out from table and column names. This course does the same.',
          'Second, text values go inside single quotes, like \'Pune\'. Double quotes mean something different in PostgreSQL: they are for unusual table or column names. So always use single quotes for text. Numbers do not need quotes.',
          'Third, a statement ends with a semicolon. When you run several statements together, the semicolons tell PostgreSQL where one ends and the next begins. Forgetting one is a very common beginner mistake.',
          'Fourth, you can write a query over several lines and add spaces freely. PostgreSQL ignores extra spaces and line breaks. Putting each part of a query on its own line makes long queries much easier to read.',
          'Finally, two dashes start a comment: -- like this. PostgreSQL ignores everything after the dashes on that line. Use comments to explain why a query does something, just like comments in any other language.'
        ],
        example: 'Writing SQL is like filling in a bank form with its own rules: dates in a certain format, names in capital letters, signature in the box. Once you know the few rules, filling it in becomes automatic.',
        code: lines(
          '-- Text in single quotes, numbers without quotes',
          "select 'Hello from PostgreSQL' AS greeting, 5 + 5 AS answer;",
          '',
          'SELECT',
          "  'Pune' AS city,",
          '  2026 AS year;'
        ),
        output: lines(
          ' greeting              | answer',
          '-----------------------+--------',
          ' Hello from PostgreSQL |     10',
          '(1 row)',
          '',
          ' city | year',
          '------+------',
          ' Pune | 2026',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'A comment: PostgreSQL skips it.' },
          { line: 2, note: 'Small-letter select works too. Each value gets a name with AS.' },
          { line: 4, note: 'One query spread over three lines. The semicolon on the last line ends it.' }
        ],
        tryIt: "Change the text on line 2 to use double quotes instead of single quotes and run it. Read the error: PostgreSQL thinks \"Hello...\" is a column name. Change it back.",
        check: {
          question: 'How do you write the text Pune in a SQL query?',
          options: ["'Pune' (single quotes)", '"Pune" (double quotes)', 'Pune (no quotes)'],
          answer: 0,
          why: 'Text values use single quotes. Double quotes are for names of tables or columns, and without quotes PostgreSQL looks for a column called Pune.'
        }
      },
      {
        title: 'Putting it together: a first look at the shop',
        say: [
          'For most of this course, you will practise on a small shop database. It has customers, products, orders, and the items in each order. Today you only need the products and customers tables, but it helps to know the whole picture from the start.',
          'The example below creates a small version of those two tables and asks a few everyday questions: what is in the catalogue, and who are the customers. Every query today is a SELECT, so nothing is changed.',
          'Notice how clear the results are when you choose good column names with AS. A result called product and price is easy to read; a result with long technical names is not. Clear names matter when other people use your reports.',
          'Tomorrow you will learn to create tables yourself, with the right types and rules, instead of relying on tables that already exist. After that, you will add, change and delete rows.',
          'In today\'s practice, you will write two SELECT queries on the shop database: one that shows the name and price of every product, and one that shows every column of the customers table.'
        ],
        example: 'On your first day at a new job, before changing anything, you look around: what is on the shelves, who the regular customers are. Reading data with SELECT is looking around the shop on day one.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text, city text);',
          "INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai'), (3, 'Meera', NULL);",
          'CREATE TABLE products (id int PRIMARY KEY, name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Notebook', 'stationery', 60), (2, 'Headphones', 'electronics', 1499);",
          'SELECT name AS product, category, price FROM products;',
          'SELECT name, city FROM customers;'
        ),
        output: lines(
          ' product    | category    | price',
          '------------+-------------+---------',
          ' Notebook   | stationery  |   60.00',
          ' Headphones | electronics | 1499.00',
          '(2 rows)',
          '',
          ' name  | city',
          '-------+--------',
          ' Asha  | Pune',
          ' Ravi  | Mumbai',
          ' Meera | NULL',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'Meera\'s city is NULL: unknown. You will learn how to handle NULL on Day 4.' },
          { line: 5, note: 'A clear column name, product, instead of name.' }
        ],
        tryIt: 'Add a query that shows only the names of all products. Then add one that shows each product name next to its price with 18% GST: price * 1.18 AS with_gst.',
        check: {
          question: 'In the result, what does NULL in Meera\'s city mean?',
          options: ['The city is unknown (no value)', 'She lives in a city called NULL', 'The row has an error'],
          answer: 0,
          why: 'NULL means "no value" or "unknown". It is not text, and it is not zero.'
        }
      }
    ],
    summary: [
      'A database stores an app\'s information safely and lets many people use it at once.',
      'Data lives in tables: each row is one item, each column is one detail with a type.',
      'A primary key is a column that is unique and never empty, usually an id.',
      'SELECT columns FROM table reads data; * means every column; AS renames a column.',
      'Text uses single quotes, statements end with a semicolon, and -- starts a comment.'
    ],
    projectStep: {
      title: 'My Library: plan your first table',
      steps: [
        'This month you keep a small database of your own books, called My Library, next to the lessons.',
        'On paper, list 4 details every book in your library should have, for example id, title, author and pages.',
        'Decide which of them is the primary key, and why.',
        'In the lesson editor, write a SELECT that shows 2 made-up book titles using AS, like SELECT \'Wings of Fire\' AS title;'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 2,
    title: 'Creating Tables: Data Types and Keys',
    goal: 'You can create a table with suitable data types, NOT NULL, DEFAULT and a primary key, and remove a table.',
    minutes: 28,
    recap: 'Yesterday you learned what tables, rows, columns and primary keys are, and read data with SELECT.',
    parts: [
      {
        title: 'CREATE TABLE: designing the shape of your data',
        say: [
          'Yesterday you read from tables that already existed. Today you create your own. The command is CREATE TABLE, followed by the table name and, in brackets, one line per column: the column name and its type, separated by commas.',
          'Creating a table is a design decision. You are deciding what information the app will keep, and in what form, before any data arrives. Getting it right early saves a lot of pain later, because changing a table that already holds millions of rows is slow and risky.',
          'Table and column names are usually written in small letters with underscores between words, like order_items or joined_on. This style is called snake_case, the same as Python. It avoids problems with capital letters and spaces, which PostgreSQL treats specially.',
          'Use clear names that describe what is stored. A column called price is better than p, and a table called customers is better than data1. Your future teammates, and your future self, will thank you.',
          'After you create a table, it is empty. It has columns but no rows. You add rows with INSERT, which you will learn properly tomorrow. In today\'s examples, we add a few rows just to see the table in action.'
        ],
        example: 'Creating a table is like printing a blank form before anyone fills it in. You decide the boxes: name, date of birth, phone number. The printed form has no answers yet, but every copy that gets filled in will have exactly those boxes.',
        code: lines(
          'CREATE TABLE books (',
          '  id int,',
          '  title text,',
          '  author text,',
          '  pages int',
          ');',
          "INSERT INTO books VALUES (1, 'Wings of Fire', 'A. P. J. Abdul Kalam', 180);",
          'SELECT * FROM books;'
        ),
        output: lines(
          ' id | title         | author               | pages',
          '----+---------------+----------------------+-------',
          '  1 | Wings of Fire | A. P. J. Abdul Kalam |   180',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'The table name, then the column list in brackets.' },
          { line: 2, note: 'One column per line: a name, then a type, then a comma.' },
          { line: 5, note: 'The last column has no comma after it.' }
        ],
        tryIt: 'Add a fifth column, published int, to the table (remember the comma on the line before), and add a year like 1999 to the INSERT.',
        check: {
          question: 'What does a new table contain right after CREATE TABLE?',
          options: ['Its columns, but no rows yet', 'One empty row', 'Sample data'],
          answer: 0,
          why: 'CREATE TABLE only defines the columns. Rows are added afterwards with INSERT.'
        }
      },
      {
        title: 'Choosing data types',
        say: [
          'Every column has a data type. The type tells PostgreSQL what values are allowed, how much space to use, and how to sort and compare them. Choosing the right type is one of the most important parts of table design.',
          'For text, use text. It can hold any length, from one letter to a whole essay. For whole numbers, like a quantity or an age, use int. For money, use numeric with a precision, for example numeric(10,2): up to 10 digits in total, 2 of them after the decimal point. Never store money in the types called real or float: they store decimals only approximately, so small rounding errors creep into totals.',
          'For dates, use date, which stores a day like 2026-09-28. For a date and a time together, use timestamp. For yes-or-no values, use boolean, which is true or false.',
          'The right type protects your data. If price is numeric, nobody can store the word "cheap" in it by mistake, and you can add prices, sort them and find the average. If you stored prices as text, sorting would put 1000 before 200, because text is sorted letter by letter.',
          'When you are unsure, ask what you will do with the value. Do maths with it? A number type. Compare it with other dates? date. Just show it? text is usually fine.'
        ],
        example: 'Choosing a type is like choosing the right container in a kitchen: rice goes in a jar, milk in a bottle, eggs in a tray. Put milk in a tray and you have a mess. Put prices in a text column and you get a different kind of mess.',
        code: lines(
          'CREATE TABLE expenses (',
          '  item text,',
          '  amount numeric(10,2),',
          '  spent_on date,',
          '  is_paid boolean',
          ');',
          "INSERT INTO expenses VALUES ('Tea', 20, '2026-09-28', true), ('Rent', 8000.5, '2026-09-01', false);",
          'SELECT * FROM expenses;',
          "SELECT '1000' < '200' AS text_compare, 1000 < 200 AS number_compare;"
        ),
        output: lines(
          ' item | amount  | spent_on   | is_paid',
          '------+---------+------------+---------',
          ' Tea  |   20.00 | 2026-09-28 | true',
          ' Rent | 8000.50 | 2026-09-01 | false',
          '(2 rows)',
          '',
          ' text_compare | number_compare',
          '--------------+----------------',
          ' true         | false',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'numeric(10,2) keeps money exact, always with 2 decimal places.' },
          { line: 4, note: 'A date written as year-month-day text is turned into a real date.' },
          { line: 9, note: 'As text, "1000" comes before "200" (1 before 2). As numbers, 1000 is bigger. Types matter.' }
        ],
        tryIt: "Try inserting the text 'cheap' as an amount by adding ('Snack', 'cheap', '2026-09-28', true) to the INSERT. Read the error. Then remove it.",
        check: {
          question: 'Which type should a price column have?',
          options: ['numeric(10,2)', 'text', 'boolean'],
          answer: 0,
          why: 'numeric stores exact decimals, so money adds up correctly and can be sorted and averaged.'
        }
      },
      {
        title: 'NOT NULL and DEFAULT',
        say: [
          'By default, any column can be left empty, which stores NULL. For some columns that is fine: a customer might not tell you their city. For others it is a mistake: an order without a date, or a product without a name, makes no sense.',
          'NOT NULL after a column\'s type makes that column required. If anyone tries to add a row without it, PostgreSQL refuses with an error. This rule protects the data even if an app has a bug.',
          'DEFAULT gives a column a value automatically when none is given. For example, spent_on date DEFAULT CURRENT_DATE fills in today\'s date, and is_paid boolean DEFAULT false starts every expense as unpaid. Defaults save typing and keep data consistent.',
          'To use a default, you list only the columns you are giving in the INSERT. Any column you leave out gets its default, or NULL if it has none.',
          'You can combine rules on one column, like amount numeric(10,2) NOT NULL. The order of the words after the type does not matter, but the type always comes right after the column name.'
        ],
        example: 'A hotel check-in form has some boxes marked with a red star: name and phone are required. Other boxes are optional. And the check-in date is filled in automatically by the receptionist with today\'s date. NOT NULL is the red star; DEFAULT is the receptionist\'s automatic stamp.',
        code: lines(
          'CREATE TABLE tasks (',
          '  title text NOT NULL,',
          '  done boolean DEFAULT false,',
          "  priority text DEFAULT 'normal'",
          ');',
          "INSERT INTO tasks (title) VALUES ('Finish SQL lesson');",
          "INSERT INTO tasks (title, priority) VALUES ('Pay phone bill', 'high');",
          'SELECT * FROM tasks;',
          'INSERT INTO tasks (done) VALUES (true);'
        ),
        output: lines(
          ' title             | done  | priority',
          '-------------------+-------+----------',
          ' Finish SQL lesson | false | normal',
          ' Pay phone bill    | false | high',
          '(2 rows)',
          '',
          '[Error] null value in column "title" of relation "tasks" violates not-null constraint'
        ),
        codeNotes: [
          { line: 2, note: 'title is required.' },
          { line: 6, note: 'Only title is given, so done becomes false and priority becomes normal.' },
          { line: 9, note: 'No title: PostgreSQL refuses this row, and the run stops here with the error.' }
        ],
        tryIt: "Fix line 9 so the new task has a title: INSERT INTO tasks (title, done) VALUES ('Water plants', true); and add SELECT * FROM tasks; after it. Now you see three tasks.",
        check: {
          question: 'What does DEFAULT false do on a done column?',
          options: ['Fills in false when a new row does not give a value', 'Makes done always false', 'Stops anyone setting done'],
          answer: 0,
          why: 'A default is used only when no value is given. You can still insert or change the value yourself.'
        }
      },
      {
        title: 'Primary keys and serial ids',
        say: [
          'Yesterday you saw that every table should have a primary key. When you create a table, you mark it with PRIMARY KEY. That single phrase means "unique and never NULL", and PostgreSQL enforces both.',
          'Typing a new id for every row is annoying and error-prone: two people might pick the same number at the same moment. So PostgreSQL can create ids for you. The type serial makes a whole number column that counts up automatically: 1, 2, 3 and so on.',
          'With id serial PRIMARY KEY, you simply leave the id out of your INSERT, and PostgreSQL fills in the next number. This is the most common way to create ids in PostgreSQL tables.',
          'You may also see GENERATED ALWAYS AS IDENTITY in newer code. It does the same job as serial. Either is fine for this course; you only need to recognise them.',
          'Ids are never reused. If you delete row 3, the next new row still gets 4, not 3. That is on purpose: an old id might still be mentioned somewhere, like on an old invoice, and reusing it would cause confusion.'
        ],
        example: 'A token machine at a bank counter gives out numbers 1, 2, 3 in order. You never choose your own number, two people never get the same one, and a number is never handed out twice, even if someone leaves the queue. serial is that token machine.',
        code: lines(
          'CREATE TABLE customers (',
          '  id serial PRIMARY KEY,',
          '  name text NOT NULL,',
          '  city text',
          ');',
          "INSERT INTO customers (name, city) VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai');",
          "INSERT INTO customers (name) VALUES ('Meera');",
          'SELECT * FROM customers;'
        ),
        output: lines(
          ' id | name  | city',
          '----+-------+--------',
          '  1 | Asha  | Pune',
          '  2 | Ravi  | Mumbai',
          '  3 | Meera | NULL',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'serial counts up by itself; PRIMARY KEY makes it unique and required.' },
          { line: 6, note: 'No id in the INSERT: PostgreSQL gives 1 and 2.' },
          { line: 7, note: 'Meera gets id 3, and no city, so NULL.' }
        ],
        tryIt: "Add another INSERT for ('Karan', 'Delhi') and run it. Karan gets id 4 without you typing it.",
        check: {
          question: 'What does id serial PRIMARY KEY give you?',
          options: ['An id that PostgreSQL fills in automatically, unique for every row', 'An id you must type yourself', 'A text id'],
          answer: 0,
          why: 'serial counts up automatically, and PRIMARY KEY guarantees each id is unique and present.'
        }
      },
      {
        title: 'UNIQUE, and removing tables with DROP TABLE',
        say: [
          'Sometimes a column that is not the primary key must still be unique. An email address, a phone number or a username should belong to only one account. Add UNIQUE after the column\'s type, and PostgreSQL will refuse a second row with the same value.',
          'UNIQUE allows NULL, though. Two customers can both have no email. That is usually what you want: an unknown email is not a duplicate email. If the column is also required, write both: email text NOT NULL UNIQUE.',
          'To remove a whole table, with all its rows, use DROP TABLE and the table\'s name. Be very careful with this in real life: there is no undo button, and the data is gone. In a company, dropping a table in the live database could be a serious incident.',
          'DROP TABLE IF EXISTS does the same, but without an error if the table does not exist. You will often see it at the top of setup scripts, so they can be run again safely.',
          'In the lesson editor, every run starts with an empty database anyway, so feel free to experiment. On your laptop and at work, always double-check the table name before you press Enter on a DROP.'
        ],
        example: 'A college gives every student an email address. Two students can have the same name, but never the same college email. That email column is UNIQUE. And throwing away the whole admission register at the end of the year, with no copy, would be DROP TABLE: fast, and impossible to undo.',
        code: lines(
          'CREATE TABLE users (',
          '  id serial PRIMARY KEY,',
          '  email text NOT NULL UNIQUE',
          ');',
          "INSERT INTO users (email) VALUES ('asha@example.com');",
          'SELECT count(*) AS users_before FROM users;',
          'DROP TABLE users;',
          'DROP TABLE IF EXISTS users;',
          "SELECT 'the users table is gone' AS note;"
        ),
        output: lines(
          ' users_before',
          '--------------',
          '            1',
          '(1 row)',
          '',
          ' note',
          '-------------------------',
          ' the users table is gone',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Required and unique: every user has one email, and no two users share it.' },
          { line: 7, note: 'The whole table and its rows are removed.' },
          { line: 8, note: 'IF EXISTS: no error, even though the table is already gone.' }
        ],
        tryIt: "Before the SELECT on line 6, add a second INSERT with the same email, 'asha@example.com', and run it. Read the error about the unique rule. Then remove that line.",
        check: {
          question: 'Why add UNIQUE to an email column?',
          options: ['So two accounts can never share the same email', 'To make email required', 'To sort emails'],
          answer: 0,
          why: 'UNIQUE stops duplicates. To make the column required as well, add NOT NULL.'
        }
      },
      {
        title: 'Putting it together: the expenses table',
        say: [
          'Let us design a complete table using everything from today: an expenses table for tracking spending. Think about each column before writing it.',
          'The id should be created automatically, so id serial PRIMARY KEY. The item must always be there, so text NOT NULL. The amount is money and must be there, so numeric(10,2) NOT NULL. The date should default to today, so date DEFAULT CURRENT_DATE. And a category is optional text.',
          'After creating the table, we insert two expenses, one with a date and one without, and read them back. The first has the date we gave. The second gets the date of the day you run it, because of the default. Because that date changes every day, the example prints only whether it matches today, rather than the date itself.',
          'This is exactly the table in today\'s first practice task. The second task asks you to design a students table with a unique email and a default for marks.',
          'Tomorrow you learn to add, change and delete rows properly, including how to change many rows at once, and how to avoid the most dangerous mistake in SQL.'
        ],
        example: 'Designing a table well is like setting up a new notebook for your monthly budget: you rule the columns, write the headings, and decide which ones must always be filled. After that, every entry is quick and tidy.',
        code: lines(
          'CREATE TABLE expenses (',
          '  id serial PRIMARY KEY,',
          '  item text NOT NULL,',
          '  amount numeric(10,2) NOT NULL,',
          '  spent_on date DEFAULT CURRENT_DATE,',
          '  category text',
          ');',
          "INSERT INTO expenses (item, amount, spent_on, category) VALUES ('Rent', 8000, '2026-09-01', 'home');",
          "INSERT INTO expenses (item, amount) VALUES ('Tea', 20);",
          'SELECT id, item, amount, category, spent_on = CURRENT_DATE AS spent_today FROM expenses;'
        ),
        output: lines(
          ' id | item | amount  | category | spent_today',
          '----+------+---------+----------+-------------',
          '  1 | Rent | 8000.00 | home     | false',
          '  2 | Tea  |   20.00 | NULL     | true',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'If no date is given, today\'s date is used.' },
          { line: 9, note: 'Only item and amount: id, date and category are filled in automatically or left NULL.' },
          { line: 10, note: 'Compare the date with today, so the output is the same whichever day you run it.' }
        ],
        tryIt: 'Add spent_on to the list of columns in the last SELECT, and run it. You will see the real dates, including today\'s.',
        check: {
          question: 'Which column definition fits "the amount must always be given, and is money"?',
          options: ['amount numeric(10,2) NOT NULL', 'amount text', 'amount int DEFAULT 0'],
          answer: 0,
          why: 'numeric(10,2) stores exact money, and NOT NULL makes it required.'
        }
      }
    ],
    summary: [
      'CREATE TABLE name (column type, ...) defines a table\'s columns; it starts empty.',
      'Main types: text, int, numeric(10,2) for money, date, timestamp, boolean.',
      'NOT NULL makes a column required; DEFAULT fills in a value when none is given.',
      'id serial PRIMARY KEY creates automatic, unique ids.',
      'UNIQUE stops duplicates; DROP TABLE removes a table and its data for good.'
    ],
    projectStep: {
      title: 'My Library: create the books table',
      steps: [
        'Write CREATE TABLE books with id serial PRIMARY KEY, title text NOT NULL, author text and pages int.',
        'Add an isbn text UNIQUE column and a finished boolean DEFAULT false column.',
        'Insert 2 of your favourite books, leaving out id and finished.',
        'SELECT * FROM books and check the defaults were filled in.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 3,
    title: 'Adding, Changing and Deleting Rows',
    goal: 'You can add rows with INSERT, change them with UPDATE, remove them with DELETE, and always use WHERE safely.',
    minutes: 28,
    recap: 'Yesterday you created tables with data types, NOT NULL, DEFAULT, serial primary keys and UNIQUE.',
    parts: [
      {
        title: 'INSERT: adding rows',
        say: [
          'INSERT INTO adds new rows to a table. The clearest way to write it is to list the columns you are filling, then the values in the same order: INSERT INTO products (name, price) VALUES (\'Pen\', 10).',
          'Always listing the columns is a good habit. It makes the statement easy to read, it lets defaults fill in the columns you leave out, and it keeps working if someone adds a new column to the table later. Writing VALUES without a column list only works if you give every column in the exact table order.',
          'You can add many rows in one INSERT by separating them with commas: VALUES (\'Pen\', 10), (\'Notebook\', 60). This is faster than many separate INSERTs, and it is how data is usually loaded in bulk.',
          'Text values need single quotes. If the text itself contains an apostrophe, like Ravi\'s, you write two single quotes: \'Ravi\'\'s\'. It looks strange, but it is the standard SQL way.',
          'Every row must follow the table\'s rules: types, NOT NULL, UNIQUE and the primary key. If even one row in a multi-row INSERT breaks a rule, the whole INSERT fails and no rows are added. That all-or-nothing behaviour protects the data from half-finished changes.'
        ],
        example: 'INSERT is like adding new entries to a guest book at a wedding. Each guest writes their name, city and message on a new line, in the columns already printed on the page. Nobody rewrites the old lines.',
        code: lines(
          'CREATE TABLE products (id serial PRIMARY KEY, name text NOT NULL, category text, price numeric(10,2));',
          "INSERT INTO products (name, category, price) VALUES ('Notebook', 'stationery', 60);",
          'INSERT INTO products (name, category, price) VALUES',
          "  ('Pen', 'stationery', 10),",
          "  ('Headphones', 'electronics', 1499),",
          "  ('Ravi''s special mug', 'kitchen', 250);",
          'SELECT * FROM products;'
        ),
        output: lines(
          ' id | name               | category    | price',
          '----+--------------------+-------------+---------',
          '  1 | Notebook           | stationery  |   60.00',
          '  2 | Pen                | stationery  |   10.00',
          '  3 | Headphones         | electronics | 1499.00',
          "  4 | Ravi's special mug | kitchen     |  250.00",
          '(4 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'Columns listed, values in the same order. id is filled in automatically.' },
          { line: 3, note: 'One INSERT, three rows, separated by commas.' },
          { line: 6, note: 'Two single quotes inside text make one apostrophe.' }
        ],
        tryIt: "Add a fifth product in its own INSERT: ('Water bottle', 'kitchen', 350). Then try one with no name, like (NULL, 'kitchen', 5), and read the error.",
        check: {
          question: 'Why is it good to list the column names in an INSERT?',
          options: ['It is clearer, uses defaults for missing columns, and keeps working if new columns are added', 'It makes the INSERT faster', 'PostgreSQL requires it'],
          answer: 0,
          why: 'A column list makes the statement readable and safe when the table changes. It is optional, but a strong habit.'
        }
      },
      {
        title: 'RETURNING: seeing what you just added',
        say: [
          'When you insert a row with a serial id, you often need to know which id it got. For example, after creating an order, the app needs the new order\'s id to add its items.',
          'PostgreSQL has a handy extra called RETURNING. Add it at the end of an INSERT, with the columns you want back, and the statement shows you the new rows, just like a SELECT would.',
          'RETURNING also works with UPDATE and DELETE, which you will learn next. It shows exactly which rows were changed or removed. This is great for checking your work and for apps that need the new values.',
          'RETURNING is a PostgreSQL feature. Some other databases have their own ways of doing this, but the idea is the same everywhere: after a change, get back what changed without a second query.',
          'In the lesson editor, RETURNING is also a nice way to see the effect of a statement straight away, without writing a separate SELECT.'
        ],
        example: 'When you post a letter by speed post, the counter gives you a receipt with a tracking number. You did not choose that number, but you need it to follow your letter. RETURNING is the receipt for your new row.',
        code: lines(
          'CREATE TABLE orders (id serial PRIMARY KEY, customer text NOT NULL, status text DEFAULT \'pending\');',
          "INSERT INTO orders (customer) VALUES ('Asha') RETURNING id, status;",
          "INSERT INTO orders (customer, status) VALUES ('Ravi', 'paid'), ('Priya', 'paid') RETURNING id, customer;"
        ),
        output: lines(
          ' id | status',
          '----+---------',
          '  1 | pending',
          '(1 row)',
          '',
          ' id | customer',
          '----+----------',
          '  2 | Ravi',
          '  3 | Priya',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'RETURNING shows the new row\'s id and its default status.' },
          { line: 3, note: 'With several rows, RETURNING shows each new row.' }
        ],
        tryIt: 'Change RETURNING id, status on line 2 to RETURNING * and run it. You get every column of the new row.',
        check: {
          question: 'What does RETURNING id do at the end of an INSERT?',
          options: ['Shows the id of each new row', 'Deletes the row after inserting it', 'Checks the id is unique'],
          answer: 0,
          why: 'RETURNING shows columns of the rows that were just inserted, like a built-in SELECT of the new rows.'
        }
      },
      {
        title: 'UPDATE: changing rows',
        say: [
          'UPDATE changes values in rows that already exist. You write UPDATE, the table, SET and the new values, and then WHERE to choose which rows to change: UPDATE products SET price = 12 WHERE name = \'Pen\'.',
          'You can change several columns at once by separating them with commas: SET price = 12, stock = 400. And the new value can use the old one: SET price = price * 1.10 raises the price by 10 percent, for every row that matches the WHERE.',
          'The WHERE part is the most important part of an UPDATE. It decides which rows change. Most of the time you pick rows by their primary key, like WHERE id = 3, because that is guaranteed to match exactly one row.',
          'PostgreSQL reports how many rows were changed. If it says 0, your WHERE did not match anything, maybe because of a spelling or capital-letter difference. If the number is much bigger than you expected, something is wrong with your WHERE.',
          'Adding RETURNING to an UPDATE shows the rows with their new values. It is a very good habit while learning, because you see immediately what your statement did.',
          'Two special values are useful in SET. SET city = NULL clears a value, for example when a customer asks you to remove their city. SET status = DEFAULT puts back the default value from the table design. Both are cleaner than typing an empty text, which is not the same as NULL and can confuse later queries.'
        ],
        example: 'UPDATE is like a shopkeeper sticking new price labels on the shelf. "Increase the price of every notebook by 5 rupees" is SET price = price + 5 WHERE category = \'notebook\'. Other items keep their old labels.',
        code: lines(
          'CREATE TABLE products (id serial PRIMARY KEY, name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products (name, category, price, stock) VALUES ('Notebook', 'stationery', 60, 120), ('Pen', 'stationery', 10, 500), ('Headphones', 'electronics', 1499, 25);",
          "UPDATE products SET price = 12, stock = 450 WHERE name = 'Pen' RETURNING name, price, stock;",
          "UPDATE products SET price = price * 1.10 WHERE category = 'electronics' RETURNING name, price;",
          'SELECT name, price FROM products ORDER BY id;'
        ),
        output: lines(
          ' name | price | stock',
          '------+-------+-------',
          ' Pen  | 12.00 |   450',
          '(1 row)',
          '',
          ' name       | price',
          '------------+---------',
          ' Headphones | 1648.90',
          '(1 row)',
          '',
          ' name       | price',
          '------------+---------',
          ' Notebook   |   60.00',
          ' Pen        |   12.00',
          ' Headphones | 1648.90',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Two columns changed in one row, chosen by name.' },
          { line: 4, note: 'The new price uses the old one: 1499 plus 10% is 1648.90.' },
          { line: 5, note: 'ORDER BY id keeps the rows in a fixed order. You will learn ORDER BY on Day 6.' }
        ],
        tryIt: "Add an UPDATE that sets the stock of 'Notebook' to 0, with RETURNING *, and run it.",
        check: {
          question: 'What does UPDATE products SET price = price + 5 WHERE category = \'stationery\' do?',
          options: ['Adds 5 to the price of every stationery product', 'Sets every price to 5', 'Adds a new product'],
          answer: 0,
          why: 'SET price = price + 5 uses each row\'s old price, and WHERE limits the change to stationery products.'
        }
      },
      {
        title: 'DELETE: removing rows',
        say: [
          'DELETE FROM removes rows from a table. Like UPDATE, it uses WHERE to choose which rows: DELETE FROM products WHERE id = 3 removes one product.',
          'DELETE removes whole rows, never single values. If you only want to clear one value, like a phone number, use UPDATE to set it to NULL instead.',
          'Deleted rows are gone. In the lesson editor that does not matter, but on a real database there is no undo, unless you are inside a transaction, which you will learn on Day 22, or unless there is a backup.',
          'Some rows cannot be deleted because other rows depend on them. For example, a product that appears in old orders is protected by a foreign key, and PostgreSQL will refuse to delete it. That protection is a good thing: it stops you breaking the history of your orders. You will see it in action on Day 10.',
          'Because of this, many real apps do not delete important rows at all. They add a column like is_active and set it to false instead. This is called a soft delete, and it keeps history intact.'
        ],
        example: 'DELETE is like tearing a page out of a notebook: the whole page goes, not just one word on it. If you only want to remove one word, you cross it out and write something else, which is UPDATE.',
        code: lines(
          'CREATE TABLE products (id serial PRIMARY KEY, name text, stock int, is_active boolean DEFAULT true);',
          "INSERT INTO products (name, stock) VALUES ('Notebook', 120), ('Old calendar', 0), ('Pen', 500), ('Desk lamp', 0);",
          'DELETE FROM products WHERE stock = 0 AND name = \'Old calendar\' RETURNING name;',
          "UPDATE products SET is_active = false WHERE name = 'Desk lamp';",
          'SELECT name, stock, is_active FROM products ORDER BY id;'
        ),
        output: lines(
          ' name',
          '--------------',
          ' Old calendar',
          '(1 row)',
          '',
          ' name      | stock | is_active',
          '-----------+-------+-----------',
          ' Notebook  |   120 | true',
          ' Pen       |   500 | true',
          ' Desk lamp |     0 | false',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Delete one row, and show which one was removed.' },
          { line: 4, note: 'A soft delete: the lamp is hidden, but its history is kept.' }
        ],
        tryIt: 'Change the DELETE on line 3 to remove every product with stock above 100, and look at which rows are left.',
        check: {
          question: 'You want to remove a customer\'s phone number but keep the customer. What do you use?',
          options: ['UPDATE ... SET phone = NULL WHERE ...', 'DELETE FROM customers WHERE ...', 'DROP TABLE customers'],
          answer: 0,
          why: 'DELETE removes whole rows. To clear one value, UPDATE it to NULL.'
        }
      },
      {
        title: 'The most dangerous mistake: forgetting WHERE',
        say: [
          'Here is the most important safety lesson in this course. An UPDATE or DELETE without WHERE changes every single row in the table. UPDATE products SET price = 0 makes every product free. DELETE FROM customers removes every customer.',
          'This mistake has happened at real companies, and it has caused real outages. It is easy to make: you write the first line, press Enter by accident, and the WHERE never gets typed.',
          'Professional developers protect themselves with a few habits. First, write the WHERE before anything else, or run the same WHERE as a SELECT first to see which rows it matches. Second, use RETURNING or check the number of changed rows. Third, on important data, work inside a transaction so you can undo, which you will learn on Day 22.',
          'Some tools and companies even block UPDATE and DELETE without WHERE on the live database. And that is one reason regular backups exist: to recover from exactly this kind of mistake.',
          'In the example below, notice the SELECT that uses the same WHERE as the DELETE. Checking first, then changing, is a habit worth building from your first week.',
          'A simple trick makes this habit easy. Write the query as SELECT * FROM customers WHERE city = \'Delhi\' first and run it. When the rows look right, change only the first part to DELETE FROM customers and keep the WHERE exactly as it is. Because the WHERE has not changed, you delete exactly the rows you just saw, no more and no fewer.'
        ],
        example: 'It is like a teacher saying "everyone who did not submit homework, stand up", but forgetting to say the "who did not submit homework" part. The whole class stands up. The condition is what makes the instruction safe.',
        code: lines(
          'CREATE TABLE customers (id serial PRIMARY KEY, name text, city text);',
          "INSERT INTO customers (name, city) VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai'), ('Karan', 'Delhi');",
          "SELECT name FROM customers WHERE city = 'Delhi';",
          "DELETE FROM customers WHERE city = 'Delhi';",
          'SELECT count(*) AS left_after_safe_delete FROM customers;',
          'DELETE FROM customers;',
          'SELECT count(*) AS left_after_no_where FROM customers;'
        ),
        output: lines(
          ' name',
          '-------',
          ' Karan',
          '(1 row)',
          '',
          ' left_after_safe_delete',
          '------------------------',
          '                      2',
          '(1 row)',
          '',
          ' left_after_no_where',
          '---------------------',
          '                   0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Check first: exactly which rows will this WHERE match?' },
          { line: 4, note: 'Then delete with the same WHERE.' },
          { line: 6, note: 'No WHERE: every customer is deleted.' }
        ],
        tryIt: 'Add WHERE name = \'Ravi\' to line 6 and run again. Now only Ravi is deleted and one customer is left.',
        check: {
          question: 'What does UPDATE products SET stock = 0; (with no WHERE) do?',
          options: ['Sets the stock of every product to 0', 'Does nothing until you add WHERE', 'Gives an error'],
          answer: 0,
          why: 'Without WHERE, UPDATE and DELETE apply to every row. PostgreSQL does not ask for confirmation.'
        }
      },
      {
        title: 'Putting it together: keeping the shop up to date',
        say: [
          'Let us put today\'s commands together as a small day in the life of the shop. New stock arrives, a price changes, and a product is removed from the catalogue.',
          'Notice the order of the steps: add the new product with INSERT and see its id with RETURNING, raise the prices of one category with a single UPDATE, delete one product chosen by its name, and finally check the result with a SELECT.',
          'Every change has a WHERE, except the INSERT, which does not need one because it only adds a new row. Every change can be checked with RETURNING or a SELECT. These are exactly the habits that keep real data safe.',
          'In today\'s practice, you will add a new product with all its details, and then raise electronics prices by 10 percent and delete a product that is no longer sold. The shop database is ready for you in the practice editor.',
          'Tomorrow you learn WHERE properly: comparisons, AND and OR, and the tricky NULL value. Since UPDATE and DELETE depend on WHERE, tomorrow\'s lesson makes today\'s commands much more powerful.'
        ],
        example: 'A shop owner\'s evening routine: write the new items into the stock book, correct a few prices, strike out an item that is no longer sold, and then read through the book once to check everything is right.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text NOT NULL, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES (1, 'Notebook', 'stationery', 60, 120), (2, 'Headphones', 'electronics', 1499, 25), (3, 'Phone stand', 'electronics', 299, 60), (4, 'Stapler', 'stationery', 150, 30);",
          "INSERT INTO products VALUES (5, 'Sticky notes', 'stationery', 45, 200) RETURNING id, name;",
          "UPDATE products SET price = price * 1.10 WHERE category = 'electronics';",
          "DELETE FROM products WHERE name = 'Stapler';",
          'SELECT name, price FROM products ORDER BY id;'
        ),
        output: lines(
          ' id | name',
          '----+--------------',
          '  5 | Sticky notes',
          '(1 row)',
          '',
          ' name         | price',
          '--------------+---------',
          ' Notebook     |   60.00',
          ' Headphones   | 1648.90',
          ' Phone stand  |  328.90',
          ' Sticky notes |   45.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'A new product, and RETURNING confirms it.' },
          { line: 4, note: 'One UPDATE changes every electronics price.' },
          { line: 5, note: 'The Stapler is removed; everything else stays.' }
        ],
        tryIt: 'Add an UPDATE that halves the price of Sticky notes (price = price / 2) before the SELECT, and check it shows 22.50.',
        check: {
          question: 'Which statement does not need a WHERE?',
          options: ['INSERT', 'UPDATE', 'DELETE'],
          answer: 0,
          why: 'INSERT adds new rows, so there is nothing to choose. UPDATE and DELETE need WHERE to pick the rows to change.'
        }
      }
    ],
    summary: [
      'INSERT INTO table (columns) VALUES (...), (...) adds one or many rows.',
      'RETURNING shows the rows an INSERT, UPDATE or DELETE touched.',
      'UPDATE table SET column = value WHERE ... changes rows; the new value can use the old one.',
      'DELETE FROM table WHERE ... removes whole rows; a soft delete sets is_active = false instead.',
      'Always check your WHERE first. Without WHERE, UPDATE and DELETE change every row.'
    ],
    projectStep: {
      title: 'My Library: add, fix and remove books',
      steps: [
        'Recreate your books table from yesterday and INSERT at least 5 books in one statement.',
        'Use RETURNING to see the ids they were given.',
        'UPDATE one book to mark it finished, choosing it by id.',
        'DELETE one book you gave away, and SELECT * to check the rest.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 4,
    title: 'Filtering Rows with WHERE',
    goal: 'You can filter rows with comparisons, combine conditions with AND, OR and NOT, and handle NULL correctly.',
    minutes: 28,
    recap: 'Yesterday you added rows with INSERT, changed them with UPDATE, removed them with DELETE, and learned why WHERE matters.',
    parts: [
      {
        title: 'WHERE and comparisons',
        say: [
          'Most questions are about some rows, not all of them: products under 500 rupees, orders from this week, customers in Pune. WHERE keeps only the rows where a condition is true. It comes after FROM: SELECT name FROM products WHERE price < 500.',
          'The comparison signs are the same ones you know from maths, with two differences. Equal is a single = in SQL, not ==. And "not equal" is written <> (or != , which PostgreSQL also accepts). The others are <, >, <= and >=.',
          'Comparisons work on numbers, text and dates. For text, = is exact, including capital letters: \'pune\' is not equal to \'Pune\'. For dates, earlier dates are "smaller", so ordered_on < \'2026-09-15\' means before the 15th.',
          'PostgreSQL checks the condition for each row, one by one. Rows where it is true are kept; rows where it is false are left out. The table itself does not change; you just see fewer rows in the result.',
          'You have already used WHERE with UPDATE and DELETE yesterday. It works in exactly the same way there: the condition chooses which rows are changed or removed. So everything you learn today makes those commands safer too.',
          'You can also compare two columns with each other, not only a column with a fixed value. WHERE stock < min_stock finds products that need reordering, if the table has both columns. And you can compare with a calculation: WHERE price * 1.18 > 1000 finds products that cost more than 1000 once GST is added.'
        ],
        example: 'WHERE is like the filters on a shopping app: "price under 500", "rating 4 and above". The shop still has every product, but the screen only shows the ones that match your filter.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60, 120), ('Pen', 'stationery', 10, 500), ('Backpack', 'bags', 1200, 15), ('Desk lamp', 'home', 899, 0), ('Headphones', 'electronics', 1499, 25);",
          'SELECT name, price FROM products WHERE price < 500;',
          "SELECT name FROM products WHERE category <> 'stationery';",
          'SELECT name, stock FROM products WHERE stock = 0;'
        ),
        output: lines(
          ' name     | price',
          '----------+-------',
          ' Notebook | 60.00',
          ' Pen      | 10.00',
          '(2 rows)',
          '',
          ' name',
          '------------',
          ' Backpack',
          ' Desk lamp',
          ' Headphones',
          '(3 rows)',
          '',
          ' name      | stock',
          '-----------+-------',
          ' Desk lamp |     0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Keep only the rows where price is less than 500.' },
          { line: 4, note: '<> means "not equal".' },
          { line: 5, note: 'A single = compares in SQL.' }
        ],
        tryIt: "Write a query for products that cost 899 or more (>=). Then try WHERE category = 'Stationery' with a capital S and notice it finds nothing.",
        check: {
          question: 'How do you write "not equal" in SQL?',
          options: ['<>', '==', '=!'],
          answer: 0,
          why: 'SQL uses <> for "not equal" (PostgreSQL also accepts !=). A single = means equal.'
        }
      },
      {
        title: 'AND, OR and NOT',
        say: [
          'One condition is often not enough. AND keeps rows where both conditions are true: price < 1000 AND stock > 0 means cheap and in stock. OR keeps rows where at least one is true: category = \'bags\' OR category = \'home\'.',
          'NOT reverses a condition: NOT (stock > 0) is the same as stock <= 0. It is most useful with the special words you will learn tomorrow, like NOT IN and NOT LIKE.',
          'When you mix AND and OR, be careful. SQL does AND before OR, just like multiplication before addition in maths. So a OR b AND c means a OR (b AND c), which is often not what you meant.',
          'The fix is simple: use brackets. (category = \'bags\' OR category = \'home\') AND price < 1000 means exactly what it says. Brackets make your intention clear to PostgreSQL and to anyone reading your query.',
          'A good habit is to read your WHERE out loud in plain words before running it. If it sounds different from the question you are trying to answer, fix it with brackets.'
        ],
        example: 'A job listing says: "Freshers or experienced candidates, who live in Pune". If you read it without care, you might think any fresher from any city can apply. Brackets make it clear: (freshers OR experienced) AND lives in Pune.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60, 120), ('Backpack', 'bags', 1200, 15), ('Tote bag', 'bags', 450, 0), ('Desk lamp', 'home', 899, 0), ('Cushion', 'home', 300, 40);",
          'SELECT name FROM products WHERE price < 1000 AND stock > 0;',
          "SELECT name FROM products WHERE category = 'bags' OR category = 'home' AND price < 1000;",
          "SELECT name FROM products WHERE (category = 'bags' OR category = 'home') AND price < 1000;"
        ),
        output: lines(
          ' name',
          '----------',
          ' Notebook',
          ' Cushion',
          '(2 rows)',
          '',
          ' name',
          '-----------',
          ' Backpack',
          ' Tote bag',
          ' Desk lamp',
          ' Cushion',
          '(4 rows)',
          '',
          ' name',
          '-----------',
          ' Tote bag',
          ' Desk lamp',
          ' Cushion',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'AND: both must be true.' },
          { line: 4, note: 'Without brackets, AND goes first, so every bag is kept, even the 1200 Backpack.' },
          { line: 5, note: 'With brackets: bags or home items, and under 1000.' }
        ],
        tryIt: "Write a query for products that are in the home category but NOT in stock: category = 'home' AND NOT (stock > 0).",
        check: {
          question: 'In a OR b AND c, which part does SQL work out first?',
          options: ['b AND c', 'a OR b', 'They are worked out left to right'],
          answer: 0,
          why: 'AND is done before OR. Use brackets, like (a OR b) AND c, when you mean something else.'
        }
      },
      {
        title: 'NULL: the unknown value',
        say: [
          'NULL means "no value" or "unknown". A customer who did not give a city has NULL in the city column. NULL is not the text \'NULL\', not an empty text \'\', and not zero. It is the absence of a value.',
          'Here is the trap: NULL is never equal to anything, not even to another NULL. If a city is unknown, is it Pune? We do not know. So city = \'Pune\' is not true for that row, and city <> \'Pune\' is not true either. The answer is "unknown", and WHERE only keeps rows where the condition is definitely true.',
          'That means WHERE city = NULL never finds anything. It is one of the most common SQL bugs, and interviewers love to ask about it. The correct way is IS NULL: WHERE city IS NULL. For the opposite, use IS NOT NULL.',
          'NULL also affects maths. Anything plus NULL is NULL: if a price is unknown, price + 10 is unknown too. You will learn how totals like SUM treat NULL on Day 8, and a function called coalesce that replaces NULL with a value you choose, on Day 7.',
          'When you design tables, NOT NULL on columns that must always have a value avoids many of these surprises. When NULL is allowed, remember to think about it in every WHERE.',
          'A quick way to remember all this: NULL is not a value, it is the lack of one. Any question you ask about a missing value gets the answer "unknown", and WHERE only keeps rows whose answer is a definite yes. The only questions that get a clear yes or no about NULL are IS NULL and IS NOT NULL.'
        ],
        example: 'Imagine a class list where one student\'s age box was left blank. Is that student older than 18? You cannot say yes, and you cannot say no. The honest answer is "unknown". SQL treats NULL exactly like that blank box.',
        code: lines(
          'CREATE TABLE customers (name text, city text);',
          "INSERT INTO customers VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai'), ('Meera', NULL);",
          'SELECT name FROM customers WHERE city = NULL;',
          'SELECT name FROM customers WHERE city IS NULL;',
          "SELECT name FROM customers WHERE city <> 'Pune';",
          'SELECT name, city IS NULL AS city_unknown FROM customers;'
        ),
        output: lines(
          ' name',
          '------',
          '(0 rows)',
          '',
          ' name',
          '-------',
          ' Meera',
          '(1 row)',
          '',
          ' name',
          '------',
          ' Ravi',
          '(1 row)',
          '',
          ' name  | city_unknown',
          '-------+--------------',
          ' Asha  | false',
          ' Ravi  | false',
          ' Meera | true',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Always empty: nothing is ever "equal" to NULL.' },
          { line: 4, note: 'The right way to find unknown values.' },
          { line: 5, note: 'Meera is missing here too: we do not know that her city is not Pune.' }
        ],
        tryIt: "Change line 5 to also keep customers with no city: WHERE city <> 'Pune' OR city IS NULL. Now Meera appears.",
        check: {
          question: 'How do you find rows where email has no value?',
          options: ['WHERE email IS NULL', 'WHERE email = NULL', "WHERE email = 'NULL'"],
          answer: 0,
          why: 'Nothing is ever equal to NULL, so = NULL finds nothing. IS NULL is the correct test.'
        }
      },
      {
        title: 'Filtering dates',
        say: [
          'Dates are one of the most common things to filter by: orders this month, customers who joined this year, bills due in the next week. In PostgreSQL, you can compare a date column with a date written as text in year-month-day format, like \'2026-09-15\'.',
          'Earlier dates are smaller. So ordered_on < \'2026-09-15\' means before the 15th, and ordered_on >= \'2026-09-01\' means on or after the 1st. To pick a whole month, combine two conditions with AND: on or after the first day, and before the first day of the next month.',
          'PostgreSQL knows today\'s date as CURRENT_DATE. You can do simple maths with dates: CURRENT_DATE - 7 is one week ago. So WHERE ordered_on >= CURRENT_DATE - 7 means "in the last 7 days". In the lesson examples we use fixed dates, so the output is the same every time you run it.',
          'Always write dates as year-month-day, like 2026-09-28. Formats like 28/09/2026 can be read differently in different countries: is 03/04 the 3rd of April or the 4th of March? Year-month-day is never ambiguous.',
          'You will learn more date tools, like extracting the month or counting days between dates, on Day 7.'
        ],
        example: 'Filtering by date is like looking through your bank statement for "all payments from 1 to 15 September". You go down the list and keep only the lines whose date falls in that window.',
        code: lines(
          'CREATE TABLE orders (id int, customer text, ordered_on date);',
          "INSERT INTO orders VALUES (1, 'Asha', '2026-08-28'), (2, 'Ravi', '2026-09-03'), (3, 'Asha', '2026-09-10'), (4, 'Priya', '2026-10-02');",
          "SELECT id, ordered_on FROM orders WHERE ordered_on >= '2026-09-01' AND ordered_on < '2026-10-01';",
          "SELECT id FROM orders WHERE ordered_on < '2026-09-05';",
          "SELECT date '2026-09-30' - 7 AS one_week_before;"
        ),
        output: lines(
          ' id | ordered_on',
          '----+------------',
          '  2 | 2026-09-03',
          '  3 | 2026-09-10',
          '(2 rows)',
          '',
          ' id',
          '----',
          '  1',
          '  2',
          '(2 rows)',
          '',
          ' one_week_before',
          '-----------------',
          ' 2026-09-23',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'The whole of September: on or after the 1st, and before 1 October.' },
          { line: 5, note: 'Subtracting a number of days from a date gives another date.' }
        ],
        tryIt: "Find Asha's orders in September only by adding AND customer = 'Asha' to line 3.",
        check: {
          question: 'Which WHERE finds orders in September 2026?',
          options: ["ordered_on >= '2026-09-01' AND ordered_on < '2026-10-01'", "ordered_on = '2026-09'", "ordered_on > '2026-09-01' OR ordered_on < '2026-10-01'"],
          answer: 0,
          why: 'On or after the first day, and before the first day of the next month, covers the whole month. The OR version would match almost every date.'
        }
      },
      {
        title: 'WHERE with UPDATE and DELETE',
        say: [
          'Everything from today works with UPDATE and DELETE too. The WHERE chooses which rows change, and now you can write precise conditions with AND, OR, dates and IS NULL.',
          'For example, you might mark old unpaid orders as cancelled: UPDATE orders SET status = \'cancelled\' WHERE status = \'pending\' AND ordered_on < \'2026-09-01\'. Or fill in a missing value: UPDATE customers SET city = \'Unknown\' WHERE city IS NULL.',
          'Remember the habit from yesterday: before running an UPDATE or DELETE, run a SELECT with the same WHERE to see which rows it will touch. If the SELECT shows the rows you expect, the change will affect exactly those rows.',
          'Be extra careful with NULL here. UPDATE ... WHERE city <> \'Pune\' will not touch customers whose city is NULL. Sometimes that is right; sometimes it is a hidden bug. Always ask yourself: what happens to rows with NULL?',
          'In the example below, notice how the SELECT and the UPDATE use exactly the same WHERE.'
        ],
        example: 'A school cleaning up old records says: "for students who left before 2020 and have no forwarding address, mark them archived". Every part of that sentence becomes a part of the WHERE, and the office checks the list before stamping anything.',
        code: lines(
          'CREATE TABLE orders (id int, status text, ordered_on date);',
          "INSERT INTO orders VALUES (1, 'pending', '2026-08-20'), (2, 'delivered', '2026-08-25'), (3, 'pending', '2026-09-12'), (4, 'pending', NULL);",
          "SELECT id FROM orders WHERE status = 'pending' AND ordered_on < '2026-09-01';",
          "UPDATE orders SET status = 'cancelled' WHERE status = 'pending' AND ordered_on < '2026-09-01' RETURNING id, status;",
          "SELECT id, status FROM orders WHERE status = 'pending';"
        ),
        output: lines(
          ' id',
          '----',
          '  1',
          '(1 row)',
          '',
          ' id | status',
          '----+-----------',
          '  1 | cancelled',
          '(1 row)',
          '',
          ' id | status',
          '----+---------',
          '  3 | pending',
          '  4 | pending',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Check first with SELECT.' },
          { line: 4, note: 'Then UPDATE with exactly the same WHERE.' },
          { line: 5, note: 'Order 4 has no date (NULL), so the date condition was not true for it, and it stayed pending.' }
        ],
        tryIt: 'Write an UPDATE that also cancels pending orders with no date: WHERE status = \'pending\' AND ordered_on IS NULL.',
        check: {
          question: 'Why did order 4 stay pending in the example?',
          options: ['Its date is NULL, so "ordered_on < 2026-09-01" is not true for it', 'It was delivered', 'UPDATE only changes one row'],
          answer: 0,
          why: 'A comparison with NULL is never true, so the row is not matched by the WHERE.'
        }
      },
      {
        title: 'Putting it together: answering shop questions',
        say: [
          'Let us answer a few real questions from a shop manager with today\'s tools. Each question becomes a WHERE: first in plain words, then in SQL.',
          '"Which products can I sell today for under 1000?" means price < 1000 AND stock > 0. "Which customers have not told us their city?" means city IS NULL. "Which orders from September are not delivered yet?" combines a date range with status <> \'delivered\'.',
          'Writing the question in plain words first, and then turning each part into a condition, is how experienced developers write queries. It also helps you spot missing brackets or forgotten NULLs.',
          'In today\'s practice you will find the affordable products that are in stock, and the customers with no city. For the second one, remember the NULL trap from this lesson.',
          'Tomorrow you learn more ways to filter: searching inside text with LIKE, checking a list of values with IN, and ranges with BETWEEN.'
        ],
        example: 'A manager\'s morning questions are like a checklist of filters: what can we sell, who do we need to call, what is late. Each question is one small WHERE, and together they run the day.',
        code: lines(
          'CREATE TABLE customers (id int, name text, city text);',
          "INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai'), (3, 'Meera', NULL);",
          'CREATE TABLE products (name text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 60, 120), ('Desk lamp', 899, 0), ('Headphones', 1499, 25), ('Phone stand', 299, 60);",
          'CREATE TABLE orders (id int, status text, ordered_on date);',
          "INSERT INTO orders VALUES (1, 'delivered', '2026-09-01'), (2, 'shipped', '2026-09-10'), (3, 'pending', '2026-09-25'), (4, 'pending', '2026-10-02');",
          'SELECT name FROM products WHERE price < 1000 AND stock > 0;',
          'SELECT name FROM customers WHERE city IS NULL;',
          "SELECT id, status FROM orders WHERE ordered_on >= '2026-09-01' AND ordered_on < '2026-10-01' AND status <> 'delivered';"
        ),
        output: lines(
          ' name',
          '-------------',
          ' Notebook',
          ' Phone stand',
          '(2 rows)',
          '',
          ' name',
          '-------',
          ' Meera',
          '(1 row)',
          '',
          ' id | status',
          '----+---------',
          '  2 | shipped',
          '  3 | pending',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 7, note: 'Affordable and in stock: the Desk lamp is excluded because its stock is 0.' },
          { line: 9, note: 'Three conditions joined with AND: in September and not delivered.' }
        ],
        tryIt: "Add a query for products that are either out of stock or cost more than 1000: stock = 0 OR price > 1000.",
        check: {
          question: 'A manager asks: "customers from Pune, or with no city". Which WHERE is right?',
          options: ["city = 'Pune' OR city IS NULL", "city = 'Pune' OR city = NULL", "city = 'Pune' AND city IS NULL"],
          answer: 0,
          why: 'OR keeps rows matching either condition, and IS NULL is the correct test for a missing city.'
        }
      }
    ],
    summary: [
      'WHERE keeps only the rows where a condition is true; it also chooses rows for UPDATE and DELETE.',
      'Comparisons: =, <> (not equal), <, >, <=, >=. Text comparisons care about capital letters.',
      'AND needs both, OR needs one, NOT reverses. AND is done before OR, so use brackets.',
      'NULL means unknown: = NULL finds nothing; use IS NULL and IS NOT NULL.',
      'Filter dates with year-month-day text; a month is >= the 1st and < the 1st of next month.'
    ],
    projectStep: {
      title: 'My Library: filter your books',
      steps: [
        'Add a pages column value for every book, and leave the author empty (NULL) for one of them.',
        'Find books with more than 300 pages.',
        'Find unfinished books by a chosen author: finished = false AND author = \'...\'.',
        'Find the book with no author using IS NULL.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 5,
    title: 'Searching Text and Ranges: LIKE, IN, BETWEEN',
    goal: 'You can search inside text with LIKE and ILIKE, check a list of values with IN, and pick ranges with BETWEEN.',
    minutes: 28,
    recap: 'Yesterday you filtered rows with WHERE, combined conditions with AND, OR and NOT, and learned to handle NULL.',
    parts: [
      {
        title: 'LIKE: searching inside text',
        say: [
          'With = you can only find text that matches exactly. But people search with parts of words: "head" should find Headphones. LIKE compares text with a pattern, where two special characters stand for "anything".',
          'The percent sign % means "any number of characters, including none". So \'Head%\' means "starts with Head", \'%phone%\' means "contains phone anywhere", and \'%s\' means "ends with s".',
          'The underscore _ means "exactly one character". So \'P_n\' matches Pen and Pan, but not Pin cushion. It is used less often than %, but it is handy for codes with a fixed shape, like PIN codes or product codes.',
          'LIKE cares about capital letters, just like =. \'head%\' does not match Headphones, because of the capital H. That surprises many beginners, and you will see the fix in the next part.',
          'NOT LIKE keeps the rows that do not match the pattern. For example, WHERE email NOT LIKE \'%@%\' finds email addresses without an @ sign, which are probably typing mistakes.',
          'What if you need to search for a real percent sign or underscore, like the text 50%? Put a backslash before it in the pattern: LIKE \'%50\\%%\' finds names containing 50%. You will not need this often, but it explains a strange result if one of your searches ever matches far more rows than expected.'
        ],
        example: 'LIKE is like searching your phone contacts by typing "Ra": you get Ravi, Rahul and Rashmi. You did not type the whole name, just a pattern, and the phone found every name that fits.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Headphones', 1499), ('Phone stand', 299), ('Pen', 10), ('Pencil box', 120), ('Notebook', 60);",
          "SELECT name FROM products WHERE name LIKE 'P%';",
          "SELECT name FROM products WHERE name LIKE '%phone%';",
          "SELECT name FROM products WHERE name LIKE 'P_n';",
          "SELECT name FROM products WHERE name LIKE 'head%';"
        ),
        output: lines(
          ' name',
          '-------------',
          ' Phone stand',
          ' Pen',
          ' Pencil box',
          '(3 rows)',
          '',
          ' name',
          '------------',
          ' Headphones',
          '(1 row)',
          '',
          ' name',
          '------',
          ' Pen',
          '(1 row)',
          '',
          ' name',
          '------',
          '(0 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Starts with a capital P.' },
          { line: 4, note: 'Contains "phone": Headphones matches; Phone stand does not, because its P is a capital.' },
          { line: 5, note: 'P, any one character, then n.' },
          { line: 6, note: 'Nothing: LIKE cares about capital letters.' }
        ],
        tryIt: "Find every product whose name ends with the letter k: LIKE '%k'. Which product is it?",
        check: {
          question: "What does name LIKE '%bag%' find?",
          options: ['Names that contain "bag" anywhere', 'Names that are exactly "bag"', 'Names that start with "bag"'],
          answer: 0,
          why: '% on both sides means any characters before and after, so "bag" can be anywhere in the name.'
        }
      },
      {
        title: 'ILIKE: search without worrying about capitals',
        say: [
          'People type in search boxes in any mix of capital and small letters. PostgreSQL has ILIKE, which works exactly like LIKE but ignores capital letters. The I stands for "insensitive", as in case-insensitive.',
          'So name ILIKE \'head%\' finds Headphones, HEADPHONES and headphones. For most search boxes in apps, ILIKE is what you want.',
          'ILIKE is a PostgreSQL feature. In other databases you might see a different approach: lower(name) LIKE \'head%\', which turns the name into small letters first. That works in PostgreSQL too, and you will learn lower() on Day 7.',
          'Searching with a % at the start, like \'%phone%\', has a cost on very large tables: PostgreSQL has to look at every row. For a shop with thousands of products that is fine. For millions of rows, there are special indexes and search tools, which is a topic for later in your career.',
          'In the example below, notice that ILIKE finds both Phone stand and Headphones for the search "phone", while LIKE only found one of them.',
          'In a real app, the search text comes from what the user typed, for example "phone". The app adds the percent signs around it and sends it to the database as a separate value, not glued into the SQL text. You will learn why that matters, and how it prevents an attack called SQL injection, on Day 26.'
        ],
        example: 'Google does not care whether you type "Pune weather" or "pune WEATHER"; it gives you the same results. ILIKE brings that friendliness to your database searches.',
        code: lines(
          'CREATE TABLE products (name text);',
          "INSERT INTO products VALUES ('Headphones'), ('Phone stand'), ('Pen'), ('Notebook');",
          "SELECT name FROM products WHERE name ILIKE '%phone%';",
          "SELECT name FROM products WHERE name ILIKE 'HEAD%';"
        ),
        output: lines(
          ' name',
          '-------------',
          ' Headphones',
          ' Phone stand',
          '(2 rows)',
          '',
          ' name',
          '------------',
          ' Headphones',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Both products are found, whatever the capital letters.' },
          { line: 4, note: 'Capital letters in the pattern do not matter either.' }
        ],
        tryIt: "Search for products containing 'NOTE' with ILIKE, and then with LIKE. Only ILIKE finds Notebook.",
        check: {
          question: 'What is the difference between LIKE and ILIKE?',
          options: ['ILIKE ignores capital and small letters; LIKE does not', 'ILIKE is faster', 'ILIKE only works on numbers'],
          answer: 0,
          why: 'Both use % and _ patterns. ILIKE treats capitals and small letters as the same.'
        }
      },
      {
        title: 'IN: matching a list of values',
        say: [
          'Sometimes you want rows where a column is one of several values: orders that are delivered or shipped, customers from Pune, Mumbai or Delhi. You could write city = \'Pune\' OR city = \'Mumbai\' OR city = \'Delhi\', but that gets long.',
          'IN is the short way: WHERE city IN (\'Pune\', \'Mumbai\', \'Delhi\'). It means exactly the same as the OR version, but it is shorter and much easier to read.',
          'NOT IN does the opposite: rows where the value is not in the list. WHERE status NOT IN (\'cancelled\', \'returned\') keeps every other status.',
          'Be careful with NULL again. If the column is NULL, neither IN nor NOT IN is true for that row, so rows with NULL disappear from both results. And if the list itself contains a NULL, NOT IN finds nothing at all. That surprising behaviour is a classic interview question, so remember: watch out for NULL with NOT IN.',
          'On Day 15 you will see that the list inside IN can come from another query, for example "customers whose id is in the list of customers who placed an order". That makes IN very powerful.',
          'IN works with numbers and dates as well as text. WHERE id IN (3, 7, 12) picks three exact rows by their ids, which is common when a user ticks several items in a list on screen and presses one button to act on all of them at once, like "archive these three orders".'
        ],
        example: 'A security guard with a list of invited guests checks each person: "is your name on this list?" That is IN. A bouncer with a list of banned people checks the opposite: NOT IN.',
        code: lines(
          'CREATE TABLE orders (id int, status text);',
          "INSERT INTO orders VALUES (1, 'delivered'), (2, 'shipped'), (3, 'cancelled'), (4, 'pending'), (5, NULL);",
          "SELECT id, status FROM orders WHERE status IN ('delivered', 'shipped');",
          "SELECT id, status FROM orders WHERE status NOT IN ('cancelled');",
          "SELECT count(*) AS found FROM orders WHERE status NOT IN ('cancelled', NULL);"
        ),
        output: lines(
          ' id | status',
          '----+-----------',
          '  1 | delivered',
          '  2 | shipped',
          '(2 rows)',
          '',
          ' id | status',
          '----+-----------',
          '  1 | delivered',
          '  2 | shipped',
          '  4 | pending',
          '(3 rows)',
          '',
          ' found',
          '-------',
          '     0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'The same as status = \'delivered\' OR status = \'shipped\'.' },
          { line: 4, note: 'Order 5 (NULL status) is missing: NOT IN is not true for NULL.' },
          { line: 5, note: 'A NULL inside a NOT IN list makes it find nothing at all.' }
        ],
        tryIt: "Change line 3 to find orders that are pending or cancelled, using IN.",
        check: {
          question: "Which is the same as city IN ('Pune', 'Delhi')?",
          options: ["city = 'Pune' OR city = 'Delhi'", "city = 'Pune' AND city = 'Delhi'", "city LIKE 'Pune%Delhi'"],
          answer: 0,
          why: 'IN checks whether the value equals any item in the list, which is the same as several conditions joined with OR.'
        }
      },
      {
        title: 'BETWEEN: ranges of numbers and dates',
        say: [
          'BETWEEN picks values in a range: price BETWEEN 100 AND 500 keeps prices from 100 to 500. Both ends are included, so a price of exactly 100 or exactly 500 is kept.',
          'It is the same as price >= 100 AND price <= 500, just shorter and easier to read. NOT BETWEEN keeps values outside the range.',
          'BETWEEN works with dates too: ordered_on BETWEEN \'2026-09-01\' AND \'2026-09-30\' keeps every order in September. Because both ends are included, the 30th is kept.',
          'There is one trap with dates and times. If the column is a timestamp, with a time of day, then BETWEEN \'2026-09-01\' AND \'2026-09-30\' stops at midnight at the start of the 30th, so orders later on the 30th are missed. For timestamps, the safe pattern from yesterday is better: >= the first day AND < the day after the last.',
          'Always put the smaller value first. BETWEEN 500 AND 100 finds nothing, because no number is at least 500 and at most 100 at the same time.',
          'BETWEEN also works on text, using alphabetical order: name BETWEEN \'A\' AND \'M\' keeps names from A up to exactly M. That catches beginners out, because a name like Meera comes after the single letter M, so it is left out. For text, a LIKE pattern or a simple comparison is usually clearer than BETWEEN.'
        ],
        example: 'A college notice says "students aged 18 to 21 can apply". Both 18 and 21 are included. That is BETWEEN 18 AND 21. A notice that says "under 21" would be < 21 instead.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Pen', 10), ('Notebook', 60), ('Stapler', 150), ('Phone stand', 299), ('Water bottle', 350), ('Desk lamp', 899);",
          'SELECT name, price FROM products WHERE price BETWEEN 60 AND 350;',
          'SELECT name FROM products WHERE price NOT BETWEEN 60 AND 350;',
          'SELECT count(*) AS found FROM products WHERE price BETWEEN 350 AND 60;'
        ),
        output: lines(
          ' name         | price',
          '--------------+--------',
          ' Notebook     |  60.00',
          ' Stapler      | 150.00',
          ' Phone stand  | 299.00',
          ' Water bottle | 350.00',
          '(4 rows)',
          '',
          ' name',
          '-----------',
          ' Pen',
          ' Desk lamp',
          '(2 rows)',
          '',
          ' found',
          '-------',
          '     0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Both ends included: 60 and 350 are kept.' },
          { line: 4, note: 'Everything outside the range.' },
          { line: 5, note: 'The bigger number first: nothing matches.' }
        ],
        tryIt: 'Find products priced from 100 to 300 with BETWEEN. You should get Stapler and Phone stand.',
        check: {
          question: 'Does price BETWEEN 100 AND 500 include a price of exactly 500?',
          options: ['Yes, both ends are included', 'No, only 100 to 499', 'Only if you add EQUAL'],
          answer: 0,
          why: 'BETWEEN includes both ends. It is the same as price >= 100 AND price <= 500.'
        }
      },
      {
        title: 'Combining text, list and range filters',
        say: [
          'Real searches combine several filters at once. On a shopping site, you might search for "bottle", choose the kitchen and home categories, and set a price range. Each of those is one condition, and they are joined with AND.',
          'In SQL that looks like: WHERE name ILIKE \'%bottle%\' AND category IN (\'kitchen\', \'home\') AND price BETWEEN 100 AND 500. Each line of the WHERE maps to one control on the screen.',
          'Writing each condition on its own line, starting with AND, makes long filters easy to read and easy to change. You can comment out a single line with -- to test the query without that filter.',
          'This is exactly what happens behind a shop\'s filter panel. When you tick a box or move a slider, the app adds or changes one condition in a query like this, and runs it again.',
          'Be careful to use brackets if you mix in an OR, as you learned yesterday. For filters joined only with AND, no brackets are needed.'
        ],
        example: 'On a train booking site, you search "Pune to Delhi", tick "sleeper and 3A", and choose departure between 6 pm and 11 pm. Each choice becomes one condition, and only trains matching all of them are shown.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Water bottle', 'kitchen', 350), ('Steel bottle', 'kitchen', 650), ('Bottle opener', 'kitchen', 90), ('Flower vase', 'home', 400), ('Bottle lamp', 'home', 480), ('Sports bottle', 'sports', 300);",
          'SELECT name, category, price',
          'FROM products',
          "WHERE name ILIKE '%bottle%'",
          "  AND category IN ('kitchen', 'home')",
          '  AND price BETWEEN 100 AND 500;'
        ),
        output: lines(
          ' name         | category | price',
          '--------------+----------+--------',
          ' Water bottle | kitchen  | 350.00',
          ' Bottle lamp  | home     | 480.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'The search box.' },
          { line: 6, note: 'The category tick boxes.' },
          { line: 7, note: 'The price slider.' }
        ],
        tryIt: 'Put -- at the start of line 7 to turn off the price filter, and run it. Which extra products appear?',
        check: {
          question: 'On a filter panel, a user ticks two categories and sets a price range. How are these conditions joined?',
          options: ['With AND', 'With OR', 'With BETWEEN only'],
          answer: 0,
          why: 'A row must match every chosen filter, so the conditions are joined with AND. The two categories themselves go in one IN list.'
        }
      },
      {
        title: 'Putting it together: a product search',
        say: [
          'Let us finish the first week with a small search page for the shop. The page has a search box, a list of order statuses and a date range, and each becomes part of a query.',
          'First we search products by name with ILIKE. Then we find orders by status with IN and by date with BETWEEN. Notice how each query reads almost like the question it answers.',
          'You now know the basics of reading data: SELECT, FROM, WHERE, comparisons, AND and OR, NULL, LIKE, IN and BETWEEN. That is already enough to answer a large share of everyday business questions.',
          'In today\'s practice, you will find products whose name starts with P, where the LIKE trap with capital letters is waiting for you, and orders in a date range with certain statuses.',
          'After the practice comes your first test, covering Days 1 to 5. Each question has an explanation, and you can try again. Next week you will learn to sort results, calculate totals and, most importantly, join tables together.'
        ],
        example: 'A good search page feels simple to the user, but behind it every box and tick turns into one small, precise condition. You now know how to write those conditions.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Pen', 10), ('Phone stand', 299), ('Headphones', 1499), ('Notebook', 60);",
          'CREATE TABLE orders (id int, status text, ordered_on date);',
          "INSERT INTO orders VALUES (1, 'delivered', '2026-09-01'), (2, 'delivered', '2026-09-03'), (3, 'shipped', '2026-09-10'), (4, 'delivered', '2026-09-12'), (5, 'cancelled', '2026-09-20');",
          "SELECT name FROM products WHERE name ILIKE 'p%';",
          "SELECT id, status FROM orders WHERE status IN ('delivered', 'shipped') AND ordered_on BETWEEN '2026-09-05' AND '2026-09-20';"
        ),
        output: lines(
          ' name',
          '-------------',
          ' Pen',
          ' Phone stand',
          '(2 rows)',
          '',
          ' id | status',
          '----+-----------',
          '  3 | shipped',
          '  4 | delivered',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'ILIKE with a small p still finds names starting with a capital P.' },
          { line: 6, note: 'A list of statuses and a date range together. Order 5 is in the range but cancelled.' }
        ],
        tryIt: "Add 'cancelled' to the IN list on line 6 and run it. Order 5 now appears too.",
        check: {
          question: "Why does name LIKE 'p%' find nothing in this shop?",
          options: ['LIKE cares about capital letters, and the names start with a capital P', 'LIKE needs two % signs', 'p is a reserved word'],
          answer: 0,
          why: "LIKE is case-sensitive. Use LIKE 'P%' or ILIKE 'p%'."
        }
      }
    ],
    summary: [
      'LIKE searches with patterns: % is any characters, _ is exactly one. It cares about capital letters.',
      'ILIKE is the same as LIKE but ignores capital letters: best for search boxes.',
      'IN (...) matches any value in a list; NOT IN is the opposite. Watch out for NULL.',
      'BETWEEN a AND b includes both ends; put the smaller value first.',
      'Combine filters with AND, one per line, like a shop\'s filter panel.'
    ],
    projectStep: {
      title: 'My Library: search your books',
      steps: [
        'Search your books by part of the title with ILIKE.',
        'Find books by any of 2 or 3 chosen authors with IN.',
        'Find books with 150 to 400 pages with BETWEEN.',
        'Combine two of these filters in one query, one condition per line.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 6,
    title: 'Sorting and Pages: ORDER BY, LIMIT, OFFSET',
    goal: 'You can sort results by one or more columns, take the top few rows, and split long lists into pages.',
    minutes: 28,
    recap: 'Yesterday you searched text with LIKE and ILIKE, matched lists with IN, and picked ranges with BETWEEN.',
    parts: [
      {
        title: 'Why order is never guaranteed',
        say: [
          'Here is something that surprises almost every beginner: a table has no fixed order. When you run SELECT without asking for an order, PostgreSQL returns the rows in whatever order is quickest for it. Often that looks like the order you inserted them, but it is not a promise.',
          'After updates and deletes, or once a table grows large, the order can change from one run to the next. If your app shows "the latest orders" without asking for an order, it might show old ones on a busy day, and nobody would know why.',
          'So the rule is simple: if the order matters, ask for it with ORDER BY. That is the only way to get a guaranteed order in SQL.',
          'ORDER BY goes at the end of the query, after WHERE. For example: SELECT name, price FROM products WHERE stock > 0 ORDER BY price. PostgreSQL first keeps the matching rows, then sorts them.',
          'In the lesson examples so far, some results came out in insert order just by luck. From today, whenever the order of the result matters, the examples use ORDER BY. That is the habit professional developers follow too.',
          'ORDER BY is also the last step PostgreSQL does before sending the result. It first finds the rows with FROM and WHERE, works out the columns in SELECT, and only then sorts. That is why you can sort by a name you gave with AS, even though that name does not exist in the table.'
        ],
        example: 'Imagine a stack of exam papers dropped on the floor and picked up again. Nobody would trust that they are still in roll number order. If the order matters, you sort them on purpose. A database table is that stack of papers: sort it when you need an order.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Pen', 10), ('Backpack', 1200), ('Notebook', 60), ('Desk lamp', 899);",
          "UPDATE products SET price = 12 WHERE name = 'Pen';",
          'SELECT name, price FROM products;',
          'SELECT name, price FROM products ORDER BY price;'
        ),
        output: lines(
          ' name      | price',
          '-----------+---------',
          ' Backpack  | 1200.00',
          ' Notebook  |   60.00',
          ' Desk lamp |  899.00',
          ' Pen       |   12.00',
          '(4 rows)',
          '',
          ' name      | price',
          '-----------+---------',
          ' Pen       |   12.00',
          ' Notebook  |   60.00',
          ' Desk lamp |  899.00',
          ' Backpack  | 1200.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'After an update, the changed row may move in the unsorted result.' },
          { line: 4, note: 'No ORDER BY: here the Pen has moved to the end.' },
          { line: 5, note: 'With ORDER BY price, the order is guaranteed: cheapest first.' }
        ],
        tryIt: 'Remove the UPDATE on line 3 and run again. The unsorted result changes, but the sorted one stays exactly the same.',
        check: {
          question: 'When is the order of rows guaranteed in a SELECT?',
          options: ['Only when the query has ORDER BY', 'Always, in the order rows were inserted', 'Always, in id order'],
          answer: 0,
          why: 'Without ORDER BY, PostgreSQL may return rows in any order. ORDER BY is the only guarantee.'
        }
      },
      {
        title: 'ORDER BY: ascending and descending',
        say: [
          'ORDER BY sorts by a column. By default it sorts from smallest to largest, which is called ascending, or ASC. For numbers that means cheapest first; for text it means A to Z; for dates it means oldest first.',
          'Add DESC after the column for descending order: largest first, Z to A, newest first. ORDER BY price DESC shows the most expensive products at the top, and ORDER BY ordered_on DESC shows the latest orders first.',
          'You can sort by a column that you do not show. SELECT name FROM products ORDER BY price is perfectly fine: the result shows only names, in price order.',
          'You can also sort by a calculation or by a name you gave with AS. For example, SELECT name, price * 1.18 AS with_gst FROM products ORDER BY with_gst. PostgreSQL works out the value for each row and sorts by it.',
          'Text is sorted using the database\'s language rules. In the lesson editor, capital and small letters are sorted by their character codes, which is why a word starting with a capital letter can come before a word starting with a small letter. Keeping text consistent, like always capitalising names, avoids surprises.'
        ],
        example: 'On a shopping app, "Price: low to high" is ORDER BY price ASC, and "Price: high to low" is ORDER BY price DESC. "Newest arrivals" is ORDER BY added_on DESC. Every sort button is one ORDER BY.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2), added_on date);',
          "INSERT INTO products VALUES ('Pen', 10, '2026-09-01'), ('Backpack', 1200, '2026-09-20'), ('Notebook', 60, '2026-09-10');",
          'SELECT name, price FROM products ORDER BY price DESC;',
          'SELECT name FROM products ORDER BY added_on DESC;',
          'SELECT name FROM products ORDER BY name;'
        ),
        output: lines(
          ' name     | price',
          '----------+---------',
          ' Backpack | 1200.00',
          ' Notebook |   60.00',
          ' Pen      |   10.00',
          '(3 rows)',
          '',
          ' name',
          '----------',
          ' Backpack',
          ' Notebook',
          ' Pen',
          '(3 rows)',
          '',
          ' name',
          '----------',
          ' Backpack',
          ' Notebook',
          ' Pen',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'DESC: most expensive first.' },
          { line: 4, note: 'Sorted by a column we do not show: newest first.' },
          { line: 5, note: 'Text in A to Z order (ASC is the default).' }
        ],
        tryIt: 'Change line 4 to show the oldest product first by removing DESC. Which product comes first now?',
        check: {
          question: 'Which query shows the newest orders first?',
          options: ['ORDER BY ordered_on DESC', 'ORDER BY ordered_on', 'ORDER BY ordered_on ASC'],
          answer: 0,
          why: 'Newer dates are larger, so descending order puts them first. ASC, the default, puts the oldest first.'
        }
      },
      {
        title: 'Sorting by more than one column',
        say: [
          'Often one column is not enough to decide the order. If several products have the same category, which comes first inside the category? You can give ORDER BY several columns, separated by commas.',
          'PostgreSQL sorts by the first column. Only when two rows have the same value there does it look at the second column, and so on. So ORDER BY category, price sorts by category A to Z, and inside each category, by price from cheapest.',
          'Each column has its own direction. ORDER BY category ASC, price DESC means categories A to Z, and inside each one, the most expensive first. The DESC only applies to the column right before it.',
          'Adding a final "tie-breaker" column, like the id, is a good professional habit. If two rows are equal on every sort column, their order is not guaranteed. Adding the id at the end makes the order completely fixed, which is important for pages, as you will see soon.',
          'Think of the sort columns as a list of questions: "first compare by this; if equal, compare by that". Writing it out in words before typing it helps avoid mistakes.'
        ],
        example: 'A school merit list is sorted by total marks, highest first. When two students have the same total, the school looks at their maths marks. If those are equal too, it uses the roll number. That is ORDER BY total DESC, maths DESC, roll_no.',
        code: lines(
          'CREATE TABLE products (id int, name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 'stationery', 10), (2, 'Headphones', 'electronics', 1499), (3, 'Stapler', 'stationery', 150),",
          "  (4, 'Phone stand', 'electronics', 299), (5, 'Notebook', 'stationery', 60), (6, 'Pencil', 'stationery', 10);",
          'SELECT category, name, price FROM products ORDER BY category, price DESC, id;'
        ),
        output: lines(
          ' category    | name        | price',
          '-------------+-------------+---------',
          ' electronics | Headphones  | 1499.00',
          ' electronics | Phone stand |  299.00',
          ' stationery  | Stapler     |  150.00',
          ' stationery  | Notebook    |   60.00',
          ' stationery  | Pen         |   10.00',
          ' stationery  | Pencil      |   10.00',
          '(6 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Category A to Z; inside it, most expensive first; for equal prices, by id.' }
        ],
        tryIt: 'Change ORDER BY to price, name and run it. Now Pen and Pencil (both 10) come first, in A to Z order.',
        check: {
          question: 'In ORDER BY city, name, when is name used?',
          options: ['Only to order rows that have the same city', 'First, before city', 'Never, only the first column counts'],
          answer: 0,
          why: 'The second column only breaks ties in the first. Rows with different cities are ordered by city alone.'
        }
      },
      {
        title: 'LIMIT: the top few rows',
        say: [
          'Very often you only want the first few rows of a sorted result: the 5 cheapest products, the 3 latest orders, the top 10 students. LIMIT does this. It goes at the very end of the query: ORDER BY price LIMIT 5.',
          'LIMIT without ORDER BY is almost always a bug. "Give me any 3 rows" is rarely a real question. Together, ORDER BY and LIMIT answer questions like "top 3" or "latest 10" correctly.',
          'LIMIT also protects your app. A query that could return a million rows might freeze a screen or use all the memory. Adding a sensible LIMIT keeps the result small, even if the table grows unexpectedly.',
          'Be careful with ties. If you ask for the top 3 prices and the 3rd and 4th products have the same price, LIMIT 3 cuts one of them off, and which one is not guaranteed unless you add a tie-breaker to ORDER BY. On Day 17 you will learn window functions, which handle "top N" with ties more carefully.',
          'You will also see FETCH FIRST 3 ROWS ONLY in some SQL. It is the official standard way of writing LIMIT 3. PostgreSQL understands both, and LIMIT is shorter.'
        ],
        example: 'A newspaper\'s "Top 5 stories of the day" list sorts all stories by how many people read them, then prints only the first five. Sorting is ORDER BY; printing only five is LIMIT.',
        code: lines(
          'CREATE TABLE products (id int, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Headphones', 1499), (2, 'Backpack', 1200), (3, 'Desk lamp', 899), (4, 'Water bottle', 350), (5, 'Phone stand', 299), (6, 'Pen', 10);",
          'SELECT name, price FROM products ORDER BY price DESC LIMIT 3;',
          'SELECT name FROM products ORDER BY price LIMIT 1;'
        ),
        output: lines(
          ' name       | price',
          '------------+---------',
          ' Headphones | 1499.00',
          ' Backpack   | 1200.00',
          ' Desk lamp  |  899.00',
          '(3 rows)',
          '',
          ' name',
          '------',
          ' Pen',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Sort most expensive first, then keep the first 3.' },
          { line: 4, note: 'The single cheapest product.' }
        ],
        tryIt: 'Write a query for the 2 cheapest products. Which ORDER BY direction do you need?',
        check: {
          question: 'Why use ORDER BY together with LIMIT?',
          options: ['Without ORDER BY, LIMIT returns an unpredictable set of rows', 'LIMIT only works after ORDER BY', 'ORDER BY makes LIMIT faster'],
          answer: 0,
          why: 'LIMIT keeps the first N rows of the result. Without an order, which rows are "first" is not guaranteed.'
        }
      },
      {
        title: 'OFFSET: pages of results',
        say: [
          'Apps rarely show hundreds of rows at once. They show pages: 10 products on page 1, the next 10 on page 2, and so on. OFFSET skips a number of rows before LIMIT starts counting.',
          'The formula is simple. With a page size of N, page P uses LIMIT N OFFSET (P - 1) times N. So with 10 per page, page 1 is OFFSET 0, page 2 is OFFSET 10, page 3 is OFFSET 20.',
          'Pages only work with a fixed, complete order. If two rows can swap places between one page and the next request, a product might appear on two pages, or be skipped. That is why you add a unique tie-breaker, like the id, at the end of ORDER BY.',
          'Asking for a page past the end is not an error. It simply returns no rows, which is how an app knows there are no more pages.',
          'OFFSET gets slower on very large tables, because PostgreSQL still has to count past all the skipped rows. Big apps sometimes use a different technique called keyset pagination: "give me the next 10 after id 12345". For most apps, and for this course, LIMIT with OFFSET is the right tool.'
        ],
        example: 'A book with 200 pages shows about 30 lines per page. To read page 3, you skip the first 60 lines and read the next 30. OFFSET 60 LIMIT 30 is page 3.',
        code: lines(
          'CREATE TABLE products (id int, name text);',
          "INSERT INTO products VALUES (1, 'Backpack'), (2, 'Desk lamp'), (3, 'Headphones'), (4, 'Notebook'), (5, 'Pen'), (6, 'Phone stand'), (7, 'Stapler');",
          'SELECT name FROM products ORDER BY name, id LIMIT 3 OFFSET 0;',
          'SELECT name FROM products ORDER BY name, id LIMIT 3 OFFSET 3;',
          'SELECT name FROM products ORDER BY name, id LIMIT 3 OFFSET 6;',
          'SELECT name FROM products ORDER BY name, id LIMIT 3 OFFSET 9;'
        ),
        output: lines(
          ' name',
          '------------',
          ' Backpack',
          ' Desk lamp',
          ' Headphones',
          '(3 rows)',
          '',
          ' name',
          '-------------',
          ' Notebook',
          ' Pen',
          ' Phone stand',
          '(3 rows)',
          '',
          ' name',
          '---------',
          ' Stapler',
          '(1 row)',
          '',
          ' name',
          '------',
          '(0 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Page 1: skip 0, show 3.' },
          { line: 4, note: 'Page 2: skip 3, show 3.' },
          { line: 5, note: 'Page 3 has only one product left.' },
          { line: 6, note: 'Past the end: no rows, no error.' }
        ],
        tryIt: 'Change the page size to 4: use LIMIT 4 with OFFSET 0 and OFFSET 4. How many pages do the 7 products fill now?',
        check: {
          question: 'With 20 items per page, what OFFSET gives page 3?',
          options: ['40', '60', '3'],
          answer: 0,
          why: 'Page 3 skips pages 1 and 2: (3 - 1) x 20 = 40 rows.'
        }
      },
      {
        title: 'Putting it together: a catalogue with pages',
        say: [
          'Let us build the query behind a shop\'s catalogue page. The user picks "in stock only", sorts by price from low to high, and moves to page 2, with 3 products per page.',
          'In SQL, each choice becomes one part of the query. The filter goes in WHERE. The sort goes in ORDER BY, with the id as a tie-breaker. The page number becomes LIMIT and OFFSET. The order of the parts is always the same: SELECT, FROM, WHERE, ORDER BY, LIMIT, OFFSET.',
          'Also notice NULLS LAST. When a column can be NULL, PostgreSQL puts NULLs at the end when sorting ascending, and at the start when descending. NULLS FIRST or NULLS LAST lets you choose. A product with an unknown price should usually go at the end, whichever way the user sorts.',
          'In today\'s practice you will find the 3 most expensive products, and page 2 of the catalogue sorted by name. Both are exactly the patterns from this lesson.',
          'Tomorrow you learn functions: changing capital letters, rounding money, and working with dates, all inside a query.'
        ],
        example: 'Every time you tap "Next page" on a shopping site, the app runs the same query again with a bigger OFFSET. The filter and the sort stay the same; only the page changes.',
        code: lines(
          'CREATE TABLE products (id int, name text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES (1, 'Notebook', 60, 120), (2, 'Pen', 10, 500), (3, 'Backpack', 1200, 15), (4, 'Water bottle', 350, 40),",
          "  (5, 'Desk lamp', 899, 0), (6, 'Headphones', 1499, 25), (7, 'Phone stand', 299, 60), (8, 'Mystery box', NULL, 5);",
          'SELECT name, price',
          'FROM products',
          'WHERE stock > 0',
          'ORDER BY price NULLS LAST, id',
          'LIMIT 3 OFFSET 3;'
        ),
        output: lines(
          ' name         | price',
          '--------------+---------',
          ' Water bottle |  350.00',
          ' Backpack     | 1200.00',
          ' Headphones   | 1499.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 6, note: 'The filter: in stock only (the Desk lamp is left out).' },
          { line: 7, note: 'Cheapest first; the product with no price goes last; id breaks ties.' },
          { line: 8, note: 'Page 2, with 3 per page.' }
        ],
        tryIt: 'Change OFFSET 3 to OFFSET 6 to see page 3. The Mystery box, with no price, appears there, at the very end.',
        check: {
          question: 'What is the correct order of these parts in a query?',
          options: ['WHERE, then ORDER BY, then LIMIT', 'LIMIT, then WHERE, then ORDER BY', 'ORDER BY, then WHERE, then LIMIT'],
          answer: 0,
          why: 'SQL always follows SELECT, FROM, WHERE, ORDER BY, LIMIT, OFFSET: filter first, then sort, then cut.'
        }
      }
    ],
    summary: [
      'Without ORDER BY, the order of rows is not guaranteed.',
      'ORDER BY column sorts ascending (ASC); add DESC for largest, newest or Z first.',
      'Several columns: the next column only breaks ties. Add the id as a final tie-breaker.',
      'LIMIT N keeps the first N rows; always use it with ORDER BY.',
      'Page P of size N: LIMIT N OFFSET (P - 1) x N. NULLS LAST puts unknown values at the end.'
    ],
    projectStep: {
      title: 'My Library: sorted lists and pages',
      steps: [
        'List your books sorted by author, and by title inside each author.',
        'Show your 3 longest books with ORDER BY pages DESC LIMIT 3.',
        'Show page 2 of your books, 2 per page, sorted by title and then id.',
        'Show unfinished books first: ORDER BY finished, title.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 7,
    title: 'Useful Functions for Text, Numbers and Dates',
    goal: 'You can use built-in functions to clean and format text, round and calculate numbers, and work with dates inside a query.',
    minutes: 28,
    recap: 'Yesterday you sorted results with ORDER BY, took the top rows with LIMIT, and made pages with OFFSET.',
    parts: [
      {
        title: 'What a function is in SQL',
        say: [
          'A function takes one or more values and gives back a new value. You have already met one: count(*). Today you meet the everyday functions that clean, format and calculate data inside a query.',
          'You call a function by writing its name and putting the values in brackets: upper(name), round(price, 2). The function runs once for every row, and its result appears as a new column.',
          'Functions never change the data stored in the table. SELECT upper(name) FROM customers shows names in capitals, but the table still holds them as they were. To change the stored data, you would use the function inside an UPDATE, like UPDATE customers SET name = upper(name).',
          'Always give a function\'s result a clear name with AS. Without it, PostgreSQL uses the function\'s name, like upper or round, which is confusing when you have several.',
          'You can put functions inside each other, like round(avg(price), 2). PostgreSQL works from the inside out: first the average, then the rounding. You will see many examples of this today.'
        ],
        example: 'A function is like a machine at a juice shop: you put in oranges, it gives back juice. The oranges in the basket are not changed; the machine just produces something new from them. upper(name) produces a capitalised copy of each name.',
        code: lines(
          'CREATE TABLE customers (name text, city text);',
          "INSERT INTO customers VALUES ('asha', 'pune'), ('Ravi', 'Mumbai');",
          'SELECT name, upper(name) AS shout, length(name) AS letters FROM customers;',
          'SELECT name FROM customers;'
        ),
        output: lines(
          ' name | shout | letters',
          '------+-------+---------',
          ' asha | ASHA  |       4',
          ' Ravi | RAVI  |       4',
          '(2 rows)',
          '',
          ' name',
          '------',
          ' asha',
          ' Ravi',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Two functions, each with its own column name.' },
          { line: 4, note: 'The stored names did not change.' }
        ],
        tryIt: 'Add lower(city) AS city_small to line 3 and run it.',
        check: {
          question: 'Does SELECT upper(name) FROM customers change the names stored in the table?',
          options: ['No, it only shows them in capitals', 'Yes, it changes them permanently', 'Only the first row'],
          answer: 0,
          why: 'SELECT only reads. To store the change, you would need UPDATE customers SET name = upper(name).'
        }
      },
      {
        title: 'Text functions',
        say: [
          'upper and lower change capital letters. initcap makes the first letter of each word a capital, which is handy for cleaning up names that users typed in any style.',
          'trim removes spaces at the start and the end. length counts the characters. These two help you clean and check data, for example finding names that are empty after trimming.',
          'To join text, use two vertical bars: first_name || \' \' || last_name. This is called concatenation. If any part is NULL, the whole result becomes NULL. The function concat does the same job but treats NULL as empty text, which is often safer.',
          'substring takes part of a text, and replace swaps one piece of text for another. For example, replace(phone, \' \', \'\') removes the spaces from a phone number. left(text, n) and right(text, n) take the first or last few characters.',
          'These functions are especially useful for cleaning messy data before saving it, and for building readable labels in reports, like "Asha (Pune)".',
          'A small warning about length: it counts characters, not bytes, so a name in Hindi or Tamil is counted correctly letter by letter. That matters in India, where apps often store names in several scripts. PostgreSQL handles them all as text, and the same functions work on them.'
        ],
        example: 'When a college prints ID cards, a clerk tidies each student\'s name: removes extra spaces, fixes the capital letters, and joins first and last names. Text functions do that tidying for thousands of names at once.',
        code: lines(
          'CREATE TABLE customers (first_name text, last_name text, city text, phone text);',
          "INSERT INTO customers VALUES ('  asha', 'RAO ', 'pune', '98765 43210'), ('ravi', 'kumar', NULL, '91234 56789');",
          'SELECT initcap(trim(first_name)) || \' \' || initcap(trim(last_name)) AS full_name,',
          '       concat(initcap(city), \'!\') AS city_label,',
          '       initcap(city) || \'!\' AS joined_with_bars,',
          "       replace(phone, ' ', '') AS phone_clean,",
          '       right(phone, 4) AS last_four',
          'FROM customers;'
        ),
        output: lines(
          ' full_name  | city_label | joined_with_bars | phone_clean | last_four',
          '------------+------------+------------------+-------------+-----------',
          ' Asha Rao   | Pune!      | Pune!            | 9876543210  | 3210',
          ' Ravi Kumar | !          | NULL             | 9123456789  | 6789',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Trim spaces, fix capitals, and join with a space in between.' },
          { line: 4, note: 'concat treats a NULL city as empty text.' },
          { line: 5, note: 'With ||, a NULL part makes the whole result NULL.' },
          { line: 7, note: 'The last 4 characters, like a bank app shows.' }
        ],
        tryIt: 'Add length(trim(first_name)) AS name_length to the query. Both names have 4 letters once the spaces are trimmed.',
        check: {
          question: "What is 'Hello ' || NULL?",
          options: ['NULL', "'Hello '", 'An error'],
          answer: 0,
          why: 'Joining anything with NULL using || gives NULL. Use concat() if you want NULL treated as empty text.'
        }
      },
      {
        title: 'Numbers: maths and rounding',
        say: [
          'SQL does maths with +, -, * and /. One trap: dividing two whole numbers gives a whole number, just like floor division. 7 / 2 is 3, not 3.5. If you want the decimal answer, make one side a decimal: 7 / 2.0, or 7::numeric / 2.',
          'The double colon :: is PostgreSQL\'s way of converting a value to another type, called a cast. 7::numeric turns the whole number 7 into an exact decimal. You will see casts often, for example \'2026-09-28\'::date.',
          'round(value, 2) rounds to 2 decimal places, which is what you want for money. round(value) with no second number rounds to a whole number. ceil rounds up and floor rounds down.',
          'The remainder of a division uses %: 17 % 5 is 2. And abs gives the size of a number without its sign, so abs(-250) is 250.',
          'Finally, coalesce(value, default) replaces NULL with a value you choose. coalesce(discount, 0) treats a missing discount as zero, so the maths works instead of producing NULL. It is one of the most used functions in real queries.',
          'Be careful when you cast text to a number. \'42\'::int works, but \'abc\'::int gives an error and stops the query. If data might be messy, clean it first with trim and check it, rather than casting everything and hoping. On Day 21 you will learn CHECK rules that stop messy values from being stored at all.'
        ],
        example: 'When a restaurant bill is split between 3 friends, the calculator shows 333.3333, and the cashier rounds it to 333.33. round does the same in SQL. And if a coupon box is empty, the cashier treats the discount as zero, which is coalesce.',
        code: lines(
          'SELECT 7 / 2 AS whole, 7 / 2.0 AS decimal, 7::numeric / 2 AS cast_first;',
          'SELECT round(1000 / 3.0, 2) AS share, ceil(4.1) AS up, floor(4.9) AS down, 17 % 5 AS remainder;',
          'CREATE TABLE items (name text, price numeric(10,2), discount numeric(10,2));',
          "INSERT INTO items VALUES ('Pen', 10, 2), ('Notebook', 60, NULL);",
          'SELECT name, price - discount AS plain, price - coalesce(discount, 0) AS safe FROM items;'
        ),
        output: lines(
          ' whole | decimal            | cast_first',
          '-------+--------------------+--------------------',
          '     3 | 3.5000000000000000 | 3.5000000000000000',
          '(1 row)',
          '',
          ' share  | up | down | remainder',
          '--------+----+------+-----------',
          ' 333.33 |  5 |    4 |         2',
          '(1 row)',
          '',
          ' name     | plain | safe',
          '----------+-------+-------',
          ' Pen      |  8.00 |  8.00',
          ' Notebook |  NULL | 60.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 1, note: 'Whole numbers divide to a whole number. Make one side a decimal for 3.5.' },
          { line: 2, note: 'round to 2 places for money; ceil up, floor down; % gives the remainder.' },
          { line: 5, note: 'A NULL discount makes the plain result NULL. coalesce treats it as 0.' }
        ],
        tryIt: 'Wrap the decimal on line 1 in round(..., 2) to show 3.50. Then try round(7 / 2.0) with no second number.',
        check: {
          question: 'What does coalesce(discount, 0) do?',
          options: ['Uses 0 when discount is NULL, otherwise the discount', 'Sets every discount to 0', 'Removes rows with no discount'],
          answer: 0,
          why: 'coalesce returns the first value that is not NULL, so a missing discount becomes 0.'
        }
      },
      {
        title: 'Dates: today, differences and parts',
        say: [
          'PostgreSQL is very good with dates. current_date is today\'s date, and now() is the current date and time. Because these change every day, the examples use fixed dates, so the output is always the same.',
          'Subtracting two dates gives the number of days between them: date \'2026-09-30\' - date \'2026-09-01\' is 29. Adding a number of days to a date gives a new date. For months and years, add an interval: order_date + interval \'1 month\'.',
          'extract pulls one part out of a date: extract(year from joined_on), extract(month from joined_on), extract(dow from day) for the day of the week, where 0 is Sunday. These are useful for grouping, like "customers per joining month".',
          'date_trunc rounds a date or time down to the start of a period: date_trunc(\'month\', ordered_on) turns any day in September into 1 September. That makes monthly reports easy, as you will see on Day 9.',
          'Dates can also be compared and sorted, as you did on Day 4. Remember to write dates as year-month-day, and to add ::date or the word date before the text when PostgreSQL needs to know it is a date.',
          'One more useful function is age. age(date \'2026-09-28\', date \'2004-08-15\') returns the difference as years, months and days, like 22 years 1 mon 13 days. It is handy for things like a customer\'s age or how long someone has been a member. For a simple number of days, subtracting dates is clearer.'
        ],
        example: 'A library\'s due-date stamp is date maths: the book was borrowed on the 1st, the loan is 14 days, so it is due on the 15th. If you return it on the 20th, the fine is for 5 days late. Subtracting dates gives exactly that 5.',
        code: lines(
          "SELECT date '2026-09-30' - date '2026-09-01' AS days_between,",
          "       date '2026-09-28' + 14 AS due_date,",
          "       date '2026-01-31' + interval '1 month' AS one_month_later;",
          "SELECT extract(year from date '2026-09-28') AS year,",
          "       extract(month from date '2026-09-28') AS month,",
          "       date_trunc('month', date '2026-09-28')::date AS month_start;"
        ),
        output: lines(
          ' days_between | due_date   | one_month_later',
          '--------------+------------+---------------------',
          '           29 | 2026-10-12 | 2026-02-28 00:00:00',
          '(1 row)',
          '',
          ' year | month | month_start',
          '------+-------+-------------',
          ' 2026 |     9 | 2026-09-01',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'Date minus date gives a number of days.' },
          { line: 2, note: 'Date plus a number of days gives a date.' },
          { line: 3, note: 'Adding a month to 31 January gives the last day of February, with a time part.' },
          { line: 6, note: 'The start of the month, turned back into a plain date with ::date.' }
        ],
        tryIt: "Work out how many days are left until 1 January 2027 from 28 September 2026: date '2027-01-01' - date '2026-09-28'.",
        check: {
          question: "What is date '2026-09-10' - date '2026-09-01'?",
          options: ['9', '10', "'9 days'"],
          answer: 0,
          why: 'Subtracting two dates gives the whole number of days between them: 10 - 1 = 9.'
        }
      },
      {
        title: 'Formatting dates and numbers for people',
        say: [
          'Databases store dates as year-month-day, but people often prefer "28 Sep 2026". to_char turns a date or number into text using a pattern. to_char(ordered_on, \'DD Mon YYYY\') gives 28 Sep 2026.',
          'The pattern letters are codes: DD is the day, Mon is the short month name, Month is the full name, YYYY is the year, and Day is the weekday. Adding FM in front, like FMDay, removes the padding spaces PostgreSQL otherwise adds.',
          'to_char also formats numbers: to_char(1250000, \'FM99,99,999\') places commas the way you choose. Many apps, though, format numbers in the app itself, because different users may want different styles.',
          'A good rule: keep the stored data in its proper type, and format it only when you show it. Store dates as date, money as numeric. If you store "28 Sep 2026" as text, you can no longer sort by date or do date maths.',
          'Formatting is the last step of a query, used for reports and exports. For anything an app will calculate with, return the real date or number and let the app format it.'
        ],
        example: 'A bank stores the transaction date in a strict computer format, but your printed passbook shows "28 Sep 2026". The data is the same; only its appearance changes for the reader.',
        code: lines(
          "SELECT to_char(date '2026-09-28', 'DD Mon YYYY') AS short_date,",
          "       to_char(date '2026-09-28', 'FMDay, DD FMMonth') AS long_date,",
          "       to_char(1250000, 'FM99,99,999') AS indian_commas;"
        ),
        output: lines(
          ' short_date  | long_date            | indian_commas',
          '-------------+----------------------+---------------',
          ' 28 Sep 2026 | Monday, 28 September | 12,50,000',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'DD day, Mon short month, YYYY year.' },
          { line: 2, note: 'FM removes padding; Day and Month give full names.' },
          { line: 3, note: 'Commas placed in the Indian lakh style by the pattern.' }
        ],
        tryIt: "Change the first pattern to 'DD/MM/YYYY' and run it. Then try 'YYYY-MM' to show just the year and month.",
        check: {
          question: 'Why store a date as date instead of text like "28 Sep 2026"?',
          options: ['So you can sort, compare and do date maths correctly', 'Text takes too much space', 'PostgreSQL cannot store text'],
          answer: 0,
          why: 'A real date sorts and calculates correctly. Format it with to_char only when you show it.'
        }
      },
      {
        title: 'Putting it together: an invoice view of products',
        say: [
          'Let us use today\'s functions to build a small invoice-style listing: product names in capitals, the price with 18% GST rounded to 2 decimals, a readable label, and how many days ago each product was added.',
          'Each column uses one or two functions, and each gets a clear name with AS. The result is a table a shop manager could read directly, without any extra processing.',
          'Notice that nothing in the table was changed. All the formatting happens in the SELECT. The original prices and dates are still stored in their proper types, ready for maths and sorting.',
          'In today\'s practice, you will show product names in capitals with the price including GST, and work out how many days before a fixed date each order was placed. Both use exactly the functions from this lesson.',
          'Tomorrow, you learn aggregate functions: count, sum, avg, min and max. They work on many rows at once to give totals and averages, which is where reports really begin.'
        ],
        example: 'A printed invoice takes plain stored data and dresses it up: names in capitals, money with 2 decimals, tax added, and dates in a friendly format. The accountant\'s records underneath stay exactly as they were.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2), added_on date);',
          "INSERT INTO products VALUES ('Pen', 10, '2026-09-25'), ('Headphones', 1499, '2026-09-01');",
          'SELECT upper(name) AS item,',
          '       round(price * 1.18, 2) AS price_with_gst,',
          "       name || ' (Rs ' || price || ')' AS label,",
          "       date '2026-09-28' - added_on AS days_listed",
          'FROM products',
          'ORDER BY days_listed DESC;'
        ),
        output: lines(
          ' item       | price_with_gst | label                   | days_listed',
          '------------+----------------+-------------------------+-------------',
          ' HEADPHONES |        1768.82 | Headphones (Rs 1499.00) |          27',
          ' PEN        |          11.80 | Pen (Rs 10.00)          |           3',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Price plus 18% GST, rounded for money.' },
          { line: 5, note: 'Join text and the price into one readable label.' },
          { line: 6, note: 'Days between a fixed date and when the product was added.' }
        ],
        tryIt: 'Add a fifth column that shows the added date as text with to_char(added_on, \'DD Mon\') AS listed_on.',
        check: {
          question: 'What does round(price * 1.18, 2) give for a price of 10?',
          options: ['11.80', '11.8000', '12'],
          answer: 0,
          why: '10 x 1.18 = 11.8, and rounding to 2 decimal places shows it as 11.80.'
        }
      }
    ],
    summary: [
      'Functions work on each row and return a new value; they never change stored data.',
      'Text: upper, lower, initcap, trim, length, replace, left, right; join with || or concat.',
      'Numbers: whole-number division drops decimals; use 2.0 or ::numeric; round, ceil, floor, %.',
      'coalesce(value, default) replaces NULL with a value you choose.',
      'Dates: subtract for days, + interval for months, extract, date_trunc, and to_char for display.'
    ],
    projectStep: {
      title: 'My Library: labels and dates',
      steps: [
        "Add a started_on date column to your books and fill it in for a few books.",
        "Show each book as a label: title || ' by ' || coalesce(author, 'unknown').",
        'Show how many days ago you started each book, using a fixed date for today.',
        "Show started_on formatted as 'DD Mon YYYY' with to_char."
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 8,
    title: 'Counting and Totals: COUNT, SUM, AVG, MIN, MAX',
    goal: 'You can turn many rows into one answer with count, sum, avg, min and max, and handle NULL in totals correctly.',
    minutes: 28,
    recap: 'Yesterday you used functions to format text, round numbers and work with dates.',
    parts: [
      {
        title: 'Aggregate functions: many rows, one answer',
        say: [
          'The functions from yesterday work on one row at a time. Today\'s functions are different: they look at many rows and give back one answer. They are called aggregate functions, and they are the heart of every report.',
          'There are five you will use all the time. count counts rows. sum adds up values. avg calculates the average. min finds the smallest value and max the largest.',
          'SELECT count(*) FROM products returns a single row with a single number: how many products there are. SELECT sum(stock) FROM products returns the total units in stock across all products.',
          'You can use several aggregates in one query: SELECT count(*), min(price), max(price), avg(price) FROM products gives four facts about the catalogue in one row. Give each one a clear name with AS.',
          'Aggregates also work with WHERE. The WHERE runs first and keeps only the matching rows, and then the aggregate works on those. So SELECT count(*) FROM orders WHERE status = \'delivered\' counts only delivered orders.',
          'Aggregates are also very fast compared with doing the same work in an app. If you loaded every order into Python or JavaScript just to add them up, you would send thousands of rows over the network. Asking PostgreSQL for sum(total) sends back a single number. A good rule is to let the database do the counting and adding, and send only the answer to the app.'
        ],
        example: 'At the end of a cricket match, nobody reads out every ball. The scoreboard shows totals: runs, wickets, the highest score. Aggregate functions turn the ball-by-ball data into the scoreboard.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60, 120), ('Pen', 'stationery', 10, 500), ('Backpack', 'bags', 1200, 15), ('Headphones', 'electronics', 1499, 25);",
          'SELECT count(*) AS products, sum(stock) AS units, min(price) AS cheapest, max(price) AS dearest FROM products;',
          "SELECT count(*) AS stationery_items FROM products WHERE category = 'stationery';"
        ),
        output: lines(
          ' products | units | cheapest | dearest',
          '----------+-------+----------+---------',
          '        4 |   660 |    10.00 | 1499.00',
          '(1 row)',
          '',
          ' stationery_items',
          '------------------',
          '                2',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Four answers about all products, in one row.' },
          { line: 4, note: 'WHERE runs first, then count counts the matching rows.' }
        ],
        tryIt: 'Add a query that shows the total value of all stock: sum(price * stock) AS stock_value. It should be 70,375.00.',
        check: {
          question: 'How many rows does SELECT sum(stock) FROM products return?',
          options: ['One row', 'One row per product', 'None'],
          answer: 0,
          why: 'An aggregate without GROUP BY turns all the rows into a single answer row.'
        }
      },
      {
        title: 'COUNT(*) and COUNT(column)',
        say: [
          'count comes in two forms, and the difference matters. count(*) counts rows, all of them. count(column) counts only the rows where that column is not NULL.',
          'So in a customers table where one customer has no city, count(*) might be 5 while count(city) is 4. Both are correct; they answer different questions: "how many customers?" and "how many customers told us their city?".',
          'count(DISTINCT column) counts the different values, ignoring duplicates and NULLs. count(DISTINCT city) answers "how many different cities do our customers live in?".',
          'Choosing the right count is a common source of subtle report bugs. If a manager asks "how many orders have a delivery date?", count(*) would be wrong; count(delivered_on) is right.',
          'On Day 12 you will see count(column) used with LEFT JOIN to count zero correctly, which is one of the most useful patterns in SQL.',
          'Which one should you use by default? For "how many rows", count(*) is the clearest and the fastest to read. Use count(column) only when you really mean "rows where this column has a value", and add a comment if the difference matters, so the next person reading the query does not change it by mistake.'
        ],
        example: 'In a class of 40, count(*) is 40 students. count(phone) is the number who gave a phone number, say 36. count(DISTINCT city) is how many different cities they come from, maybe 5.',
        code: lines(
          'CREATE TABLE customers (name text, city text);',
          "INSERT INTO customers VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai'), ('Priya', 'Pune'), ('Karan', 'Delhi'), ('Meera', NULL);",
          'SELECT count(*) AS customers, count(city) AS with_city, count(DISTINCT city) AS different_cities FROM customers;'
        ),
        output: lines(
          ' customers | with_city | different_cities',
          '-----------+-----------+------------------',
          '         5 |         4 |                3',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'All rows; rows with a city; different cities (Pune counted once).' }
        ],
        tryIt: "Add a sixth customer with city 'Mumbai' and run it. Which of the three numbers change?",
        check: {
          question: 'A table has 10 rows, and 3 of them have NULL in email. What is count(email)?',
          options: ['7', '10', '3'],
          answer: 0,
          why: 'count(column) skips NULL values, so only the 7 rows with an email are counted.'
        }
      },
      {
        title: 'SUM and AVG, and how they treat NULL',
        say: [
          'sum adds up a column and avg gives its average. Both skip NULL values completely. That is usually what you want, but you must know it.',
          'Imagine 4 products, one with an unknown price. avg(price) averages only the 3 known prices. It does not treat the unknown price as zero. If you wanted zero, you would write avg(coalesce(price, 0)), which gives a different, lower answer.',
          'If every value is NULL, or there are no rows at all, sum returns NULL, not 0. A report showing an empty total instead of 0 looks broken, so wrap it: coalesce(sum(amount), 0).',
          'The average of numbers usually has many decimals. PostgreSQL shows them all, which is not friendly. Wrap it: round(avg(price), 2).',
          'You can also sum and average calculations, like sum(price * quantity) for the total value of an order, or avg(date \'2026-09-30\' - ordered_on) for the average age of orders in days.',
          'Averages can mislead. If nine products cost about 100 rupees and one costs 50,000, the average is over 5,000, which describes none of the products well. For prices and salaries, analysts often look at the median, the middle value, as well. PostgreSQL can calculate it with percentile_cont(0.5) WITHIN GROUP (ORDER BY price), but for now it is enough to know that the average is not the whole story.'
        ],
        example: 'If three friends tell you their marks and one refuses, the class average you calculate is based on three people, not four with a zero. SQL does the same: an unknown value is left out, not counted as zero.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Pen', 10), ('Notebook', 60), ('Stapler', 150), ('Mystery box', NULL);",
          'SELECT avg(price) AS raw_average, round(avg(price), 2) AS average, round(avg(coalesce(price, 0)), 2) AS unknown_as_zero FROM products;',
          "SELECT sum(price) AS plain_sum, coalesce(sum(price), 0) AS safe_sum FROM products WHERE name = 'Nothing';"
        ),
        output: lines(
          ' raw_average         | average | unknown_as_zero',
          '---------------------+---------+-----------------',
          ' 73.3333333333333333 |   73.33 |           55.00',
          '(1 row)',
          '',
          ' plain_sum | safe_sum',
          '-----------+----------',
          '      NULL |        0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'avg skips the NULL: (10 + 60 + 150) / 3. Treating it as 0 divides by 4 instead.' },
          { line: 4, note: 'No matching rows: sum is NULL; coalesce turns it into 0.' }
        ],
        tryIt: 'Add sum(price) AS total to line 3. Is the Mystery box counted?',
        check: {
          question: 'What does avg(price) do with rows where price is NULL?',
          options: ['Leaves them out of the average', 'Counts them as 0', 'Returns NULL for the whole average'],
          answer: 0,
          why: 'Aggregates like avg and sum skip NULL values. Use coalesce if you want them counted as 0.'
        }
      },
      {
        title: 'MIN and MAX on numbers, text and dates',
        say: [
          'min and max find the smallest and largest value in a column. They work on numbers, as you would expect, but also on dates and text.',
          'On dates, min gives the earliest and max the latest. SELECT max(ordered_on) FROM orders answers "when was the last order?", a question every shop owner asks.',
          'On text, min and max use alphabetical order: min(name) is the name that would come first in A to Z order.',
          'A common beginner question is: "how do I get the name of the most expensive product?". SELECT name, max(price) FROM products gives an error, because max returns one row while name has many. The simple answer uses what you learned on Day 6: ORDER BY price DESC LIMIT 1. On Day 15 you will see another way with a subquery.',
          'min and max also skip NULL values, like the other aggregates.',
          'min and max are also a quick way to check data quality. If max(price) is 99,99,999 or min(ordered_on) is in the year 1900, something was typed wrong or loaded badly. Running a few min and max queries on a new table is a simple habit that finds problems before they reach a report.'
        ],
        example: 'On a train timetable, min(departure) is the first train of the day and max(departure) the last. You do not need to read the whole timetable to find them.',
        code: lines(
          'CREATE TABLE orders (id int, customer text, ordered_on date, total numeric(10,2));',
          "INSERT INTO orders VALUES (1, 'Ravi', '2026-09-03', 1200), (2, 'Asha', '2026-09-25', 50), (3, 'Priya', '2026-09-12', 760);",
          'SELECT min(ordered_on) AS first_order, max(ordered_on) AS last_order, min(customer) AS first_name_a_to_z FROM orders;',
          'SELECT customer, total FROM orders ORDER BY total DESC LIMIT 1;',
          'SELECT customer, max(total) FROM orders;'
        ),
        output: lines(
          ' first_order | last_order | first_name_a_to_z',
          '-------------+------------+-------------------',
          ' 2026-09-03  | 2026-09-25 | Asha',
          '(1 row)',
          '',
          ' customer | total',
          '----------+---------',
          ' Ravi     | 1200.00',
          '(1 row)',
          '',
          '[Error] column "orders.customer" must appear in the GROUP BY clause or be used in an aggregate function'
        ),
        codeNotes: [
          { line: 3, note: 'Earliest and latest dates, and the first name in A to Z order.' },
          { line: 4, note: 'The right way to find who placed the biggest order.' },
          { line: 5, note: 'This mixes one-per-row values with one-for-all: PostgreSQL refuses.' }
        ],
        tryIt: 'Fix line 5 by adding GROUP BY customer at the end, and run it again. Now it shows each customer\'s biggest order.',
        check: {
          question: 'How do you find the name of the most expensive product?',
          options: ['SELECT name FROM products ORDER BY price DESC LIMIT 1', 'SELECT name, max(price) FROM products', 'SELECT max(name) FROM products'],
          answer: 0,
          why: 'Sorting and taking the first row returns the whole row. Mixing name with max(price) is an error, and max(name) is just the last name in A to Z order.'
        }
      },
      {
        title: 'Aggregates with WHERE and calculations',
        say: [
          'Most real reports combine a filter with aggregates. "Total sales in September", "average order value for delivered orders", "number of products under 100 rupees". The WHERE picks the rows, the aggregate summarises them.',
          'Remember the order in which PostgreSQL works: FROM picks the table, WHERE filters the rows, and only then are the aggregates calculated. So a WHERE cannot use an aggregate like WHERE count(*) > 5. Filtering on aggregates needs HAVING, which you will learn tomorrow.',
          'Calculations inside aggregates are very common: sum(price * quantity) gives the total value, and avg(price * 1.18) gives the average price including GST.',
          'You can also count only some rows inside one query with FILTER: count(*) FILTER (WHERE status = \'delivered\'). This lets you put several counts side by side in a single row, which makes compact summary reports.',
          'Always sanity-check totals. If a report says the average order is 5 crore rupees, something is wrong, maybe a missing WHERE or a unit mistake. Developers who double-check numbers are trusted.',
          'When a total looks wrong, break it down. Count the rows first, then look at the biggest few with ORDER BY and LIMIT, then check the WHERE. Most wrong totals come from counting rows you did not mean to include, such as cancelled orders or test data, rather than from the maths itself.'
        ],
        example: 'A shop owner asks: "In September, how many orders did we deliver, and what was the total value?". You first pick September\'s delivered orders, then count and add them up. WHERE is the picking; count and sum are the adding up.',
        code: lines(
          'CREATE TABLE orders (id int, status text, ordered_on date, total numeric(10,2));',
          "INSERT INTO orders VALUES (1, 'delivered', '2026-09-01', 280), (2, 'delivered', '2026-09-03', 1200), (3, 'shipped', '2026-09-10', 2097),",
          "  (4, 'delivered', '2026-09-12', 760), (5, 'cancelled', '2026-09-20', 899), (6, 'delivered', '2026-10-02', 450);",
          'SELECT count(*) AS delivered_orders, sum(total) AS delivered_value, round(avg(total), 2) AS average_value',
          'FROM orders',
          "WHERE status = 'delivered' AND ordered_on >= '2026-09-01' AND ordered_on < '2026-10-01';",
          "SELECT count(*) AS all_orders, count(*) FILTER (WHERE status = 'cancelled') AS cancelled FROM orders;"
        ),
        output: lines(
          ' delivered_orders | delivered_value | average_value',
          '------------------+-----------------+---------------',
          '                3 |         2240.00 |        746.67',
          '(1 row)',
          '',
          ' all_orders | cancelled',
          '------------+-----------',
          '          6 |         1',
          '(1 row)'
        ),
        codeNotes: [
          { line: 6, note: 'First keep September\'s delivered orders...' },
          { line: 4, note: '...then count, add and average them.' },
          { line: 7, note: 'FILTER counts only some rows, next to the total count.' }
        ],
        tryIt: "Add a third column to line 7: count(*) FILTER (WHERE status = 'delivered') AS delivered. It should be 4.",
        check: {
          question: 'Why can you not write WHERE count(*) > 5?',
          options: ['WHERE runs before aggregates are calculated', 'count cannot compare numbers', 'You need two WHERE clauses'],
          answer: 0,
          why: 'WHERE filters individual rows first. To filter on an aggregate result you use HAVING, which you learn tomorrow.'
        }
      },
      {
        title: 'Putting it together: the catalogue in numbers',
        say: [
          'Let us write a one-row summary of the shop\'s catalogue, the kind of numbers a manager checks every morning: how many products, the cheapest and dearest, the average price, and the total units in stock.',
          'Every column is one aggregate, some wrapped in round for readable money, and each one has a clear name. The result is a single row: the shop in numbers.',
          'Notice that the summary query has no GROUP BY, so it returns exactly one row, however many products there are. That makes it perfect for the tiles at the top of a dashboard: each tile reads one column of this one row.',
          'Then we add a second query with FILTER to count products by stock level: out of stock, low stock and plenty. These small summaries are what dashboards are built from.',
          'In today\'s practice, you will write a one-row catalogue summary with count, min and max, and another with the total stock and the average price rounded to 2 decimals.',
          'Tomorrow you learn GROUP BY: instead of one summary for the whole table, one summary per group, like per category or per month. That is where reports become really powerful.'
        ],
        example: 'A shop\'s morning dashboard is just a handful of numbers: products, stock, prices. Each number is one aggregate query, and together they tell the owner how the shop is doing at a glance.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 60, 120), ('Pen', 10, 500), ('Backpack', 1200, 15), ('Water bottle', 350, 40),",
          "  ('Desk lamp', 899, 0), ('Headphones', 1499, 25), ('Phone stand', 299, 60), ('Stapler', 150, 30);",
          'SELECT count(*) AS products, min(price) AS lowest, max(price) AS highest,',
          '       round(avg(price), 2) AS avg_price, sum(stock) AS total_stock',
          'FROM products;',
          'SELECT count(*) FILTER (WHERE stock = 0) AS out_of_stock,',
          '       count(*) FILTER (WHERE stock BETWEEN 1 AND 30) AS low_stock,',
          '       count(*) FILTER (WHERE stock > 30) AS plenty',
          'FROM products;'
        ),
        output: lines(
          ' products | lowest | highest | avg_price | total_stock',
          '----------+--------+---------+-----------+-------------',
          '        8 |  10.00 | 1499.00 |    558.38 |         790',
          '(1 row)',
          '',
          ' out_of_stock | low_stock | plenty',
          '--------------+-----------+--------',
          '            1 |         3 |      4',
          '(1 row)'
        ),
        codeNotes: [
          { line: 5, note: 'Round the average for money.' },
          { line: 8, note: 'BETWEEN includes both 1 and 30.' }
        ],
        tryIt: 'Add sum(price * stock) AS stock_value to the first query, rounded to 2 decimals.',
        check: {
          question: 'What does round(avg(price), 2) do?',
          options: ['Averages the prices, then rounds the result to 2 decimals', 'Rounds each price, then averages', 'Averages only the first 2 prices'],
          answer: 0,
          why: 'Functions work from the inside out: first avg over all rows, then round the one result.'
        }
      }
    ],
    summary: [
      'Aggregates turn many rows into one answer: count, sum, avg, min, max.',
      'count(*) counts rows; count(column) skips NULL; count(DISTINCT column) counts different values.',
      'sum and avg skip NULL; use coalesce(sum(x), 0) for an empty total; round averages.',
      'min and max work on numbers, dates and text. For the row with the max, use ORDER BY ... LIMIT 1.',
      'WHERE filters rows before aggregating; FILTER counts some rows next to others.'
    ],
    projectStep: {
      title: 'My Library: reading statistics',
      steps: [
        'Count your books, and count how many you have finished with FILTER.',
        'Find your shortest and longest book in pages with min and max.',
        'Find the average number of pages, rounded to a whole number.',
        'Count how many different authors you have with count(DISTINCT author).'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 9,
    title: 'Groups: GROUP BY and HAVING',
    goal: 'You can calculate totals per group with GROUP BY, follow the grouping rule, and filter groups with HAVING.',
    minutes: 28,
    recap: 'Yesterday you used count, sum, avg, min and max to turn a whole table into one summary row.',
    parts: [
      {
        title: 'GROUP BY: one summary per group',
        say: [
          'Yesterday\'s aggregates gave one answer for the whole table. But managers usually want answers per group: products per category, sales per city, orders per month. GROUP BY does exactly that.',
          'SELECT category, count(*) FROM products GROUP BY category splits the products into groups, one for each category, and counts each group separately. The result has one row per category.',
          'Think of it in two steps. First, PostgreSQL puts rows with the same category into the same pile. Then it runs the aggregate on each pile and writes one row per pile.',
          'You can use any aggregate with GROUP BY: sum(stock) per category, avg(price) per category, max(ordered_on) per customer. And several at once, each with its own name.',
          'The groups come out in no particular order, just like any result without ORDER BY. Add ORDER BY to sort them, for example by the count, biggest first.',
          'You can also group without any aggregate. SELECT category FROM products GROUP BY category simply lists each category once, like SELECT DISTINCT category. In practice, DISTINCT is clearer for that job, and GROUP BY is used when you also want counts or totals per group.'
        ],
        example: 'After a school sports day, the teacher does not announce every race result. She sorts the results into piles by house, Red, Blue, Green, Yellow, and announces the total points per house. Sorting into piles is GROUP BY; adding up each pile is sum.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60, 120), ('Pen', 'stationery', 10, 500), ('Stapler', 'stationery', 150, 30),",
          "  ('Headphones', 'electronics', 1499, 25), ('Phone stand', 'electronics', 299, 60), ('Backpack', 'bags', 1200, 15);",
          'SELECT category, count(*) AS products, sum(stock) AS units',
          'FROM products',
          'GROUP BY category',
          'ORDER BY products DESC, category;'
        ),
        output: lines(
          ' category    | products | units',
          '-------------+----------+-------',
          ' stationery  |        3 |   650',
          ' electronics |        2 |    85',
          ' bags        |        1 |    15',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 6, note: 'One pile per category.' },
          { line: 4, note: 'For each pile: its name, how many rows, and the total stock.' },
          { line: 7, note: 'Sort the groups: most products first.' }
        ],
        tryIt: 'Add round(avg(price), 2) AS avg_price to the SELECT to see the average price per category.',
        check: {
          question: 'How many rows does SELECT city, count(*) FROM customers GROUP BY city return?',
          options: ['One row per different city', 'One row per customer', 'Always one row'],
          answer: 0,
          why: 'GROUP BY makes one group, and one result row, for each different value of city.'
        }
      },
      {
        title: 'The grouping rule',
        say: [
          'There is one rule that every beginner meets: in a query with GROUP BY, every column in the SELECT must either be in the GROUP BY, or be inside an aggregate.',
          'Why? Each result row represents a whole group. The category is the same for the whole group, so it can be shown. The count is one number for the group, so it can be shown. But a product name? There are several names in the stationery group. PostgreSQL does not know which one you want, so it refuses.',
          'The error message says exactly this: column must appear in the GROUP BY clause or be used in an aggregate function. When you see it, look at the column it names and decide: do you want one row per value of that column (add it to GROUP BY), or a summary of it (wrap it in an aggregate)?',
          'There is a useful exception: if you group by a table\'s primary key, PostgreSQL knows every other column of that table has only one value per group, so you may show them. You will use this with joins later.',
          'Some other databases, like older versions of MySQL, quietly pick a random value instead of refusing. PostgreSQL\'s strictness is a good thing: it stops wrong reports.',
          'If you really do want one example value from each group, say so explicitly with an aggregate: min(name) or max(name) picks the first or last name in A to Z order. The query then states exactly which value you mean, and anyone reading it understands the result.'
        ],
        example: 'If a teacher reports the total marks for each house, she can say "Red house: 250 points". She cannot say "Red house: student name ___", because Red house has many students. She can only name something that is the same for the whole house, or a summary like "top scorer".',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60), ('Pen', 'stationery', 10), ('Headphones', 'electronics', 1499), ('Phone stand', 'electronics', 299);",
          'SELECT category, max(price) AS top_price, min(name) AS first_name_a_to_z FROM products GROUP BY category ORDER BY category;',
          'SELECT category, name FROM products GROUP BY category;'
        ),
        output: lines(
          ' category    | top_price | first_name_a_to_z',
          '-------------+-----------+-------------------',
          ' electronics |   1499.00 | Headphones',
          ' stationery  |     60.00 | Notebook',
          '(2 rows)',
          '',
          '[Error] column "products.name" must appear in the GROUP BY clause or be used in an aggregate function'
        ),
        codeNotes: [
          { line: 3, note: 'Allowed: category is grouped; max and min are aggregates.' },
          { line: 4, note: 'Not allowed: which of the names in each group should be shown?' }
        ],
        tryIt: 'Change line 4 to end with GROUP BY category, name and run it again. Now each group is one product, so the query works.',
        check: {
          question: 'In SELECT city, name, count(*) FROM customers GROUP BY city, what is wrong?',
          options: ['name is neither in GROUP BY nor inside an aggregate', 'count(*) cannot be used with GROUP BY', 'city must be last'],
          answer: 0,
          why: 'Each group is one city with many names. name must be grouped too, or summarised, for example with min(name).'
        }
      },
      {
        title: 'Grouping by more than one column, and by calculations',
        say: [
          'You can group by several columns. GROUP BY city, status makes one group for each combination: Pune delivered, Pune pending, Mumbai delivered, and so on. It answers questions like "how many orders of each status in each city?".',
          'You can also group by a calculation. The most useful example is dates: GROUP BY date_trunc(\'month\', ordered_on) makes one group per month, whatever the day. This is how monthly sales reports are built.',
          'When you group by a calculation, repeat the same calculation in the SELECT so it appears in the result. Or give it a name in the SELECT and group by that position or name, which PostgreSQL also allows.',
          'The same idea works with CASE, which you will meet on Day 19: grouping products into price bands like budget, mid and premium, and counting each band.',
          'As always, add ORDER BY so the groups come out in a sensible order, like months in time order.'
        ],
        example: 'A bank statement summary shows spending per month and per category: September food, September travel, October food. Each line is one combination of month and category, which is GROUP BY month, category.',
        code: lines(
          'CREATE TABLE orders (id int, city text, status text, ordered_on date, total numeric(10,2));',
          "INSERT INTO orders VALUES (1, 'Pune', 'delivered', '2026-08-28', 280), (2, 'Mumbai', 'delivered', '2026-09-03', 1200), (3, 'Pune', 'shipped', '2026-09-10', 2097),",
          "  (4, 'Pune', 'delivered', '2026-09-12', 760), (5, 'Mumbai', 'pending', '2026-10-02', 450);",
          'SELECT city, status, count(*) AS orders FROM orders GROUP BY city, status ORDER BY city, status;',
          "SELECT date_trunc('month', ordered_on)::date AS month, sum(total) AS sales",
          'FROM orders',
          "GROUP BY date_trunc('month', ordered_on)",
          'ORDER BY month;'
        ),
        output: lines(
          ' city   | status    | orders',
          '--------+-----------+--------',
          ' Mumbai | delivered |      1',
          ' Mumbai | pending   |      1',
          ' Pune   | delivered |      2',
          ' Pune   | shipped   |      1',
          '(4 rows)',
          '',
          ' month      | sales',
          '------------+---------',
          ' 2026-08-01 |  280.00',
          ' 2026-09-01 | 4057.00',
          ' 2026-10-01 |  450.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'One group for each city and status combination.' },
          { line: 7, note: 'Group by the start of each month: a monthly report.' }
        ],
        tryIt: "Change the monthly query to group by city as well: SELECT city, date_trunc('month', ordered_on)::date AS month, ... GROUP BY city, date_trunc('month', ordered_on).",
        check: {
          question: 'How do you make a report with one row per month?',
          options: ["GROUP BY date_trunc('month', ordered_on)", 'GROUP BY ordered_on', 'ORDER BY month'],
          answer: 0,
          why: 'date_trunc turns every date in a month into the first of that month, so all of the month\'s rows fall into one group.'
        }
      },
      {
        title: 'HAVING: filtering groups',
        say: [
          'WHERE filters rows before grouping. But sometimes you want to filter the groups themselves: categories with more than 2 products, customers who ordered more than 3 times, months with sales above 1 lakh. For that, SQL has HAVING.',
          'HAVING comes after GROUP BY and can use aggregates: GROUP BY category HAVING count(*) > 2. Each group is checked after its count is known, and only the groups that pass appear in the result.',
          'You can use WHERE and HAVING in the same query. WHERE runs first, on rows: "only delivered orders". Then the groups are made and counted. Then HAVING runs, on groups: "only customers with 2 or more of those orders".',
          'A good rule: if the condition is about a single row, like status or price, put it in WHERE. If it is about a group summary, like a count or a total, put it in HAVING. Putting row conditions in WHERE is also faster, because fewer rows need grouping.',
          'The full order of a query is now: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. It is worth memorising, because interviewers often ask about the difference between WHERE and HAVING.',
          'Although you write SELECT first, PostgreSQL works in a different order: FROM, then WHERE, then GROUP BY, then HAVING, then SELECT, then ORDER BY, then LIMIT. Knowing this explains many rules. For example, WHERE cannot use a name you gave with AS in the SELECT, because the SELECT has not happened yet when WHERE runs, but ORDER BY can, because it runs after.'
        ],
        example: 'A school wants to award houses that scored more than 200 points. First it adds up the points per house (GROUP BY), then it looks at each house total and keeps only those above 200 (HAVING). It cannot check "above 200" for a single race result; it needs the totals first.',
        code: lines(
          'CREATE TABLE orders (id int, customer text, status text, total numeric(10,2));',
          "INSERT INTO orders VALUES (1, 'Asha', 'delivered', 280), (2, 'Ravi', 'delivered', 1200), (3, 'Asha', 'shipped', 2097),",
          "  (4, 'Priya', 'delivered', 760), (5, 'Asha', 'delivered', 50), (6, 'Ravi', 'cancelled', 899);",
          'SELECT customer, count(*) AS orders FROM orders GROUP BY customer HAVING count(*) >= 2 ORDER BY customer;',
          'SELECT customer, sum(total) AS delivered_value',
          'FROM orders',
          "WHERE status = 'delivered'",
          'GROUP BY customer',
          'HAVING sum(total) > 500',
          'ORDER BY delivered_value DESC;'
        ),
        output: lines(
          ' customer | orders',
          '----------+--------',
          ' Asha     |      3',
          ' Ravi     |      2',
          '(2 rows)',
          '',
          ' customer | delivered_value',
          '----------+-----------------',
          ' Ravi     |         1200.00',
          ' Priya    |          760.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Keep only customers with 2 or more orders.' },
          { line: 7, note: 'WHERE: row by row, only delivered orders.' },
          { line: 9, note: 'HAVING: group by group, only totals above 500. Asha\'s delivered total is 330.' }
        ],
        tryIt: 'Remove the WHERE line from the second query and run it. Asha now appears, because her shipped order counts too.',
        check: {
          question: 'Which clause filters categories that have more than 5 products?',
          options: ['HAVING count(*) > 5', 'WHERE count(*) > 5', 'ORDER BY count(*) > 5'],
          answer: 0,
          why: 'The condition uses an aggregate about each group, so it belongs in HAVING, after GROUP BY.'
        }
      },
      {
        title: 'Common grouping mistakes',
        say: [
          'A few mistakes come up again and again with GROUP BY. Knowing them saves hours of confusion.',
          'The first is putting an aggregate in WHERE, like WHERE count(*) > 1. PostgreSQL refuses, because WHERE runs before any counting. Move it to HAVING.',
          'The second is grouping by too much. If you add the product name to GROUP BY by accident, every product becomes its own group and all your counts are 1. If the numbers look suspiciously small, check your GROUP BY list.',
          'The third is forgetting that NULL forms its own group. Customers with no city are grouped together in one row whose city is NULL. That is usually correct, but label it clearly in reports, for example with coalesce(city, \'Unknown\').',
          'The fourth is counting the wrong thing after a filter. If you want customers with no orders to appear with 0, you need a LEFT JOIN and count(column), which you will learn on Day 12. A plain GROUP BY on the orders table only shows customers who have orders.'
        ],
        example: 'Counting votes per party, a careless clerk writes each voter\'s name on the tally sheet too. Now every line is one person, and every count is 1. Grouping by too much hides the totals you wanted.',
        code: lines(
          'CREATE TABLE customers (name text, city text);',
          "INSERT INTO customers VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai'), ('Priya', 'Pune'), ('Meera', NULL), ('Kabir', NULL);",
          "SELECT coalesce(city, 'Unknown') AS city, count(*) AS customers FROM customers GROUP BY city ORDER BY customers DESC, city;",
          'SELECT city, name, count(*) AS customers FROM customers GROUP BY city, name ORDER BY name LIMIT 2;'
        ),
        output: lines(
          ' city    | customers',
          '---------+-----------',
          ' Pune    |         2',
          ' Unknown |         2',
          ' Mumbai  |         1',
          '(3 rows)',
          '',
          ' city | name  | customers',
          '------+-------+-----------',
          ' Pune | Asha  |         1',
          ' NULL | Kabir |         1',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Customers with no city form their own group, labelled with coalesce.' },
          { line: 4, note: 'Grouping by name too: every group is one person, so every count is 1.' }
        ],
        tryIt: 'In line 3, change ORDER BY to city only. Where does the Unknown group appear now, and why?',
        check: {
          question: 'Every count in your grouped report is 1. What is the most likely cause?',
          options: ['A column that is unique per row, like name or id, is in the GROUP BY', 'The table is empty', 'HAVING is missing'],
          answer: 0,
          why: 'Grouping by a unique column makes each row its own group, so every count is 1.'
        }
      },
      {
        title: 'Putting it together: a category report',
        say: [
          'Let us write the category report a shop manager would ask for: for each category, the number of products, the total stock and the average price, only for categories with more than one product, biggest categories first.',
          'Read the query from top to bottom and match each line to a part of the question. SELECT lists what to show. FROM names the table. GROUP BY makes one row per category. HAVING keeps categories with more than one product. ORDER BY sorts them.',
          'This is a real, useful report, and it uses everything from the last two days. Many junior analyst and backend interviews include a question just like this.',
          'In today\'s practice, you will count the products in each category, and then show only the categories that have more than one product. The shop database is ready in the practice editor.',
          'Tomorrow you learn how tables link to each other with foreign keys, the idea behind joins, which are the most important topic of week 2.'
        ],
        example: 'A supermarket manager\'s weekly review looks at each aisle: how many products it has, how much stock, and the average price, but only for aisles with enough products to matter. That review is this query.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60, 120), ('Pen', 'stationery', 10, 500), ('Stapler', 'stationery', 150, 30),",
          "  ('Headphones', 'electronics', 1499, 25), ('Phone stand', 'electronics', 299, 60), ('Backpack', 'bags', 1200, 15), ('Desk lamp', 'home', 899, 0);",
          'SELECT category,',
          '       count(*) AS products,',
          '       sum(stock) AS total_stock,',
          '       round(avg(price), 2) AS avg_price',
          'FROM products',
          'GROUP BY category',
          'HAVING count(*) > 1',
          'ORDER BY products DESC;'
        ),
        output: lines(
          ' category    | products | total_stock | avg_price',
          '-------------+----------+-------------+-----------',
          ' stationery  |        3 |         650 |     73.33',
          ' electronics |        2 |          85 |    899.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'One row per category.' },
          { line: 10, note: 'Only categories with more than one product.' },
          { line: 11, note: 'Biggest categories first.' }
        ],
        tryIt: 'Remove the HAVING line and run it. Which categories appear now, and how many products do they have?',
        check: {
          question: 'What is the correct order of these clauses?',
          options: ['WHERE, GROUP BY, HAVING, ORDER BY', 'GROUP BY, WHERE, ORDER BY, HAVING', 'HAVING, GROUP BY, WHERE, ORDER BY'],
          answer: 0,
          why: 'Rows are filtered (WHERE), grouped (GROUP BY), groups are filtered (HAVING), then sorted (ORDER BY).'
        }
      }
    ],
    summary: [
      'GROUP BY makes one result row per group; aggregates then work on each group.',
      'The rule: every selected column is in GROUP BY or inside an aggregate.',
      'Group by several columns for combinations, or by date_trunc for months.',
      'WHERE filters rows before grouping; HAVING filters groups after.',
      'Order of clauses: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.'
    ],
    projectStep: {
      title: 'My Library: books per author',
      steps: [
        'Count your books per author, with the author shown as coalesce(author, \'Unknown\').',
        'Show the total pages per author, most pages first.',
        'Show only authors with more than one book, using HAVING.',
        'Count finished and unfinished books with GROUP BY finished.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 10,
    title: 'Linking Tables: Relationships and Foreign Keys',
    goal: 'You can explain one-to-many and many-to-many relationships, create foreign keys, and see how they protect linked data.',
    minutes: 28,
    recap: 'Yesterday you made reports per group with GROUP BY and filtered groups with HAVING.',
    parts: [
      {
        title: 'Why data is split into several tables',
        say: [
          'So far most examples used one table at a time. Real apps have many tables that are linked: customers place orders, orders contain products. Today you learn how these links work, which prepares you for joins tomorrow.',
          'Why not keep everything in one big table? Imagine an orders table that also stores the customer\'s name, phone and address on every order. A customer with 50 orders has their address copied 50 times. If they move, you must change 50 rows, and if you miss one, the data disagrees with itself.',
          'The better design stores each customer once, in a customers table, with an id. Each order then stores only the customer\'s id. The address lives in one place, and changing it once fixes it everywhere.',
          'This idea, storing each fact once and linking with ids, is the foundation of relational databases. The word "relational" comes from the relationships between tables.',
          'On Day 20 you will learn the formal rules for this, called normalization. Today, the key idea is simply: one table per kind of thing, and ids to link them.'
        ],
        example: 'A college does not write a student\'s full address on every exam paper. The paper just has the roll number. The address is stored once in the admissions office. If the student moves, only the office record changes, and every paper still points to the right student.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text, city text);',
          "INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai');",
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, total numeric(10,2));',
          'INSERT INTO orders VALUES (101, 1, 280), (102, 2, 1200), (103, 1, 2097);',
          "UPDATE customers SET city = 'Bengaluru' WHERE id = 1;",
          'SELECT id, customer_id, total FROM orders ORDER BY id;',
          'SELECT * FROM customers ORDER BY id;'
        ),
        output: lines(
          ' id  | customer_id | total',
          '-----+-------------+---------',
          ' 101 |           1 |  280.00',
          ' 102 |           2 | 1200.00',
          ' 103 |           1 | 2097.00',
          '(3 rows)',
          '',
          ' id | name | city',
          '----+------+-----------',
          '  1 | Asha | Bengaluru',
          '  2 | Ravi | Mumbai',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Orders store only the customer\'s id, not their name or city.' },
          { line: 5, note: 'Asha moves: one row changes, and both her orders still point to her.' }
        ],
        tryIt: "Add a third order for Ravi: (104, 2, 450). Notice you only need his id, not his name or city.",
        check: {
          question: 'Why store customer_id in orders instead of the customer\'s name and address?',
          options: ['Each customer\'s details are stored once, so a change is made in one place', 'Ids are shorter to type', 'Orders cannot hold text'],
          answer: 0,
          why: 'Storing details once avoids copies that can disagree. The id links each order to the one customer record.'
        }
      },
      {
        title: 'One-to-many relationships',
        say: [
          'The most common relationship is one-to-many: one customer has many orders, but each order belongs to exactly one customer. One category has many products. One author has many books.',
          'In the tables, the "many" side holds the link. The orders table has a customer_id column; the customers table does not need a list of orders. To find a customer\'s orders, you look in orders for rows with that customer_id.',
          'The column on the many side has a special name: a foreign key. It is "foreign" because it holds a key that belongs to another table. customer_id in orders is a foreign key pointing to id in customers.',
          'A useful way to design this is to say it out loud: "a customer places many orders; an order is placed by one customer". The table on the "one" side gets the id; the table on the "many" side gets the foreign key.',
          'You can already use this link with what you know: SELECT count(*) FROM orders WHERE customer_id = 1 counts Asha\'s orders. Tomorrow, joins let you show the customer\'s name next to each order in one query.',
          'Foreign key columns are usually named after the table they point to, with _id at the end: customer_id points to customers, product_id to products. Following this naming habit makes a database easy to read, because anyone can guess where each link goes without looking it up.'
        ],
        example: 'A mother can have several children, but each child has one mother. On each child\'s school form, there is a box for the mother\'s name. The mother\'s form does not list the children. The link is written on the "many" side: the children.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text);',
          "INSERT INTO customers VALUES (1, 'Asha'), (2, 'Ravi'), (3, 'Meera');",
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, total numeric(10,2));',
          'INSERT INTO orders VALUES (101, 1, 280), (102, 2, 1200), (103, 1, 2097), (104, 1, 50);',
          'SELECT customer_id, count(*) AS orders, sum(total) AS spent FROM orders GROUP BY customer_id ORDER BY customer_id;'
        ),
        output: lines(
          ' customer_id | orders | spent',
          '-------------+--------+---------',
          '           1 |      3 | 2427.00',
          '           2 |      1 | 1200.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'The "many" side holds the link: customer_id.' },
          { line: 5, note: 'Orders per customer id. Meera (3) has no orders, so she does not appear yet.' }
        ],
        tryIt: 'Add an order for Meera, (105, 3, 99), and run again. She now appears with 1 order.',
        check: {
          question: 'In "one category has many products", which table gets the foreign key?',
          options: ['products, with a category_id column', 'categories, with a product_id column', 'Both tables'],
          answer: 0,
          why: 'The link goes on the "many" side. Each product stores the id of its one category.'
        }
      },
      {
        title: 'FOREIGN KEY: letting PostgreSQL protect the link',
        say: [
          'A column called customer_id is just a number until you tell PostgreSQL it is a link. Without that, nothing stops someone from saving an order for customer 999, who does not exist. That is called an orphan row, and it breaks reports.',
          'You declare the link with REFERENCES: customer_id int REFERENCES customers(id). This creates a foreign key constraint. From then on, PostgreSQL checks every insert and update: the customer_id must exist in customers, or be NULL.',
          'The protection works in the other direction too. If you try to delete a customer who still has orders, PostgreSQL refuses by default, because those orders would become orphans. You saw this rule in the Day 3 practice, when the shop could not delete a product that was in an old order.',
          'You can choose other behaviour with ON DELETE, which you will learn on Day 21: CASCADE deletes the orders along with the customer, and SET NULL keeps the orders but clears their customer_id. The default, refusing, is the safest.',
          'Foreign keys are a promise the database keeps for you, whatever app, script or person changes the data. That is why experienced developers always declare them.'
        ],
        example: 'A school will not accept a library card request for a roll number that is not on the admissions list. And it will not remove a student from the list while they still have library books. The foreign key is that rule, checked every time.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text);',
          "INSERT INTO customers VALUES (1, 'Asha'), (2, 'Ravi');",
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id), total numeric(10,2));',
          'INSERT INTO orders VALUES (101, 1, 280);',
          'INSERT INTO orders VALUES (102, 999, 50);'
        ),
        output: '[Error] insert or update on table "orders" violates foreign key constraint "orders_customer_id_fkey"',
        codeNotes: [
          { line: 3, note: 'REFERENCES makes customer_id a foreign key to customers(id).' },
          { line: 5, note: 'Customer 999 does not exist, so PostgreSQL refuses the order.' }
        ],
        tryIt: 'Change line 5 to delete a customer who has an order instead: DELETE FROM customers WHERE id = 1; and read the error. Then try deleting Ravi (id 2), who has no orders.',
        check: {
          question: 'What does customer_id int REFERENCES customers(id) prevent?',
          options: ['Orders pointing to customers that do not exist', 'Two orders for the same customer', 'Customers with no orders'],
          answer: 0,
          why: 'A foreign key ensures every value points to a real row in the other table (or is NULL).'
        }
      },
      {
        title: 'Many-to-many relationships',
        say: [
          'Some relationships are many-to-many. An order contains many products, and a product appears in many orders. A student takes many courses, and a course has many students.',
          'You cannot store this with one foreign key column. Instead, you add a third table in the middle, often called a junction table or link table. For orders and products, it is order_items: each row says "this order contains this product, in this quantity".',
          'The junction table has two foreign keys, one to each side, and usually a primary key made of both columns together: PRIMARY KEY (order_id, product_id). That means the same product appears at most once per order; the quantity column says how many.',
          'Junction tables often hold extra information about the relationship itself. The quantity belongs to "this product in this order", not to the order or the product alone. A price at the time of purchase is another common example.',
          'This is exactly the shape of the shop database you have practised with: customers, orders, order_items and products. Tomorrow you will join all four together.'
        ],
        example: 'A wedding guest list and a list of events (mehendi, sangeet, reception): each guest attends many events, and each event has many guests. The invitation card for each guest-event pair is the junction table, and it can say extra things, like "plus two".',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer text);',
          'CREATE TABLE products (id int PRIMARY KEY, name text);',
          'CREATE TABLE order_items (',
          '  order_id int REFERENCES orders(id),',
          '  product_id int REFERENCES products(id),',
          '  quantity int,',
          '  PRIMARY KEY (order_id, product_id)',
          ');',
          "INSERT INTO orders VALUES (1, 'Asha'), (2, 'Ravi');",
          "INSERT INTO products VALUES (10, 'Notebook'), (20, 'Pen');",
          'INSERT INTO order_items VALUES (1, 10, 3), (1, 20, 10), (2, 20, 5);',
          'SELECT product_id, count(*) AS in_orders, sum(quantity) AS units FROM order_items GROUP BY product_id ORDER BY product_id;'
        ),
        output: lines(
          ' product_id | in_orders | units',
          '------------+-----------+-------',
          '         10 |         1 |     3',
          '         20 |         2 |    15',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'The junction table between orders and products.' },
          { line: 7, note: 'A primary key made of two columns: each product at most once per order.' },
          { line: 11, note: 'Order 1 has two products; the Pen is in two orders.' }
        ],
        tryIt: 'Try adding (1, 20, 2) again to the order_items INSERT and read the error: the Pen is already in order 1. The fix in a real app is to UPDATE the quantity instead.',
        check: {
          question: 'How do you store "orders contain products" when each order has many products and each product is in many orders?',
          options: ['A third table, order_items, with order_id and product_id', 'A product_id column in orders', 'An order_id column in products'],
          answer: 0,
          why: 'Many-to-many needs a junction table with a foreign key to each side.'
        }
      },
      {
        title: 'Reading a database design',
        say: [
          'When you join a new company or project, one of the first things to do is read the database design: which tables exist, and how they link. Being able to read it quickly is a real job skill.',
          'PostgreSQL itself can tell you. The information_schema is a set of built-in views that describe your tables. For example, information_schema.table_constraints lists every primary key, foreign key and unique rule.',
          'Teams often draw the design as a diagram, called an ER diagram, short for entity-relationship. Each table is a box, and lines between boxes show the foreign keys. A line with a "crow\'s foot" on one end marks the "many" side.',
          'When you read a design, ask three questions for each foreign key: which table points to which, what does one row on each side mean, and what happens when the "one" side is deleted.',
          'In the example below, we ask PostgreSQL to list the foreign keys in a small shop database. This is the same kind of query that database tools run to draw diagrams for you.'
        ],
        example: 'A metro map shows stations as dots and lines as connections. You do not need to see every train to understand how to get from A to B. An ER diagram is the metro map of a database: tables and the links between them.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text);',
          'CREATE TABLE products (id int PRIMARY KEY, name text);',
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id));',
          'CREATE TABLE order_items (order_id int REFERENCES orders(id), product_id int REFERENCES products(id), quantity int, PRIMARY KEY (order_id, product_id));',
          'SELECT table_name, constraint_type, count(*) AS how_many',
          'FROM information_schema.table_constraints',
          "WHERE table_schema = 'public' AND constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')",
          'GROUP BY table_name, constraint_type',
          'ORDER BY table_name, constraint_type;'
        ),
        output: lines(
          ' table_name  | constraint_type | how_many',
          '-------------+-----------------+----------',
          ' customers   | PRIMARY KEY     |        1',
          ' order_items | FOREIGN KEY     |        2',
          ' order_items | PRIMARY KEY     |        1',
          ' orders      | FOREIGN KEY     |        1',
          ' orders      | PRIMARY KEY     |        1',
          ' products    | PRIMARY KEY     |        1',
          '(6 rows)'
        ),
        codeNotes: [
          { line: 6, note: 'A built-in view that describes the rules on every table.' },
          { line: 7, note: 'Only our own tables, and only primary and foreign keys.' }
        ],
        tryIt: 'Add a reviews table with product_id int REFERENCES products(id) and run it again. A new FOREIGN KEY row appears for reviews.',
        check: {
          question: 'In an ER diagram, what does a line between two tables usually show?',
          options: ['A foreign key relationship', 'That the tables have the same columns', 'That one table is a copy of the other'],
          answer: 0,
          why: 'Lines connect tables linked by foreign keys, often with a crow\'s foot on the "many" side.'
        }
      },
      {
        title: 'Putting it together: adding reviews to the shop',
        say: [
          'Let us extend the shop with a new feature: product reviews. First, think about the relationship. One product has many reviews, and each review is about one product. So reviews gets a product_id foreign key.',
          'Next, the rules. A rating must be from 1 to 5, which is a CHECK rule, and the product must exist, which is the foreign key. With both in place, PostgreSQL refuses bad reviews no matter which app sends them.',
          'Then we add some reviews and use GROUP BY to show the number of reviews and the average rating per product id. Tomorrow, with joins, you will show the product names instead of ids.',
          'In today\'s practice, you will create the reviews table with its foreign key and CHECK rule, and count the orders per customer id from the shop\'s orders table.',
          'Tomorrow is one of the most important days of the course: joins. You will finally put linked tables side by side in one result, like each order with its customer\'s name.'
        ],
        example: 'When a shopping app adds a new feature like reviews, a developer first decides how it links to what already exists: every review belongs to one product. Getting that link right, with the right rules, is the first step of every new feature.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text);',
          "INSERT INTO products VALUES (1, 'Notebook'), (2, 'Headphones');",
          'CREATE TABLE reviews (',
          '  id serial PRIMARY KEY,',
          '  product_id int REFERENCES products(id),',
          '  rating int CHECK (rating BETWEEN 1 AND 5),',
          '  comment text',
          ');',
          "INSERT INTO reviews (product_id, rating, comment) VALUES (1, 5, 'Great paper'), (1, 4, 'Good value'), (2, 3, 'Okay sound');",
          'SELECT product_id, count(*) AS reviews, round(avg(rating), 1) AS avg_rating FROM reviews GROUP BY product_id ORDER BY product_id;'
        ),
        output: lines(
          ' product_id | reviews | avg_rating',
          '------------+---------+------------',
          '          1 |       2 |        4.5',
          '          2 |       1 |        3.0',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'Each review points to one existing product.' },
          { line: 6, note: 'Ratings outside 1 to 5 are refused.' },
          { line: 10, note: 'Reviews and average rating per product, rounded to 1 decimal.' }
        ],
        tryIt: "Add a review with rating 7: (2, 7, 'Amazing!!'). Read the error from the CHECK rule. Then try a review for product 99.",
        check: {
          question: 'A review must be about a real product and have a rating from 1 to 5. Which rules do you need?',
          options: ['A foreign key on product_id and a CHECK on rating', 'Only a primary key', 'UNIQUE on rating'],
          answer: 0,
          why: 'The foreign key makes sure the product exists; the CHECK keeps ratings between 1 and 5.'
        }
      }
    ],
    summary: [
      'Store each kind of thing in its own table, once, and link tables with ids.',
      'One-to-many: the "many" table holds a foreign key to the "one" table.',
      'REFERENCES creates a foreign key: no orphan rows, and linked rows cannot be deleted by accident.',
      'Many-to-many needs a junction table with two foreign keys, like order_items.',
      'information_schema and ER diagrams show how a database\'s tables are linked.'
    ],
    projectStep: {
      title: 'My Library: add authors as their own table',
      steps: [
        'Create an authors table with id serial PRIMARY KEY and name text NOT NULL UNIQUE.',
        'Add an author_id int REFERENCES authors(id) column to your books table design.',
        'Insert 2 or 3 authors and link your books to them by id.',
        'Try to add a book with an author_id that does not exist, and read the error.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 11,
    title: 'Joining Tables: INNER JOIN',
    goal: 'You can combine linked tables in one result with INNER JOIN, use table aliases, and filter, sort and total joined data.',
    minutes: 28,
    recap: 'Yesterday you learned how tables link with foreign keys: one-to-many, many-to-many, and why data is split into tables.',
    parts: [
      {
        title: 'What a join does',
        say: [
          'Yesterday you split data into linked tables: orders store a customer_id instead of the customer\'s name. That is good design, but when a manager asks "show each order with the customer\'s name", the name is in one table and the order is in another. A join brings them together.',
          'A join puts rows from two tables side by side, matching them by a rule you give. For orders and customers, the rule is: the order\'s customer_id equals the customer\'s id. Each order finds its customer, and the result has columns from both tables.',
          'The basic form is: SELECT columns FROM orders JOIN customers ON customers.id = orders.customer_id. JOIN on its own means INNER JOIN, the most common kind. The ON part is the matching rule.',
          'The database does not store the joined result anywhere. It builds it fresh each time you run the query, from the current data. So if a customer changes their name, every joined report shows the new name straight away.',
          'Joins are the single most important skill in SQL. Almost every real question needs one, and almost every SQL interview asks about them. You will spend three days on them, starting today with INNER JOIN.',
          'You may also see an older way of writing joins: FROM orders, customers WHERE customers.id = orders.customer_id. It gives the same result for an inner join, but mixing the matching rule into WHERE makes long queries hard to read and easy to break. Modern SQL uses JOIN ... ON, and so does this course.'
        ],
        example: 'Think of a wedding: the guest list has names and table numbers, and the seating chart has table numbers and which side of the hall each table is on. To tell a guest where to go, you match their table number on both lists. A join is that matching, done for every row at once.',
        code: lines(
          MINI_SHOP,
          'SELECT orders.id, orders.status, customers.name',
          'FROM orders',
          'JOIN customers ON customers.id = orders.customer_id',
          'ORDER BY orders.id;'
        ),
        output: lines(
          ' id  | status    | name',
          '-----+-----------+-------',
          ' 101 | delivered | Asha',
          ' 102 | delivered | Ravi',
          ' 103 | shipped   | Asha',
          ' 104 | pending   | Priya',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Columns from both tables. The table name before the dot says which table.' },
          { line: 11, note: 'The matching rule: each order\'s customer_id equals a customer\'s id.' }
        ],
        tryIt: 'Add customers.city to the SELECT list and run it. Each order now also shows where its customer lives.',
        check: {
          question: 'What does JOIN customers ON customers.id = orders.customer_id do?',
          options: ['Puts each order next to the customer whose id matches its customer_id', 'Copies customers into the orders table', 'Deletes orders without a customer'],
          answer: 0,
          why: 'A join combines rows from both tables in the result, using the ON rule to match them. The tables themselves are not changed.'
        }
      },
      {
        title: 'Table aliases: shorter joins',
        say: [
          'Writing the full table name before every column gets long quickly: orders.id, customers.name, order_items.quantity. So SQL lets you give each table a short nickname, called an alias, right after its name: FROM orders o JOIN customers c.',
          'From then on, you use the alias instead of the full name: o.id, c.name. The query becomes much shorter and easier to read, especially with three or four tables.',
          'Good aliases are short but clear, usually the first letter or two of the table: c for customers, o for orders, p for products, oi for order_items. Avoid meaningless aliases like a, b, c when the tables are not called a, b and c.',
          'When a column name exists in both tables, like id or name, you must say which one you mean. SELECT id FROM orders o JOIN customers c ... gives an error, because both tables have an id. Writing o.id or c.id removes the doubt. Many teams simply always write the alias, which is a good habit.',
          'You can also rename result columns with AS, as before. This is useful in joins, because two columns with the same name, like o.id and c.id, would otherwise be confusing in the result.'
        ],
        example: 'In a class with three students called Rahul, the teacher says "Rahul S" and "Rahul K" to be clear. Aliases do the same for tables: o.id and c.id, so PostgreSQL knows exactly which id you mean.',
        code: lines(
          MINI_SHOP,
          'SELECT o.id AS order_id, c.id AS customer_id, c.name AS customer',
          'FROM orders o',
          'JOIN customers c ON c.id = o.customer_id',
          'ORDER BY o.id;',
          'SELECT id FROM orders o JOIN customers c ON c.id = o.customer_id;'
        ),
        output: lines(
          ' order_id | customer_id | customer',
          '----------+-------------+----------',
          '      101 |           1 | Asha',
          '      102 |           2 | Ravi',
          '      103 |           1 | Asha',
          '      104 |           3 | Priya',
          '(4 rows)',
          '',
          '[Error] column reference "id" is ambiguous'
        ),
        codeNotes: [
          { line: 10, note: 'o is the alias for orders, used from here on.' },
          { line: 13, note: 'Both tables have an id column, so PostgreSQL cannot tell which one you mean.' }
        ],
        tryIt: 'Fix line 13 by writing o.id instead of id, and run again. Both queries now work.',
        check: {
          question: 'Why write o.id instead of just id in a join of orders and customers?',
          options: ['Both tables have an id column, so you must say which one', 'Aliases make the query faster', 'id is a reserved word'],
          answer: 0,
          why: 'When a column name exists in both tables, the alias tells PostgreSQL which table\'s column you mean.'
        }
      },
      {
        title: 'INNER JOIN keeps only matching rows',
        say: [
          'INNER JOIN has one important behaviour: it keeps only rows that have a match on both sides. An order whose customer_id matches no customer would disappear from the result. And a customer with no orders does not appear either.',
          'In our small shop, Meera has not ordered anything. So a join of customers and orders shows Asha, Ravi and Priya, but not Meera. That is correct for the question "show each order with its customer", but wrong for "show every customer and their orders".',
          'This is the most common source of wrong join results: rows that silently disappear. A report of "sales per customer" made with INNER JOIN leaves out customers who bought nothing, which might be exactly the customers a manager wants to call.',
          'Tomorrow you will learn LEFT JOIN, which keeps rows even when there is no match. For today, remember the rule: INNER JOIN shows only pairs that exist on both sides.',
          'A good habit is to count before and after a join. If the orders table has 4 rows and your joined result has 3, some rows found no match. Knowing why is part of writing a correct query.'
        ],
        example: 'A dance class pairs up students who both signed up for the same slot. A student whose partner did not come is not in the pairs list. INNER JOIN is that pairs list: only complete pairs appear.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, o.id AS order_id',
          'FROM customers c',
          'JOIN orders o ON o.customer_id = c.id',
          'ORDER BY c.name, o.id;',
          'SELECT count(*) AS customers FROM customers;'
        ),
        output: lines(
          ' name  | order_id',
          '-------+----------',
          ' Asha  |      101',
          ' Asha  |      103',
          ' Priya |      104',
          ' Ravi  |      102',
          '(4 rows)',
          '',
          ' customers',
          '-----------',
          '         4',
          '(1 row)'
        ),
        codeNotes: [
          { line: 11, note: 'Only customers who have at least one order appear.' },
          { line: 13, note: 'There are 4 customers, but Meera has no orders, so she is missing above.' }
        ],
        tryIt: 'Add an order for Meera to the setup by adding a line: INSERT INTO orders VALUES (105, 4, \'2026-09-20\', \'pending\'); before the SELECT. She now appears.',
        check: {
          question: 'A customer has no orders. Does INNER JOIN between customers and orders show them?',
          options: ['No, INNER JOIN only keeps rows with a match on both sides', 'Yes, with empty order columns', 'Only if you add ORDER BY'],
          answer: 0,
          why: 'INNER JOIN drops rows without a match. LEFT JOIN, tomorrow, keeps them with NULLs.'
        }
      },
      {
        title: 'Joining and then filtering, sorting and totalling',
        say: [
          'A join produces rows like any other query, so everything you learned in week 1 works on top of it. WHERE filters the joined rows, ORDER BY sorts them, and GROUP BY with aggregates totals them.',
          'For example, "orders from customers in Pune" needs the customer\'s city, which lives in customers, and the orders, which live in orders. Join them, then add WHERE c.city = \'Pune\'.',
          '"How many orders has each customer placed?" joins orders to customers, then groups by the customer\'s name. Because the name comes from the joined table, you can group and show it directly.',
          'The order of clauses stays the same: SELECT, FROM with its JOINs, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. The JOIN lines belong to the FROM part, before WHERE.',
          'When you group joined data, group by something unique for each group, like the customer id, as well as the name. Two different customers can have the same name, and grouping by name alone would wrongly add their orders together.'
        ],
        example: 'A college wants the number of books borrowed by students from each hostel. The borrowing record has roll numbers; the student list has hostels. You match them first, then count per hostel. Join first, then group.',
        code: lines(
          MINI_SHOP,
          'SELECT o.id, c.name',
          'FROM orders o',
          'JOIN customers c ON c.id = o.customer_id',
          "WHERE c.city = 'Pune'",
          'ORDER BY o.id;',
          'SELECT c.id, c.name, count(*) AS orders',
          'FROM customers c',
          'JOIN orders o ON o.customer_id = c.id',
          'GROUP BY c.id, c.name',
          'ORDER BY orders DESC, c.name;'
        ),
        output: lines(
          ' id  | name',
          '-----+-------',
          ' 101 | Asha',
          ' 103 | Asha',
          ' 104 | Priya',
          '(3 rows)',
          '',
          ' id | name  | orders',
          '----+-------+--------',
          '  1 | Asha  |      2',
          '  3 | Priya |      1',
          '  2 | Ravi  |      1',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 12, note: 'The filter uses a column from the joined customers table.' },
          { line: 17, note: 'Group by the id and the name, so two customers with the same name stay separate.' }
        ],
        tryIt: "Add HAVING count(*) > 1 to the second query, before ORDER BY. Only Asha is left.",
        check: {
          question: 'Where do the JOIN lines go in a query?',
          options: ['Right after FROM, before WHERE', 'After ORDER BY', 'Inside the SELECT list'],
          answer: 0,
          why: 'Joins are part of the FROM clause. WHERE, GROUP BY and ORDER BY then work on the joined rows.'
        }
      },
      {
        title: 'Joining a junction table',
        say: [
          'Many-to-many relationships, like orders and products, go through a junction table: order_items. To show "which products were in order 101", you join order_items to products.',
          'Each row of order_items says "this order contains this product, this many times". Joining it to products on product_id adds the product\'s name and price to each line. The result reads like the lines of a bill.',
          'Once you have the price and the quantity side by side, you can calculate: p.price * oi.quantity AS line_total. And with GROUP BY on the order, sum of the line totals gives each order\'s total value.',
          'This is a very common pattern in real apps: a bill, a shopping cart, a playlist, a class timetable. Each is a junction table joined to the thing it lists.',
          'Remember that the junction table can have several rows for one order, one per product. So when you join and then count or sum, you are counting lines, not orders. Always ask yourself what one row of your result means.',
          'In a real shop, order_items usually also stores the price at the time of purchase, because product prices change. If the Pen costs 12 next month, an old bill must still show the 10 rupees the customer actually paid. Joining to the current products price is fine for learning, but real invoices keep their own copy.'
        ],
        example: 'A restaurant bill lists each dish you ordered, how many plates, the price per plate, and the line total. The kitchen\'s order slip only had dish numbers and quantities; the prices came from the menu. The bill is order_items joined to the menu.',
        code: lines(
          MINI_SHOP,
          'SELECT p.name, oi.quantity, p.price, p.price * oi.quantity AS line_total',
          'FROM order_items oi',
          'JOIN products p ON p.id = oi.product_id',
          'WHERE oi.order_id = 101',
          'ORDER BY p.name;',
          'SELECT oi.order_id, sum(p.price * oi.quantity) AS order_total',
          'FROM order_items oi',
          'JOIN products p ON p.id = oi.product_id',
          'GROUP BY oi.order_id',
          'ORDER BY oi.order_id;'
        ),
        output: lines(
          ' name     | quantity | price | line_total',
          '----------+----------+-------+------------',
          ' Notebook |        3 | 60.00 |     180.00',
          ' Pen      |       10 | 10.00 |     100.00',
          '(2 rows)',
          '',
          ' order_id | order_total',
          '----------+-------------',
          '      101 |      280.00',
          '      102 |     1200.00',
          '      103 |       50.00',
          '      104 |       60.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Each line of the bill: name, quantity, price and line total.' },
          { line: 14, note: 'Add up the line totals for each order.' }
        ],
        tryIt: 'Change the first query to show order 103 instead of 101. What did that order contain?',
        check: {
          question: 'In a join of order_items and products, what does one result row represent?',
          options: ['One product line inside one order', 'One whole order', 'One product in the catalogue'],
          answer: 0,
          why: 'order_items has one row per product per order, so each joined row is one line of a bill.'
        }
      },
      {
        title: 'Putting it together: an orders report',
        say: [
          'Let us combine today\'s ideas into a report a shop manager would use: each delivered order with its customer\'s name and its total value, biggest first.',
          'This needs three tables. orders gives the status and date. customers gives the name. order_items and products give the total. We join them all, filter with WHERE, group by the order, and sort.',
          'Read the query slowly from FROM downwards: start with orders, attach the customer, attach the order lines, attach the products. Then keep delivered orders, group each order\'s lines together, and add them up. Tomorrow and the day after, you will build longer chains like this.',
          'In today\'s practice, you will show every order with its customer\'s name, and list the products and quantities in one order. Both are single joins, exactly like this lesson.',
          'Tomorrow you meet LEFT JOIN, which keeps rows that have no match: customers who never ordered, products nobody bought. It is the answer to the "missing rows" problem from part 3.'
        ],
        example: 'At the end of the day, a shop owner flips through the delivered orders: whose order it was, and how much it came to. Behind that simple list, three or four tables are joined together.',
        code: lines(
          MINI_SHOP,
          'SELECT o.id AS order_id, c.name AS customer, sum(p.price * oi.quantity) AS total',
          'FROM orders o',
          'JOIN customers c ON c.id = o.customer_id',
          'JOIN order_items oi ON oi.order_id = o.id',
          'JOIN products p ON p.id = oi.product_id',
          "WHERE o.status = 'delivered'",
          'GROUP BY o.id, c.name',
          'ORDER BY total DESC;'
        ),
        output: lines(
          ' order_id | customer | total',
          '----------+----------+---------',
          '      102 | Ravi     | 1200.00',
          '      101 | Asha     |  280.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'Attach each order\'s customer.' },
          { line: 12, note: 'Attach the order\'s lines, then each line\'s product.' },
          { line: 15, note: 'One result row per order, with its lines added up.' }
        ],
        tryIt: "Remove the WHERE line and run it again. Orders 103 and 104, which are not delivered, now appear too.",
        check: {
          question: 'Why group by o.id in the orders report?',
          options: ['So each order\'s product lines are added up into one row per order', 'Because every join needs GROUP BY', 'To sort the orders'],
          answer: 0,
          why: 'After joining, each order has one row per product line. Grouping by the order adds those lines into one total.'
        }
      }
    ],
    summary: [
      'A join puts rows from linked tables side by side, matched by an ON rule.',
      'JOIN on its own means INNER JOIN: only rows with a match on both sides are kept.',
      'Aliases like o and c keep joins short; use them when a column name is in both tables.',
      'WHERE, GROUP BY and ORDER BY work on the joined rows; group by an id, not just a name.',
      'Junction tables like order_items join to the things they list, like the lines of a bill.'
    ],
    projectStep: {
      title: 'My Library: books with author names',
      steps: [
        'Using your authors and books tables from Day 10, join them to show each book with its author\'s name.',
        'Show only the books by one chosen author, using WHERE on the author\'s name.',
        'Count books per author with a join and GROUP BY a.id, a.name.',
        'Count the rows before and after the join. If any book disappeared, find out why.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 12,
    title: 'Keeping Rows Without a Match: LEFT JOIN',
    goal: 'You can keep unmatched rows with LEFT JOIN, count zero correctly, and find rows with no match.',
    minutes: 28,
    recap: 'Yesterday you combined tables with INNER JOIN, which keeps only rows that have a match on both sides.',
    parts: [
      {
        title: 'LEFT JOIN: keep every row from the first table',
        say: [
          'Yesterday, Meera disappeared from the customers-and-orders result because she has no orders. INNER JOIN only keeps complete pairs. Often that is exactly what you want, but sometimes it hides important rows.',
          'LEFT JOIN solves this. It keeps every row from the left table, the one written before the word JOIN, whether it finds a match or not. When there is no match, the columns from the right table are filled with NULL.',
          'So customers LEFT JOIN orders shows every customer. Asha, Ravi and Priya appear with their orders, and Meera appears once, with NULL in the order columns. Nothing is lost.',
          'The left table is simply the one that comes first. FROM customers c LEFT JOIN orders o keeps all customers. FROM orders o LEFT JOIN customers c would keep all orders instead. Choosing which table goes first is choosing which rows must never disappear.',
          'You will also see LEFT OUTER JOIN in some SQL. It means exactly the same as LEFT JOIN; the word OUTER is optional.',
          'A quick way to check whether you need LEFT JOIN is to read the question for words like every, all, including or even if. "Every customer and their orders", "all products, including unsold ones": these words mean some rows must stay even without a match, so the table they refer to goes first, with LEFT JOIN.'
        ],
        example: 'A class teacher reads the full attendance register and ticks who submitted homework. Students who did not submit are still on the list, with an empty box next to their name. LEFT JOIN is the full register with empty boxes; INNER JOIN would be a list of only those who submitted.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, o.id AS order_id, o.status',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'ORDER BY c.name, o.id;'
        ),
        output: lines(
          ' name  | order_id | status',
          '-------+----------+-----------',
          ' Asha  |      101 | delivered',
          ' Asha  |      103 | shipped',
          ' Meera |     NULL | NULL',
          ' Priya |      104 | pending',
          ' Ravi  |      102 | delivered',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'customers is on the left, so every customer is kept.' },
          { line: 11, note: 'Meera has no orders, so her order columns are NULL.' }
        ],
        tryIt: 'Change LEFT JOIN to JOIN and run it again. Meera disappears. Change it back.',
        check: {
          question: 'In FROM customers c LEFT JOIN orders o, which rows are always kept?',
          options: ['Every customer', 'Every order', 'Only customers with orders'],
          answer: 0,
          why: 'LEFT JOIN keeps every row of the left table, the one before JOIN. Missing matches become NULL.'
        }
      },
      {
        title: 'Counting zero correctly',
        say: [
          'The most common use of LEFT JOIN is counting, including zero. "How many orders has each customer placed?" should show Meera with 0, not leave her out.',
          'Here is the trap: with LEFT JOIN, count(*) counts rows, and Meera still has one row, the one filled with NULLs. So count(*) says 1 for her, which is wrong.',
          'The fix is to count a column from the right table, like count(o.id). Remember from Day 8: count(column) skips NULL. Meera\'s only row has a NULL order id, so count(o.id) correctly gives 0.',
          'The same applies to sum: sum(o.total) for a customer with no orders is NULL, not 0. Wrap it with coalesce: coalesce(sum(o.total), 0).',
          'This pattern, LEFT JOIN plus count(right_table.id) plus GROUP BY, is one of the most useful in SQL. It is also a favourite interview question, because so many people get the zero wrong.',
          'Before trusting such a report, check the total number of rows. A report of orders per customer should have exactly one row per customer, so its row count should equal SELECT count(*) FROM customers. If it has fewer rows, some customers were lost; if it has more, the GROUP BY is wrong. This simple check catches most mistakes.'
        ],
        example: 'If you count the empty boxes on an attendance sheet as "one submission", a student who submitted nothing looks like they submitted once. You must count the ticks, not the lines. count(o.id) counts the ticks.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, count(*) AS wrong_count, count(o.id) AS order_count',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'GROUP BY c.id, c.name',
          'ORDER BY c.name;'
        ),
        output: lines(
          ' name  | wrong_count | order_count',
          '-------+-------------+-------------',
          ' Asha  |           2 |           2',
          ' Meera |           1 |           0',
          ' Priya |           1 |           1',
          ' Ravi  |           1 |           1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'count(*) counts Meera\'s NULL row as 1. count(o.id) skips it and gives 0.' },
          { line: 12, note: 'Group by id and name, as you learned yesterday.' }
        ],
        tryIt: 'Remove the wrong_count column so only the correct count is left. This is the query you would give to a manager.',
        check: {
          question: 'With LEFT JOIN, which count shows 0 for customers with no orders?',
          options: ['count(o.id)', 'count(*)', 'count(c.id)'],
          answer: 0,
          why: 'The unmatched row has NULL in o.id, and count(column) skips NULL. count(*) and count(c.id) both count that row as 1.'
        }
      },
      {
        title: 'Finding rows with no match',
        say: [
          'LEFT JOIN can also find what is missing: customers who never ordered, products nobody bought, students who did not submit. These are some of the most valuable questions in business.',
          'The trick is to LEFT JOIN, then keep only the rows where the right side is NULL: WHERE o.id IS NULL. Those are exactly the left rows that found no match.',
          'Use a column that can never be NULL in a real match, such as the right table\'s primary key. If you used a column that is sometimes NULL anyway, like a comment, you would find false "missing" rows.',
          'This pattern is sometimes called an anti-join. On Day 15 you will see another way to write it, with NOT EXISTS, which some developers prefer. Both give the same answer.',
          'Questions like "customers who have not ordered in 90 days" or "products with no sales this month" are asked every week in real companies, and they all use this idea.'
        ],
        example: 'A school wants to call parents of students who did not come to the parent-teacher meeting. It takes the full student list, marks who came, and keeps the unmarked names. That is LEFT JOIN, then keep where the match is empty.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'WHERE o.id IS NULL;',
          'SELECT p.name',
          'FROM products p',
          'LEFT JOIN order_items oi ON oi.product_id = p.id',
          'WHERE oi.order_id IS NULL;'
        ),
        output: lines(
          ' name',
          '-------',
          ' Meera',
          '(1 row)',
          '',
          ' name',
          '---------',
          ' Stapler',
          '(1 row)'
        ),
        codeNotes: [
          { line: 12, note: 'Keep only customers whose order side is empty: Meera.' },
          { line: 16, note: 'The same idea for products: the Stapler was never ordered.' }
        ],
        tryIt: 'Add an order line for the Stapler to the setup, for example INSERT INTO order_items VALUES (104, 4, 2); and run again. The second result becomes empty.',
        check: {
          question: 'How do you find customers who have never placed an order?',
          options: ['LEFT JOIN orders, then WHERE o.id IS NULL', 'INNER JOIN orders, then WHERE o.id IS NULL', 'SELECT customers WHERE orders = 0'],
          answer: 0,
          why: 'LEFT JOIN keeps unmatched customers with NULL order columns, and IS NULL keeps just those.'
        }
      },
      {
        title: 'The WHERE trap with LEFT JOIN',
        say: [
          'There is one trap with LEFT JOIN that catches almost everyone. Suppose you want every customer with their delivered orders only. You write LEFT JOIN orders, then WHERE o.status = \'delivered\'. Meera and Priya vanish. Why?',
          'Because WHERE runs after the join, on the joined rows. Meera\'s row has NULL status, and NULL = \'delivered\' is not true, so WHERE removes her. Priya only has a pending order, so her row is removed too. The LEFT JOIN kept them, but the WHERE threw them away.',
          'The fix is to put the condition in the ON part instead: LEFT JOIN orders o ON o.customer_id = c.id AND o.status = \'delivered\'. Now the condition only decides which orders are attached. Customers without a delivered order are still kept, with NULLs.',
          'A simple rule: with LEFT JOIN, conditions about the right table usually belong in ON. Conditions about the left table, like c.city = \'Pune\', belong in WHERE.',
          'If your LEFT JOIN result looks like an INNER JOIN result, with the unmatched rows missing, look for a WHERE condition on the right table. It is almost always the cause.'
        ],
        example: 'A teacher wants the full class list, with a tick for students who submitted on time. If she first removes everyone without an on-time tick, she no longer has the full class. She should keep everyone and only tick the on-time ones. ON decides the ticks; WHERE removes rows.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, o.id AS delivered_order',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          "WHERE o.status = 'delivered'",
          'ORDER BY c.name;',
          'SELECT c.name, o.id AS delivered_order',
          'FROM customers c',
          "LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered'",
          'ORDER BY c.name;'
        ),
        output: lines(
          ' name | delivered_order',
          '------+-----------------',
          ' Asha |             101',
          ' Ravi |             102',
          '(2 rows)',
          '',
          ' name  | delivered_order',
          '-------+-----------------',
          ' Asha  |             101',
          ' Meera |            NULL',
          ' Priya |            NULL',
          ' Ravi  |             102',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 12, note: 'The trap: WHERE removes customers without a delivered order.' },
          { line: 16, note: 'The fix: the condition in ON only chooses which orders are attached.' }
        ],
        tryIt: "Add WHERE c.city = 'Pune' to the second query, before ORDER BY. That condition is about customers, so WHERE is the right place.",
        check: {
          question: 'Your LEFT JOIN result is missing customers with no match. What is the likely cause?',
          options: ['A WHERE condition on a right-table column, which removes the NULL rows', 'LEFT JOIN is too slow', 'Missing ORDER BY'],
          answer: 0,
          why: 'WHERE runs after the join and drops rows whose right-table columns are NULL. Move that condition into ON.'
        }
      },
      {
        title: 'RIGHT JOIN and FULL JOIN',
        say: [
          'There are two more outer joins. RIGHT JOIN keeps every row from the right table instead of the left. orders o RIGHT JOIN customers c keeps every customer, just like customers c LEFT JOIN orders o.',
          'Because any RIGHT JOIN can be written as a LEFT JOIN by swapping the tables, most developers only use LEFT JOIN. It makes queries easier to read: the table whose rows must all appear always comes first.',
          'FULL JOIN keeps every row from both sides. Rows that match are paired; unmatched rows from either table appear with NULLs on the other side. It is useful for comparing two lists and seeing what is in one, the other, or both.',
          'For example, comparing a list of students who registered with a list of students who attended: FULL JOIN shows who registered and attended, who registered but did not attend, and who attended without registering.',
          'FULL JOIN is used less often than LEFT JOIN, but when you need to compare two lists, it is the right tool. Knowing all four joins, and when to use each, is a standard interview topic.',
          'Comparing lists like this is common when checking data: payments in the bank statement against payments in your app, or students on the fee list against students on the attendance list. The rows with NULL on one side are exactly the ones someone needs to look into.'
        ],
        example: 'Comparing a wedding\'s invitation list with the list of guests who actually came: some were invited and came, some were invited but did not come, and a few came without an invitation. FULL JOIN shows all three groups at once.',
        code: lines(
          'CREATE TABLE registered (name text);',
          "INSERT INTO registered VALUES ('Asha'), ('Ravi'), ('Priya');",
          'CREATE TABLE attended (name text);',
          "INSERT INTO attended VALUES ('Asha'), ('Priya'), ('Karan');",
          'SELECT r.name AS registered, a.name AS attended',
          'FROM registered r',
          'FULL JOIN attended a ON a.name = r.name',
          'ORDER BY coalesce(r.name, a.name);'
        ),
        output: lines(
          ' registered | attended',
          '------------+----------',
          ' Asha       | Asha',
          ' NULL       | Karan',
          ' Priya      | Priya',
          ' Ravi       | NULL',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 7, note: 'FULL JOIN keeps unmatched rows from both lists.' },
          { line: 8, note: 'Sort by whichever name is present.' }
        ],
        tryIt: 'Change FULL JOIN to LEFT JOIN and run it. Karan, who attended without registering, disappears.',
        check: {
          question: 'Which join shows rows from both tables, even when they have no match?',
          options: ['FULL JOIN', 'INNER JOIN', 'LEFT JOIN'],
          answer: 0,
          why: 'FULL JOIN keeps unmatched rows from both sides. LEFT JOIN keeps only the left side\'s unmatched rows.'
        }
      },
      {
        title: 'Putting it together: a customer activity report',
        say: [
          'Let us build a report that a real shop would use to plan a marketing campaign: every customer, how many orders they placed, and how much they spent in total, including customers who have not ordered yet.',
          'Every customer must appear, so customers goes first with LEFT JOIN. Spending needs order_items and products too, so those are LEFT JOINed as well. The counts use count(DISTINCT o.id), because each order now appears once per product line. And the total uses coalesce so customers with nothing show 0.',
          'Notice count(DISTINCT o.id). After joining order lines, an order with two products appears twice. count(o.id) would count it twice; DISTINCT counts each order once. Always think about what one row means after a join.',
          'In today\'s practice, you will show every customer\'s order count, including 0, and find the products nobody ordered. Both are exactly the patterns from this lesson.',
          'Tomorrow you join many tables in a chain, and even join a table to itself, for example employees and their managers.'
        ],
        example: 'Before a festival sale, a shop sends messages to every customer: a thank-you to regular buyers, and a welcome offer to people who signed up but never bought. To do that, it needs every customer, with or without orders. That list is this report.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name,',
          '       count(DISTINCT o.id) AS orders,',
          '       coalesce(sum(p.price * oi.quantity), 0) AS spent',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'LEFT JOIN order_items oi ON oi.order_id = o.id',
          'LEFT JOIN products p ON p.id = oi.product_id',
          'GROUP BY c.id, c.name',
          'ORDER BY spent DESC, c.name;'
        ),
        output: lines(
          ' name  | orders | spent',
          '-------+--------+---------',
          ' Ravi  |      1 | 1200.00',
          ' Asha  |      2 |  330.00',
          ' Priya |      1 |   60.00',
          ' Meera |      0 |       0',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'DISTINCT: each order is counted once, even if it has several product lines.' },
          { line: 11, note: 'coalesce turns Meera\'s NULL total into 0.' },
          { line: 13, note: 'LEFT JOIN all the way down, so no customer is lost.' }
        ],
        tryIt: 'Change count(DISTINCT o.id) to count(o.id) and run it. Asha\'s count goes up, because her order 101 has two lines. Change it back.',
        check: {
          question: 'Why use count(DISTINCT o.id) after joining order_items?',
          options: ['An order with several product lines appears several times after the join', 'DISTINCT makes counting faster', 'count cannot count ids without DISTINCT'],
          answer: 0,
          why: 'Each product line repeats the order. DISTINCT counts each order once.'
        }
      }
    ],
    summary: [
      'LEFT JOIN keeps every row of the left table; unmatched right-side columns become NULL.',
      'Count with count(right_table.id) to get 0 for rows with no match; use coalesce for sums.',
      'Find missing matches with LEFT JOIN plus WHERE right_table.id IS NULL.',
      'Conditions on the right table belong in ON, not WHERE, or unmatched rows vanish.',
      'RIGHT JOIN is LEFT JOIN reversed; FULL JOIN keeps unmatched rows from both sides.'
    ],
    projectStep: {
      title: 'My Library: authors without books',
      steps: [
        'Add an author to your authors table who has no books yet.',
        'List every author with their number of books, showing 0 for the new author.',
        'Find authors with no books, using LEFT JOIN and IS NULL.',
        'List every author with their finished books only, putting the finished condition in ON.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 13,
    title: 'Joining Many Tables, and a Table to Itself',
    goal: 'You can chain several joins, choose the right join for each link, and join a table to itself.',
    minutes: 28,
    recap: 'Yesterday you kept unmatched rows with LEFT JOIN, counted zero correctly, and found rows with no match.',
    parts: [
      {
        title: 'Chaining joins step by step',
        say: [
          'Real questions often cross three or four tables. "Which products did Asha buy?" starts at customers, goes through orders and order_items, and ends at products. You write one JOIN for each step.',
          'Think of it as a path. Start from the table that holds your starting point, here customers. Then add one table at a time, each joined to one that is already in the query, using the foreign key between them.',
          'Each JOIN line has its own ON rule. customers to orders uses orders.customer_id = customers.id. orders to order_items uses order_items.order_id = orders.id. order_items to products uses products.id = order_items.product_id.',
          'The order of the JOIN lines usually does not change the result for INNER JOINs; PostgreSQL chooses the fastest way to do them. But writing them in path order makes the query much easier to read and check.',
          'If you are unsure, build the query one join at a time. Run it after each JOIN, look at the rows, and only then add the next. This is how experienced developers write long queries too.',
          'Long join queries are easier to read if you format them the same way every time: one JOIN per line, each ON on the same line as its JOIN, and tables in path order. Your teammates will read your queries far more often than you write them, so consistent formatting is a kindness, and in code reviews it is often expected.'
        ],
        example: 'Finding a friend\'s house in a new city: from the station take the bus to the market, from the market walk to the temple, from the temple it is the third house. Each step connects to the last one. A chain of joins is that set of directions through your tables.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name AS customer, o.id AS order_id, p.name AS product, oi.quantity',
          'FROM customers c',
          'JOIN orders o ON o.customer_id = c.id',
          'JOIN order_items oi ON oi.order_id = o.id',
          'JOIN products p ON p.id = oi.product_id',
          "WHERE c.name = 'Asha'",
          'ORDER BY o.id, p.name;'
        ),
        output: lines(
          ' customer | order_id | product  | quantity',
          '----------+----------+----------+----------',
          ' Asha     |      101 | Notebook |        3',
          ' Asha     |      101 | Pen      |       10',
          ' Asha     |      103 | Pen      |        5',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'Start from customers.' },
          { line: 11, note: 'Step 1: to orders. Step 2: to order_items. Step 3: to products.' },
          { line: 14, note: 'Then filter to one customer.' }
        ],
        tryIt: "Change the WHERE to c.name = 'Priya' and run it. What did Priya order?",
        check: {
          question: 'To go from customers to products, which tables must you join through?',
          options: ['orders and order_items', 'Only orders', 'None; customers and products link directly'],
          answer: 0,
          why: 'Customers link to orders, orders to order_items, and order_items to products. Each join follows one foreign key.'
        }
      },
      {
        title: 'Filtering and grouping across many tables',
        say: [
          'With several tables joined, you can filter on any of them and group by any of them. "Units of each product sold in delivered orders" filters on orders.status and groups by products.name, while summing order_items.quantity.',
          'This is where joins become powerful: a question that mixes information from four tables is still one query, usually just 8 to 10 lines long.',
          'As before, group by an id as well as a name when names might repeat. And think about what one row means before aggregating. After joining order lines, one row is one product in one order.',
          'Keep an eye on which join you use at each step. If the question is "every product, even unsold ones", products must be on the left with LEFT JOINs. If the question is only about things that were sold, INNER JOINs are right.',
          'Another useful check is to test the query with a customer you know well. If Asha placed two orders with three product lines in total, the joined result for her should have three rows before grouping. Checking one case by hand is often faster than staring at the whole result.',
          'When a report number looks too big, the usual cause is a join that multiplies rows, for example joining two different "many" tables to the same parent. Counting rows after each join helps you spot it.'
        ],
        example: 'A school asks: "how many science textbooks were issued to students in hostel B?". The answer needs students (hostel), issues (who got what) and books (subject). One question, three lists, one answer.',
        code: lines(
          MINI_SHOP,
          'SELECT p.name AS product, sum(oi.quantity) AS units',
          'FROM order_items oi',
          'JOIN orders o ON o.id = oi.order_id',
          'JOIN products p ON p.id = oi.product_id',
          "WHERE o.status = 'delivered'",
          'GROUP BY p.id, p.name',
          'ORDER BY units DESC;'
        ),
        output: lines(
          ' product  | units',
          '----------+-------',
          ' Pen      |    10',
          ' Notebook |     3',
          ' Backpack |     1',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 13, note: 'Only lines from delivered orders.' },
          { line: 14, note: 'One row per product, adding up the quantities.' }
        ],
        tryIt: "Remove the WHERE line and run it again. The Pen's units go up, because order 103 is only shipped.",
        check: {
          question: 'After joining orders and order_items, what does one row represent?',
          options: ['One product line in one order', 'One order', 'One customer'],
          answer: 0,
          why: 'order_items has one row per product per order, so the joined rows are at that level. Group to go back to orders.'
        }
      },
      {
        title: 'Self joins: a table joined to itself',
        say: [
          'Sometimes a table links to itself. In an employees table, each employee has a manager, who is also an employee. The manager_id column points to another row in the same table.',
          'To show each employee next to their manager\'s name, you join the employees table to itself. You list it twice in FROM with two different aliases: e for the employee, m for the manager.',
          'The ON rule matches the employee\'s manager_id with the manager\'s id: JOIN employees m ON m.id = e.manager_id. From then on, e.name is the employee and m.name is the manager, even though both come from the same table.',
          'The aliases are essential here. Without them, PostgreSQL could not tell which copy of the table you mean. Choose aliases that say the role, like e and m, or emp and mgr.',
          'Use LEFT JOIN if people without a manager, like the CEO, should still appear. With INNER JOIN, the person at the top disappears, because they have no manager to match.'
        ],
        example: 'In a family tree, every person has a mother, who is also a person in the same tree. To write "Ravi, son of Sunita", you look up Ravi, then look up his mother in the same tree. A self join does that lookup.',
        code: lines(
          'CREATE TABLE employees (id int PRIMARY KEY, name text, manager_id int REFERENCES employees(id));',
          "INSERT INTO employees VALUES (1, 'Anita', NULL), (2, 'Vikram', 1), (3, 'Sara', 1), (4, 'Joel', 2);",
          'SELECT e.name AS employee, m.name AS manager',
          'FROM employees e',
          'LEFT JOIN employees m ON m.id = e.manager_id',
          'ORDER BY e.id;'
        ),
        output: lines(
          ' employee | manager',
          '----------+---------',
          ' Anita    | NULL',
          ' Vikram   | Anita',
          ' Sara     | Anita',
          ' Joel     | Vikram',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 1, note: 'manager_id points to another row of the same table.' },
          { line: 4, note: 'e is the employee...' },
          { line: 5, note: '...and m is the same table again, playing the manager. LEFT JOIN keeps Anita, who has no manager.' }
        ],
        tryIt: 'Change LEFT JOIN to JOIN and run it. Anita, the boss, disappears because she has no manager.',
        check: {
          question: 'What makes a self join possible?',
          options: ['Listing the same table twice with two different aliases', 'A special SELF JOIN keyword', 'Copying the table first'],
          answer: 0,
          why: 'Two aliases let PostgreSQL treat the same table as two roles, like employee and manager.'
        }
      },
      {
        title: 'More uses of self joins',
        say: [
          'Self joins are not only for managers. Any time you need to compare rows of the same table with each other, a self join can help.',
          'For example, finding pairs of customers who live in the same city: join customers to itself on the city, and keep pairs where the first id is smaller than the second. The id rule avoids pairing a customer with themselves and avoids listing each pair twice.',
          'Another example is finding products in the same category with a price difference of less than 100 rupees, which could help a shop suggest cheaper alternatives. The join matches on category, and the WHERE compares prices.',
          'Self joins can create many rows quickly: a table with 1,000 customers can produce up to a million pairs. Always add a condition that keeps the pairs meaningful, like same city or same category.',
          'On Day 17 you will learn window functions, which can answer some "compare with other rows" questions, like "the previous order", without a self join.',
          'Self joins also appear with dates, for example comparing each day\'s sales with the day before by joining a daily sales table to itself on day = previous_day + 1. It works, but window functions make it simpler, which is one reason they are so popular.'
        ],
        example: 'A college wants to form study pairs from students in the same hostel. For each student, it looks down the same list for others in the same hostel. It is one list compared with itself.',
        code: lines(
          MINI_SHOP,
          'SELECT a.name AS customer_1, b.name AS customer_2, a.city',
          'FROM customers a',
          'JOIN customers b ON b.city = a.city AND a.id < b.id',
          'ORDER BY a.city;'
        ),
        output: lines(
          ' customer_1 | customer_2 | city',
          '------------+------------+------',
          ' Asha       | Priya      | Pune',
          '(1 row)'
        ),
        codeNotes: [
          { line: 11, note: 'Same city, and a.id < b.id so each pair appears once and nobody pairs with themselves.' }
        ],
        tryIt: 'Change a.id < b.id to a.id <> b.id and run it. Now each pair appears twice, once in each order.',
        check: {
          question: 'Why add a.id < b.id when pairing customers from the same city?',
          options: ['To avoid pairing a customer with themselves and listing each pair twice', 'To sort the result', 'Because ids must be compared in every join'],
          answer: 0,
          why: 'Without it, each customer matches themselves, and every pair appears as (A, B) and (B, A).'
        }
      },
      {
        title: 'Choosing the right join at each step',
        say: [
          'In a chain of joins, each JOIN can be INNER or LEFT, and the choice matters. A simple rule: start from the table whose rows must all appear, and use LEFT JOIN for every step after it.',
          'Why every step? If you LEFT JOIN orders to customers, but then INNER JOIN order_items to orders, customers with no orders lose their row at the second step, because their NULL order has no order_items to match. One INNER JOIN in the chain can undo the LEFT JOINs before it.',
          'If the question is only about things that exist on every side, like "products in delivered orders", INNER JOINs all the way are correct and simpler.',
          'Before writing a query, say the question out loud and underline the word "every". "Every customer" means customers first with LEFT JOINs. "Orders with their products" means INNER JOINs are fine.',
          'When a count looks too small after adding a join, check the join types. When it looks too big, check for a join that multiplies rows. These two checks solve most join bugs.',
          'In interviews, you may be asked to explain the difference between INNER and LEFT JOIN with a small example. Using customers and orders, and a customer with no orders, is a simple way to show it clearly, exactly like this week\'s examples.'
        ],
        example: 'A relay race needs every runner to pass the baton. If one runner in the middle drops it, it does not matter how well the first runners did: the baton is lost. One INNER JOIN in a chain of LEFT JOINs is that dropped baton.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, count(oi.product_id) AS lines',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'JOIN order_items oi ON oi.order_id = o.id',
          'GROUP BY c.id, c.name ORDER BY c.name;',
          'SELECT c.name, count(oi.product_id) AS lines',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'LEFT JOIN order_items oi ON oi.order_id = o.id',
          'GROUP BY c.id, c.name ORDER BY c.name;'
        ),
        output: lines(
          ' name  | lines',
          '-------+-------',
          ' Asha  |     3',
          ' Priya |     1',
          ' Ravi  |     1',
          '(3 rows)',
          '',
          ' name  | lines',
          '-------+-------',
          ' Asha  |     3',
          ' Meera |     0',
          ' Priya |     1',
          ' Ravi  |     1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 12, note: 'An INNER JOIN after a LEFT JOIN: Meera is lost again.' },
          { line: 17, note: 'LEFT JOIN at every step: Meera stays, with 0 lines.' }
        ],
        tryIt: 'In the first query, change the order of the two JOIN lines and see whether the result changes.',
        check: {
          question: 'You LEFT JOIN customers to orders, then INNER JOIN order_items. What happens to customers with no orders?',
          options: ['They disappear, because the INNER JOIN finds no order_items for them', 'They stay with NULLs', 'They appear twice'],
          answer: 0,
          why: 'Their NULL order row has nothing to match in order_items, so the INNER JOIN removes it. Use LEFT JOIN at every step.'
        }
      },
      {
        title: 'Putting it together: who bought what',
        say: [
          'Let us write a report that crosses all four shop tables: for each customer, the list of different products they have bought, in one row, and how many units in total.',
          'string_agg is an aggregate that joins text from many rows into one, with a separator you choose: string_agg(DISTINCT p.name, \', \') gives "Notebook, Pen". Adding ORDER BY inside it keeps the list in a fixed order.',
          'The query starts from customers with LEFT JOINs all the way, so Meera appears, with no products and 0 units. It groups by the customer and uses coalesce for the units.',
          'In today\'s practice, you will add up units sold per product in delivered orders, and show each employee with their manager\'s name. Both come straight from this lesson.',
          'Tomorrow you learn to combine the results of two queries on top of each other with UNION, and to compare lists with INTERSECT and EXCEPT.'
        ],
        example: 'A shop\'s customer card might say: "Asha: Notebook, Pen, 18 items so far". Behind that one line are four tables joined together and summarised per customer.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name,',
          "       string_agg(DISTINCT p.name, ', ' ORDER BY p.name) AS products,",
          '       coalesce(sum(oi.quantity), 0) AS units',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'LEFT JOIN order_items oi ON oi.order_id = o.id',
          'LEFT JOIN products p ON p.id = oi.product_id',
          'GROUP BY c.id, c.name',
          'ORDER BY c.name;'
        ),
        output: lines(
          ' name  | products      | units',
          '-------+---------------+-------',
          ' Asha  | Notebook, Pen |    18',
          ' Meera | NULL          |     0',
          ' Priya | Notebook      |     1',
          ' Ravi  | Backpack      |     1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'string_agg joins the product names into one text, A to Z, each once.' },
          { line: 13, note: 'LEFT JOIN at every step, so every customer appears.' }
        ],
        tryIt: "Change the separator from ', ' to ' + ' and run it again.",
        check: {
          question: 'What does string_agg(p.name, \', \') do?',
          options: ['Joins the names from many rows into one text, separated by commas', 'Counts the names', 'Splits a name into letters'],
          answer: 0,
          why: 'string_agg is an aggregate for text: it combines values from the rows in a group into one string.'
        }
      }
    ],
    summary: [
      'Chain joins one step at a time, each following one foreign key.',
      'Filter and group on any joined table; think about what one row means first.',
      'A self join uses the same table twice with two aliases, like employee and manager.',
      'Start from the table that must keep every row, and use LEFT JOIN at every step after it.',
      'string_agg joins text from many rows into one, like a list of products.'
    ],
    projectStep: {
      title: 'My Library: series and sequels',
      steps: [
        'Add a sequel_of int REFERENCES books(id) column to your books design.',
        'Mark one book as the sequel of another.',
        'Use a self join to show each book next to the book it follows.',
        'Use string_agg to list all your book titles per author in one row.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 14,
    title: 'Combining Results: UNION, INTERSECT, EXCEPT',
    goal: 'You can stack results with UNION and UNION ALL, and compare lists with INTERSECT and EXCEPT.',
    minutes: 28,
    recap: 'Yesterday you chained joins across many tables and joined a table to itself.',
    parts: [
      {
        title: 'UNION: stacking results',
        say: [
          'Joins put tables side by side. Sometimes you want to stack results on top of each other instead: the cities of customers and the cities of stores in one list, or this year\'s orders and last year\'s archived orders together.',
          'UNION does this. You write two complete SELECT queries with UNION between them, and PostgreSQL returns the rows of both as one result.',
          'Plain UNION also removes duplicate rows. If Pune appears in both lists, it appears only once in the result. That is handy for "every city we are in", where you want each city once.',
          'The column names in the result come from the first query. So give good names with AS in the first SELECT; the names in the second one are ignored.',
          'ORDER BY applies to the whole combined result, so write it once at the very end, after the last SELECT. You cannot sort each part separately with a plain ORDER BY in the middle.',
          'UNION is also handy when data about the same kind of thing is split across tables for historical reasons, such as an old system and a new one. Rather than changing both tables, a UNION query can present them as one list while the teams decide how to merge them properly.'
        ],
        example: 'Two teachers each have an attendance list for a joint event. To send one thank-you message to everyone, you put both lists together and cross out names that appear twice. That combined list without repeats is UNION.',
        code: lines(
          MINI_SHOP,
          'CREATE TABLE stores (city text);',
          "INSERT INTO stores VALUES ('Pune'), ('Bengaluru'), ('Delhi');",
          'SELECT city AS place FROM customers WHERE city IS NOT NULL',
          'UNION',
          'SELECT city FROM stores',
          'ORDER BY place;'
        ),
        output: lines(
          ' place',
          '-----------',
          ' Bengaluru',
          ' Delhi',
          ' Mumbai',
          ' Pune',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'The first query names the column: place.' },
          { line: 12, note: 'UNION stacks the two results and removes duplicates, so Pune appears once.' },
          { line: 14, note: 'One ORDER BY for the whole result, at the end.' }
        ],
        tryIt: 'Remove WHERE city IS NOT NULL from the first query and run it. A NULL place appears for Meera.',
        check: {
          question: 'What does UNION do with a row that appears in both queries?',
          options: ['Shows it once', 'Shows it twice', 'Removes it completely'],
          answer: 0,
          why: 'Plain UNION removes duplicates. UNION ALL, next, keeps them.'
        }
      },
      {
        title: 'UNION ALL: keep every row',
        say: [
          'UNION ALL stacks results like UNION, but keeps every row, including duplicates. It is also faster, because PostgreSQL does not have to check for duplicates.',
          'Use UNION ALL when duplicates are real and meaningful. For example, combining this year\'s orders with archived orders: two different orders with the same amount are still two orders, and removing one would make totals wrong.',
          'Use plain UNION when you want a list of distinct values, like "every city we operate in".',
          'A common mistake is using UNION out of habit, and then wondering why a total is too small. If you are adding up or counting afterwards, you almost always want UNION ALL.',
          'Removing duplicates also costs time. To find duplicates, PostgreSQL has to sort or compare every row, which is noticeable on large results. So UNION ALL is not only more correct for totals, it is also faster. Use plain UNION only when you really want each value once.',
          'You can stack more than two queries: SELECT ... UNION ALL SELECT ... UNION ALL SELECT .... Each part must still follow the rules in the next part of this lesson.'
        ],
        example: 'Adding up a family\'s expenses from three people\'s notebooks: if two people both bought tea for 20 rupees, both expenses are real. Crossing one out as a "duplicate" would make the total wrong. That is why totals use UNION ALL.',
        code: lines(
          'CREATE TABLE orders_2026 (id int, amount numeric(10,2));',
          'INSERT INTO orders_2026 VALUES (1, 500), (2, 250);',
          'CREATE TABLE orders_2025 (id int, amount numeric(10,2));',
          'INSERT INTO orders_2025 VALUES (7, 250), (8, 900);',
          'SELECT sum(amount) AS total_with_union FROM (SELECT amount FROM orders_2026 UNION SELECT amount FROM orders_2025) AS t;',
          'SELECT sum(amount) AS total_with_union_all FROM (SELECT amount FROM orders_2026 UNION ALL SELECT amount FROM orders_2025) AS t;'
        ),
        output: lines(
          ' total_with_union',
          '------------------',
          '          1650.00',
          '(1 row)',
          '',
          ' total_with_union_all',
          '----------------------',
          '              1900.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 5, note: 'UNION drops one of the two 250s, so the total is wrong.' },
          { line: 6, note: 'UNION ALL keeps both, so the total is right. (A query in brackets in FROM is a subquery; more on Day 15.)' }
        ],
        tryIt: 'Add a third year table with one order of 500, and include it with another UNION ALL in the second query.',
        check: {
          question: 'You are combining two lists of payments to add them up. Which should you use?',
          options: ['UNION ALL', 'UNION', 'INTERSECT'],
          answer: 0,
          why: 'Two separate payments can have the same amount. UNION would drop one; UNION ALL keeps every row, so the sum is correct.'
        }
      },
      {
        title: 'The rules for combining queries',
        say: [
          'UNION, INTERSECT and EXCEPT have two simple rules. First, every query must return the same number of columns. Second, the columns in the same position must have compatible types: text with text, numbers with numbers.',
          'The columns are matched by position, not by name. The first column of the second query goes under the first column of the first query, whatever it is called. So always list the columns in the same order in every part.',
          'If one table has a column the other does not, you can fill the gap with a fixed value: SELECT name, \'customer\' AS kind FROM customers UNION ALL SELECT name, \'supplier\' FROM suppliers. The fixed text column also tells you where each row came from.',
          'If the types do not match, PostgreSQL gives an error that says UNION types cannot be matched. Cast one side, for example with ::text, when you really need to combine them.',
          'These rules make sense when you imagine the result: one table with one set of columns. Each part must fit into those columns.',
          'When combining text and numbers in a report, it is often clearer to convert everything to text in the parts that need it, for example amount::text, and to label each row with a kind column. The reader then always knows what a row is, even though it came from a different table.'
        ],
        example: 'Stacking two spreadsheets on top of each other only works if the columns line up: name above name, phone above phone. If one sheet has phone in column B and the other has it in column C, the combined sheet is a mess. SQL insists on lined-up columns.',
        code: lines(
          'CREATE TABLE customers (name text, city text);',
          "INSERT INTO customers VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai');",
          'CREATE TABLE suppliers (company text, city text);',
          "INSERT INTO suppliers VALUES ('Paper Mart', 'Pune');",
          "SELECT name, city, 'customer' AS kind FROM customers",
          'UNION ALL',
          "SELECT company, city, 'supplier' FROM suppliers",
          'ORDER BY city, name;',
          'SELECT name, city FROM customers UNION SELECT company FROM suppliers;'
        ),
        output: lines(
          ' name       | city   | kind',
          '------------+--------+----------',
          ' Ravi       | Mumbai | customer',
          ' Asha       | Pune   | customer',
          ' Paper Mart | Pune   | supplier',
          '(3 rows)',
          '',
          '[Error] each UNION query must have the same number of columns'
        ),
        codeNotes: [
          { line: 5, note: 'A fixed text column records where each row came from.' },
          { line: 7, note: 'company goes under name because it is in the same position.' },
          { line: 9, note: 'Two columns on one side and one on the other: an error.' }
        ],
        tryIt: 'Fix line 9 by giving the suppliers part two columns: SELECT name, city FROM customers UNION SELECT company, city FROM suppliers; Now both queries work.',
        check: {
          question: 'How are columns matched between the two queries of a UNION?',
          options: ['By position: first with first, second with second', 'By column name', 'Alphabetically'],
          answer: 0,
          why: 'UNION lines columns up by their position. The names in the result come from the first query.'
        }
      },
      {
        title: 'INTERSECT and EXCEPT: comparing lists',
        say: [
          'INTERSECT returns only the rows that appear in both queries. "Cities where we have both customers and a store" is customers\' cities INTERSECT store cities.',
          'EXCEPT returns the rows of the first query that do not appear in the second. "Cities where we have customers but no store yet" is customers\' cities EXCEPT store cities. The order matters: A EXCEPT B is not the same as B EXCEPT A.',
          'Like UNION, both remove duplicates by default, and both follow the same rules about the number and types of columns. INTERSECT ALL and EXCEPT ALL exist too, but they are rarely needed.',
          'These questions could also be answered with joins or subqueries, which you will learn tomorrow. But for simple list comparisons, INTERSECT and EXCEPT are often the clearest way to write them, because they read almost like the question.',
          'EXCEPT is especially useful for checking data. For example, "ids in the old system EXCEPT ids in the new system" shows records that were not copied during a migration.',
          'INTERSECT and EXCEPT compare whole rows, not single columns. If you select both city and state, a row matches only when both values match. This makes them precise, but it also means you should select only the columns you want to compare, or rows that differ in some other column will not match.'
        ],
        example: 'Comparing two shopping lists: things on both lists (INTERSECT), and things on your list but not on your roommate\'s (EXCEPT), so you know what only you need to buy.',
        code: lines(
          MINI_SHOP,
          'CREATE TABLE stores (city text);',
          "INSERT INTO stores VALUES ('Pune'), ('Bengaluru'), ('Delhi');",
          'SELECT city FROM customers INTERSECT SELECT city FROM stores;',
          'SELECT city FROM customers WHERE city IS NOT NULL EXCEPT SELECT city FROM stores;',
          'SELECT city FROM stores EXCEPT SELECT city FROM customers ORDER BY city;'
        ),
        output: lines(
          ' city',
          '------',
          ' Pune',
          '(1 row)',
          '',
          ' city',
          '--------',
          ' Mumbai',
          '(1 row)',
          '',
          ' city',
          '-----------',
          ' Bengaluru',
          ' Delhi',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'In both lists: only Pune.' },
          { line: 12, note: 'Customers\' cities without a store: Mumbai.' },
          { line: 13, note: 'The other way round: store cities with no customers yet.' }
        ],
        tryIt: "Add a store in Mumbai to the setup and run again. The second result becomes empty.",
        check: {
          question: 'What does SELECT city FROM customers EXCEPT SELECT city FROM stores return?',
          options: ['Customer cities that have no store', 'Store cities that have no customers', 'Cities in both'],
          answer: 0,
          why: 'EXCEPT keeps rows of the first query that are missing from the second. Swap the queries to get the other direction.'
        }
      },
      {
        title: 'UNION with joins and totals',
        say: [
          'Each part of a UNION can be a full query with joins, WHERE and GROUP BY. This lets you build reports that combine different kinds of information in one list.',
          'A common example is an activity feed: new orders from one table and new reviews from another, shown together in date order. Each part selects a date, a type and a description, and UNION ALL stacks them.',
          'You can also wrap a UNION in brackets and use it as a table in FROM, as you saw in part 2. That lets you group and total the combined rows, for example total spending across current and archived orders per customer.',
          'When the combined result is used again and again, it can be saved as a view, which you will learn on Day 24. Views make complex UNIONs easy to reuse.',
          'Keep each part simple and readable. If one part becomes very long, consider whether the data should really be in one table instead.',
          'The kind column in the example is worth copying in your own work. When results from several tables are stacked, a column that says where each row came from makes the result easy to filter later, for example to show only reviews, and it makes debugging much simpler.'
        ],
        example: 'A phone\'s notification screen shows messages, missed calls and app alerts in one list, newest first. They come from different places, but each has a time and a short text, so they can be stacked into one feed.',
        code: lines(
          'CREATE TABLE orders (id int, customer text, created_at date);',
          "INSERT INTO orders VALUES (1, 'Asha', '2026-09-10'), (2, 'Ravi', '2026-09-12');",
          'CREATE TABLE reviews (id int, customer text, rating int, created_at date);',
          "INSERT INTO reviews VALUES (1, 'Asha', 5, '2026-09-11'), (2, 'Priya', 3, '2026-09-13');",
          "SELECT created_at, 'order' AS kind, customer || ' placed order ' || id AS event FROM orders",
          'UNION ALL',
          "SELECT created_at, 'review', customer || ' gave ' || rating || ' stars' FROM reviews",
          'ORDER BY created_at DESC;'
        ),
        output: lines(
          ' created_at | kind   | event',
          '------------+--------+---------------------',
          ' 2026-09-13 | review | Priya gave 3 stars',
          ' 2026-09-12 | order  | Ravi placed order 2',
          ' 2026-09-11 | review | Asha gave 5 stars',
          ' 2026-09-10 | order  | Asha placed order 1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'Each part has the same three columns: date, kind and a readable event.' },
          { line: 8, note: 'The whole feed, newest first.' }
        ],
        tryIt: "Add LIMIT 3 at the end to show only the three newest events.",
        check: {
          question: 'What must be the same in both parts of the activity-feed UNION ALL?',
          options: ['The number of columns and their types, in the same order', 'The table names', 'The WHERE conditions'],
          answer: 0,
          why: 'Each part must return the same number of columns with compatible types, lined up by position.'
        }
      },
      {
        title: 'Putting it together: where the shop is',
        say: [
          'Let us answer three questions a growing shop might ask when planning where to open new stores, using today\'s three tools.',
          'Every city we are present in, with customers or stores: UNION. Cities with both customers and a store: INTERSECT. Cities with customers but no store yet, where a new store might be a good idea: EXCEPT.',
          'Each question is one short query, and each reads almost like the English question. That is the strength of these operators for list comparisons.',
          'In today\'s practice, you will list all cities with UNION, making sure each appears once, and find cities with customers but no store with EXCEPT.',
          'Tomorrow you learn subqueries: queries inside queries. They let you use the result of one question, like the average price, inside another question, like "products above the average".'
        ],
        example: 'A company planning expansion puts two lists on the table: where our customers are, and where our stores are. Where the lists differ is where the opportunities are.',
        code: lines(
          MINI_SHOP,
          'CREATE TABLE stores (city text);',
          "INSERT INTO stores VALUES ('Pune'), ('Bengaluru'), ('Delhi');",
          'SELECT count(*) AS cities_present FROM (SELECT city FROM customers WHERE city IS NOT NULL UNION SELECT city FROM stores) AS all_cities;',
          'SELECT city AS both_customers_and_store FROM customers INTERSECT SELECT city FROM stores;',
          'SELECT city AS store_opportunity FROM customers WHERE city IS NOT NULL EXCEPT SELECT city FROM stores;'
        ),
        output: lines(
          ' cities_present',
          '----------------',
          '              4',
          '(1 row)',
          '',
          ' both_customers_and_store',
          '--------------------------',
          ' Pune',
          '(1 row)',
          '',
          ' store_opportunity',
          '-------------------',
          ' Mumbai',
          '(1 row)'
        ),
        codeNotes: [
          { line: 11, note: 'Count the distinct cities from both lists.' },
          { line: 13, note: 'Where a new store might be a good idea.' }
        ],
        tryIt: "Add a new customer in Chennai to the setup: INSERT INTO customers VALUES (5, 'Arjun', 'Chennai'); and run again. Chennai becomes another opportunity.",
        check: {
          question: 'Which operator answers "cities with customers but no store"?',
          options: ['EXCEPT', 'UNION', 'INTERSECT'],
          answer: 0,
          why: 'EXCEPT keeps the cities from the first query (customers) that are missing from the second (stores).'
        }
      }
    ],
    summary: [
      'UNION stacks two results and removes duplicates; UNION ALL keeps every row.',
      'Use UNION ALL for totals and counts, so real duplicates are not lost.',
      'Every part needs the same number of columns with compatible types, matched by position.',
      'INTERSECT keeps rows in both results; EXCEPT keeps rows in the first but not the second.',
      'Names come from the first query; ORDER BY goes once, at the end.'
    ],
    projectStep: {
      title: 'My Library: books to read and books read',
      steps: [
        'Create a wishlist table with a title column and add 3 books you want to read.',
        'List every title from your books and your wishlist together with UNION.',
        'Find wishlist titles you already own with INTERSECT.',
        'Find wishlist titles you do not own yet with EXCEPT.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 15,
    title: 'Queries Inside Queries: Subqueries',
    goal: 'You can use subqueries that return one value, a list for IN, a table in FROM, and EXISTS checks.',
    minutes: 28,
    recap: 'Yesterday you stacked results with UNION and compared lists with INTERSECT and EXCEPT.',
    parts: [
      {
        title: 'A subquery that returns one value',
        say: [
          'Some questions have two steps. "Which products cost more than the average price?" First you need the average price. Then you compare each product with it. A subquery lets you do both steps in one query.',
          'A subquery is a SELECT inside brackets, placed inside another query. (SELECT avg(price) FROM products) works out the average, and the outer query uses it: WHERE price > (SELECT avg(price) FROM products).',
          'PostgreSQL runs the inner query first, gets one number, and then uses that number for every row of the outer query. You do not need to know the average yourself, and the answer stays correct when prices change.',
          'A subquery used like this must return exactly one value: one row, one column. If it returns several rows, PostgreSQL gives an error, because it cannot compare a price with a whole list.',
          'You can also put a one-value subquery in the SELECT list, to show it next to every row: SELECT name, price, (SELECT avg(price) FROM products) AS average. That makes it easy to compare each row with the overall figure.',
          'Because the inner query is recalculated every time you run the outer query, the result always reflects the current data. If a new expensive product is added tomorrow, the average changes, and so does the list of products above it, without anyone editing the query.'
        ],
        example: 'A teacher says: "stand up if your marks are above the class average". First she works out the average, then each student compares their own marks with it. The average is the subquery; the comparison is the outer query.',
        code: lines(
          MINI_SHOP,
          'SELECT round(avg(price), 2) AS average_price FROM products;',
          'SELECT name, price',
          'FROM products',
          'WHERE price > (SELECT avg(price) FROM products)',
          'ORDER BY price DESC;'
        ),
        output: lines(
          ' average_price',
          '---------------',
          '        355.00',
          '(1 row)',
          '',
          ' name     | price',
          '----------+---------',
          ' Backpack | 1200.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 9, note: 'On its own, the average is 355.00.' },
          { line: 12, note: 'The subquery in brackets gives that one number; each product is compared with it.' }
        ],
        tryIt: 'Change > to < to find the products below the average. Then add the average as a third column with (SELECT round(avg(price), 2) FROM products) AS average.',
        check: {
          question: 'What must a subquery used in WHERE price > (...) return?',
          options: ['Exactly one value', 'A list of values', 'A whole table'],
          answer: 0,
          why: 'Comparing with > needs a single value. A subquery returning several rows here causes an error.'
        }
      },
      {
        title: 'IN with a subquery',
        say: [
          'On Day 5 you used IN with a fixed list: status IN (\'delivered\', \'shipped\'). The list can also come from a subquery. customer_id IN (SELECT id FROM customers WHERE city = \'Pune\') means "orders from any customer in Pune".',
          'This subquery can return many rows, but only one column. PostgreSQL builds the list, then keeps the outer rows whose value is in it.',
          'Many questions can be written either with a join or with IN and a subquery. "Customers who have a delivered order" can be a join with DISTINCT, or WHERE id IN (SELECT customer_id FROM orders WHERE status = \'delivered\'). The IN version often reads more like the question.',
          'NOT IN finds the opposite: customers whose id is not in the list. But remember the NULL trap from Day 5: if the subquery\'s list contains a NULL, NOT IN finds nothing at all. That is why many developers prefer NOT EXISTS for "not in", which you will see in part 4.',
          'An IN subquery runs once, independently of the outer rows. That makes it easy to test: run the inner SELECT on its own first and check that the list is what you expect.'
        ],
        example: 'A college notice says: "students who are in the cricket team may leave early". The office first makes the cricket team list, then checks each student against it. The team list is the subquery.',
        code: lines(
          MINI_SHOP,
          "SELECT customer_id FROM orders WHERE status = 'delivered';",
          'SELECT name',
          'FROM customers',
          "WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered')",
          'ORDER BY name;'
        ),
        output: lines(
          ' customer_id',
          '-------------',
          '           1',
          '           2',
          '(2 rows)',
          '',
          ' name',
          '------',
          ' Asha',
          ' Ravi',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Run the inner query on its own first: the list of customer ids.' },
          { line: 12, note: 'Keep customers whose id is in that list.' }
        ],
        tryIt: "Change 'delivered' to 'pending' inside the subquery. Who has a pending order?",
        check: {
          question: 'In WHERE id IN (SELECT customer_id FROM orders), how many columns may the subquery return?',
          options: ['One', 'Any number', 'Exactly two'],
          answer: 0,
          why: 'IN compares one value with a list, so the subquery must return a single column (it may have many rows).'
        }
      },
      {
        title: 'Subqueries in FROM',
        say: [
          'A subquery can also be used as a table, in the FROM part. You saw this briefly yesterday, when a UNION was wrapped in brackets and then summed. The inner query builds a temporary result, and the outer query treats it like a table.',
          'A subquery in FROM must have an alias: FROM (SELECT ...) AS t. The alias is the temporary table\'s name, used for its columns in the outer query.',
          'This is useful for two-step calculations. For example, first work out each order\'s total with GROUP BY, then find the average order total. You cannot write avg(sum(...)) directly, but you can average the column of an inner query that already did the sums.',
          'Another use is filtering on a calculated column. The inner query calculates price * 1.18 AS with_gst, and the outer query can then say WHERE with_gst > 1000, because now with_gst is a real column of the inner result.',
          'Subqueries in FROM can become hard to read when nested deeply. Tomorrow you learn WITH, which gives each step a name and makes the same queries much clearer.'
        ],
        example: 'A cook first prepares a basic gravy in one pot, then uses it as the base for three different dishes. The subquery in FROM is that gravy: prepared first, then used by the outer query as if it were a ready ingredient.',
        code: lines(
          MINI_SHOP,
          'SELECT round(avg(order_total), 2) AS average_order',
          'FROM (',
          '  SELECT oi.order_id, sum(p.price * oi.quantity) AS order_total',
          '  FROM order_items oi',
          '  JOIN products p ON p.id = oi.product_id',
          '  GROUP BY oi.order_id',
          ') AS totals;'
        ),
        output: lines(
          ' average_order',
          '---------------',
          '        397.50',
          '(1 row)'
        ),
        codeNotes: [
          { line: 11, note: 'The inner query: one row per order with its total.' },
          { line: 15, note: 'The alias names the temporary table.' },
          { line: 9, note: 'The outer query averages the inner totals.' }
        ],
        tryIt: 'Change avg to max in the first line to find the biggest order total.',
        check: {
          question: 'Why use a subquery in FROM to find the average order total?',
          options: ['You first need one total per order, then an average of those totals', 'avg only works in subqueries', 'To make the query shorter'],
          answer: 0,
          why: 'It is a two-step calculation: sum per order, then average across orders. The inner query does the first step.'
        }
      },
      {
        title: 'EXISTS and correlated subqueries',
        say: [
          'EXISTS asks a yes-or-no question: does the subquery return at least one row? WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id) keeps customers who have at least one order.',
          'Notice that the subquery mentions c.id, a column from the outer query. That makes it a correlated subquery: it runs once for each outer row, with that row\'s values. For Asha it checks Asha\'s orders, for Meera it checks Meera\'s orders, and so on.',
          'NOT EXISTS is the safest way to find rows with no match: customers with no orders, products never sold. Unlike NOT IN, it is not confused by NULLs. Many experienced developers use NOT EXISTS for every "has no" question.',
          'Inside EXISTS, it does not matter what you SELECT, only whether any row exists. That is why people write SELECT 1. PostgreSQL stops looking as soon as it finds one match, which makes EXISTS efficient.',
          'You now know three ways to find customers with no orders: LEFT JOIN with IS NULL, NOT IN, and NOT EXISTS. They usually give the same answer, but NOT EXISTS is the most reliable when NULLs are possible.'
        ],
        example: 'A receptionist checks for each visitor: "is there at least one appointment in your name today?". She does not need to count them, and she stops looking at the first one she finds. That is EXISTS, checked separately for each visitor.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name FROM customers c',
          'WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)',
          'ORDER BY c.name;',
          'SELECT c.name FROM customers c',
          'WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);'
        ),
        output: lines(
          ' name',
          '-------',
          ' Asha',
          ' Priya',
          ' Ravi',
          '(3 rows)',
          '',
          ' name',
          '-------',
          ' Meera',
          '(1 row)'
        ),
        codeNotes: [
          { line: 10, note: 'For each customer: is there at least one order with their id?' },
          { line: 13, note: 'NOT EXISTS: customers with no orders at all.' }
        ],
        tryIt: "Change the second query to find customers with no delivered order: add AND o.status = 'delivered' inside the subquery.",
        check: {
          question: 'What makes a subquery "correlated"?',
          options: ['It uses a column from the outer query, so it runs for each outer row', 'It returns exactly one value', 'It is inside FROM'],
          answer: 0,
          why: 'A correlated subquery refers to the outer row, like c.id, so its answer depends on which row is being checked.'
        }
      },
      {
        title: 'Subqueries in SELECT, and when to use a join instead',
        say: [
          'A correlated subquery can also go in the SELECT list, to calculate something for each row: SELECT c.name, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS orders FROM customers c. For each customer, the subquery counts their orders.',
          'This is easy to read, and it naturally gives 0 for customers with no orders, without the LEFT JOIN count trap from Day 12.',
          'But it runs once per row. For a few thousand rows that is fine. For millions of rows, a join with GROUP BY is usually much faster, because PostgreSQL can process all the rows together.',
          'A useful rule: if you need several values from the other table, like count, sum and max, a join with GROUP BY is cleaner than three separate subqueries. If you need one simple value per row, a subquery in SELECT can be clearer.',
          'There is rarely only one correct way to write a query. Readability for your teammates and correctness come first; speed matters when the tables are big. You will learn to measure speed with EXPLAIN on Day 23.'
        ],
        example: 'A class teacher can ask each student one by one, "how many books did you read?". That works for a class of 40. For a school of 5,000, it is faster to collect all the reading logs and count them together. Subqueries per row are the one-by-one approach; joins with GROUP BY are the bulk approach.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name,',
          '       (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS orders,',
          '       (SELECT max(o.ordered_on) FROM orders o WHERE o.customer_id = c.id) AS last_order',
          'FROM customers c',
          'ORDER BY c.name;'
        ),
        output: lines(
          ' name  | orders | last_order',
          '-------+--------+------------',
          ' Asha  |      2 | 2026-09-10',
          ' Meera |      0 | NULL',
          ' Priya |      1 | 2026-09-12',
          ' Ravi  |      1 | 2026-09-03',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'For each customer: count their orders. Meera gets 0 naturally.' },
          { line: 11, note: 'A second subquery for the latest order date; NULL when there is none.' }
        ],
        tryIt: 'Rewrite this report as a LEFT JOIN with GROUP BY c.id, c.name, using count(o.id) and max(o.ordered_on). Check you get the same result.',
        check: {
          question: 'When is a join with GROUP BY usually better than a subquery in SELECT?',
          options: ['On large tables, or when you need several values from the other table', 'Never', 'Only when there are no NULLs'],
          answer: 0,
          why: 'A subquery in SELECT runs once per row. A join with GROUP BY processes all rows together and can return several aggregates at once.'
        }
      },
      {
        title: 'Putting it together: finding the most valuable customers',
        say: [
          'Let us answer a question that needs several steps: "Which customers have spent more than the average customer?". First, the total spent by each customer. Second, the average of those totals. Third, the customers above it.',
          'The query below builds each customer\'s total in a subquery in FROM, and compares it with a one-value subquery that averages the same totals. It works, but notice how the same inner query appears twice. Tomorrow, WITH will let you write that step once and give it a name.',
          'This kind of layered question, "above average", "top per group", "more than their usual", is very common in business reports and data interviews. Subqueries are the tool that makes them possible.',
          'In today\'s practice, you will find products priced above the average price, and customers who have at least one delivered order.',
          'You have now finished the first half of the course. You can read, filter, sort, total, group, join and nest queries: the core of everyday SQL. Next comes making complex queries readable, and then the advanced tools that analysts and backend developers use every day.'
        ],
        example: 'A bank wants to invite its best customers to a special offer. It first works out each customer\'s total deposits, then the average, then invites those above it. Three steps, one answer.',
        code: lines(
          MINI_SHOP,
          'SELECT name, spent',
          'FROM (',
          '  SELECT c.name, sum(p.price * oi.quantity) AS spent',
          '  FROM customers c',
          '  JOIN orders o ON o.customer_id = c.id',
          '  JOIN order_items oi ON oi.order_id = o.id',
          '  JOIN products p ON p.id = oi.product_id',
          '  GROUP BY c.id, c.name',
          ') AS per_customer',
          'WHERE spent > (',
          '  SELECT avg(total) FROM (',
          '    SELECT sum(p.price * oi.quantity) AS total',
          '    FROM orders o',
          '    JOIN order_items oi ON oi.order_id = o.id',
          '    JOIN products p ON p.id = oi.product_id',
          '    GROUP BY o.customer_id',
          '  ) AS totals',
          ')',
          'ORDER BY spent DESC;'
        ),
        output: lines(
          ' name | spent',
          '------+---------',
          ' Ravi | 1200.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 11, note: 'Step 1: each customer\'s total spending.' },
          { line: 18, note: 'Steps 2 and 3: keep customers above the average of those totals.' },
          { line: 20, note: 'The same kind of per-customer total is calculated again here; WITH will fix that tomorrow.' }
        ],
        tryIt: 'Change the comparison in WHERE from > to < to find customers who spent less than the average.',
        check: {
          question: 'Why is the per-customer total calculated twice in this query?',
          options: ['Once to list customers and once inside the average; WITH can name it once instead', 'Because PostgreSQL requires it', 'To make the result more accurate'],
          answer: 0,
          why: 'Subqueries cannot be reused by name. WITH, tomorrow, lets you define a step once and use it several times.'
        }
      }
    ],
    summary: [
      'A subquery is a SELECT in brackets inside another query.',
      'One-value subqueries work with =, >, < and in the SELECT list.',
      'IN (SELECT ...) uses a one-column list; beware NULLs with NOT IN.',
      'A subquery in FROM needs an alias and is great for two-step calculations.',
      'EXISTS and NOT EXISTS check for matching rows; NOT EXISTS is safest for "has no".'
    ],
    projectStep: {
      title: 'My Library: above-average books',
      steps: [
        'Find your books with more pages than the average, using a subquery.',
        'Find authors who have at least one finished book, with IN or EXISTS.',
        'Find authors with no finished books, using NOT EXISTS.',
        'Show each author with their number of books using a subquery in SELECT.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 16,
    title: 'Readable Queries with WITH',
    goal: 'You can break a long query into named steps with WITH, reuse a step, and write recursive queries for sequences and hierarchies.',
    minutes: 28,
    recap: 'Yesterday you used subqueries: one value, IN lists, tables in FROM, and EXISTS checks.',
    parts: [
      {
        title: 'Why long queries need names',
        say: [
          'At the end of yesterday\'s lesson, the "customers above average" query calculated each customer\'s total twice, inside brackets inside brackets. It worked, but it was hard to read, and if you changed one copy and forgot the other, the answer would be wrong.',
          'WITH solves this. It lets you give a step a name, write it once at the top, and then use that name like a table in the rest of the query. The named step is called a CTE, short for common table expression.',
          'The shape is: WITH step_name AS ( SELECT ... ) SELECT ... FROM step_name. Read it like a recipe: "first make this, and call it step_name; then use it to make the final dish".',
          'A CTE only exists while that one query runs. It is not saved as a table, and it does not change any data. The next query starts fresh.',
          'The biggest benefit is readability. A complicated report becomes a series of small, named steps, each easy to check on its own. Analysts and backend developers write long reports this way every day.',
          'You can test each step separately: copy the SELECT inside the brackets, run it on its own, and check its rows before building the next step on top of it.'
        ],
        example: 'A good cooking recipe says: "Step 1, make the masala. Step 2, cook the vegetables. Step 3, add the masala to the vegetables." Each step has a name and is done once. WITH turns a long query into that kind of recipe.',
        code: lines(
          MINI_SHOP,
          'WITH order_totals AS (',
          '  SELECT oi.order_id, sum(p.price * oi.quantity) AS total',
          '  FROM order_items oi',
          '  JOIN products p ON p.id = oi.product_id',
          '  GROUP BY oi.order_id',
          ')',
          'SELECT order_id, total',
          'FROM order_totals',
          'WHERE total > 100',
          'ORDER BY total DESC;'
        ),
        output: lines(
          ' order_id | total',
          '----------+---------',
          '      102 | 1200.00',
          '      101 |  280.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'WITH gives the step a name: order_totals.' },
          { line: 17, note: 'The main query uses order_totals like a table.' }
        ],
        tryIt: 'Change the main query to SELECT count(*) AS big_orders FROM order_totals WHERE total > 100; and run it.',
        check: {
          question: 'What is a CTE made with WITH?',
          options: ['A named step that exists only while the query runs', 'A new table saved in the database', 'A copy of the whole database'],
          answer: 0,
          why: 'A CTE is a temporary, named result used by the rest of the query. It is not saved and does not change data.'
        }
      },
      {
        title: 'Several steps, one after another',
        say: [
          'A WITH can hold several steps, separated by commas. Each step can use the steps above it. This is how you build a report in layers.',
          'The shape is: WITH step_one AS ( ... ), step_two AS ( SELECT ... FROM step_one ... ) SELECT ... FROM step_two. There is only one WITH word at the top; the next steps just follow after commas.',
          'Now the "customers above average" question from yesterday becomes clear. Step one: each customer\'s total. Step two is not even needed as a separate table; the main query compares each total with the average of the same step.',
          'Because the step is written once, a change to how totals are calculated, for example leaving out cancelled orders, happens in exactly one place.',
          'Give steps descriptive names, like customer_totals or delivered_orders, not t1 and t2. The names are what make the query readable months later.',
          'A good way to plan a layered query is to write the steps in plain words first, as comments, and then fill in the SQL under each comment.',
          'WITH also works in front of INSERT, UPDATE and DELETE, not only SELECT. For example, a step can find the ids of old cancelled orders, and the DELETE that follows removes exactly those. You will not need this often yet, but it is good to know the tool is there.'
        ],
        example: 'A school report card is built in layers: first each subject\'s marks, then the total per student, then the class average, then who is above it. Each layer uses the one before. WITH lets you write those layers in order.',
        code: lines(
          MINI_SHOP,
          'WITH customer_totals AS (',
          '  SELECT c.name, sum(p.price * oi.quantity) AS spent',
          '  FROM customers c',
          '  JOIN orders o ON o.customer_id = c.id',
          '  JOIN order_items oi ON oi.order_id = o.id',
          '  JOIN products p ON p.id = oi.product_id',
          '  GROUP BY c.id, c.name',
          '),',
          'average AS (',
          '  SELECT avg(spent) AS avg_spent FROM customer_totals',
          ')',
          'SELECT ct.name, ct.spent, round(a.avg_spent, 2) AS average',
          'FROM customer_totals ct, average a',
          'WHERE ct.spent > a.avg_spent;'
        ),
        output: lines(
          ' name | spent   | average',
          '------+---------+---------',
          ' Ravi | 1200.00 |  530.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 9, note: 'Step 1: each customer\'s total, written once.' },
          { line: 17, note: 'Step 2 uses step 1: the average of those totals.' },
          { line: 21, note: 'average has one row, so listing it in FROM adds that one value to every customer row.' }
        ],
        tryIt: 'Remove the WHERE line and run it. You now see every customer with the average next to them.',
        check: {
          question: 'In WITH a AS (...), b AS (...) SELECT ..., which steps can b use?',
          options: ['a, because it is defined above b', 'Only tables, not a', 'Only the main query can use a'],
          answer: 0,
          why: 'Each step can use the steps defined before it. That is how layers are built.'
        }
      },
      {
        title: 'WITH versus subqueries',
        say: [
          'Anything you can write with WITH, you can usually write with subqueries too. So why prefer WITH? Mostly for people, not for the computer.',
          'A subquery is read from the inside out: you have to find the innermost brackets first. A WITH query is read from top to bottom, in the order the steps happen. That matches how people think about a problem.',
          'WITH also lets you use the same step several times without repeating it, as you saw with customer_totals. With subqueries, you would copy the same SQL twice.',
          'In modern PostgreSQL, a simple CTE is usually just as fast as the same subquery, because the database optimiser can merge them. So you can choose WITH for clarity without worrying about speed in most cases.',
          'Short, one-step questions are still fine as subqueries. WHERE price > (SELECT avg(price) FROM products) is perfectly clear. Reach for WITH when a query has two or more steps, or when a step is used twice.',
          'In job interviews, writing a multi-step answer with clearly named CTEs makes a strong impression, because the interviewer can follow your thinking step by step.'
        ],
        example: 'Directions to a friend\'s house can be given as one long sentence full of "after the thing that is next to the place where...", or as a numbered list. Both get you there, but the numbered list is much easier to follow. WITH is the numbered list.',
        code: lines(
          MINI_SHOP,
          '-- As a subquery:',
          'SELECT count(*) AS big_orders FROM (',
          '  SELECT oi.order_id FROM order_items oi JOIN products p ON p.id = oi.product_id',
          '  GROUP BY oi.order_id HAVING sum(p.price * oi.quantity) > 100',
          ') AS t;',
          '-- The same with WITH:',
          'WITH big_orders AS (',
          '  SELECT oi.order_id FROM order_items oi JOIN products p ON p.id = oi.product_id',
          '  GROUP BY oi.order_id HAVING sum(p.price * oi.quantity) > 100',
          ')',
          'SELECT count(*) AS big_orders FROM big_orders;'
        ),
        output: lines(
          ' big_orders',
          '------------',
          '          2',
          '(1 row)',
          '',
          ' big_orders',
          '------------',
          '          2',
          '(1 row)'
        ),
        codeNotes: [
          { line: 10, note: 'The subquery version: read the inside first.' },
          { line: 15, note: 'The WITH version: the step is named first, then used.' }
        ],
        tryIt: 'Change the limit from 100 to 1000 in both queries. Both answers change the same way, because they are the same query.',
        check: {
          question: 'What is the main reason to prefer WITH over nested subqueries?',
          options: ['It is easier to read top to bottom and a step can be reused', 'It is always much faster', 'Subqueries are not allowed in PostgreSQL'],
          answer: 0,
          why: 'WITH mainly helps people: named steps in order, written once. Speed is usually the same.'
        }
      },
      {
        title: 'Recursive WITH: counting and sequences',
        say: [
          'WITH has a special form, WITH RECURSIVE, where a step refers to itself. It sounds strange, but it is the SQL way of repeating something until a condition stops it, like a loop.',
          'A recursive CTE has two parts joined by UNION ALL. The first part is the starting row, like SELECT 1. The second part takes the rows made so far and makes the next ones, like SELECT n + 1 FROM nums WHERE n < 10.',
          'PostgreSQL runs the starting part once, then runs the second part again and again on the newest rows, until it produces no new rows. The WHERE in the second part is what stops it.',
          'If you forget the stopping condition, the query runs forever. In the lesson editor, it is stopped after a few seconds, but on a real server it could run until someone notices. Always check the WHERE in the recursive part.',
          'A simple use is generating a list of dates, like every day of a month, to make sure a report shows days with no sales as zero. PostgreSQL also has generate_series for this, but the recursive form shows the idea.',
          'Recursive queries are an advanced topic. You do not need to use them often, but knowing how they work helps with the next part: walking through a hierarchy.'
        ],
        example: 'Counting stairs as you climb: start at step 1, and each time go up one, until you reach the top floor. The starting step is the first part; "go up one until the top" is the recursive part.',
        code: lines(
          'WITH RECURSIVE days(day) AS (',
          "  SELECT date '2026-09-01'",
          '  UNION ALL',
          "  SELECT day + 1 FROM days WHERE day < date '2026-09-05'",
          ')',
          'SELECT day, to_char(day, \'Dy\') AS weekday FROM days;'
        ),
        output: lines(
          ' day        | weekday',
          '------------+---------',
          ' 2026-09-01 | Tue',
          ' 2026-09-02 | Wed',
          ' 2026-09-03 | Thu',
          ' 2026-09-04 | Fri',
          ' 2026-09-05 | Sat',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'The starting row: 1 September.' },
          { line: 4, note: 'The next row is the day after, until 5 September. The WHERE stops it.' },
          { line: 6, note: 'Use the generated days like a table.' }
        ],
        tryIt: 'Change the end date to 2026-09-10 and run it. You get ten days.',
        check: {
          question: 'What stops a recursive CTE from running forever?',
          options: ['A WHERE condition in the recursive part that eventually produces no new rows', 'The UNION ALL keyword', 'The name of the CTE'],
          answer: 0,
          why: 'The recursive part runs until it returns no rows. Its WHERE condition is what makes that happen.'
        }
      },
      {
        title: 'Recursive WITH: walking a hierarchy',
        say: [
          'The most useful job for WITH RECURSIVE is walking down a tree of data: a company\'s reporting chain, categories and sub-categories, or folders inside folders.',
          'The starting part picks the top of the tree, for example the boss with no manager. The recursive part finds everyone whose manager is someone already found, level by level.',
          'You can carry extra information down the tree, like a level number that goes up by one each step, or a path of names that grows longer. That lets you show the whole structure clearly.',
          'Without recursion, you would need a separate self join for every level, and you would have to know in advance how deep the tree goes. The recursive CTE works for any depth.',
          'On large trees, add a limit on the level as a safety net, like WHERE level < 20, in case the data has a loop by mistake, for example two people listed as each other\'s manager.',
          'You will not write these every day, but when a question says "everyone under this manager" or "all sub-categories of electronics", recursive WITH is the tool.'
        ],
        example: 'A family tree drawn from a great-grandmother down: first her, then her children, then their children, each generation one level lower. Walking a hierarchy with recursion is drawing that tree one generation at a time.',
        code: lines(
          'CREATE TABLE employees (id int PRIMARY KEY, name text, manager_id int);',
          "INSERT INTO employees VALUES (1, 'Anita', NULL), (2, 'Vikram', 1), (3, 'Sara', 1), (4, 'Joel', 2), (5, 'Nisha', 4);",
          'WITH RECURSIVE chain AS (',
          "  SELECT id, name, 1 AS level, name AS path FROM employees WHERE manager_id IS NULL",
          '  UNION ALL',
          "  SELECT e.id, e.name, c.level + 1, c.path || ' > ' || e.name",
          '  FROM employees e JOIN chain c ON e.manager_id = c.id',
          ')',
          'SELECT level, name, path FROM chain ORDER BY path;'
        ),
        output: lines(
          ' level | name   | path',
          '-------+--------+-------------------------------',
          '     1 | Anita  | Anita',
          '     2 | Sara   | Anita > Sara',
          '     2 | Vikram | Anita > Vikram',
          '     3 | Joel   | Anita > Vikram > Joel',
          '     4 | Nisha  | Anita > Vikram > Joel > Nisha',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Start at the top: the person with no manager.' },
          { line: 6, note: 'Each step: people whose manager was already found, one level deeper, with a growing path.' },
          { line: 9, note: 'Sorting by path shows the tree in order.' }
        ],
        tryIt: "Add a new employee under Sara: (6, 'Ravi', 3) to the INSERT and run it. Ravi appears at level 3 under Sara.",
        check: {
          question: 'Why use a recursive CTE for "everyone under this manager"?',
          options: ['It works for any number of levels without knowing the depth in advance', 'Self joins are not allowed', 'It is the only way to use JOIN'],
          answer: 0,
          why: 'Each recursive step goes one level deeper, as many times as needed, so the depth does not have to be known.'
        }
      },
      {
        title: 'Putting it together: a monthly report in steps',
        say: [
          'Let us write a report the way professionals do: in named steps. The question is "for each customer, their delivered spending, and whether it is above the average customer\'s delivered spending".',
          'Step one keeps only delivered order lines with their values. Step two adds them up per customer. The main query compares each customer with the average of step two, and labels them.',
          'Each step is short and testable on its own. If the numbers look wrong, you can run step one alone and check the lines, then step two, and so on. That is much easier than debugging one giant query.',
          'In today\'s practice, you will use WITH to find orders with a total above 500, and WITH RECURSIVE to produce the numbers 1 to 10.',
          'Tomorrow you meet window functions, which calculate across rows without grouping them away: ranks, row numbers and the top item per group.',
          'Keep the habit you practised today: when a question has several steps, write them as named steps in a WITH. It is one of the clearest signs of a thoughtful SQL writer.'
        ],
        example: 'An accountant preparing a yearly summary works in labelled sheets: one for raw transactions, one for totals per client, one for the final comparison. Anyone can check each sheet. A WITH query is that set of labelled sheets.',
        code: lines(
          MINI_SHOP,
          'WITH delivered_lines AS (',
          '  SELECT o.customer_id, p.price * oi.quantity AS value',
          '  FROM orders o',
          '  JOIN order_items oi ON oi.order_id = o.id',
          '  JOIN products p ON p.id = oi.product_id',
          "  WHERE o.status = 'delivered'",
          '),',
          'per_customer AS (',
          '  SELECT customer_id, sum(value) AS spent FROM delivered_lines GROUP BY customer_id',
          ')',
          'SELECT c.name, pc.spent,',
          "       pc.spent > (SELECT avg(spent) FROM per_customer) AS above_average",
          'FROM per_customer pc',
          'JOIN customers c ON c.id = pc.customer_id',
          'ORDER BY pc.spent DESC;'
        ),
        output: lines(
          ' name | spent   | above_average',
          '------+---------+---------------',
          ' Ravi | 1200.00 | true',
          ' Asha |  280.00 | false',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Step 1: only delivered order lines, with their value.' },
          { line: 16, note: 'Step 2: one total per customer.' },
          { line: 20, note: 'Compare each total with the average of step 2.' }
        ],
        tryIt: "Change 'delivered' to 'shipped' in step 1 and run it. Only Asha has a shipped order.",
        check: {
          question: 'Why is a WITH query easier to debug than one big nested query?',
          options: ['Each named step can be run and checked on its own', 'WITH queries never have mistakes', 'PostgreSQL explains WITH errors better'],
          answer: 0,
          why: 'You can copy one step\'s SELECT, run it, and check its rows before looking at the next step.'
        }
      }
    ],
    summary: [
      'WITH name AS (...) names a step (a CTE) that the rest of the query uses like a table.',
      'Several steps are separated by commas; each can use the steps above it.',
      'WITH reads top to bottom and avoids repeating the same subquery.',
      'WITH RECURSIVE repeats a step until it returns no rows: sequences and hierarchies.',
      'Always make sure a recursive step has a condition that stops it.'
    ],
    projectStep: {
      title: 'My Library: a reading report in steps',
      steps: [
        'Write a WITH step that finds pages per author for finished books.',
        'Add a second step with the average of those totals.',
        'Show each author with their pages and whether they are above average.',
        'Use WITH RECURSIVE to list the numbers 1 to 12, one for each month of your reading goal.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 17,
    title: 'Ranking Rows: Window Functions',
    goal: 'You can number and rank rows with window functions, rank inside groups with PARTITION BY, and find the top item per group.',
    minutes: 28,
    recap: 'Yesterday you wrote readable multi-step queries with WITH, and walked sequences and hierarchies with WITH RECURSIVE.',
    parts: [
      {
        title: 'What a window function is',
        say: [
          'GROUP BY squeezes many rows into one row per group. But sometimes you want to keep every row and still calculate something across the rows, like each product\'s rank by price, or each product\'s price compared with its category average.',
          'Window functions do exactly that. They calculate across a set of rows, called a window, but they do not remove any rows. Every row stays, with a new column added.',
          'You recognise a window function by the word OVER after it. rank() OVER (ORDER BY price DESC) gives each product its position in a list sorted by price, most expensive first.',
          'Even normal aggregates become window functions when you add OVER. avg(price) OVER () shows the overall average price next to every product, without grouping them away.',
          'Window functions are one of the most asked-about topics in data analyst and backend interviews, because they answer "rank", "top N per group" and "compared with others" questions elegantly.',
          'They are calculated after WHERE and GROUP BY, just before ORDER BY. So they work on the rows that are left after filtering, which is usually exactly what you want.',
          'You can even use a window function on top of a GROUP BY result. For example, group sales by category to get each category\'s total, and then rank the categories by that total with rank() OVER (ORDER BY sum(amount) DESC), all in one query. The grouping happens first, then the ranking.'
        ],
        example: 'A class result sheet lists every student with their marks and their rank in the class. Nobody is removed from the sheet; the rank is just an extra column. That rank column is a window function.',
        code: lines(
          MINI_SHOP,
          'SELECT name, price,',
          '       rank() OVER (ORDER BY price DESC) AS price_rank,',
          '       round(avg(price) OVER (), 2) AS overall_average',
          'FROM products',
          'ORDER BY price_rank;'
        ),
        output: lines(
          ' name     | price   | price_rank | overall_average',
          '----------+---------+------------+-----------------',
          ' Backpack | 1200.00 |          1 |          355.00',
          ' Stapler  |  150.00 |          2 |          355.00',
          ' Notebook |   60.00 |          3 |          355.00',
          ' Pen      |   10.00 |          4 |          355.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'A rank based on price, highest first. Every product keeps its row.' },
          { line: 11, note: 'The overall average, shown on every row. OVER () means "all rows".' }
        ],
        tryIt: 'Add a column price - avg(price) OVER () AS above_average to see how far each price is from the average.',
        check: {
          question: 'What is the key difference between GROUP BY and a window function?',
          options: ['A window function keeps every row; GROUP BY returns one row per group', 'Window functions only work on dates', 'GROUP BY is faster in every case'],
          answer: 0,
          why: 'Window functions add a calculated column to each row without collapsing the rows.'
        }
      },
      {
        title: 'ROW_NUMBER, RANK and DENSE_RANK',
        say: [
          'There are three ways to number rows in order, and they differ only in how they treat ties, rows with the same value.',
          'row_number() gives 1, 2, 3, 4 with no repeats, even for ties. If two products have the same price, one gets 2 and the other gets 3, and which one is not guaranteed unless you add a tie-breaker to the ORDER BY.',
          'rank() gives tied rows the same number and then skips: 1, 2, 2, 4. It is like a sports result where two runners share second place and nobody is third.',
          'dense_rank() gives tied rows the same number but does not skip: 1, 2, 2, 3. Use it when you want "the 3rd highest price" to mean the 3rd different price.',
          'Which one to use depends on the question. For numbering rows or picking exactly one row per group, use row_number. For fair rankings with ties, use rank or dense_rank.',
          'Interviewers love this difference. A classic question is "find the second highest salary", and dense_rank is one of the cleanest answers, because it handles ties correctly.'
        ],
        example: 'In a race, two runners finish together in second place. The official results say 1st, 2nd, 2nd, 4th: that is rank. A medal list would say gold, silver, silver, bronze: that is dense_rank. The start list numbers everyone 1, 2, 3, 4: that is row_number.',
        code: lines(
          'CREATE TABLE scores (student text, marks int);',
          "INSERT INTO scores VALUES ('Asha', 92), ('Ravi', 88), ('Priya', 88), ('Karan', 75);",
          'SELECT student, marks,',
          '       row_number() OVER (ORDER BY marks DESC, student) AS row_num,',
          '       rank() OVER (ORDER BY marks DESC) AS rank,',
          '       dense_rank() OVER (ORDER BY marks DESC) AS dense_rank',
          'FROM scores',
          'ORDER BY marks DESC, student;'
        ),
        output: lines(
          ' student | marks | row_num | rank | dense_rank',
          '---------+-------+---------+------+------------',
          ' Asha    |    92 |       1 |    1 |          1',
          ' Priya   |    88 |       2 |    2 |          2',
          ' Ravi    |    88 |       3 |    2 |          2',
          ' Karan   |    75 |       4 |    4 |          3',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Always different numbers; student name breaks the tie.' },
          { line: 5, note: 'Ties share a rank, then a number is skipped.' },
          { line: 6, note: 'Ties share a rank, and no number is skipped.' }
        ],
        tryIt: "Give Karan 88 marks too and run it. Compare the three columns for the three students on 88.",
        check: {
          question: 'Marks are 92, 88, 88, 75. What dense_rank does 75 get?',
          options: ['3', '4', '2'],
          answer: 0,
          why: 'dense_rank does not skip numbers after a tie: 92 is 1, both 88s are 2, and 75 is 3. rank would give 4.'
        }
      },
      {
        title: 'PARTITION BY: ranking inside each group',
        say: [
          'Often you want a ranking inside each group, not across everything: the most expensive product in each category, the top student in each class, the latest order of each customer.',
          'PARTITION BY splits the rows into groups for the window function. rank() OVER (PARTITION BY category ORDER BY price DESC) ranks products by price separately inside each category. Each category starts again at 1.',
          'It is similar to GROUP BY, but again, no rows are removed. Every product stays, with its rank inside its own category.',
          'You can combine PARTITION BY with any window function: count(*) OVER (PARTITION BY category) shows the size of each product\'s category, and avg(price) OVER (PARTITION BY category) shows the category\'s average price next to each product.',
          'A handy example is percentages within a group: price / sum(price) OVER (PARTITION BY category) gives each product\'s share of its category\'s total. Multiply by 100 and round, and you have a column that shows at a glance which products dominate each category.',
          'That lets you compare each row with its own group, for example "this product is 200 rupees above its category average". With GROUP BY alone you would need a join back to the grouped result.',
          'Remember: PARTITION BY decides the groups, ORDER BY inside OVER decides the order within each group. Both go inside the brackets after OVER.'
        ],
        example: 'A school has three sections of class 10. Each section announces its own topper; section A\'s rank 1 and section B\'s rank 1 are different students. Ranking with PARTITION BY section is exactly that.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60), ('Pen', 'stationery', 10), ('Stapler', 'stationery', 150),",
          "  ('Headphones', 'electronics', 1499), ('Phone stand', 'electronics', 299);",
          'SELECT category, name, price,',
          '       rank() OVER (PARTITION BY category ORDER BY price DESC) AS rank_in_category,',
          '       round(avg(price) OVER (PARTITION BY category), 2) AS category_average',
          'FROM products',
          'ORDER BY category, rank_in_category;'
        ),
        output: lines(
          ' category    | name        | price   | rank_in_category | category_average',
          '-------------+-------------+---------+------------------+------------------',
          ' electronics | Headphones  | 1499.00 |                1 |           899.00',
          ' electronics | Phone stand |  299.00 |                2 |           899.00',
          ' stationery  | Stapler     |  150.00 |                1 |            73.33',
          ' stationery  | Notebook    |   60.00 |                2 |            73.33',
          ' stationery  | Pen         |   10.00 |                3 |            73.33',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'Ranks restart at 1 in each category.' },
          { line: 6, note: 'Each product sees its own category\'s average.' }
        ],
        tryIt: 'Add count(*) OVER (PARTITION BY category) AS products_in_category to the SELECT.',
        check: {
          question: 'What does PARTITION BY category do inside OVER?',
          options: ['Calculates the window function separately for each category', 'Removes all but one row per category', 'Sorts the final result by category'],
          answer: 0,
          why: 'PARTITION BY makes separate windows per category. Rows are kept; only the calculation is per group.'
        }
      },
      {
        title: 'The top item per group',
        say: [
          'A very common question is "the top one (or top three) in each group": the latest order per customer, the best-selling product per category, the highest-paid employee per department.',
          'The recipe has two steps. First, number the rows inside each group with row_number() OVER (PARTITION BY group ORDER BY what_matters DESC). Second, keep only the rows where that number is 1, or at most 3 for a top three.',
          'You cannot use a window function directly in WHERE, because WHERE runs before window functions are calculated. So you put the first step in a WITH (or a subquery in FROM), and filter in the main query.',
          'Choose row_number when you want exactly one row per group, even if there is a tie. Choose rank when tied rows should all appear, for example two products sharing the top price.',
          'This two-step pattern, window function in a CTE and then WHERE rn = 1, appears in real reports every day. It is worth learning by heart.',
          'Before window functions existed, people solved this with complicated self joins or correlated subqueries. The window function way is shorter, clearer and usually faster.',
          'If a question asks for the top three per group, change the filter to rn <= 3. If it asks for everything except the top one, use rn > 1. The numbering step stays exactly the same; only the final WHERE changes, which makes the pattern easy to adapt.'
        ],
        example: 'Each hostel in a college picks its best cook for a festival. Inside each hostel, the students are ranked, and only number 1 from each hostel goes forward. Number inside each group, then keep the first.',
        code: lines(
          MINI_SHOP,
          'WITH numbered AS (',
          '  SELECT c.name, o.id AS order_id, o.ordered_on,',
          '         row_number() OVER (PARTITION BY c.id ORDER BY o.ordered_on DESC) AS rn',
          '  FROM customers c',
          '  JOIN orders o ON o.customer_id = c.id',
          ')',
          'SELECT name, order_id, ordered_on AS latest_order',
          'FROM numbered',
          'WHERE rn = 1',
          'ORDER BY name;'
        ),
        output: lines(
          ' name  | order_id | latest_order',
          '-------+----------+--------------',
          ' Asha  |      103 | 2026-09-10',
          ' Priya |      104 | 2026-09-12',
          ' Ravi  |      102 | 2026-09-03',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'Number each customer\'s orders, newest first.' },
          { line: 17, note: 'Keep only number 1: the latest order per customer.' }
        ],
        tryIt: 'Change ORDER BY o.ordered_on DESC to ASC inside OVER. Now you get each customer\'s first order instead.',
        check: {
          question: 'Why is the row_number step put inside WITH before filtering rn = 1?',
          options: ['WHERE runs before window functions, so it cannot filter on them directly', 'row_number only works inside WITH', 'To make the query faster'],
          answer: 0,
          why: 'Window functions are calculated after WHERE. Computing them in a CTE first lets the main query filter on the result.'
        }
      },
      {
        title: 'Comparing with the previous row: LAG and LEAD',
        say: [
          'Two more window functions look at neighbouring rows. lag(column) gives the value from the previous row in the window\'s order, and lead(column) gives the value from the next row.',
          'This makes "compared with last time" questions easy: this month\'s sales versus last month\'s, or the gap in days between a customer\'s orders.',
          'For the first row, there is no previous row, so lag returns NULL. You can give a default instead: lag(amount, 1, 0) uses 0. The number 1 means "one row back"; 2 would look two rows back.',
          'Combine lag with PARTITION BY to compare within each group, for example each customer\'s order with that same customer\'s previous order, not with someone else\'s.',
          'A typical calculation is the change: amount - lag(amount) OVER (ORDER BY month). With the growth as a percentage, this is the basis of many business charts.',
          'Tomorrow you will go further with frames, which let a window cover "the last 3 rows" or "everything so far", for running totals and moving averages.'
        ],
        example: 'A shopkeeper compares today\'s sales with yesterday\'s: "we sold 300 rupees more than yesterday". Looking one row back in time order is exactly what lag does.',
        code: lines(
          'CREATE TABLE monthly_sales (month date, amount numeric(10,2));',
          "INSERT INTO monthly_sales VALUES ('2026-06-01', 12000), ('2026-07-01', 15000), ('2026-08-01', 13500), ('2026-09-01', 18000);",
          'SELECT month, amount,',
          '       lag(amount) OVER (ORDER BY month) AS previous,',
          '       amount - lag(amount) OVER (ORDER BY month) AS change',
          'FROM monthly_sales',
          'ORDER BY month;'
        ),
        output: lines(
          ' month      | amount   | previous | change',
          '------------+----------+----------+----------',
          ' 2026-06-01 | 12000.00 |     NULL |     NULL',
          ' 2026-07-01 | 15000.00 | 12000.00 |  3000.00',
          ' 2026-08-01 | 13500.00 | 15000.00 | -1500.00',
          ' 2026-09-01 | 18000.00 | 13500.00 |  4500.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'The previous month\'s amount; NULL for the first month.' },
          { line: 5, note: 'The change from the previous month.' }
        ],
        tryIt: 'Add lead(amount) OVER (ORDER BY month) AS next_month and run it. The last month has no next month, so it shows NULL.',
        check: {
          question: 'What does lag(amount) OVER (ORDER BY month) return for the first month?',
          options: ['NULL, because there is no previous row', '0', 'The same month\'s amount'],
          answer: 0,
          why: 'The first row has no row before it. Use lag(amount, 1, 0) if you want a default instead of NULL.'
        }
      },
      {
        title: 'Putting it together: top products per category',
        say: [
          'Let us answer a question every shop asks: "What is the most expensive product in each category?", and "what are the top 2 by price overall, with ties handled fairly?".',
          'The first uses the top-per-group recipe: row_number with PARTITION BY category, then keep rn = 1. The second uses dense_rank across all products and keeps ranks 1 and 2.',
          'Notice how short and readable both queries are. The same questions with self joins or correlated subqueries would be much longer and harder to get right.',
          'In today\'s practice, you will rank products by price inside their category, and show the most expensive product in each category.',
          'Tomorrow you learn running totals and moving averages, which use window functions with frames, a way of saying exactly which rows each calculation should include.',
          'If you remember one thing from today: window functions add information to each row without removing rows, and PARTITION BY makes them work per group.'
        ],
        example: 'An online shop\'s category pages each show a "premium pick", the priciest item in that category. One query with a window function finds all of them at once.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60), ('Pen', 'stationery', 10), ('Stapler', 'stationery', 150),",
          "  ('Headphones', 'electronics', 1499), ('Phone stand', 'electronics', 299), ('Backpack', 'bags', 1200), ('Tote bag', 'bags', 1200);",
          'WITH ranked AS (',
          '  SELECT category, name, price,',
          '         row_number() OVER (PARTITION BY category ORDER BY price DESC, name) AS rn',
          '  FROM products',
          ')',
          'SELECT category, name, price FROM ranked WHERE rn = 1 ORDER BY category;',
          'WITH ranked AS (',
          '  SELECT name, price, dense_rank() OVER (ORDER BY price DESC) AS dr FROM products',
          ')',
          'SELECT name, price, dr FROM ranked WHERE dr <= 2 ORDER BY dr, name;'
        ),
        output: lines(
          ' category    | name       | price',
          '-------------+------------+---------',
          ' bags        | Backpack   | 1200.00',
          ' electronics | Headphones | 1499.00',
          ' stationery  | Stapler    |  150.00',
          '(3 rows)',
          '',
          ' name       | price   | dr',
          '------------+---------+----',
          ' Headphones | 1499.00 |  1',
          ' Backpack   | 1200.00 |  2',
          ' Tote bag   | 1200.00 |  2',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 6, note: 'One row per category; the name breaks the tie between the two 1200 bags.' },
          { line: 11, note: 'dense_rank: both 1200 products share place 2.' }
        ],
        tryIt: 'In the first query, change row_number to rank and remove ", name" from its ORDER BY. Now both bags appear for the bags category.',
        check: {
          question: 'Two products tie for the top price in a category. Which function shows both as number 1?',
          options: ['rank() or dense_rank()', 'row_number()', 'lag()'],
          answer: 0,
          why: 'rank and dense_rank give tied rows the same number. row_number always gives different numbers.'
        }
      }
    ],
    summary: [
      'Window functions (with OVER) add a calculated column without removing rows.',
      'row_number never repeats; rank repeats ties then skips; dense_rank repeats ties without skipping.',
      'PARTITION BY makes the calculation separate for each group; ORDER BY inside OVER sets the order.',
      'Top per group: row_number in a WITH step, then WHERE rn = 1.',
      'lag and lead look at the previous or next row, for "compared with last time" questions.'
    ],
    projectStep: {
      title: 'My Library: ranking your books',
      steps: [
        'Rank your books by pages, longest first, with rank().',
        'Rank books by pages inside each author with PARTITION BY.',
        'Show each author\'s longest book using row_number and rn = 1.',
        'Show each book\'s pages next to the average pages of its author.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 18,
    title: 'Running Totals and Moving Averages',
    goal: 'You can calculate running totals, moving averages and period-over-period changes with window frames.',
    minutes: 28,
    recap: 'Yesterday you ranked rows with window functions, used PARTITION BY, and compared rows with lag and lead.',
    parts: [
      {
        title: 'Running totals with SUM OVER',
        say: [
          'A running total adds up values as you go down a list: the first day\'s sales, then the first two days together, then the first three, and so on. It answers "how much so far?", which is one of the most common questions in business.',
          'In SQL, it is a window function: sum(amount) OVER (ORDER BY day). The ORDER BY inside OVER is essential. It tells PostgreSQL to add up all rows from the start up to the current row, in date order.',
          'Without an ORDER BY inside OVER, sum(amount) OVER () gives the grand total on every row instead. That difference, one small ORDER BY, changes the meaning completely.',
          'Every row stays in the result. You see each day\'s own amount next to the total so far, which makes it easy to spot when a target was reached.',
          'Running totals also work per group with PARTITION BY, for example a running total of spending for each customer separately, restarting at zero for each one.',
          'In finance, running totals give account balances: each transaction\'s amount, and the balance after it. In sales, they show progress towards a monthly target.',
          'Running totals can also be turned into percentages of a goal. If the monthly target is 5,000, then round(sum(amount) OVER (ORDER BY day) / 5000 * 100) shows how far along the month the shop is each day, which is exactly the progress bar many sales dashboards show.'
        ],
        example: 'A savings jar where you add some money every day. Each evening you count the whole jar: that count is the running total. The daily amount is what you added; the running total is what you have so far.',
        code: lines(
          'CREATE TABLE daily_sales (day date, amount numeric(10,2));',
          "INSERT INTO daily_sales VALUES ('2026-09-01', 280), ('2026-09-02', 1200), ('2026-09-03', 2097), ('2026-09-04', 760);",
          'SELECT day, amount,',
          '       sum(amount) OVER (ORDER BY day) AS running_total,',
          '       sum(amount) OVER () AS grand_total',
          'FROM daily_sales',
          'ORDER BY day;'
        ),
        output: lines(
          ' day        | amount  | running_total | grand_total',
          '------------+---------+---------------+-------------',
          ' 2026-09-01 |  280.00 |        280.00 |     4337.00',
          ' 2026-09-02 | 1200.00 |       1480.00 |     4337.00',
          ' 2026-09-03 | 2097.00 |       3577.00 |     4337.00',
          ' 2026-09-04 |  760.00 |       4337.00 |     4337.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'With ORDER BY: the total so far, day by day.' },
          { line: 5, note: 'Without ORDER BY: the grand total on every row.' }
        ],
        tryIt: 'Add a column showing each day\'s share of the grand total: round(amount / sum(amount) OVER () * 100, 1) AS percent.',
        check: {
          question: 'What turns sum(amount) OVER () into a running total?',
          options: ['Adding ORDER BY day inside OVER', 'Adding GROUP BY day', 'Adding LIMIT'],
          answer: 0,
          why: 'With ORDER BY inside OVER, the sum covers all rows from the start up to the current row.'
        }
      },
      {
        title: 'Frames: which rows the window covers',
        say: [
          'When you write ORDER BY inside OVER, PostgreSQL uses a default frame: all rows from the first one up to the current row. That is why sum becomes a running total. A frame is simply the set of rows the calculation looks at for each row.',
          'You can choose the frame yourself with ROWS BETWEEN. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW means "from the very first row to this one", which is the running total written out in full.',
          'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW means "this row and the two before it", a sliding window of three rows. That is the basis of a moving average.',
          'There is also FOLLOWING, for rows after the current one. ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING looks at the row before, this row and the row after.',
          'There is one subtle trap with the default frame: it uses RANGE, not ROWS, and treats rows with the same ORDER BY value as one. If two rows have the same date, both get the total including both. Writing ROWS explicitly, or adding a tie-breaker to the ORDER BY, avoids surprises.',
          'Frames sound technical, but the idea is simple: for each row, which neighbours should be included? Say it in words first, then write the frame.'
        ],
        example: 'Standing in a queue, you can look at "everyone ahead of me and me" (a running count), or "me and the two people just ahead" (a small sliding window). The frame is which people you choose to look at.',
        code: lines(
          'CREATE TABLE daily_sales (day date, amount numeric(10,2));',
          "INSERT INTO daily_sales VALUES ('2026-09-01', 100), ('2026-09-02', 200), ('2026-09-03', 300), ('2026-09-04', 400), ('2026-09-05', 500);",
          'SELECT day, amount,',
          '       sum(amount) OVER (ORDER BY day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS so_far,',
          '       sum(amount) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS last_3_days,',
          '       sum(amount) OVER (ORDER BY day ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) AS around',
          'FROM daily_sales',
          'ORDER BY day;'
        ),
        output: lines(
          ' day        | amount | so_far  | last_3_days | around',
          '------------+--------+---------+-------------+---------',
          ' 2026-09-01 | 100.00 |  100.00 |      100.00 |  300.00',
          ' 2026-09-02 | 200.00 |  300.00 |      300.00 |  600.00',
          ' 2026-09-03 | 300.00 |  600.00 |      600.00 |  900.00',
          ' 2026-09-04 | 400.00 | 1000.00 |      900.00 | 1200.00',
          ' 2026-09-05 | 500.00 | 1500.00 |     1200.00 |  900.00',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'From the first row to this row: the running total.' },
          { line: 5, note: 'This row and the two before it.' },
          { line: 6, note: 'The row before, this row and the row after.' }
        ],
        tryIt: 'Change 2 PRECEDING to 1 PRECEDING in the last_3_days column and rename it last_2_days.',
        check: {
          question: 'What does ROWS BETWEEN 2 PRECEDING AND CURRENT ROW include?',
          options: ['The current row and the two rows before it', 'Only the two rows before', 'All rows'],
          answer: 0,
          why: 'The frame starts two rows back and ends at the current row: three rows in total (fewer at the start).'
        }
      },
      {
        title: 'Moving averages',
        say: [
          'Daily numbers jump up and down: a big order one day, a quiet day the next. A moving average smooths this out by averaging each day with the few days before it, so the trend is easier to see.',
          'A 3-day moving average is avg(amount) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW). For each day, it averages that day and the two before it.',
          'At the start of the list there are fewer rows before, so the first day averages just itself, and the second averages two days. Some reports hide those first rows, because they are based on less data.',
          'Round moving averages for reading, with round(..., 2). And label them clearly, like avg_3_days, so nobody confuses them with the day\'s own value.',
          'Moving averages are everywhere: the 7-day average of cases in health reports, the 50-day average of a share price in finance, the weekly average of app sign-ups in product teams.',
          'The window size is a choice. A small window follows changes quickly but is still bumpy; a large window is smooth but slow to show real changes. Seven days is common for daily data because it covers every weekday once.'
        ],
        example: 'When you track your daily steps, one lazy Sunday does not mean you have stopped walking. Looking at your average over the last 7 days shows the real habit. That is a moving average.',
        code: lines(
          'CREATE TABLE daily_sales (day date, amount numeric(10,2));',
          "INSERT INTO daily_sales VALUES ('2026-09-01', 280), ('2026-09-02', 1200), ('2026-09-03', 2097), ('2026-09-04', 760), ('2026-09-05', 450);",
          'SELECT day, amount,',
          '       round(avg(amount) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_3_days',
          'FROM daily_sales',
          'ORDER BY day;'
        ),
        output: lines(
          ' day        | amount  | avg_3_days',
          '------------+---------+------------',
          ' 2026-09-01 |  280.00 |     280.00',
          ' 2026-09-02 | 1200.00 |     740.00',
          ' 2026-09-03 | 2097.00 |    1192.33',
          ' 2026-09-04 |  760.00 |    1352.33',
          ' 2026-09-05 |  450.00 |    1102.33',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Each day averaged with up to two days before it, rounded.' }
        ],
        tryIt: 'Add count(*) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS days_used to see how many days each average is based on.',
        check: {
          question: 'Why use a moving average on daily sales?',
          options: ['To smooth out day-to-day jumps and show the trend', 'To make the numbers bigger', 'To remove days with no sales'],
          answer: 0,
          why: 'Averaging each day with its neighbours reduces the effect of single unusual days, so the trend is clearer.'
        }
      },
      {
        title: 'Running totals per group',
        say: [
          'PARTITION BY works with frames too. sum(amount) OVER (PARTITION BY customer ORDER BY paid_on) gives each customer their own running total, which restarts at zero for the next customer.',
          'This is exactly how a bank statement is built for each account: each transaction, and the balance after it, separately for every account holder.',
          'Deposits are positive and withdrawals negative, so a running sum of the amounts gives the balance. If you store withdrawals as positive numbers with a type column, use CASE, which you will learn tomorrow, to make them negative first.',
          'When you partition, make sure the ORDER BY inside OVER has a clear order within each group. If two payments of the same customer have the same timestamp, add the id as a tie-breaker, or the balance order could differ between runs.',
          'Running totals per group are also used for goals: each salesperson\'s sales so far this month, each student\'s marks so far this term.',
          'Remember that nothing is grouped away. Every transaction stays in the result, and the running total column simply grows within each customer.'
        ],
        example: 'Each family member keeps their own piggy bank. When Asha adds money, only her total grows; Ravi\'s is separate. PARTITION BY person is keeping one piggy bank per person.',
        code: lines(
          'CREATE TABLE payments (id int, customer text, paid_on date, amount numeric(10,2));',
          "INSERT INTO payments VALUES (1, 'Asha', '2026-09-01', 500), (2, 'Ravi', '2026-09-01', 1000), (3, 'Asha', '2026-09-05', -200),",
          "  (4, 'Asha', '2026-09-09', 300), (5, 'Ravi', '2026-09-10', -400);",
          'SELECT customer, paid_on, amount,',
          '       sum(amount) OVER (PARTITION BY customer ORDER BY paid_on, id) AS balance',
          'FROM payments',
          'ORDER BY customer, paid_on, id;'
        ),
        output: lines(
          ' customer | paid_on    | amount  | balance',
          '----------+------------+---------+---------',
          ' Asha     | 2026-09-01 |  500.00 |  500.00',
          ' Asha     | 2026-09-05 | -200.00 |  300.00',
          ' Asha     | 2026-09-09 |  300.00 |  600.00',
          ' Ravi     | 2026-09-01 | 1000.00 | 1000.00',
          ' Ravi     | 2026-09-10 | -400.00 |  600.00',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'A separate running total for each customer; id breaks ties on the same day.' }
        ],
        tryIt: "Add a new payment (6, 'Ravi', '2026-09-12', 250) and run it. Only Ravi's balance changes.",
        check: {
          question: 'What does PARTITION BY customer do to a running total?',
          options: ['Gives each customer their own running total that starts from zero', 'Adds all customers together', 'Removes all but the last payment'],
          answer: 0,
          why: 'Each partition has its own window, so the running total restarts for each customer.'
        }
      },
      {
        title: 'Period-over-period growth',
        say: [
          'Managers often ask "how much did we grow compared with last month?". You met lag yesterday: it fetches the previous row\'s value. Growth is this month minus last month, and the percentage is that change divided by last month.',
          'In SQL: round((amount - lag(amount) OVER (ORDER BY month)) / lag(amount) OVER (ORDER BY month) * 100, 1). It looks long, so it is cleaner to put lag in a WITH step first and calculate the percentage in the main query.',
          'Be careful with division. If last month\'s value was 0, dividing by it causes an error. nullif(previous, 0) turns a zero into NULL, and dividing by NULL gives NULL instead of an error. It is a neat safety trick.',
          'The first month has no previous month, so its growth is NULL. That is honest: there is nothing to compare with. A report can show it as a dash.',
          'You can combine growth with monthly totals from GROUP BY: first group sales by month in a WITH step, then apply lag to the monthly totals.',
          'Growth figures are often misread. A 50 percent rise from a tiny number is not impressive, so reports usually show both the amounts and the percentage.',
          'It also helps to compare the same period last year, not just last month, because many businesses are seasonal. Festival months are always busy in India, so comparing October with September can mislead, while October this year against October last year tells the real story. That uses lag with 12 rows back on monthly data.'
        ],
        example: 'A school compares this year\'s admissions with last year\'s: 600 against 500 is 100 more, a 20 percent increase. Growth needs both numbers side by side, and lag puts them there.',
        code: lines(
          'CREATE TABLE sales (sold_on date, amount numeric(10,2));',
          "INSERT INTO sales VALUES ('2026-07-03', 5000), ('2026-07-20', 7000), ('2026-08-11', 9000), ('2026-08-25', 6000), ('2026-09-02', 18000);",
          'WITH monthly AS (',
          "  SELECT date_trunc('month', sold_on)::date AS month, sum(amount) AS total",
          '  FROM sales GROUP BY 1',
          '),',
          'with_previous AS (',
          '  SELECT month, total, lag(total) OVER (ORDER BY month) AS previous FROM monthly',
          ')',
          'SELECT month, total, previous,',
          '       round((total - previous) / nullif(previous, 0) * 100, 1) AS growth_percent',
          'FROM with_previous',
          'ORDER BY month;'
        ),
        output: lines(
          ' month      | total    | previous | growth_percent',
          '------------+----------+----------+----------------',
          ' 2026-07-01 | 12000.00 |     NULL |           NULL',
          ' 2026-08-01 | 15000.00 | 12000.00 |           25.0',
          ' 2026-09-01 | 18000.00 | 15000.00 |           20.0',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Step 1: total sales per month. GROUP BY 1 means "group by the first column".' },
          { line: 8, note: 'Step 2: each month next to the previous month.' },
          { line: 11, note: 'Growth in percent; nullif avoids dividing by zero.' }
        ],
        tryIt: "Add a sale in October: ('2026-10-05', 9000). The October growth is negative: sales fell by half.",
        check: {
          question: 'What does nullif(previous, 0) protect against?',
          options: ['Dividing by zero when the previous value is 0', 'NULL values in the current month', 'Negative growth'],
          answer: 0,
          why: 'nullif turns 0 into NULL. Dividing by NULL gives NULL instead of a division-by-zero error.'
        }
      },
      {
        title: 'Putting it together: a sales trend report',
        say: [
          'Let us build a small but complete trend report from daily sales: each day\'s amount, the running total for the month, and a 3-day moving average. This is the kind of table behind a sales chart on a company dashboard.',
          'All three columns come from the same rows, so one query with three window functions does the job. Each window has the same ORDER BY day, but different frames.',
          'When a window definition repeats, PostgreSQL lets you name it once with a WINDOW clause at the end: WINDOW by_day AS (ORDER BY day), and then write OVER by_day. It keeps long queries tidy.',
          'In today\'s practice, you will calculate a running total of daily sales, and a 3-day moving average rounded to 2 decimals.',
          'Tomorrow you learn CASE, which lets a query make decisions like "if the price is under 100, call it budget". Combined with what you learned this week, it opens up almost any report.',
          'You now know the advanced analysis tools that many junior developers never learn properly. Being comfortable with window functions and frames is a real advantage in interviews.'
        ],
        example: 'A shop owner looks at one simple chart each evening: today\'s bar, a line for the month so far, and a smooth line for the recent trend. Those three lines are the three window functions in this query.',
        code: lines(
          'CREATE TABLE daily_sales (day date, amount numeric(10,2));',
          "INSERT INTO daily_sales VALUES ('2026-09-01', 280), ('2026-09-02', 1200), ('2026-09-03', 2097), ('2026-09-04', 760), ('2026-09-05', 450);",
          'SELECT day, amount,',
          '       sum(amount) OVER by_day AS month_so_far,',
          '       round(avg(amount) OVER (by_day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_3_days',
          'FROM daily_sales',
          'WINDOW by_day AS (ORDER BY day)',
          'ORDER BY day;'
        ),
        output: lines(
          ' day        | amount  | month_so_far | avg_3_days',
          '------------+---------+--------------+------------',
          ' 2026-09-01 |  280.00 |       280.00 |     280.00',
          ' 2026-09-02 | 1200.00 |      1480.00 |     740.00',
          ' 2026-09-03 | 2097.00 |      3577.00 |    1192.33',
          ' 2026-09-04 |  760.00 |      4337.00 |    1352.33',
          ' 2026-09-05 |  450.00 |      4787.00 |    1102.33',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Running total using the named window.' },
          { line: 5, note: 'The same named window, with a 3-row frame added.' },
          { line: 7, note: 'The window is defined once, by name.' }
        ],
        tryIt: 'Add a column amount - lag(amount) OVER by_day AS change_from_yesterday.',
        check: {
          question: 'What is the WINDOW clause for?',
          options: ['Naming a window definition once so several functions can reuse it', 'Filtering rows before window functions', 'Creating a new table'],
          answer: 0,
          why: 'WINDOW by_day AS (...) defines the window once; each function can then say OVER by_day.'
        }
      }
    ],
    summary: [
      'sum(x) OVER (ORDER BY day) is a running total; without ORDER BY it is the grand total.',
      'A frame chooses the rows: ROWS BETWEEN n PRECEDING AND CURRENT ROW, UNBOUNDED PRECEDING, FOLLOWING.',
      'avg(x) over a small frame is a moving average that smooths the trend.',
      'PARTITION BY gives each group its own running total, like a balance per account.',
      'Growth: compare with lag, and use nullif(previous, 0) to avoid dividing by zero.'
    ],
    projectStep: {
      title: 'My Library: pages read over time',
      steps: [
        'Create a reading_log table with day and pages_read, and add 7 days of reading.',
        'Show a running total of pages read.',
        'Show a 3-day moving average of pages per day.',
        'Show the change in pages compared with the previous day using lag.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 19,
    title: 'Decisions Inside a Query: CASE',
    goal: 'You can make decisions inside queries with CASE: label rows, sort in custom orders, count by condition and build pivot-style reports.',
    minutes: 28,
    recap: 'Yesterday you calculated running totals, moving averages and growth with window frames.',
    parts: [
      {
        title: 'CASE: if-then-else inside SQL',
        say: [
          'Many reports need a decision for each row: "if the price is under 100, call it budget; if under 1000, mid; otherwise premium". CASE is SQL\'s if-then-else.',
          'The shape is: CASE WHEN condition THEN value WHEN another_condition THEN another_value ELSE default_value END. It works out one value for each row, and you give that value a name with AS.',
          'PostgreSQL checks the WHEN conditions from top to bottom and uses the first one that is true. So the order matters, exactly like elif in Python or else if in JavaScript. Put the most specific conditions first.',
          'If no WHEN is true and there is no ELSE, the result is NULL. It is good practice to always write an ELSE, even if it is just ELSE \'other\', so nothing slips through unlabelled.',
          'Every THEN and the ELSE should return the same type: all text, or all numbers. Mixing \'budget\' and 5 in one CASE gives an error.',
          'CASE can be used almost anywhere a value can: in SELECT, WHERE, ORDER BY, GROUP BY, and inside aggregates. That makes it one of the most versatile tools in SQL.',
          'Writing each WHEN on its own line, indented under CASE, makes long decisions much easier to read and review. It also makes it obvious if two branches overlap, or if a case has been forgotten.'
        ],
        example: 'A college grading table: 75 and above is Distinction, 60 and above is First class, 40 and above is Pass, otherwise Fail. The clerk checks from the top and stops at the first rule that fits. CASE follows those same rules for every row.',
        code: lines(
          MINI_SHOP,
          'SELECT name, price,',
          '       CASE',
          "         WHEN price < 100 THEN 'budget'",
          "         WHEN price < 1000 THEN 'mid'",
          "         ELSE 'premium'",
          '       END AS price_band',
          'FROM products',
          'ORDER BY price;'
        ),
        output: lines(
          ' name     | price   | price_band',
          '----------+---------+------------',
          ' Pen      |   10.00 | budget',
          ' Notebook |   60.00 | budget',
          ' Stapler  |  150.00 | mid',
          ' Backpack | 1200.00 | premium',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'Checked first: anything under 100 is budget.' },
          { line: 12, note: 'Only reached if the first condition was false.' },
          { line: 13, note: 'Everything else.' }
        ],
        tryIt: "Swap the order of the first two WHEN lines and run it. The Pen and the Notebook are now called mid, because price < 1000 is checked first.",
        check: {
          question: 'Which WHEN branch does CASE use when several are true?',
          options: ['The first true one, from the top', 'The last true one', 'All of them'],
          answer: 0,
          why: 'CASE stops at the first WHEN that is true, so the order of conditions matters.'
        }
      },
      {
        title: 'Simple CASE and cleaning codes into words',
        say: [
          'When you compare one column with several fixed values, there is a shorter form: CASE status WHEN \'d\' THEN \'Delivered\' WHEN \'p\' THEN \'Pending\' ELSE \'Unknown\' END. The column is written once after CASE.',
          'This is very common when data stores short codes, like d, p, c, or 1, 2, 3, and a report needs readable words. The database keeps the compact codes, and the query translates them for people.',
          'The short form only checks equality. For ranges or several columns, use the full form with WHEN condition, as in the first part.',
          'If the same translation is needed in many queries, a small lookup table is usually better than repeating the CASE everywhere: a table of codes and their names, joined when needed. Then a new code means adding one row, not editing many queries.',
          'CASE can also produce numbers, for example a score for each status, which you can then add up or sort by.',
          'Always handle unexpected values with ELSE. Real data eventually contains a code nobody planned for, and "Unknown" is much better than a silent NULL.',
          'Showing the unexpected code in the label, like "Unknown code: x", is better than a plain "Unknown", because the person reading the report can tell the development team exactly which value appeared. Small touches like this make data problems much faster to fix.'
        ],
        example: 'At a railway station, the board shows "Delayed" and "On time", but the computer behind it stores status codes like D and O. Something translates the codes into words for travellers. That translator is a CASE.',
        code: lines(
          'CREATE TABLE tickets (id int, status char(1));',
          "INSERT INTO tickets VALUES (1, 'o'), (2, 'c'), (3, 'o'), (4, 'x');",
          'SELECT id,',
          '       CASE status',
          "         WHEN 'o' THEN 'Open'",
          "         WHEN 'c' THEN 'Closed'",
          "         ELSE 'Unknown code: ' || status",
          '       END AS status_text',
          'FROM tickets',
          'ORDER BY id;'
        ),
        output: lines(
          ' id | status_text',
          '----+-----------------',
          '  1 | Open',
          '  2 | Closed',
          '  3 | Open',
          '  4 | Unknown code: x',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'The short form: the column is written once.' },
          { line: 7, note: 'ELSE catches codes nobody planned for, and shows them.' }
        ],
        tryIt: "Add a code for 'x': WHEN 'x' THEN 'Cancelled', and run it again.",
        check: {
          question: 'When is the short form CASE column WHEN value THEN ... useful?',
          options: ['When comparing one column with several fixed values', 'When checking ranges like price < 100', 'When joining tables'],
          answer: 0,
          why: 'The short form only checks equality with fixed values. Ranges need the full CASE WHEN condition form.'
        }
      },
      {
        title: 'CASE in ORDER BY: custom sort orders',
        say: [
          'Sometimes the natural order is not alphabetical or numeric. Order statuses, for example, should appear as pending, shipped, delivered, cancelled: the order in which things happen, not A to Z.',
          'CASE in ORDER BY solves this. Give each value a number with CASE, and sort by that number: ORDER BY CASE status WHEN \'pending\' THEN 1 WHEN \'shipped\' THEN 2 WHEN \'delivered\' THEN 3 ELSE 4 END.',
          'You can combine it with other sort columns: first by the custom status order, then by date within each status.',
          'Another use is pinning certain rows to the top: ORDER BY CASE WHEN is_featured THEN 0 ELSE 1 END, price puts featured products first, then everything else by price.',
          'The CASE in ORDER BY does not have to appear in the SELECT. It only controls the order, and the result shows the columns you chose.',
          'If the same custom order is used in many places, a lookup table with a sort_order column is again the tidier solution. But for one report, CASE in ORDER BY is quick and clear.'
        ],
        example: 'A hospital waiting room is not served A to Z by name, but by urgency: emergencies first, then appointments, then walk-ins, and within each group by arrival time. That custom priority is CASE in ORDER BY.',
        code: lines(
          MINI_SHOP,
          'SELECT id, status, ordered_on',
          'FROM orders',
          'ORDER BY CASE status',
          "           WHEN 'pending' THEN 1",
          "           WHEN 'shipped' THEN 2",
          "           WHEN 'delivered' THEN 3",
          '           ELSE 4',
          '         END,',
          '         ordered_on;'
        ),
        output: lines(
          ' id  | status    | ordered_on',
          '-----+-----------+------------',
          ' 104 | pending   | 2026-09-12',
          ' 103 | shipped   | 2026-09-10',
          ' 101 | delivered | 2026-09-01',
          ' 102 | delivered | 2026-09-03',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'Each status gets a number that sets its place in the order.' },
          { line: 17, note: 'Inside each status, oldest first.' }
        ],
        tryIt: 'Change the numbers so delivered orders come first, and run it.',
        check: {
          question: 'How do you sort statuses in a custom order like pending, shipped, delivered?',
          options: ['ORDER BY a CASE that gives each status a number', 'ORDER BY status', 'GROUP BY status'],
          answer: 0,
          why: 'CASE turns each status into a sort number, and ORDER BY uses that number instead of alphabetical order.'
        }
      },
      {
        title: 'Counting by condition',
        say: [
          'CASE inside an aggregate lets you count or add up only some rows, several ways at once, in a single query. sum(CASE WHEN status = \'delivered\' THEN 1 ELSE 0 END) counts delivered orders.',
          'You met FILTER on Day 8, which does the same job more neatly in PostgreSQL: count(*) FILTER (WHERE status = \'delivered\'). The CASE version works in every SQL database, so you will see both in real code.',
          'The same trick adds up amounts conditionally: sum(CASE WHEN status = \'delivered\' THEN total ELSE 0 END) is the value of delivered orders only.',
          'With GROUP BY, this produces compact summary tables: one row per customer, with columns for delivered, shipped and pending orders side by side.',
          'This pattern is sometimes called conditional aggregation. It is much faster than running three separate queries, because PostgreSQL reads the data once.',
          'Watch out for ELSE: in a sum, ELSE 0 keeps the total a number; without an ELSE, the CASE gives NULL for other rows, which sum skips, so the result is the same unless no rows match, in which case you get NULL instead of 0.'
        ],
        example: 'A teacher collecting a class survey counts three things in one pass through the papers: how many said yes, how many said no, and how many left it blank. She does not go through the pile three times. Conditional aggregation is that single pass.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name,',
          "       sum(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) AS delivered,",
          "       count(*) FILTER (WHERE o.status IN ('shipped', 'pending')) AS open,",
          '       count(o.id) AS all_orders',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'GROUP BY c.id, c.name',
          'ORDER BY c.name;'
        ),
        output: lines(
          ' name  | delivered | open | all_orders',
          '-------+-----------+------+------------',
          ' Asha  |         1 |    1 |          2',
          ' Meera |         0 |    0 |          0',
          ' Priya |         0 |    1 |          1',
          ' Ravi  |         1 |    0 |          1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'The CASE way: 1 for each delivered order, 0 otherwise, then add up.' },
          { line: 11, note: 'The PostgreSQL FILTER way: same idea, shorter.' }
        ],
        tryIt: "Add a column for cancelled orders using either style. Everyone has 0, because no order is cancelled.",
        check: {
          question: 'What does sum(CASE WHEN status = \'delivered\' THEN 1 ELSE 0 END) calculate?',
          options: ['The number of delivered orders', 'The total value of all orders', 'The number of statuses'],
          answer: 0,
          why: 'Each delivered order adds 1 and every other order adds 0, so the sum is the count of delivered orders.'
        }
      },
      {
        title: 'Pivot-style reports',
        say: [
          'Spreadsheets often show data as a grid: one row per product, one column per month. This is called a pivot table. SQL naturally returns long lists, one row per product per month, but conditional aggregation can turn them into a grid.',
          'For each column of the grid, write one sum with a CASE (or FILTER) that keeps only that column\'s rows: sum(amount) FILTER (WHERE month = \'2026-08\') AS aug, and the same for September.',
          'Group by the row labels, like the product name, and you get one row per product with one column per month.',
          'The limitation is that the columns must be known when you write the query. A new month means adding a new column to the SQL. For fully dynamic pivots, apps usually fetch the long list and pivot it in code or in a spreadsheet tool.',
          'Pivot reports are popular with managers because they are easy to scan. Being able to produce one directly in SQL saves a lot of copying into Excel.',
          'Use coalesce around each column, or ELSE 0 inside the CASE, so empty cells show 0 instead of NULL. A grid full of NULLs looks broken, even when it is correct.'
        ],
        example: 'A school attendance summary shows each student as a row and each month as a column, with days present in each cell. The attendance register is a long list of days; the summary grid is a pivot of it.',
        code: lines(
          'CREATE TABLE sales (product text, sold_on date, amount numeric(10,2));',
          "INSERT INTO sales VALUES ('Pen', '2026-08-05', 100), ('Pen', '2026-09-02', 150), ('Notebook', '2026-08-20', 180),",
          "  ('Notebook', '2026-09-11', 60), ('Backpack', '2026-09-15', 1200), ('Pen', '2026-09-20', 50);",
          'SELECT product,',
          "       coalesce(sum(amount) FILTER (WHERE sold_on >= '2026-08-01' AND sold_on < '2026-09-01'), 0) AS aug,",
          "       coalesce(sum(amount) FILTER (WHERE sold_on >= '2026-09-01' AND sold_on < '2026-10-01'), 0) AS sep,",
          '       sum(amount) AS total',
          'FROM sales',
          'GROUP BY product',
          'ORDER BY total DESC;'
        ),
        output: lines(
          ' product  | aug    | sep     | total',
          '----------+--------+---------+---------',
          ' Backpack |      0 | 1200.00 | 1200.00',
          ' Pen      | 100.00 |  200.00 |  300.00',
          ' Notebook | 180.00 |   60.00 |  240.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'One column for August: only August rows are added.' },
          { line: 6, note: 'One column for September.' },
          { line: 9, note: 'One row per product.' }
        ],
        tryIt: "Add an October column the same way, and a sale ('Backpack', '2026-10-01', 1200) to the INSERT.",
        check: {
          question: 'How do you turn "one row per product per month" into "one row per product, one column per month"?',
          options: ['GROUP BY product, with one conditional sum per month column', 'ORDER BY month', 'UNION the months together'],
          answer: 0,
          why: 'Each month column adds up only that month\'s rows, and grouping by product gives one row per product.'
        }
      },
      {
        title: 'Putting it together: a product dashboard',
        say: [
          'Let us combine today\'s ideas into a small product dashboard: each product with a price band, a stock status in words, and a custom order that shows products needing attention first.',
          'The price band and stock status are CASE expressions in SELECT. The custom order is a CASE in ORDER BY that puts out-of-stock products first, then low stock, then the rest, cheapest first within each group.',
          'Below it, a one-row summary counts the products in each price band using conditional aggregation. Together they are the kind of overview a shop owner checks every morning.',
          'In today\'s practice, you will label every product as budget, mid or premium, and write a one-row summary counting delivered, open and cancelled orders.',
          'Tomorrow is about design rather than queries: how to split data into good tables in the first place, called normalization. It explains why the shop database looks the way it does.',
          'CASE is simple, but it appears in a huge share of real-world queries. Whenever a report needs a label, a custom order or a conditional count, reach for CASE.'
        ],
        example: 'A shop owner\'s morning checklist says: first look at anything out of stock, then anything running low, then the rest. And tell me roughly how many cheap, mid and expensive items we carry. One query answers both.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 60, 120), ('Pen', 10, 500), ('Backpack', 1200, 15), ('Desk lamp', 899, 0), ('Headphones', 1499, 25), ('Stapler', 150, 8);",
          'SELECT name, price, stock,',
          "       CASE WHEN stock = 0 THEN 'out of stock' WHEN stock < 20 THEN 'low' ELSE 'ok' END AS stock_status",
          'FROM products',
          'ORDER BY CASE WHEN stock = 0 THEN 1 WHEN stock < 20 THEN 2 ELSE 3 END, price;',
          'SELECT count(*) FILTER (WHERE price < 100) AS budget,',
          '       count(*) FILTER (WHERE price >= 100 AND price < 1000) AS mid,',
          '       count(*) FILTER (WHERE price >= 1000) AS premium',
          'FROM products;'
        ),
        output: lines(
          ' name       | price   | stock | stock_status',
          '------------+---------+-------+--------------',
          ' Desk lamp  |  899.00 |     0 | out of stock',
          ' Stapler    |  150.00 |     8 | low',
          ' Backpack   | 1200.00 |    15 | low',
          ' Pen        |   10.00 |   500 | ok',
          ' Notebook   |   60.00 |   120 | ok',
          ' Headphones | 1499.00 |    25 | ok',
          '(6 rows)',
          '',
          ' budget | mid | premium',
          '--------+-----+---------',
          '      2 |   2 |       2',
          '(1 row)'
        ),
        codeNotes: [
          { line: 4, note: 'A readable stock status for each product.' },
          { line: 6, note: 'Products needing attention first, then by price.' },
          { line: 7, note: 'A one-row count of each price band.' }
        ],
        tryIt: 'Change the low-stock limit from 20 to 30 in both places and run it. The Headphones move into the low group.',
        check: {
          question: 'Why does the query repeat the stock conditions in SELECT and in ORDER BY?',
          options: ['SELECT shows the label; ORDER BY uses its own CASE to decide the order', 'PostgreSQL requires every CASE twice', 'To make the query faster'],
          answer: 0,
          why: 'The label and the sort order are separate jobs. (You could also ORDER BY the label\'s name, but custom numbers give full control.)'
        }
      }
    ],
    summary: [
      'CASE WHEN ... THEN ... ELSE ... END makes a decision for each row; the first true WHEN wins.',
      'The short form CASE column WHEN value THEN ... translates codes into words.',
      'CASE in ORDER BY creates custom sort orders.',
      'sum(CASE ...) or count(*) FILTER (...) counts and totals by condition in one pass.',
      'One conditional sum per column turns a long list into a pivot-style grid.'
    ],
    projectStep: {
      title: 'My Library: book labels',
      steps: [
        'Label each book short (under 200 pages), medium (under 400) or long.',
        'Sort unfinished books first, then by title, with CASE in ORDER BY.',
        'Count short, medium and long books in one row.',
        'Show each author with columns for finished and unfinished books.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 20,
    title: 'Designing Good Tables: Normalization',
    goal: 'You can spot problems caused by repeated data, explain 1NF, 2NF and 3NF in plain words, and split a flat table into linked tables.',
    minutes: 28,
    recap: 'Yesterday you used CASE to label rows, sort in custom orders and count by condition.',
    parts: [
      {
        title: 'What goes wrong with repeated data',
        say: [
          'Imagine a shop that keeps everything in one big sheet: each row is an order line, with the customer\'s name, city and phone, the product name and price, and the quantity. It seems simple. But look what happens over time.',
          'Asha\'s phone number is copied onto every one of her order lines. When she changes her number, someone must update all those rows. Miss one, and the database now has two different phone numbers for Asha. Nobody knows which is right. This is called an update anomaly.',
          'If a product has not been ordered yet, there is nowhere to store its price, because every row is an order line. That is an insert anomaly: you cannot record a fact until something else happens.',
          'And if Asha\'s only order is deleted, her details disappear with it, even though she is still a customer. That is a delete anomaly.',
          'All three problems come from the same cause: one table trying to store facts about several different things, customers, products and orders, at once. The solution is to split the data so each fact is stored once.',
          'This process of splitting tables to remove repeated facts is called normalization. It has formal rules, but the idea is exactly what you practised on Day 10: one table per kind of thing, linked by ids.'
        ],
        example: 'A class keeps a single notebook where every page records one homework submission, with the student\'s name, parent\'s phone and address copied each time. When a parent changes their phone, the teacher must fix dozens of pages. A separate contact list, written once, solves it.',
        code: lines(
          'CREATE TABLE orders_flat (order_id int, customer text, phone text, product text, price numeric(10,2));',
          "INSERT INTO orders_flat VALUES (1, 'Asha', '98765 11111', 'Pen', 10), (2, 'Asha', '98765 11111', 'Notebook', 60), (3, 'Ravi', '91234 22222', 'Pen', 10);",
          "UPDATE orders_flat SET phone = '90000 33333' WHERE order_id = 1;",
          "SELECT customer, count(DISTINCT phone) AS phone_numbers_on_record FROM orders_flat GROUP BY customer ORDER BY customer;"
        ),
        output: lines(
          ' customer | phone_numbers_on_record',
          '----------+-------------------------',
          ' Asha     |                       2',
          ' Ravi     |                       1',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'Asha\'s phone is copied onto each of her orders.' },
          { line: 3, note: 'Someone updates only one of her rows.' },
          { line: 4, note: 'Now the database holds two different phone numbers for Asha.' }
        ],
        tryIt: "Fix it properly by updating every Asha row: UPDATE orders_flat SET phone = '90000 33333' WHERE customer = 'Asha'; and run again. That is the extra work normalization avoids.",
        check: {
          question: 'Asha\'s phone number is stored on 20 order rows and only one is updated. What is this problem called?',
          options: ['An update anomaly', 'A syntax error', 'A foreign key'],
          answer: 0,
          why: 'Repeated data that is updated in some places but not others leaves the database disagreeing with itself.'
        }
      },
      {
        title: 'First normal form: one value per cell',
        say: [
          'Normalization has levels called normal forms. You only need the first three for almost all real work, and each has a simple idea behind the formal name.',
          'First normal form, 1NF, says: each cell holds a single value, and each row can be identified. A column like phones containing "98765 11111, 91234 22222" breaks this rule, because one cell holds a list.',
          'Lists in a cell cause real problems. You cannot easily search for one phone number, count how many phones a customer has, or make sure each one is valid. And every app that reads the data has to split the text itself.',
          'The fix is to move the list into its own table, with one row per value: customer_phones(customer_id, phone). Now each phone is a separate row, easy to search, count and check.',
          'The same applies to columns like phone1, phone2, phone3. They look tidy, but a fourth phone needs a new column, and searching means checking three columns. A separate table handles any number of phones.',
          'PostgreSQL does have array and JSON columns, which you will meet on Day 25. They are useful for some data, but for things you search, count or link to, separate rows are almost always the better design.'
        ],
        example: 'A registration form with one box that says "subjects: Maths, Physics, Chemistry" is hard to sort by subject. A form with one line per subject, each in its own box, lets the office count how many students take Physics in seconds.',
        code: lines(
          'CREATE TABLE customers_bad (id int, name text, phones text);',
          "INSERT INTO customers_bad VALUES (1, 'Asha', '98765 11111, 90000 33333'), (2, 'Ravi', '91234 22222');",
          'CREATE TABLE customer_phones (customer_id int, phone text);',
          "INSERT INTO customer_phones VALUES (1, '98765 11111'), (1, '90000 33333'), (2, '91234 22222');",
          'SELECT customer_id, count(*) AS phones FROM customer_phones GROUP BY customer_id ORDER BY customer_id;',
          "SELECT customer_id FROM customer_phones WHERE phone = '90000 33333';"
        ),
        output: lines(
          ' customer_id | phones',
          '-------------+--------',
          '           1 |      2',
          '           2 |      1',
          '(2 rows)',
          '',
          ' customer_id',
          '-------------',
          '           1',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'Breaks 1NF: one cell holds a list of phones.' },
          { line: 3, note: 'Fixed: one row per phone.' },
          { line: 5, note: 'Counting and searching are now simple.' }
        ],
        tryIt: "Try finding the customer with phone '90000 33333' in customers_bad. You would need LIKE '%90000 33333%', which is slow and easy to get wrong.",
        check: {
          question: 'Which design follows first normal form?',
          options: ['A separate table with one row per phone number', 'A phones column with numbers separated by commas', 'Columns phone1, phone2 and phone3'],
          answer: 0,
          why: '1NF means one value per cell. A separate table stores each phone as its own row.'
        }
      },
      {
        title: 'Second normal form: facts about the whole key',
        say: [
          'Second normal form, 2NF, matters when a table\'s primary key is made of two or more columns, like order_items with the key (order_id, product_id).',
          'The rule says: every other column must depend on the whole key, not just part of it. In order_items, quantity depends on both the order and the product: it is "how many of this product in this order". That is fine.',
          'But if order_items also stored the product\'s name, that name depends only on product_id, just part of the key. The same product name would be repeated on every order line for that product, which brings back the update anomaly.',
          'The fix is the same as always: move the fact to the table where it belongs. The product name belongs in products, keyed by product_id alone.',
          'A good test: for each column, ask "what is this a fact about?". If the answer is "about the product", it belongs in products. If it is "about this product in this order", it belongs in order_items.',
          'Tables with a single-column id key, like most tables in this course, automatically satisfy 2NF, because there is no "part of the key" to depend on. So 2NF is mostly about junction tables.'
        ],
        example: 'A wedding seating chart lists each guest at each table. The number of chairs reserved depends on both the guest and the table. But the guest\'s home city depends only on the guest, so it belongs on the guest list, not copied onto every seating line.',
        code: lines(
          'CREATE TABLE order_items_bad (order_id int, product_id int, product_name text, quantity int, PRIMARY KEY (order_id, product_id));',
          "INSERT INTO order_items_bad VALUES (101, 1, 'Notebook', 3), (102, 1, 'Notebook', 1), (103, 1, 'Note book', 2);",
          'SELECT product_id, count(DISTINCT product_name) AS different_names FROM order_items_bad GROUP BY product_id;'
        ),
        output: lines(
          ' product_id | different_names',
          '------------+-----------------',
          '          1 |               2',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'product_name depends only on product_id, part of the key: this breaks 2NF.' },
          { line: 2, note: 'A typo on one line means product 1 now has two different names.' }
        ],
        tryIt: 'Design the fix on paper: which columns stay in order_items, and which move to products?',
        check: {
          question: 'In order_items with key (order_id, product_id), which column belongs there?',
          options: ['quantity', 'product_name', 'customer_name'],
          answer: 0,
          why: 'quantity depends on both the order and the product. product_name depends only on the product, and customer_name on the order\'s customer.'
        }
      },
      {
        title: 'Third normal form: no facts about other facts',
        say: [
          'Third normal form, 3NF, says: every column should be a fact about the key, and not a fact about another non-key column.',
          'For example, an orders table with customer_id, customer_city and customer_pincode. The city is really a fact about the customer, not about the order. It depends on customer_id, which is not the order\'s key. That is a "fact about another fact", and it breaks 3NF.',
          'The problem is the familiar one: if the customer moves, every one of their orders must be updated, and any row that is missed disagrees with the rest.',
          'The fix: keep customer_id in orders, and move city and pincode to the customers table. When you need the city on an order report, you join, which is exactly what you learned in week 2.',
          'A famous way to remember the first three forms is: every column must depend on the key, the whole key, and nothing but the key. The first part is roughly 1NF and identifying rows, the whole key is 2NF, and nothing but the key is 3NF.',
          'In practice, a well-designed database in 3NF simply has one table per kind of thing, with each fact stored once and linked by ids. If you design like that from the start, you rarely need to think about the formal names.'
        ],
        example: 'A student\'s marksheet shows their roll number and their class teacher\'s name. But the teacher\'s name is a fact about the class, not the student. If the teacher changes, every student\'s sheet would need editing. Stored with the class, it changes once.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text, city text);',
          "INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai');",
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id), total numeric(10,2));',
          'INSERT INTO orders VALUES (101, 1, 280), (102, 2, 1200), (103, 1, 50);',
          "UPDATE customers SET city = 'Bengaluru' WHERE id = 1;",
          'SELECT o.id, c.name, c.city, o.total FROM orders o JOIN customers c ON c.id = o.customer_id ORDER BY o.id;'
        ),
        output: lines(
          ' id  | name | city      | total',
          '-----+------+-----------+---------',
          ' 101 | Asha | Bengaluru |  280.00',
          ' 102 | Ravi | Mumbai    | 1200.00',
          ' 103 | Asha | Bengaluru |   50.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'orders stores only customer_id: the city lives with the customer.' },
          { line: 5, note: 'One update, and every order report shows the new city.' }
        ],
        tryIt: 'Add a pincode column to customers in the CREATE TABLE and show it in the joined result. It is stored once per customer.',
        check: {
          question: 'Where should a customer\'s city be stored?',
          options: ['In the customers table, once per customer', 'In every order row', 'In order_items'],
          answer: 0,
          why: 'The city is a fact about the customer. Storing it once and joining when needed follows 3NF and avoids update anomalies.'
        }
      },
      {
        title: 'When to break the rules: denormalization',
        say: [
          'Normalization is the right starting point, but there are good reasons to repeat data on purpose. This is called denormalization, and experienced developers do it carefully.',
          'The most common reason is history. An order should record the price the customer actually paid, even if the product\'s price changes later. So order_items stores a unit_price column, a deliberate copy of the price at the time of the order. It is not a mistake; it is a different fact: "the price on this order".',
          'Another example is an address on an invoice. The customer may move later, but the invoice must still show the address it was sent to. Legal documents need to stay exactly as they were.',
          'A third reason is speed. Reporting databases sometimes store totals and joined data ready-made, so dashboards load quickly. These copies are refreshed on a schedule and are not where data is edited.',
          'The key difference is intention. Accidental repetition causes anomalies. Deliberate repetition records a different fact, like a snapshot in time, or a read-only copy for speed.',
          'When in doubt, start normalized. It is much easier to add a deliberate copy later than to clean up a messy, repeated design that is already full of contradictory data.'
        ],
        example: 'A hotel bill from last year shows the room rate you paid then, not today\'s rate. The hotel deliberately keeps that old price on your bill. That is a sensible copy, because it records what really happened.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 10);",
          'CREATE TABLE order_items (order_id int, product_id int REFERENCES products(id), quantity int, unit_price numeric(10,2));',
          'INSERT INTO order_items VALUES (101, 1, 10, 10);',
          'UPDATE products SET price = 12 WHERE id = 1;',
          'SELECT oi.order_id, p.name, oi.unit_price AS paid_then, p.price AS price_now',
          'FROM order_items oi JOIN products p ON p.id = oi.product_id;'
        ),
        output: lines(
          ' order_id | name | paid_then | price_now',
          '----------+------+-----------+-----------',
          '      101 | Pen  |     10.00 |     12.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'unit_price is a deliberate copy: the price on this order.' },
          { line: 5, note: 'The catalogue price goes up later.' },
          { line: 6, note: 'The order still shows what the customer really paid.' }
        ],
        tryIt: 'Add a second order line (102, 1, 5, 12) after the price change and run it. The two orders show different prices paid, both correct.',
        check: {
          question: 'Why store unit_price in order_items when products already has a price?',
          options: ['To record the price actually paid, which should not change when the catalogue price changes', 'Because joins are not allowed', 'It is always a design mistake'],
          answer: 0,
          why: 'It is a different fact: the price at the time of the order. Deliberate copies like this are sensible denormalization.'
        }
      },
      {
        title: 'Putting it together: splitting a flat table',
        say: [
          'Let us take a messy flat table of orders, where customer details repeat on every row, and split it into a proper customers table and an orders table, using only SQL.',
          'Step one: create customers with a serial id, and fill it with each distinct customer using INSERT ... SELECT DISTINCT. Step two: create orders with a customer_id foreign key, and fill it by joining the flat rows to the new customers table to find each id.',
          'INSERT ... SELECT is new here: instead of VALUES, the rows to insert come from a query. It is the standard way to move and reshape data inside a database.',
          'After the split, each customer\'s details are stored once. A final join shows the same information as the flat table, but now a change of city is a single update.',
          'In today\'s practice, you will list each customer once from a flat table with DISTINCT, and create and fill a people table from it with INSERT ... SELECT.',
          'Tomorrow you learn the constraints that protect a good design: UNIQUE, CHECK and what happens to linked rows when something is deleted.'
        ],
        example: 'A college moving from a single overflowing spreadsheet to a proper student system first copies each student once into a student list, then links every record to the right student number. The data is the same; the structure is now safe.',
        code: lines(
          'CREATE TABLE orders_flat (order_id int, customer_name text, customer_city text, total numeric(10,2));',
          "INSERT INTO orders_flat VALUES (1, 'Asha', 'Pune', 280), (2, 'Asha', 'Pune', 60), (3, 'Ravi', 'Mumbai', 1200), (4, 'Priya', 'Pune', 760);",
          'CREATE TABLE customers (id serial PRIMARY KEY, name text, city text);',
          'INSERT INTO customers (name, city) SELECT DISTINCT customer_name, customer_city FROM orders_flat ORDER BY customer_name;',
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id), total numeric(10,2));',
          'INSERT INTO orders SELECT f.order_id, c.id, f.total FROM orders_flat f JOIN customers c ON c.name = f.customer_name AND c.city = f.customer_city;',
          'SELECT * FROM customers ORDER BY id;',
          'SELECT o.id, c.name, o.total FROM orders o JOIN customers c ON c.id = o.customer_id ORDER BY o.id;'
        ),
        output: lines(
          ' id | name  | city',
          '----+-------+--------',
          '  1 | Asha  | Pune',
          '  2 | Priya | Pune',
          '  3 | Ravi  | Mumbai',
          '(3 rows)',
          '',
          ' id | name  | total',
          '----+-------+---------',
          '  1 | Asha  |  280.00',
          '  2 | Asha  |   60.00',
          '  3 | Ravi  | 1200.00',
          '  4 | Priya |  760.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Each customer once, from the flat table.' },
          { line: 6, note: 'Each order, linked to the new customer id by matching name and city.' },
          { line: 8, note: 'The same information as before, now stored without repetition.' }
        ],
        tryIt: "Move Asha to Bengaluru with one UPDATE on customers, then run the last query again. Both her orders show the new city if you add c.city to it.",
        check: {
          question: 'What does INSERT INTO customers (name, city) SELECT DISTINCT ... do?',
          options: ['Inserts one row for each different customer returned by the query', 'Copies the whole flat table', 'Deletes duplicate customers'],
          answer: 0,
          why: 'INSERT ... SELECT inserts the rows a query returns. DISTINCT makes sure each customer appears once.'
        }
      }
    ],
    summary: [
      'Repeated data causes update, insert and delete anomalies.',
      '1NF: one value per cell; lists go into their own table, one row per value.',
      '2NF: every column depends on the whole key (matters for multi-column keys).',
      '3NF: no facts about other non-key columns; "the key, the whole key, and nothing but the key".',
      'Deliberate copies, like the price paid on an order, are sensible denormalization.'
    ],
    projectStep: {
      title: 'My Library: check your design',
      steps: [
        'Look at your books, authors and wishlist tables. Is any fact stored twice?',
        'If a book can have several genres, design a book_genres table instead of a genres list column.',
        'Write down, for each column, what it is a fact about.',
        'Fix one design problem you find, using CREATE TABLE and INSERT ... SELECT.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 21,
    title: 'Constraints That Protect Your Data',
    goal: 'You can add UNIQUE and CHECK rules, change tables with ALTER TABLE, and choose what happens to linked rows when a row is deleted.',
    minutes: 28,
    recap: 'Yesterday you learned normalization: why repeated data causes problems and how to split tables so each fact is stored once.',
    parts: [
      {
        title: 'Why rules belong in the database',
        say: [
          'A good design is only half the job. The other half is making sure bad data can never get in: a negative price, a duplicate email, an order for a customer who does not exist. Rules that PostgreSQL enforces are called constraints.',
          'You already know several: NOT NULL, PRIMARY KEY, UNIQUE and FOREIGN KEY. Today you meet CHECK, learn to add rules to existing tables, and choose what happens to linked rows on delete.',
          'Why not just check everything in the app? Because data reaches a database in many ways: the website, the mobile app, an admin tool, a one-off script, a data import. If the rule only lives in one app, the others can break it. A constraint protects the data whichever way it arrives.',
          'Constraints also protect against bugs. Even careful developers make mistakes, and a constraint turns a silent bad value into a loud error at the moment it happens, which is much easier to fix than a wrong report months later.',
          'Apps should still check input, to give users friendly messages like "please enter a positive amount". The database constraint is the final safety net behind the app, not a replacement for good forms.',
          'Every constraint has a name. PostgreSQL makes one up if you do not, like products_price_check. Giving your own clear names makes error messages easier to understand.'
        ],
        example: 'A bank teller checks your withdrawal slip, but the bank\'s system also refuses to let any account go below zero, whoever enters the transaction. The teller is the app; the system rule is the constraint.',
        code: lines(
          'CREATE TABLE accounts (',
          '  id int PRIMARY KEY,',
          '  owner text NOT NULL,',
          '  balance numeric(12,2) NOT NULL CONSTRAINT balance_not_negative CHECK (balance >= 0)',
          ');',
          "INSERT INTO accounts VALUES (1, 'Asha', 500);",
          'UPDATE accounts SET balance = balance - 800 WHERE id = 1;'
        ),
        output: '[Error] new row for relation "accounts" violates check constraint "balance_not_negative"',
        codeNotes: [
          { line: 4, note: 'A named CHECK rule: the balance can never be below 0.' },
          { line: 7, note: 'This would make the balance -300, so PostgreSQL refuses.' }
        ],
        tryIt: 'Change 800 to 300 on the last line and add SELECT * FROM accounts; after it. The update works, leaving 200.',
        check: {
          question: 'Why add a CHECK rule in the database when the app already checks the amount?',
          options: ['Data can arrive from many places, and the rule protects it from all of them', 'Apps cannot check numbers', 'CHECK rules make queries faster'],
          answer: 0,
          why: 'Scripts, imports and other apps can bypass one app\'s checks. A constraint is enforced for every change.'
        }
      },
      {
        title: 'CHECK rules',
        say: [
          'A CHECK rule is a condition that every row must meet. You write it like a WHERE condition: CHECK (price > 0), CHECK (rating BETWEEN 1 AND 5), CHECK (status IN (\'pending\', \'shipped\', \'delivered\')).',
          'PostgreSQL tests the condition on every INSERT and UPDATE. If it is false, the change is refused with an error naming the rule. If it is true, or NULL, the change goes ahead.',
          'That last detail matters: a CHECK passes when the condition is NULL. So CHECK (price > 0) allows a NULL price. If the value is also required, add NOT NULL as well.',
          'A CHECK can compare several columns of the same row: CHECK (end_date >= start_date) makes sure a booking does not end before it starts. Rules like this catch mistakes that a simple type cannot.',
          'CHECK rules can only look at the row being changed. They cannot look at other rows or other tables. For rules that involve other tables, you use foreign keys, or more advanced tools like triggers.',
          'Good CHECK rules describe business facts: prices are positive, discounts are between 0 and 100 percent, a quantity is at least 1. Ask the people who know the business which values should never be possible.'
        ],
        example: 'A cinema booking form will not let you pick a return journey before your departure, or book zero seats. Those are CHECK rules: simple facts about each booking that must always be true.',
        code: lines(
          'CREATE TABLE bookings (',
          '  id int PRIMARY KEY,',
          '  seats int NOT NULL CHECK (seats >= 1),',
          '  start_date date NOT NULL,',
          '  end_date date NOT NULL,',
          '  CHECK (end_date >= start_date)',
          ');',
          "INSERT INTO bookings VALUES (1, 2, '2026-10-01', '2026-10-03');",
          'SELECT * FROM bookings;',
          "INSERT INTO bookings VALUES (2, 1, '2026-10-05', '2026-10-02');"
        ),
        output: lines(
          ' id | seats | start_date | end_date',
          '----+-------+------------+------------',
          '  1 |     2 | 2026-10-01 | 2026-10-03',
          '(1 row)',
          '',
          '[Error] new row for relation "bookings" violates check constraint "bookings_check"'
        ),
        codeNotes: [
          { line: 3, note: 'At least one seat.' },
          { line: 6, note: 'A rule about two columns of the same row.' },
          { line: 10, note: 'Ends before it starts: refused.' }
        ],
        tryIt: "Fix line 10 so the booking ends after it starts, for example '2026-10-05' to '2026-10-07', and add SELECT count(*) FROM bookings; after it. Then try a booking with 0 seats.",
        check: {
          question: 'A column has CHECK (price > 0) but no NOT NULL. Can price be NULL?',
          options: ['Yes, because a CHECK passes when the condition is NULL', 'No, CHECK blocks NULL', 'Only for the first row'],
          answer: 0,
          why: 'A NULL comparison gives NULL, not false, so the CHECK does not block it. Add NOT NULL to require a value.'
        }
      },
      {
        title: 'UNIQUE on one or several columns',
        say: [
          'UNIQUE stops two rows having the same value in a column, like an email or a username. You met it on Day 2. Today, two more uses.',
          'A UNIQUE rule can cover several columns together: UNIQUE (student_id, course_id) means a student can enrol in many courses, and a course has many students, but the same student cannot enrol in the same course twice.',
          'Combined uniqueness is very common in junction tables and in things like "one review per customer per product" or "one attendance mark per student per day".',
          'UNIQUE treats NULLs as different from each other by default, so several rows can have a NULL email. If you need at most one row without a value, PostgreSQL has UNIQUE NULLS NOT DISTINCT, but that is rarely needed.',
          'Behind the scenes, PostgreSQL creates an index for every UNIQUE rule and every primary key. That index is what lets it check for duplicates quickly, even in huge tables. You will learn about indexes on Day 23.',
          'A UNIQUE rule also documents the design: anyone reading the table sees immediately that email identifies a user, or that one student has one row per course.'
        ],
        example: 'A college allows a student to join many clubs, and a club to have many students, but a student cannot sign up for the same club twice. The rule is about the pair: student plus club.',
        code: lines(
          'CREATE TABLE enrolments (',
          '  student_id int NOT NULL,',
          '  course_id int NOT NULL,',
          '  enrolled_on date NOT NULL,',
          '  UNIQUE (student_id, course_id)',
          ');',
          "INSERT INTO enrolments VALUES (1, 10, '2026-09-01'), (1, 20, '2026-09-01'), (2, 10, '2026-09-02');",
          'SELECT count(*) AS enrolments FROM enrolments;',
          "INSERT INTO enrolments VALUES (1, 10, '2026-09-05');"
        ),
        output: lines(
          ' enrolments',
          '------------',
          '          3',
          '(1 row)',
          '',
          '[Error] duplicate key value violates unique constraint "enrolments_student_id_course_id_key"'
        ),
        codeNotes: [
          { line: 5, note: 'The pair must be unique; each value alone may repeat.' },
          { line: 7, note: 'Student 1 in two courses, and course 10 with two students: all fine.' },
          { line: 9, note: 'Student 1 in course 10 again: refused.' }
        ],
        tryIt: "Change line 9 to a new pair, like (2, 20, '2026-09-05'), and add SELECT count(*) FROM enrolments; after it. The new pair is accepted, making 4 enrolments.",
        check: {
          question: 'What does UNIQUE (student_id, course_id) prevent?',
          options: ['The same student enrolling in the same course twice', 'A student enrolling in two courses', 'A course having two students'],
          answer: 0,
          why: 'A multi-column UNIQUE rule applies to the combination. Each column alone can still repeat.'
        }
      },
      {
        title: 'ALTER TABLE: changing a table that already exists',
        say: [
          'Tables change as an app grows: a new column, a new rule, a renamed column. You do not have to drop and recreate the table; ALTER TABLE changes it in place, keeping the data.',
          'ALTER TABLE products ADD COLUMN discount numeric(5,2) DEFAULT 0 adds a column. ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0) adds a rule. ALTER TABLE products ALTER COLUMN name SET NOT NULL makes a column required.',
          'When you add a rule, PostgreSQL checks it against every existing row first. If any row breaks the new rule, the ALTER fails, and nothing changes. That is a good thing: it tells you exactly which data needs cleaning before the rule can be added.',
          'The usual workflow is: find the bad rows with a SELECT, fix them with an UPDATE, then add the constraint. The rule then keeps the data clean from that moment on.',
          'You can also remove things: ALTER TABLE ... DROP COLUMN, DROP CONSTRAINT. Be careful, as dropping a column deletes its data.',
          'In real teams, changes like these are written as migration scripts, small numbered files that are run in order on every copy of the database, so development, testing and live databases stay the same shape.'
        ],
        example: 'A school decides every student must now have a parent\'s phone number on file. Before making it compulsory, the office first finds the students without one and collects the numbers. Only then does the rule take effect. That is clean up first, then add the rule.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 10), (2, 'Free sticker', 0), (3, 'Notebook', 60);",
          'SELECT id, name FROM products WHERE price <= 0;',
          "UPDATE products SET price = 1 WHERE name = 'Free sticker';",
          'ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0);',
          'ALTER TABLE products ADD COLUMN discount numeric(5,2) NOT NULL DEFAULT 0;',
          'SELECT * FROM products ORDER BY id;'
        ),
        output: lines(
          ' id | name',
          '----+--------------',
          '  2 | Free sticker',
          '(1 row)',
          '',
          ' id | name         | price | discount',
          '----+--------------+-------+----------',
          '  1 | Pen          | 10.00 |     0.00',
          '  2 | Free sticker |  1.00 |     0.00',
          '  3 | Notebook     | 60.00 |     0.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Find the rows that would break the new rule.' },
          { line: 4, note: 'Fix them first.' },
          { line: 5, note: 'Now the rule can be added, and it protects the table from here on.' },
          { line: 6, note: 'A new column; existing rows get the default.' }
        ],
        tryIt: 'Remove the UPDATE on line 4 and run it. The ALTER on line 5 fails, because the free sticker breaks the rule.',
        check: {
          question: 'What happens when you add a CHECK rule that some existing rows break?',
          options: ['The ALTER TABLE fails, and you must fix those rows first', 'The bad rows are deleted', 'The rule is added but ignored for old rows'],
          answer: 0,
          why: 'PostgreSQL checks existing rows when adding a rule. If any break it, the change is refused.'
        }
      },
      {
        title: 'What happens on delete: CASCADE, SET NULL, RESTRICT',
        say: [
          'A foreign key links a child row to a parent row, like an order item to its order. What should happen to the children when the parent is deleted? You choose with ON DELETE.',
          'The default is to refuse: you cannot delete an order that still has items. This is the safest choice, and you have seen its error already. RESTRICT is almost the same thing, written explicitly.',
          'ON DELETE CASCADE deletes the children too. Delete an order, and its order items go with it. This makes sense when the children have no meaning without the parent: an order line without an order is useless.',
          'ON DELETE SET NULL keeps the children but clears their link. Delete a salesperson, and their past orders stay, with no salesperson recorded. This makes sense when the children still matter on their own.',
          'Choose carefully. CASCADE is convenient but powerful: deleting one customer with CASCADE all the way down could remove years of orders. For important business data, many companies prefer the default refusal, and use soft deletes instead, as you saw on Day 3.',
          'There is also ON UPDATE, for when a parent\'s key changes, but with ids that never change, it is rarely needed.'
        ],
        example: 'If a school closes a club, its membership list is thrown away too, because members of a closed club mean nothing: that is CASCADE. If a teacher leaves, their old students are not deleted; the "class teacher" box just becomes empty: that is SET NULL.',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer text);',
          'CREATE TABLE order_items (order_id int REFERENCES orders(id) ON DELETE CASCADE, product text);',
          'CREATE TABLE staff (id int PRIMARY KEY, name text);',
          'CREATE TABLE deliveries (id int PRIMARY KEY, staff_id int REFERENCES staff(id) ON DELETE SET NULL);',
          "INSERT INTO orders VALUES (1, 'Asha'), (2, 'Ravi');",
          "INSERT INTO order_items VALUES (1, 'Pen'), (1, 'Notebook'), (2, 'Backpack');",
          "INSERT INTO staff VALUES (7, 'Vikram');",
          'INSERT INTO deliveries VALUES (100, 7), (101, 7);',
          'DELETE FROM orders WHERE id = 1;',
          'DELETE FROM staff WHERE id = 7;',
          'SELECT count(*) AS items_left FROM order_items;',
          'SELECT id, staff_id FROM deliveries ORDER BY id;'
        ),
        output: lines(
          ' items_left',
          '------------',
          '          1',
          '(1 row)',
          '',
          ' id  | staff_id',
          '-----+----------',
          ' 100 |     NULL',
          ' 101 |     NULL',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'CASCADE: deleting an order deletes its items.' },
          { line: 4, note: 'SET NULL: deleting a staff member keeps the deliveries, without a name.' },
          { line: 11, note: 'Only order 2\'s item is left.' }
        ],
        tryIt: 'Remove ON DELETE CASCADE from line 2 and run it. Deleting order 1 is now refused, because it still has items.',
        check: {
          question: 'Which ON DELETE option fits "order items should be removed when their order is deleted"?',
          options: ['CASCADE', 'SET NULL', 'The default (refuse)'],
          answer: 0,
          why: 'Order items have no meaning without their order, so deleting them together with it makes sense.'
        }
      },
      {
        title: 'Putting it together: a well-protected table',
        say: [
          'Let us design a reviews table with every rule from this week: an id, a product that must exist, a customer, a rating from 1 to 5, and one review per customer per product. Reviews are deleted with their product.',
          'Read the CREATE TABLE line by line: each rule is one short phrase, and together they describe exactly what a valid review is. Anyone joining the team can read the rules straight from the design.',
          'Then we try three bad inserts inside separate statements. Each is refused with a clear message naming the broken rule. In a real app, those messages would be turned into friendly text for the user.',
          'In today\'s practice, you will add a UNIQUE email and a CHECK on balance to an existing accounts table with ALTER TABLE, and create a books table whose rows are deleted along with their author.',
          'Tomorrow you learn transactions: how to make several changes happen together, all or nothing, which is the other half of keeping data safe.',
          'A table with good constraints is like a building with good foundations. You rarely think about them, but they are what stop everything falling apart when something unexpected happens.'
        ],
        example: 'A well-run exam hall has rules printed at the door: one seat per student, only registered students, no phones. The invigilator does not need to remember them all; the rules are on the wall for everyone. Constraints are the rules on the wall of your table.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text NOT NULL);',
          "INSERT INTO products VALUES (1, 'Notebook');",
          'CREATE TABLE reviews (',
          '  id serial PRIMARY KEY,',
          '  product_id int NOT NULL REFERENCES products(id) ON DELETE CASCADE,',
          '  customer text NOT NULL,',
          '  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),',
          '  UNIQUE (product_id, customer)',
          ');',
          "INSERT INTO reviews (product_id, customer, rating) VALUES (1, 'Asha', 5);",
          'SELECT product_id, customer, rating FROM reviews;',
          "INSERT INTO reviews (product_id, customer, rating) VALUES (1, 'Asha', 4);"
        ),
        output: lines(
          ' product_id | customer | rating',
          '------------+----------+--------',
          '          1 | Asha     |      5',
          '(1 row)',
          '',
          '[Error] duplicate key value violates unique constraint "reviews_product_id_customer_key"'
        ),
        codeNotes: [
          { line: 5, note: 'Must be a real product; reviews go when the product goes.' },
          { line: 7, note: 'Ratings from 1 to 5 only.' },
          { line: 8, note: 'One review per customer per product.' },
          { line: 12, note: 'Asha reviewing the same product again: refused.' }
        ],
        tryIt: "Change the last line to a rating of 9 for a new customer, like ('Ravi', 9), and read which rule refuses it.",
        check: {
          question: 'Which rule stops Asha reviewing the same product twice?',
          options: ['UNIQUE (product_id, customer)', 'CHECK (rating BETWEEN 1 AND 5)', 'The foreign key on product_id'],
          answer: 0,
          why: 'The multi-column UNIQUE rule allows one row per product and customer pair.'
        }
      }
    ],
    summary: [
      'Constraints are rules PostgreSQL enforces for every change, from every app or script.',
      'CHECK (condition) must be true or NULL for every row; add NOT NULL to require a value.',
      'UNIQUE can cover several columns together, like one enrolment per student per course.',
      'ALTER TABLE adds columns and rules; fix existing bad rows first.',
      'ON DELETE: the default refuses, CASCADE deletes children, SET NULL clears the link.'
    ],
    projectStep: {
      title: 'My Library: add safety rules',
      steps: [
        'Add CHECK (pages > 0) to your books table with ALTER TABLE.',
        'Add a rating column with CHECK (rating BETWEEN 1 AND 5).',
        'Make each title unique per author with UNIQUE (title, author_id).',
        'Decide what should happen to books when an author is deleted, and set ON DELETE.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 22,
    title: 'Transactions: All or Nothing',
    goal: 'You can group changes into a transaction with BEGIN and COMMIT, undo them with ROLLBACK, and explain ACID in plain words.',
    minutes: 28,
    recap: 'Yesterday you protected tables with CHECK, UNIQUE, ALTER TABLE and ON DELETE rules.',
    parts: [
      {
        title: 'Why some changes must happen together',
        say: [
          'Some jobs need several changes that only make sense together. Moving 500 rupees from Asha to Ravi means taking 500 from Asha and adding 500 to Ravi. If the first change happens and the second fails, 500 rupees have simply vanished.',
          'Failures happen: the server restarts, the network drops, a constraint rejects a value, a bug throws an error halfway. Without protection, the data is left half-changed, and nobody may notice until the numbers stop adding up.',
          'A transaction solves this. It groups several statements into one unit that either happens completely, or not at all. There is no in-between state that anyone else can see.',
          'You start a transaction with BEGIN, run your statements, and finish with COMMIT to make them permanent. If anything goes wrong before COMMIT, all the changes since BEGIN are undone.',
          'Every single statement in PostgreSQL is already its own small transaction. An UPDATE that changes a thousand rows changes all of them or none of them. BEGIN and COMMIT let you extend that guarantee across several statements.',
          'Banks, shops, ticket booking sites and every app that handles money or stock rely on transactions. Understanding them is a basic requirement for backend developer jobs.'
        ],
        example: 'When you pay at a shop by UPI, the money must leave your account and reach the shop together. You would be very upset if it left your account and never arrived. The bank wraps both steps in one transaction.',
        code: lines(
          'CREATE TABLE accounts (id int PRIMARY KEY, owner text, balance numeric(12,2) CHECK (balance >= 0));',
          "INSERT INTO accounts VALUES (1, 'Asha', 1000), (2, 'Ravi', 200);",
          'BEGIN;',
          'UPDATE accounts SET balance = balance - 500 WHERE id = 1;',
          'UPDATE accounts SET balance = balance + 500 WHERE id = 2;',
          'COMMIT;',
          'SELECT owner, balance FROM accounts ORDER BY id;',
          'SELECT sum(balance) AS total_money FROM accounts;'
        ),
        output: lines(
          ' owner | balance',
          '-------+---------',
          ' Asha  |  500.00',
          ' Ravi  |  700.00',
          '(2 rows)',
          '',
          ' total_money',
          '-------------',
          '     1200.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Start the transaction.' },
          { line: 4, note: 'Both updates belong together.' },
          { line: 6, note: 'Make both permanent at once.' },
          { line: 8, note: 'The total is still 1200: no money appeared or vanished.' }
        ],
        tryIt: 'Change the amount to 5000 in both updates and run it. The first update breaks the CHECK rule, the transaction fails, and nothing changes.',
        check: {
          question: 'What does a transaction guarantee?',
          options: ['All its changes happen together, or none of them happen', 'It runs faster than separate statements', 'It cannot contain UPDATE statements'],
          answer: 0,
          why: 'A transaction is all or nothing: either every change is committed, or all are undone.'
        }
      },
      {
        title: 'ROLLBACK: undoing on purpose',
        say: [
          'COMMIT keeps the changes. ROLLBACK throws them away. Everything done since BEGIN is undone, as if it never happened.',
          'Apps use ROLLBACK when they discover a problem partway through: the item is out of stock, the payment was declined, the user pressed cancel. Instead of trying to reverse each change by hand, they simply roll back.',
          'ROLLBACK is also a great safety tool when you work on a real database by hand. Start with BEGIN, run your UPDATE, check the result with a SELECT, and only COMMIT if it looks right. If it looks wrong, ROLLBACK, and nothing was damaged.',
          'Inside the transaction, your own SELECTs see your changes, even before COMMIT. That is how you check them. Other people connected to the database do not see them until you commit.',
          'Remember the Day 3 warning about UPDATE without WHERE? Working inside BEGIN turns that disaster into a small scare: you see the wrong row count, you ROLLBACK, and every row is back as it was.',
          'Do not leave a transaction open for long. While it is open, it may hold locks that make other people wait. Check, then commit or roll back quickly.'
        ],
        example: 'Writing an important email: you write a draft, read it through, and either press Send or Discard. BEGIN starts the draft, SELECT is reading it through, COMMIT is Send, and ROLLBACK is Discard.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 10), (2, 'Notebook', 60), (3, 'Backpack', 1200);",
          'BEGIN;',
          'UPDATE products SET price = 0;',
          'SELECT count(*) AS free_products FROM products WHERE price = 0;',
          'ROLLBACK;',
          'SELECT name, price FROM products ORDER BY id;'
        ),
        output: lines(
          ' free_products',
          '---------------',
          '             3',
          '(1 row)',
          '',
          ' name     | price',
          '----------+---------',
          ' Pen      |   10.00',
          ' Notebook |   60.00',
          ' Backpack | 1200.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'A mistake: no WHERE, so every product becomes free.' },
          { line: 5, note: 'Checking inside the transaction shows the damage: 3 free products.' },
          { line: 6, note: 'ROLLBACK undoes everything since BEGIN.' },
          { line: 7, note: 'All prices are back.' }
        ],
        tryIt: 'Change ROLLBACK to COMMIT and run it. This time the mistake is saved, and every price is 0.',
        check: {
          question: 'You ran an UPDATE inside BEGIN and it changed far more rows than expected. What should you do?',
          options: ['ROLLBACK, so all changes since BEGIN are undone', 'COMMIT and fix it later', 'Run DELETE'],
          answer: 0,
          why: 'Before COMMIT, ROLLBACK safely undoes every change made in the transaction.'
        }
      },
      {
        title: 'Errors inside a transaction',
        say: [
          'When a statement inside a transaction fails, for example because it breaks a constraint, PostgreSQL marks the whole transaction as failed. Every further statement is refused until you end it.',
          'You will see a message like "current transaction is aborted, commands ignored until end of transaction block". It means: something already went wrong, so nothing else will run. End the transaction, and the failed changes are all undone.',
          'This is the "all or nothing" rule in action. PostgreSQL will not let you continue as if the failed step had worked, because that could leave the data half-changed.',
          'In apps, database libraries handle this for you. You write your steps inside a transaction block, and if any step throws an error, the library rolls back automatically. You will see this with Python and Node.js on Day 26.',
          'The important habit is to put all the steps of one business action, like "place an order", inside one transaction: create the order, add the items, reduce the stock. If the stock update fails, the order and its items vanish too.',
          'In the lesson editor, the error stops the run, so you only see the error message, but the idea is exactly the same: the failed transaction changed nothing.'
        ],
        example: 'A train reservation for a family of four: if only three seats are available, the system does not book three people and leave the fourth stranded. The whole booking fails, and nobody is charged. One failed step cancels the whole group.',
        code: lines(
          'CREATE TABLE stock (product text PRIMARY KEY, units int CHECK (units >= 0));',
          "INSERT INTO stock VALUES ('Pen', 5);",
          'CREATE TABLE sales (product text, quantity int);',
          'BEGIN;',
          "INSERT INTO sales VALUES ('Pen', 8);",
          "UPDATE stock SET units = units - 8 WHERE product = 'Pen';",
          'COMMIT;'
        ),
        output: '[Error] new row for relation "stock" violates check constraint "stock_units_check"',
        codeNotes: [
          { line: 5, note: 'The sale is recorded first...' },
          { line: 6, note: '...but there are only 5 pens, so the stock would go below 0 and the CHECK refuses.' },
          { line: 7, note: 'Because of the error, the whole transaction is undone, including the sale.' }
        ],
        tryIt: 'Change 8 to 3 in both lines, and add SELECT * FROM stock; SELECT * FROM sales; at the end. Now both changes are saved together.',
        check: {
          question: 'Inside a transaction, the second of three statements fails. What happens to the first one\'s changes?',
          options: ['They are undone along with everything else in the transaction', 'They stay saved', 'Only the third statement is undone'],
          answer: 0,
          why: 'A failed transaction commits nothing. All changes since BEGIN are discarded.'
        }
      },
      {
        title: 'ACID in plain words',
        say: [
          'Databases like PostgreSQL promise four properties for transactions, remembered as ACID. It is a classic interview question, so here it is in plain words.',
          'A is for Atomic: all or nothing. A transaction cannot be half done. You have seen this in every example today.',
          'C is for Consistent: a transaction takes the database from one valid state to another. Every constraint, like "balance never below zero", holds before and after. If a change would break a rule, the transaction fails instead.',
          'I is for Isolated: transactions running at the same time do not see each other\'s unfinished work. While your transfer is half done, nobody else sees Asha\'s money gone and Ravi\'s not yet arrived.',
          'D is for Durable: once COMMIT succeeds, the change survives, even if the server loses power a second later. PostgreSQL writes it to a log on disk before saying "committed".',
          'These four promises are why banks, hospitals and shops trust relational databases with their most important data. Some newer databases relax them for speed, which is one of the trade-offs you will read about on Day 29.'
        ],
        example: 'Think of posting a registered letter. Atomic: it is either sent or not. Consistent: it follows the post office\'s rules. Isolated: nobody sees it half-posted. Durable: once you have the receipt, it is officially sent, even if the counter\'s computer crashes afterwards.',
        code: lines(
          'CREATE TABLE seats (seat text PRIMARY KEY, booked_by text);',
          "INSERT INTO seats VALUES ('A1', NULL), ('A2', NULL);",
          'BEGIN;',
          "UPDATE seats SET booked_by = 'Asha' WHERE seat = 'A1' AND booked_by IS NULL;",
          "UPDATE seats SET booked_by = 'Asha' WHERE seat = 'A2' AND booked_by IS NULL;",
          'COMMIT;',
          'SELECT seat, booked_by FROM seats ORDER BY seat;'
        ),
        output: lines(
          ' seat | booked_by',
          '------+-----------',
          ' A1   | Asha',
          ' A2   | Asha',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Book a seat only if it is still free.' },
          { line: 6, note: 'Both seats are booked together, or neither is.' }
        ],
        tryIt: "Before BEGIN, book A2 for Ravi: UPDATE seats SET booked_by = 'Ravi' WHERE seat = 'A2'; Then run it. Asha only gets A1, because A2 was no longer free.",
        check: {
          question: 'What does the D in ACID mean?',
          options: ['Durable: committed changes survive a crash', 'Deleted: rows can be removed', 'Distinct: no duplicate rows'],
          answer: 0,
          why: 'Durability means once COMMIT succeeds, the change is safely stored and survives power loss or restarts.'
        }
      },
      {
        title: 'When two people change the same row',
        say: [
          'In a real app, many users act at the same moment. Two people might try to book the last seat, or two cashiers might sell the last pen. Transactions and locks keep this safe.',
          'When a transaction updates a row, PostgreSQL locks that row until the transaction ends. If a second transaction tries to update the same row, it waits. When the first commits, the second continues and sees the new value.',
          'That is why the seat booking in the last example used WHERE booked_by IS NULL. The second person\'s update waits, then finds the seat is no longer free, and changes nothing. The app sees "0 rows updated" and can tell the user the seat was taken.',
          'A classic bug is reading a value, deciding in the app, then writing it back: read the stock as 1, see it is enough, write 0. If two people do this at once, both read 1, and both sell. The fix is to do the check and the change in one UPDATE, like UPDATE stock SET units = units - 1 WHERE product = \'Pen\' AND units >= 1.',
          'Another option is SELECT ... FOR UPDATE, which locks the rows you read so nobody else can change them until you finish. It is used when the app really must read first and decide.',
          'The lesson editor has only one connection, so it cannot show two users at once. But these patterns, doing the check inside the UPDATE, are exactly what you should use in real apps.'
        ],
        example: 'Two people reach for the last packet of biscuits on a shelf at the same moment. Only one hand can take it. The shop does not sell the same packet twice; the second person finds the shelf empty. A row lock is that single packet.',
        code: lines(
          'CREATE TABLE stock (product text PRIMARY KEY, units int NOT NULL);',
          "INSERT INTO stock VALUES ('Pen', 1);",
          "UPDATE stock SET units = units - 1 WHERE product = 'Pen' AND units >= 1 RETURNING units AS left_after_first_sale;",
          "UPDATE stock SET units = units - 1 WHERE product = 'Pen' AND units >= 1 RETURNING units AS left_after_second_sale;",
          "SELECT units FROM stock WHERE product = 'Pen';"
        ),
        output: lines(
          ' left_after_first_sale',
          '-----------------------',
          '                     0',
          '(1 row)',
          '',
          ' left_after_second_sale',
          '------------------------',
          '(0 rows)',
          '',
          ' units',
          '-------',
          '     0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'The check (units >= 1) and the change happen in one statement.' },
          { line: 4, note: 'The second sale finds no row that matches: 0 rows, so nothing is sold twice.' }
        ],
        tryIt: 'Remove AND units >= 1 from both updates and run it. The stock goes to -1: the same pen was sold twice.',
        check: {
          question: 'How do you stop two sales taking the last item?',
          options: ['Check and change in one UPDATE: SET units = units - 1 WHERE ... AND units >= 1', 'Read the stock in the app first, then update', 'Add ORDER BY to the UPDATE'],
          answer: 0,
          why: 'Doing the check inside the UPDATE, on a locked row, means the second sale sees the new value and matches nothing.'
        }
      },
      {
        title: 'Putting it together: placing an order safely',
        say: [
          'Let us write the most important transaction in any shop: placing an order. It must create the order, add its items, and reduce the stock, all together.',
          'Inside BEGIN and COMMIT, we insert the order and use RETURNING to see its id, insert the order item, and reduce the stock with a safe UPDATE that checks there is enough.',
          'If the stock is too low, the CHECK rule on units refuses the update, and the whole order disappears as if it was never placed. No order without stock, no stock taken without an order.',
          'In today\'s practice, you will transfer money between two accounts in one transaction, and record a sale while reducing the stock, all together.',
          'Tomorrow you learn how to make queries fast with indexes, and how to read what PostgreSQL does behind the scenes with EXPLAIN.',
          'Whenever you write code that changes several tables for one user action, ask yourself: what happens if this fails halfway? If the answer is "the data is wrong", you need a transaction.'
        ],
        example: 'When you order food in an app, three things happen: the order is created, your money is taken, and the restaurant\'s menu stock goes down. If any of them fails, none should stay. The app wraps them in one transaction.',
        code: lines(
          'CREATE TABLE stock (product text PRIMARY KEY, units int NOT NULL CHECK (units >= 0));',
          "INSERT INTO stock VALUES ('Notebook', 10);",
          'CREATE TABLE orders (id serial PRIMARY KEY, customer text NOT NULL);',
          'CREATE TABLE order_items (order_id int REFERENCES orders(id), product text, quantity int);',
          'BEGIN;',
          "INSERT INTO orders (customer) VALUES ('Asha') RETURNING id;",
          "INSERT INTO order_items VALUES (1, 'Notebook', 3);",
          "UPDATE stock SET units = units - 3 WHERE product = 'Notebook';",
          'COMMIT;',
          "SELECT (SELECT count(*) FROM orders) AS orders, (SELECT units FROM stock WHERE product = 'Notebook') AS notebooks_left;"
        ),
        output: lines(
          ' id',
          '----',
          '  1',
          '(1 row)',
          '',
          ' orders | notebooks_left',
          '--------+----------------',
          '      1 |              7',
          '(1 row)'
        ),
        codeNotes: [
          { line: 5, note: 'One transaction for the whole order.' },
          { line: 6, note: 'Create the order and see its new id.' },
          { line: 8, note: 'Take the stock. If there were not enough, the CHECK would undo everything.' }
        ],
        tryIt: 'Change the quantity to 30 in lines 7 and 8 and run it. The stock update fails, and the order is not created either.',
        check: {
          question: 'Why is placing an order done in one transaction?',
          options: ['So the order, its items and the stock change together, or not at all', 'Because INSERT needs a transaction', 'To make RETURNING work'],
          answer: 0,
          why: 'If any step fails, the transaction undoes the others, so there is never an order without stock taken, or the reverse.'
        }
      }
    ],
    summary: [
      'A transaction groups statements: BEGIN, the changes, then COMMIT to keep them.',
      'ROLLBACK undoes everything since BEGIN; use it to check risky changes safely.',
      'If a statement fails inside a transaction, the whole transaction is undone.',
      'ACID: Atomic, Consistent, Isolated, Durable.',
      'Avoid double-selling by checking and changing in one UPDATE, like WHERE units >= 1.'
    ],
    projectStep: {
      title: 'My Library: lending a book safely',
      steps: [
        'Create a loans table (book_id, friend, lent_on) and add an is_lent boolean DEFAULT false to books.',
        'In one transaction, insert a loan and set is_lent = true for that book.',
        'Make the UPDATE safe: only lend if is_lent = false.',
        'Try lending the same book twice and check that the second time changes nothing.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 23,
    title: 'Faster Queries: Indexes and EXPLAIN',
    goal: 'You can explain what an index is, create one, read a simple EXPLAIN plan, and decide which columns deserve an index.',
    minutes: 28,
    recap: 'Yesterday you used transactions to make changes all or nothing, and learned ACID and safe updates.',
    parts: [
      {
        title: 'Why big tables get slow',
        say: [
          'So far every table has had a handful of rows, and every query was instant. Real tables are bigger: a shop might have a million orders, a bank hundreds of millions of transactions.',
          'Without help, finding one order by its customer means PostgreSQL reads every single row and checks it. This is called a sequential scan, or Seq Scan. On a million rows, that can take a noticeable time, and if thousands of users do it at once, the whole app slows down.',
          'An index is a separate, sorted structure that points to where each value lives in the table. With an index on customer_id, PostgreSQL can jump straight to that customer\'s orders, instead of reading everything.',
          'Primary keys and UNIQUE columns get an index automatically. That is why looking up a row by its id is always fast. Other columns, like customer_id in orders or email in a login table, need an index you create yourself.',
          'Indexes are the single most important tool for database speed. Many "the app is slow" problems in real companies are solved by adding one well-chosen index.',
          'The rest of today is about how to create them, how to check whether PostgreSQL uses them, and when not to add them.',
          'The example below uses generate_series, a PostgreSQL function that produces a list of numbers, to create 50,000 orders in one statement. It is a handy way to make realistic amounts of test data when you want to see how a query behaves on a bigger table.'
        ],
        example: 'Finding a topic in a 600-page textbook by reading every page takes ages. The index at the back says "Photosynthesis: page 212", and you go straight there. A database index works exactly the same way.',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, total numeric(10,2));',
          'INSERT INTO orders SELECT n, n % 5000, (n % 900) + 10 FROM generate_series(1, 50000) AS n;',
          'SELECT count(*) AS orders, count(DISTINCT customer_id) AS customers FROM orders;',
          'SELECT count(*) AS orders_of_customer_42 FROM orders WHERE customer_id = 42;'
        ),
        output: lines(
          ' orders | customers',
          '--------+-----------',
          '  50000 |      5000',
          '(1 row)',
          '',
          ' orders_of_customer_42',
          '-----------------------',
          '                    10',
          '(1 row)'
        ),
        codeNotes: [
          { line: 2, note: 'generate_series makes 50,000 numbers, so we get 50,000 orders from 5,000 customers.' },
          { line: 4, note: 'Without an index, PostgreSQL checks all 50,000 rows to find these 10.' }
        ],
        tryIt: 'Change 50000 to 200000 and run it. The table is bigger, and the search still works, but on a real server, reading every row gets slower as the table grows.',
        check: {
          question: 'What is a sequential scan?',
          options: ['Reading every row of the table to find the matching ones', 'Using an index to jump to the rows', 'Sorting the table'],
          answer: 0,
          why: 'A Seq Scan checks each row one by one. Indexes let PostgreSQL skip straight to the matching rows.'
        }
      },
      {
        title: 'EXPLAIN: seeing the plan',
        say: [
          'Before running a query, PostgreSQL makes a plan: which tables to read, in which order, and how. EXPLAIN in front of a query shows you that plan instead of running it.',
          'The plan is shown as a small tree of steps. The step you will look for most is the scan: Seq Scan means "read every row", Index Scan or Bitmap Index Scan means "use an index".',
          'By default, EXPLAIN also shows cost estimates, long numbers that depend on the machine. In the examples we use EXPLAIN (COSTS OFF) so the plan is short and stays the same every time.',
          'EXPLAIN ANALYZE actually runs the query and adds the real time taken. It is the tool for measuring on a real database, but its timings change every run, so it is not used in the lesson examples.',
          'Reading plans is a skill that grows with practice. For now, focus on one question: did PostgreSQL read the whole table, or did it use an index?',
          'Notice the Filter line under a Seq Scan. It tells you the condition PostgreSQL checked on every row. That is the work an index can save.'
        ],
        example: 'Before a long drive, a map app shows you the route it plans to take, before you start. EXPLAIN is that route preview for your query: you see the plan without actually making the trip.',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, total numeric(10,2));',
          'INSERT INTO orders SELECT n, n % 5000, (n % 900) + 10 FROM generate_series(1, 50000) AS n;',
          'ANALYZE orders;',
          'EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE customer_id = 42;',
          'EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE id = 42;'
        ),
        output: lines(
          ' QUERY PLAN',
          '------------------------------',
          ' Seq Scan on orders',
          '   Filter: (customer_id = 42)',
          '(2 rows)',
          '',
          ' QUERY PLAN',
          '----------------------------------------',
          ' Index Scan using orders_pkey on orders',
          '   Index Cond: (id = 42)',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'ANALYZE collects statistics so PostgreSQL can plan well.' },
          { line: 4, note: 'No index on customer_id: a Seq Scan with a Filter.' },
          { line: 5, note: 'The primary key has an index: an Index Scan.' }
        ],
        tryIt: 'Change the first EXPLAIN to search WHERE total > 900. It also reads every row, because there is no index on total.',
        check: {
          question: 'In an EXPLAIN plan, what does "Seq Scan on orders" tell you?',
          options: ['PostgreSQL will read every row of orders', 'An index on orders will be used', 'The query has an error'],
          answer: 0,
          why: 'Seq Scan means a full read of the table. Index Scan means an index is used.'
        }
      },
      {
        title: 'CREATE INDEX',
        say: [
          'You create an index with CREATE INDEX name ON table (column). A clear naming style is idx_table_column, like idx_orders_customer.',
          'After the index exists, PostgreSQL decides on its own when to use it. You do not change your queries at all. The same SELECT becomes faster because the plan changes.',
          'Creating an index on a large table takes some time, because PostgreSQL has to read and sort the whole column. On a busy live database, teams use CREATE INDEX CONCURRENTLY, which builds it without blocking other users.',
          'Foreign key columns, like customer_id in orders, are the most common columns to index. Joins and lookups use them constantly, and PostgreSQL does not index them automatically.',
          'Other good candidates are columns you often filter or sort by, like status, created_at or email. Look at your most common and slowest queries, and index the columns in their WHERE, JOIN and ORDER BY.',
          'After creating an index, run EXPLAIN again to confirm it is used. If it is not, the query or the data may not suit that index, which is the topic of part 5.'
        ],
        example: 'A library that adds an author index card cabinet does not change its books or how you ask for them. It simply lets the librarian find "all books by R. K. Narayan" without walking every shelf.',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, total numeric(10,2));',
          'INSERT INTO orders SELECT n, n % 5000, (n % 900) + 10 FROM generate_series(1, 50000) AS n;',
          'CREATE INDEX idx_orders_customer ON orders (customer_id);',
          'ANALYZE orders;',
          'EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE customer_id = 42;',
          'SELECT count(*) AS orders_of_customer_42 FROM orders WHERE customer_id = 42;'
        ),
        output: lines(
          ' QUERY PLAN',
          '------------------------------------------------',
          ' Bitmap Heap Scan on orders',
          '   Recheck Cond: (customer_id = 42)',
          '   ->  Bitmap Index Scan on idx_orders_customer',
          '         Index Cond: (customer_id = 42)',
          '(4 rows)',
          '',
          ' orders_of_customer_42',
          '-----------------------',
          '                    10',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Create the index on the column we search by.' },
          { line: 5, note: 'The plan now uses the index instead of reading every row.' },
          { line: 6, note: 'The query and its answer are exactly the same as before.' }
        ],
        tryIt: 'Add an index on total: CREATE INDEX idx_orders_total ON orders (total); and EXPLAIN a query WHERE total = 500.',
        check: {
          question: 'After creating an index, what do you need to change in your SELECT queries?',
          options: ['Nothing; PostgreSQL decides when to use the index', 'Add USE INDEX to every query', 'Rename the column'],
          answer: 0,
          why: 'Indexes are used automatically when the planner thinks they help. Queries stay the same.'
        }
      },
      {
        title: 'What indexes cost',
        say: [
          'If indexes make reading faster, why not index every column? Because indexes are not free.',
          'Each index takes disk space, sometimes as much as the table itself. And every INSERT, UPDATE and DELETE must update every index on the table too. A table with ten indexes makes every write do ten extra pieces of work.',
          'So indexes are a trade-off: faster reads, slower writes, more storage. A table that is read constantly, like products, can have several. A table that is written constantly, like a log of every click, should have few.',
          'Indexes also help less when a column has very few different values. An index on a boolean is_active column, where 99 percent of rows are true, rarely helps, because reading "all the true rows" is nearly the whole table anyway.',
          'Indexes that are never used are pure cost. PostgreSQL keeps statistics that show how often each index is used, and database teams regularly remove unused ones.',
          'A good rule for beginners: index primary keys (automatic), foreign keys, and the columns in your most frequent WHERE and ORDER BY. Then measure with EXPLAIN before adding more.'
        ],
        example: 'A book with an index for every single word would be twice as thick and take much longer to update in each new edition. A good index lists the important topics only. Database indexes are the same: useful ones help, too many slow everything down.',
        code: lines(
          'CREATE TABLE clicks (id int, page text, clicked_at timestamp);',
          "INSERT INTO clicks SELECT n, '/page/' || (n % 50), timestamp '2026-09-01' + n * interval '1 minute' FROM generate_series(1, 20000) AS n;",
          'CREATE INDEX idx_clicks_page ON clicks (page);',
          'CREATE INDEX idx_clicks_time ON clicks (clicked_at);',
          "SELECT relname AS name, CASE WHEN relkind = 'i' THEN 'index' ELSE 'table' END AS kind",
          'FROM pg_class',
          "WHERE relname IN ('clicks', 'idx_clicks_page', 'idx_clicks_time')",
          'ORDER BY kind DESC, name;'
        ),
        output: lines(
          ' name            | kind',
          '-----------------+-------',
          ' clicks          | table',
          ' idx_clicks_page | index',
          ' idx_clicks_time | index',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Each index is a separate structure that every INSERT must also update.' },
          { line: 5, note: 'pg_class lists tables and indexes: here, one table with two indexes to maintain.' }
        ],
        tryIt: 'Add a third index on id and run it again. Then think: for a table written to every second, is every index worth its cost?',
        check: {
          question: 'Why not add an index to every column?',
          options: ['Every index uses space and slows down every INSERT, UPDATE and DELETE', 'PostgreSQL allows only one index per table', 'Indexes make SELECT slower'],
          answer: 0,
          why: 'Indexes speed up reads but must be maintained on every write, so each one should earn its place.'
        }
      },
      {
        title: 'Indexes on several columns and on expressions',
        say: [
          'An index can cover several columns: CREATE INDEX ON orders (customer_id, ordered_on). It helps queries that filter by the customer and then by date, like "this customer\'s orders in September", and it can also return them already sorted by date.',
          'Column order matters in a multi-column index. It is sorted by the first column, then the second within it, like a phone book sorted by surname then first name. So it helps searches by customer_id alone, but not searches by ordered_on alone.',
          'An index can also be built on an expression. If your login query searches WHERE lower(email) = lower(\'Asha@X.com\'), a normal index on email does not help, because the query compares lower(email). An index on (lower(email)) does.',
          'A UNIQUE index on an expression enforces a rule too: CREATE UNIQUE INDEX ON users (lower(email)) makes sure nobody can register Asha@x.com and asha@x.com as two accounts.',
          'A common reason an index is not used is exactly this mismatch: the query wraps the column in a function, or compares it with a different type. When EXPLAIN shows a Seq Scan you did not expect, check that the WHERE looks exactly like the indexed column or expression.',
          'PostgreSQL has other index types too, like GIN for JSON and full-text search. You will meet GIN briefly on Day 25. The standard type, B-tree, is the right choice for most columns.'
        ],
        example: 'A phone book sorted by surname, then first name, is great for finding "Sharma, Priya". It is useless for finding everyone called Priya whatever their surname. The order of columns in an index works the same way.',
        code: lines(
          'CREATE TABLE users (id int PRIMARY KEY, email text);',
          "INSERT INTO users VALUES (1, 'Asha@Example.com');",
          'CREATE UNIQUE INDEX idx_users_email ON users (lower(email));',
          "SELECT id FROM users WHERE lower(email) = lower('asha@example.com');",
          "INSERT INTO users VALUES (2, 'ASHA@example.com');"
        ),
        output: lines(
          ' id',
          '----',
          '  1',
          '(1 row)',
          '',
          '[Error] duplicate key value violates unique constraint "idx_users_email"'
        ),
        codeNotes: [
          { line: 3, note: 'An index on an expression, and UNIQUE at the same time.' },
          { line: 4, note: 'The query uses the same expression, so the index can help.' },
          { line: 5, note: 'The same email in different capitals: refused.' }
        ],
        tryIt: "Change line 5 to a truly different email, like 'ravi@example.com', and run it again. This time it is accepted.",
        check: {
          question: 'An index on (customer_id, ordered_on) helps which search most?',
          options: ['A customer\'s orders in a date range', 'All orders on one date, for every customer', 'Orders sorted by total'],
          answer: 0,
          why: 'A multi-column index is sorted by the first column first, so it helps searches that start with customer_id.'
        }
      },
      {
        title: 'Putting it together: speeding up a slow report',
        say: [
          'Let us follow the real process of fixing a slow query. A report lists a customer\'s recent orders, newest first. The first step is always to look at the plan.',
          'EXPLAIN shows a Seq Scan on orders with a filter on customer_id, followed by a Sort. PostgreSQL reads every row, keeps a few, and sorts them.',
          'The fix is an index matching the query: (customer_id, ordered_on). The plan changes to an index scan, and the sort step can disappear, because the index already keeps each customer\'s orders in date order.',
          'Always measure before and after. On a real database, you would run EXPLAIN ANALYZE to see the actual time drop. And check that the index does not slow down important writes too much.',
          'In today\'s practice, you will create an index on orders(customer_id), and a unique index on lower(email) so two users cannot share an email in different capitals.',
          'Tomorrow you learn views: saving a query under a name, so complicated joins can be reused like a simple table.'
        ],
        example: 'A mechanic does not replace random parts when a car is slow. They connect a diagnostic tool, read what is wrong, fix that one part, and test drive again. EXPLAIN is the diagnostic tool; the index is the part.',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, ordered_on date);',
          "INSERT INTO orders SELECT n, n % 5000, date '2026-01-01' + (n % 270) FROM generate_series(1, 50000) AS n;",
          'ANALYZE orders;',
          'EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE customer_id = 42 ORDER BY ordered_on DESC LIMIT 5;',
          'CREATE INDEX idx_orders_customer_date ON orders (customer_id, ordered_on);',
          'EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE customer_id = 42 ORDER BY ordered_on DESC LIMIT 5;'
        ),
        output: lines(
          ' QUERY PLAN',
          '------------------------------------------',
          ' Limit',
          '   ->  Sort',
          '         Sort Key: ordered_on DESC',
          '         ->  Seq Scan on orders',
          '               Filter: (customer_id = 42)',
          '(5 rows)',
          '',
          ' QUERY PLAN',
          '--------------------------------------------------------------------',
          ' Limit',
          '   ->  Index Scan Backward using idx_orders_customer_date on orders',
          '         Index Cond: (customer_id = 42)',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Before: read every row, filter, then sort.' },
          { line: 5, note: 'An index that matches the WHERE and the ORDER BY.' },
          { line: 6, note: 'After: the index gives the rows already in order.' }
        ],
        tryIt: 'Change the index to be only on (ordered_on) and look at the second plan. It does not help this query as much, because the query starts with customer_id.',
        check: {
          question: 'What is the first step when a query is slow?',
          options: ['Look at its plan with EXPLAIN', 'Add indexes to every column', 'Rewrite it in another language'],
          answer: 0,
          why: 'The plan shows where the time goes, so you can fix the real cause, often with one matching index.'
        }
      }
    ],
    summary: [
      'Without an index, PostgreSQL reads every row (Seq Scan).',
      'An index is a sorted structure that lets PostgreSQL jump to matching rows.',
      'EXPLAIN shows the plan; look for Seq Scan versus Index Scan.',
      'Indexes speed up reads but cost space and slow down writes; index foreign keys and frequent filters.',
      'Multi-column indexes follow column order; expression indexes match WHERE lower(email) = ....'
    ],
    projectStep: {
      title: 'My Library: indexes for common searches',
      steps: [
        'List the 3 searches you run most on your books (for example by author or title).',
        'Create an index for each on the matching column.',
        'Add a unique index on lower(title) and author_id to stop duplicate titles in different capitals.',
        'Use EXPLAIN (COSTS OFF) on one search to see the plan.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 24,
    title: 'Saved Queries: Views',
    goal: 'You can save a query as a view, use views to simplify joins and hide columns, and refresh materialized views.',
    minutes: 28,
    recap: 'Yesterday you made queries faster with indexes and read query plans with EXPLAIN.',
    parts: [
      {
        title: 'What a view is',
        say: [
          'Some queries are used again and again: "each order with its customer\'s name and total". Writing the same joins every time is tiring and error-prone. A view saves a query under a name.',
          'You create one with CREATE VIEW name AS SELECT .... After that, you can SELECT FROM the view as if it were a table: filter it, sort it, join it, count it.',
          'A view does not store any data. Every time you query it, PostgreSQL runs the saved query on the current tables. So a view always shows fresh data, and it takes no extra space.',
          'Views make the database easier for everyone. A new developer or an analyst can use order_summaries without knowing how the four tables are joined. The complicated part is written once, by someone who understands it.',
          'Because views are just saved queries, PostgreSQL can often optimise a query on a view as well as if you had written the whole query yourself. There is usually no speed penalty.',
          'Views should have clear, descriptive names, often plural nouns like order_summaries or active_customers, so they read naturally in queries.',
          'You can list the views in a database from information_schema.views, and see a view\'s saved query with pg_get_viewdef. That is useful when you join a new team and want to know which ready-made reports already exist before writing your own.'
        ],
        example: 'A "saved search" on a shopping site, like "shoes under 2000 in my size", stores the search, not the shoes. Each time you open it, it shows the shoes available right now. A view is a saved search for your database.',
        code: lines(
          MINI_SHOP,
          'CREATE VIEW order_summaries AS',
          'SELECT o.id AS order_id, c.name AS customer, o.status, sum(p.price * oi.quantity) AS total',
          'FROM orders o',
          'JOIN customers c ON c.id = o.customer_id',
          'JOIN order_items oi ON oi.order_id = o.id',
          'JOIN products p ON p.id = oi.product_id',
          'GROUP BY o.id, c.name, o.status;',
          'SELECT * FROM order_summaries ORDER BY order_id;',
          "SELECT customer, total FROM order_summaries WHERE status = 'delivered' ORDER BY total DESC;"
        ),
        output: lines(
          ' order_id | customer | status    | total',
          '----------+----------+-----------+---------',
          '      101 | Asha     | delivered |  280.00',
          '      102 | Ravi     | delivered | 1200.00',
          '      103 | Asha     | shipped   |   50.00',
          '      104 | Priya    | pending   |   60.00',
          '(4 rows)',
          '',
          ' customer | total',
          '----------+---------',
          ' Ravi     | 1200.00',
          ' Asha     |  280.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Save the query under the name order_summaries.' },
          { line: 16, note: 'Use the view like a table.' },
          { line: 17, note: 'Filter and sort it like any table; the joins are hidden inside.' }
        ],
        tryIt: 'Add a query: SELECT customer, sum(total) AS spent FROM order_summaries GROUP BY customer ORDER BY spent DESC;',
        check: {
          question: 'Does a view store a copy of the data?',
          options: ['No, it runs its saved query each time, so it always shows current data', 'Yes, it copies the data once', 'Only for the first row'],
          answer: 0,
          why: 'A normal view is just a stored query. The data stays in the underlying tables.'
        }
      },
      {
        title: 'Views always show current data',
        say: [
          'Because a view runs its query every time, changes to the tables appear in the view immediately. There is nothing to refresh or update.',
          'If a new order is inserted, the next SELECT from order_summaries includes it. If a price changes, every total in the view reflects it. The view is always exactly as correct as the tables.',
          'This makes views ideal for reports that must be up to date, like "orders waiting to be shipped" for a warehouse screen.',
          'The flip side is that a view on a large, complex query does all its work every time it is used. If thousands of people open a dashboard built on a heavy view, the database repeats that heavy work thousands of times. Part 5 shows the solution: materialized views.',
          'You can change a view\'s query with CREATE OR REPLACE VIEW, as long as you only add columns at the end and keep the existing ones the same. To make bigger changes, drop it and create it again.',
          'Dropping a view never deletes table data, because the view never held any. DROP VIEW simply forgets the saved query.'
        ],
        example: 'A live cricket scoreboard on a website does not store the score; it shows the current score every time you look. Refresh the page after a boundary, and the new score is there. A view is a live scoreboard for your data.',
        code: lines(
          'CREATE TABLE tasks (id serial PRIMARY KEY, title text, done boolean DEFAULT false);',
          "INSERT INTO tasks (title) VALUES ('Pack orders'), ('Call supplier');",
          'CREATE VIEW open_tasks AS SELECT id, title FROM tasks WHERE NOT done;',
          'SELECT count(*) AS open_before FROM open_tasks;',
          "INSERT INTO tasks (title) VALUES ('Update prices');",
          'UPDATE tasks SET done = true WHERE id = 1;',
          'SELECT * FROM open_tasks ORDER BY id;'
        ),
        output: lines(
          ' open_before',
          '-------------',
          '           2',
          '(1 row)',
          '',
          ' id | title',
          '----+---------------',
          '  2 | Call supplier',
          '  3 | Update prices',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'A view of the tasks that are not done yet.' },
          { line: 5, note: 'Change the table: one new task, one finished.' },
          { line: 7, note: 'The view shows the changes immediately.' }
        ],
        tryIt: 'Add CREATE OR REPLACE VIEW open_tasks AS SELECT id, title, done FROM tasks WHERE NOT done; before the last SELECT. The new column appears at the end.',
        check: {
          question: 'A row is added to a table after a view was created. Does the view show it?',
          options: ['Yes, immediately, because the view runs its query each time', 'Only after the view is recreated', 'Never'],
          answer: 0,
          why: 'Normal views have no stored data; every query on them reads the current tables.'
        }
      },
      {
        title: 'Views for simplicity and safety',
        say: [
          'Views are also a way to control what people see. A customers table might contain phone numbers and addresses. A view with only the name and city can be shared with an analytics team without exposing private details.',
          'With PostgreSQL permissions, which you will meet on Day 29, you can let a user read a view but not the table underneath. That way, the private columns are protected by the database itself.',
          'Views can also hide messy details. A column called cust_nm_v2 can appear in a view as customer_name. A status code can be translated into words with CASE. The view becomes a clean, friendly interface to the data.',
          'Some teams build a whole reporting layer out of views: raw tables at the bottom, and views on top that give each team exactly the data they need, in the shape they need.',
          'Simple views, from one table without GROUP BY, can even be updated: an UPDATE on the view changes the table underneath. For views with joins or aggregates, updates are not allowed, which is usually what you want for reports.',
          'A good test for a view: can someone use it correctly without ever looking at its definition? If yes, the view is doing its job.',
          'Comments help too. COMMENT ON VIEW customer_directory IS \'Public customer list without phone numbers\' stores a short description inside the database, where tools and teammates can read it.'
        ],
        example: 'A school notice board shows students\' names and exam rooms, but not their home addresses or parents\' phone numbers. The office has all the details; the notice board is a view with only what everyone needs to see.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text, phone text, city text, status char(1));',
          "INSERT INTO customers VALUES (1, 'Asha', '98765 11111', 'Pune', 'a'), (2, 'Ravi', '91234 22222', 'Mumbai', 'i');",
          'CREATE VIEW customer_directory AS',
          "SELECT name, city, CASE status WHEN 'a' THEN 'active' ELSE 'inactive' END AS status",
          'FROM customers;',
          'SELECT * FROM customer_directory ORDER BY name;'
        ),
        output: lines(
          ' name | city   | status',
          '------+--------+----------',
          ' Asha | Pune   | active',
          ' Ravi | Mumbai | inactive',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'No phone column, and the status code is translated into words.' },
          { line: 6, note: 'Anyone using the view sees only what they need.' }
        ],
        tryIt: 'Try SELECT phone FROM customer_directory; and read the error: the view has no phone column.',
        check: {
          question: 'How can a view protect private data?',
          options: ['It can leave out private columns, and users can be allowed to read only the view', 'It encrypts the table', 'It deletes private columns from the table'],
          answer: 0,
          why: 'A view shows only the columns you choose. With permissions, users can read the view without reading the table.'
        }
      },
      {
        title: 'Building on views',
        say: [
          'A view can use other views. You might have a view of delivered order totals, and another view that uses it to calculate each customer\'s lifetime value.',
          'This lets you build reports in layers, like WITH steps, but saved permanently and shared by everyone. Each layer is small and easy to understand.',
          'Be careful not to stack too many layers. When something is wrong in a view five levels deep, it can be hard to find. Two or three layers are usually plenty.',
          'PostgreSQL remembers which views depend on which tables and views. If you try to drop a table that a view uses, it refuses, and tells you which view depends on it. DROP ... CASCADE would drop the views too, which is rarely what you want.',
          'This protection is useful: it stops someone changing a table and silently breaking every report built on it.',
          'When you need to change a table that views depend on, the usual process is to change the views and the table together, in one migration script, inside a transaction.'
        ],
        example: 'A company\'s monthly report is built from a team\'s weekly reports, which are built from daily logs. Each level uses the one below. If someone tried to throw away the daily logs, everyone would shout, because the reports depend on them.',
        code: lines(
          MINI_SHOP,
          'CREATE VIEW delivered_totals AS',
          'SELECT o.customer_id, sum(p.price * oi.quantity) AS total',
          'FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id',
          "WHERE o.status = 'delivered'",
          'GROUP BY o.id, o.customer_id;',
          'CREATE VIEW customer_value AS',
          'SELECT c.name, coalesce(sum(d.total), 0) AS lifetime_value',
          'FROM customers c LEFT JOIN delivered_totals d ON d.customer_id = c.id',
          'GROUP BY c.id, c.name;',
          'SELECT * FROM customer_value ORDER BY lifetime_value DESC, name;',
          'DROP VIEW delivered_totals;'
        ),
        output: lines(
          ' name  | lifetime_value',
          '-------+----------------',
          ' Ravi  |        1200.00',
          ' Asha  |         280.00',
          ' Meera |              0',
          ' Priya |              0',
          '(4 rows)',
          '',
          '[Error] cannot drop view delivered_totals because other objects depend on it'
        ),
        codeNotes: [
          { line: 9, note: 'Layer 1: each delivered order\'s total.' },
          { line: 14, note: 'Layer 2 uses layer 1: each customer\'s lifetime value.' },
          { line: 19, note: 'Dropping layer 1 is refused, because layer 2 depends on it.' }
        ],
        tryIt: 'Change the last line to DROP VIEW customer_value; and run it. The top layer can be dropped, because nothing depends on it.',
        check: {
          question: 'Why does PostgreSQL refuse to drop a view that another view uses?',
          options: ['To stop reports that depend on it from silently breaking', 'Because views can never be dropped', 'Because the view holds data'],
          answer: 0,
          why: 'PostgreSQL tracks dependencies and protects them. You must drop or change the dependent view first.'
        }
      },
      {
        title: 'Materialized views: saved results you refresh',
        say: [
          'A normal view reruns its query every time. For a heavy report that is used often, that repeats a lot of work. A materialized view stores the result of the query, like a table, so reading it is fast.',
          'You create one with CREATE MATERIALIZED VIEW name AS SELECT .... PostgreSQL runs the query once and saves the rows.',
          'The catch: the saved rows do not change when the tables change. The materialized view shows the data as it was when it was last filled. To update it, you run REFRESH MATERIALIZED VIEW name, which reruns the query and replaces the saved rows.',
          'Teams usually refresh on a schedule, like every hour or every night, depending on how fresh the numbers need to be. A dashboard of yesterday\'s sales can refresh once a night; a stock screen probably cannot use a materialized view at all.',
          'Unlike normal views, materialized views can have their own indexes, which makes them even faster to query.',
          'Choosing between them is a trade-off between freshness and speed: a normal view is always fresh but does the work every time; a materialized view is fast but only as fresh as the last refresh.'
        ],
        example: 'A printed monthly bank statement is a materialized view: quick to read, but it does not show today\'s transactions until the next statement is printed. The live banking app is a normal view: always current, but it does the work every time you open it.',
        code: lines(
          'CREATE TABLE sales (day date, amount numeric(10,2));',
          "INSERT INTO sales VALUES ('2026-09-01', 280), ('2026-09-02', 1200);",
          'CREATE MATERIALIZED VIEW sales_summary AS SELECT count(*) AS days, sum(amount) AS total FROM sales;',
          "INSERT INTO sales VALUES ('2026-09-03', 2097);",
          'SELECT * FROM sales_summary;',
          'REFRESH MATERIALIZED VIEW sales_summary;',
          'SELECT * FROM sales_summary;'
        ),
        output: lines(
          ' days | total',
          '------+---------',
          '    2 | 1480.00',
          '(1 row)',
          '',
          ' days | total',
          '------+---------',
          '    3 | 3577.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'The result is calculated now and stored.' },
          { line: 5, note: 'The new sale is not included yet: the stored result is old.' },
          { line: 6, note: 'REFRESH reruns the query and stores the new result.' }
        ],
        tryIt: 'Change CREATE MATERIALIZED VIEW to CREATE VIEW and remove the REFRESH line. The first SELECT now already includes the third day.',
        check: {
          question: 'What is the main difference between a view and a materialized view?',
          options: ['A materialized view stores its result and must be refreshed; a view always reruns its query', 'A view is faster in every case', 'A materialized view cannot be queried'],
          answer: 0,
          why: 'Materialized views trade freshness for speed: fast to read, but only updated on REFRESH.'
        }
      },
      {
        title: 'Putting it together: a reporting view for the shop',
        say: [
          'Let us give the shop manager a simple interface for their most common questions: a view with one row per customer, showing their order count and spending, including customers with no orders.',
          'Everything you learned in week 2 goes inside the view: LEFT JOIN, count of the right table\'s id, coalesce for zero totals. The manager only needs to write SELECT * FROM customer_order_counts.',
          'Then, a price list view shows each product with its price including GST. Anyone in the shop can use it without knowing the tax rate or rounding rules.',
          'In today\'s practice, you will create a price-list view with GST, and a view of each customer\'s order count that includes customers with no orders.',
          'Tomorrow you learn how PostgreSQL stores and queries JSON, for data that does not fit neatly into columns, like app events and settings.',
          'Views are small to write but have a big effect on a team. Every good view is one less complicated query that someone else has to get right.'
        ],
        example: 'A shop manager\'s favourite report is saved as a single button in their app. Behind the button is a view that joins four tables, but the manager only ever sees a clean list.',
        code: lines(
          MINI_SHOP,
          'CREATE VIEW customer_order_counts AS',
          'SELECT c.name, count(o.id) AS order_count',
          'FROM customers c LEFT JOIN orders o ON o.customer_id = c.id',
          'GROUP BY c.id, c.name;',
          'CREATE VIEW price_list AS',
          'SELECT name, price, round(price * 1.18, 2) AS price_with_gst FROM products;',
          'SELECT * FROM customer_order_counts ORDER BY order_count DESC, name;',
          'SELECT * FROM price_list ORDER BY price;'
        ),
        output: lines(
          ' name  | order_count',
          '-------+-------------',
          ' Asha  |           2',
          ' Priya |           1',
          ' Ravi  |           1',
          ' Meera |           0',
          '(4 rows)',
          '',
          ' name     | price   | price_with_gst',
          '----------+---------+----------------',
          ' Pen      |   10.00 |          11.80',
          ' Notebook |   60.00 |          70.80',
          ' Stapler  |  150.00 |         177.00',
          ' Backpack | 1200.00 |        1416.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'count(o.id) with LEFT JOIN, so Meera shows 0.' },
          { line: 14, note: 'The GST rule lives in one place.' }
        ],
        tryIt: 'Add a new customer to the setup and run it. They appear in customer_order_counts with 0 orders, without changing the view.',
        check: {
          question: 'Why put the GST calculation in a view?',
          options: ['The rule is written once, and everyone who uses the view gets it right', 'Views calculate faster than SELECT', 'GST can only be calculated in views'],
          answer: 0,
          why: 'A view keeps shared logic in one place, so every report uses the same rule.'
        }
      }
    ],
    summary: [
      'CREATE VIEW name AS SELECT ... saves a query; use it like a table.',
      'Normal views store no data and always show the current tables.',
      'Views hide complex joins and private columns, and rename messy columns.',
      'Views can build on views; PostgreSQL protects these dependencies.',
      'Materialized views store results for speed and need REFRESH MATERIALIZED VIEW.'
    ],
    projectStep: {
      title: 'My Library: handy views',
      steps: [
        'Create a view books_with_authors that joins books to authors.',
        'Create a view unfinished_books with title, author and pages.',
        'Create a view author_stats with each author\'s book count and total pages.',
        'Use your views in two queries, as if they were tables.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 25,
    title: 'JSON Data in PostgreSQL',
    goal: 'You can store JSON in a jsonb column, read values with -> and ->>, filter and group by them, and decide when JSON is the right choice.',
    minutes: 28,
    recap: 'Yesterday you saved queries as views and learned materialized views for faster reports.',
    parts: [
      {
        title: 'Why store JSON in a database',
        say: [
          'Most data fits neatly into columns: a product has a name, a price and a stock. But some data is flexible: app events where each type of event has different details, user settings that change between versions, or answers from an outside API.',
          'JSON, which you may know from Python or JavaScript, is a text format for this kind of data: objects in curly brackets with named keys, arrays in square brackets. PostgreSQL can store JSON in a column and still query inside it.',
          'PostgreSQL has two JSON types. json stores the text exactly as given. jsonb stores it in a processed binary form that is faster to search and supports indexes. In almost every case, use jsonb.',
          'jsonb checks that the value is valid JSON when you insert it, and it tidies the storage: it removes extra spaces, keeps only the last copy of a duplicate key, and may store keys in a different order. The data means the same, but may print differently.',
          'This flexibility is useful, but it has a cost. Inside a JSON value, PostgreSQL cannot enforce types, NOT NULL or foreign keys the way it can for real columns. So JSON is a tool for truly flexible data, not a way to avoid designing tables.',
          'Many real systems use both: normal columns for the important, fixed facts, and one jsonb column for the extra details that vary.'
        ],
        example: 'A hospital form has fixed boxes for name, age and date, and a big free-notes box where the doctor writes whatever matters for this patient. The fixed boxes are columns; the notes box is a jsonb column, flexible but less structured.',
        code: lines(
          'CREATE TABLE events (id serial PRIMARY KEY, happened_at date NOT NULL, data jsonb NOT NULL);',
          'INSERT INTO events (happened_at, data) VALUES',
          '  (\'2026-09-01\', \'{"type": "click", "page": "/home"}\'),',
          '  (\'2026-09-01\', \'{"type": "purchase", "amount": 499, "items": ["Pen", "Notebook"]}\'),',
          '  (\'2026-09-02\', \'{"type": "click", "page": "/cart"}\');',
          'SELECT id, data FROM events ORDER BY id;'
        ),
        output: lines(
          ' id | data',
          '----+-------------------------------------------------------------------',
          '  1 | {"page": "/home", "type": "click"}',
          '  2 | {"type": "purchase", "items": ["Pen", "Notebook"], "amount": 499}',
          '  3 | {"page": "/cart", "type": "click"}',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 1, note: 'Fixed facts as columns; flexible details in one jsonb column.' },
          { line: 4, note: 'Different events have different keys, which JSON allows.' },
          { line: 6, note: 'jsonb may print keys in a different order than they were written.' }
        ],
        tryIt: "Try inserting invalid JSON, like '{type: click}' without quotes around the key, and read the error.",
        check: {
          question: 'Which JSON type should you usually choose in PostgreSQL?',
          options: ['jsonb', 'json', 'text'],
          answer: 0,
          why: 'jsonb is faster to search, supports indexes and validates the value. json only keeps the text as written.'
        }
      },
      {
        title: 'Reading values: -> and ->>',
        say: [
          'To read a key from a jsonb value, PostgreSQL has two arrows. data -> \'page\' returns the value as JSON. data ->> \'page\' returns it as plain text.',
          'The difference matters. With ->, a text value comes back with its double quotes, as JSON. With ->>, you get the text itself, ready to compare with = or show in a report. For most everyday use, ->> is what you want.',
          'For numbers, ->> gives text, so to do maths, cast it: (data ->> \'amount\')::numeric. Then you can sum it, average it or compare it with >.',
          'Chained arrows reach inside nested objects: data -> \'customer\' ->> \'city\' first gets the customer object, then the city inside it as text. For arrays, use a position number: data -> \'items\' ->> 0 is the first item.',
          'If a key does not exist, the arrow returns NULL, not an error. That is convenient for flexible data, but remember to handle NULL, for example with coalesce.',
          'Keys are case-sensitive: \'Page\' and \'page\' are different keys. Consistent naming in your JSON, usually small letters with underscores, avoids confusion.',
          'When JSON comes from an outside API, look at a few real examples before writing queries, because keys are sometimes missing, renamed, or nested differently than the documentation says.'
        ],
        example: 'A parcel label has sections: "To" with a name and address inside. data -> \'to\' ->> \'city\' is like reading the To section, and inside it, the city line. The single arrow opens a section; the double arrow reads the words.',
        code: lines(
          "SELECT '{\"page\": \"/home\"}'::jsonb -> 'page' AS as_json, '{\"page\": \"/home\"}'::jsonb ->> 'page' AS as_text;",
          'CREATE TABLE orders (id int, details jsonb);',
          'INSERT INTO orders VALUES',
          '  (1, \'{"amount": 499, "customer": {"name": "Asha", "city": "Pune"}, "items": ["Pen", "Notebook"]}\'),',
          '  (2, \'{"amount": 1200, "customer": {"name": "Ravi", "city": "Mumbai"}, "items": ["Backpack"]}\');',
          "SELECT id, details -> 'customer' ->> 'city' AS city, details -> 'items' ->> 0 AS first_item,",
          "       (details ->> 'amount')::numeric * 1.18 AS amount_with_gst, details ->> 'coupon' AS coupon",
          'FROM orders ORDER BY id;'
        ),
        output: lines(
          ' as_json | as_text',
          '---------+---------',
          ' "/home" | /home',
          '(1 row)',
          '',
          ' id | city   | first_item | amount_with_gst | coupon',
          '----+--------+------------+-----------------+--------',
          '  1 | Pune   | Pen        |          588.82 | NULL',
          '  2 | Mumbai | Backpack   |         1416.00 | NULL',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 1, note: '-> keeps the JSON quotes; ->> gives plain text.' },
          { line: 6, note: 'Two steps into a nested object, and the first array item.' },
          { line: 7, note: 'Cast to numeric for maths. A missing key gives NULL.' }
        ],
        tryIt: "Add details -> 'items' ->> 1 AS second_item to the SELECT. Ravi's order has only one item, so his is NULL.",
        check: {
          question: "What does data ->> 'city' return?",
          options: ['The city as plain text', 'The city as JSON, with quotes', 'An error if city is missing'],
          answer: 0,
          why: '->> returns text. -> returns JSON. A missing key returns NULL, not an error.'
        }
      },
      {
        title: 'Filtering and grouping by JSON values',
        say: [
          'Once you can read values, you can use them anywhere: WHERE data ->> \'type\' = \'click\' keeps click events, and GROUP BY data ->> \'type\' counts events of each type.',
          'This is how product teams analyse app usage. Every tap, page view and purchase is stored as a JSON event, and SQL turns millions of them into reports: most visited pages, sign-ups per day, purchases per campaign.',
          'PostgreSQL also has a "contains" operator, @>. data @> \'{"type": "click"}\' is true when the JSON contains that key and value. It is neat for checking several keys at once, and it can use a special index.',
          'The ? operator checks whether a key exists: data ? \'coupon\' finds events that have a coupon key, whatever its value.',
          'When you filter by a JSON value very often on a large table, create an index. A GIN index on the whole column, CREATE INDEX ON events USING gin (data), speeds up @> and ? searches. An index on an expression, like ((data ->> \'type\')), speeds up = searches on one key.',
          'If you find yourself filtering by the same JSON key in almost every query, that is a hint it might deserve to be a real column instead.'
        ],
        example: 'A shop keeps every receipt in a big box of slips with different details. To find all receipts that used a coupon, you check each slip for a coupon line. With JSON in PostgreSQL, the database checks all the slips for you, and an index makes it quick.',
        code: lines(
          'CREATE TABLE events (id int, data jsonb);',
          'INSERT INTO events VALUES',
          '  (1, \'{"type": "click", "page": "/home"}\'), (2, \'{"type": "view", "page": "/cart"}\'),',
          '  (3, \'{"type": "click", "page": "/cart"}\'), (4, \'{"type": "purchase", "amount": 499, "coupon": "DIWALI"}\'),',
          '  (5, \'{"type": "click", "page": "/home"}\');',
          "SELECT data ->> 'type' AS type, count(*) AS events FROM events GROUP BY 1 ORDER BY events DESC, type;",
          "SELECT data ->> 'page' AS page, count(*) AS clicks FROM events WHERE data @> '{\"type\": \"click\"}' GROUP BY 1 ORDER BY clicks DESC;",
          "SELECT id FROM events WHERE data ? 'coupon';"
        ),
        output: lines(
          ' type     | events',
          '----------+--------',
          ' click    |      3',
          ' purchase |      1',
          ' view     |      1',
          '(3 rows)',
          '',
          ' page  | clicks',
          '-------+--------',
          ' /home |      2',
          ' /cart |      1',
          '(2 rows)',
          '',
          ' id',
          '----',
          '  4',
          '(1 row)'
        ),
        codeNotes: [
          { line: 6, note: 'Count events per type. GROUP BY 1 means the first column.' },
          { line: 7, note: '@> checks that the JSON contains type: click.' },
          { line: 8, note: '? checks that a key exists.' }
        ],
        tryIt: "Change the page report to count views instead of clicks: '{\"type\": \"view\"}'.",
        check: {
          question: "What does data @> '{\"type\": \"click\"}' check?",
          options: ['That the JSON contains the key type with the value click', 'That the JSON is exactly that object', 'That the key type exists'],
          answer: 0,
          why: '@> means "contains": the value may have other keys too. ? only checks that a key exists.'
        }
      },
      {
        title: 'Building and changing JSON',
        say: [
          'PostgreSQL can also build JSON from normal columns. jsonb_build_object(\'name\', name, \'city\', city) makes an object from a row. jsonb_agg collects many rows into a JSON array.',
          'This is very useful for APIs. A backend can ask PostgreSQL for data already shaped as the JSON the app needs, instead of building it in code. On Day 26, you will see how apps read query results.',
          'To change a value inside a jsonb column, use jsonb_set: UPDATE settings SET data = jsonb_set(data, \'{theme}\', \'"dark"\'). The path is written in curly brackets, and the new value must be valid JSON, which is why text needs its double quotes.',
          'The || operator merges two objects: data || \'{"language": "hi"}\' adds or replaces the language key. The - operator removes a key: data - \'coupon\'.',
          'These tools make jsonb columns practical for things like user preferences, feature flags and form answers, where the set of keys changes over time.',
          'As always, keep the important, fixed facts in normal columns. Use JSON for the parts that really are flexible.'
        ],
        example: 'A mobile app\'s settings screen has toggles that change between versions: dark mode, language, notifications. Storing all settings as one JSON object means a new toggle needs no new column; the app just adds a key.',
        code: lines(
          'CREATE TABLE users (id int PRIMARY KEY, name text, settings jsonb DEFAULT \'{}\');',
          'INSERT INTO users VALUES (1, \'Asha\', \'{"theme": "light", "notifications": true}\'), (2, \'Ravi\', \'{}\');',
          "UPDATE users SET settings = jsonb_set(settings, '{theme}', '\"dark\"') WHERE id = 1;",
          "UPDATE users SET settings = settings || '{\"language\": \"hi\"}' WHERE id = 2;",
          'SELECT id, settings FROM users ORDER BY id;',
          "SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name) ORDER BY id) AS api_response FROM users;"
        ),
        output: lines(
          ' id | settings',
          '----+------------------------------------------',
          '  1 | {"theme": "dark", "notifications": true}',
          '  2 | {"language": "hi"}',
          '(2 rows)',
          '',
          ' api_response',
          '--------------------------------------------------------',
          ' [{"id": 1, "name": "Asha"}, {"id": 2, "name": "Ravi"}]',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Change one key; text values need JSON double quotes.' },
          { line: 4, note: '|| merges in a new key.' },
          { line: 6, note: 'Build a JSON array of objects, ready for an API.' }
        ],
        tryIt: "Remove the notifications key from Asha's settings with UPDATE users SET settings = settings - 'notifications' WHERE id = 1; before the SELECT.",
        check: {
          question: 'What does jsonb_agg do?',
          options: ['Collects values from many rows into one JSON array', 'Counts JSON keys', 'Checks that JSON is valid'],
          answer: 0,
          why: 'jsonb_agg is an aggregate: it combines many rows into a single JSON array, useful for API responses.'
        }
      },
      {
        title: 'Columns or JSON: choosing well',
        say: [
          'JSON columns are tempting, because they never need an ALTER TABLE. But used everywhere, they bring back the problems normalization solves, and add new ones.',
          'Inside JSON, there are no types: an amount can be the number 499 in one row and the text "499" in another. There are no NOT NULL rules, no CHECK rules, no foreign keys. Mistakes that a column would refuse slip straight in.',
          'Queries also get longer and harder to read: (data ->> \'amount\')::numeric instead of simply amount. And the database has less information to plan fast queries.',
          'A good rule: if every row has the key, you filter or join by it often, or it must follow rules, make it a column. If the keys vary between rows, are optional, or come from outside and change often, JSON is a good fit.',
          'You can move a JSON key into a proper column later with ALTER TABLE ADD COLUMN and an UPDATE that copies the value out. Many teams start with JSON for a new feature and promote the stable keys to columns once they are sure.',
          'In interviews, a balanced answer is best: "I use normal columns for structured, important data, and jsonb for flexible or external data, with indexes where needed."'
        ],
        example: 'A clothes shop has fixed labels on every item: size, price, colour. Special notes, like "limited edition" or "handwash only", vary from item to item, so they go on a separate tag. Fixed labels are columns; the variable tag is JSON.',
        code: lines(
          'CREATE TABLE orders (id int, details jsonb);',
          'INSERT INTO orders VALUES (1, \'{"amount": 499}\'), (2, \'{"amount": "1200"}\'), (3, \'{"amount": -50}\');',
          "SELECT id, jsonb_typeof(details -> 'amount') AS stored_as FROM orders ORDER BY id;",
          'ALTER TABLE orders ADD COLUMN amount numeric(10,2);',
          "UPDATE orders SET amount = (details ->> 'amount')::numeric;",
          'ALTER TABLE orders ADD CONSTRAINT amount_positive CHECK (amount > 0);'
        ),
        output: lines(
          ' id | stored_as',
          '----+-----------',
          '  1 | number',
          '  2 | string',
          '  3 | number',
          '(3 rows)',
          '',
          '[Error] check constraint "amount_positive" of relation "orders" is violated by some row'
        ),
        codeNotes: [
          { line: 3, note: 'One amount is a number, one is text: JSON did not stop it.' },
          { line: 5, note: 'Promote the key to a real numeric column.' },
          { line: 6, note: 'Now a rule can be added, and it finds the bad -50 order.' }
        ],
        tryIt: 'Add UPDATE orders SET amount = 50 WHERE id = 3; before the ALTER on the last line. Now the rule is accepted.',
        check: {
          question: 'When is a jsonb column a good choice?',
          options: ['For flexible data whose keys vary between rows', 'For every column, to avoid ALTER TABLE', 'For ids used in joins'],
          answer: 0,
          why: 'JSON suits varying, optional or external data. Important fixed facts belong in typed columns with rules.'
        }
      },
      {
        title: 'Putting it together: analysing app events',
        say: [
          'Let us analyse a small app\'s event log the way a product team would. Each event has a date and a jsonb data column with a type and details.',
          'The report answers three questions: how many events of each type, which pages were clicked most, and how much money purchases brought in. Each question is a short query with ->>, @> or a cast.',
          'Notice that purchase amounts are cast to numeric before summing. Keeping amounts as JSON numbers, not text, makes that cast reliable.',
          'In today\'s practice, you will list the pages of click events as text, and count events per type.',
          'Tomorrow you learn how apps written in Python and Node.js talk to PostgreSQL, and the most important security rule in databases: never glue user input into SQL.',
          'With JSON, you now have a complete toolbox: structured tables for the core data, and flexible JSON where it truly helps.'
        ],
        example: 'A mobile app team meets every Monday to look at last week\'s numbers: which screens people used, where they dropped off, how many paid. All of it comes from a table of JSON events and a handful of SQL queries like these.',
        code: lines(
          'CREATE TABLE events (id int, day date, data jsonb);',
          'INSERT INTO events VALUES',
          '  (1, \'2026-09-01\', \'{"type": "click", "page": "/home"}\'), (2, \'2026-09-01\', \'{"type": "click", "page": "/cart"}\'),',
          '  (3, \'2026-09-01\', \'{"type": "purchase", "amount": 499}\'), (4, \'2026-09-02\', \'{"type": "click", "page": "/home"}\'),',
          '  (5, \'2026-09-02\', \'{"type": "purchase", "amount": 1200}\'), (6, \'2026-09-02\', \'{"type": "view", "page": "/home"}\');',
          "SELECT data ->> 'type' AS type, count(*) AS events FROM events GROUP BY 1 ORDER BY events DESC, type;",
          "SELECT data ->> 'page' AS page, count(*) AS clicks FROM events WHERE data ->> 'type' = 'click' GROUP BY 1 ORDER BY clicks DESC;",
          "SELECT day, sum((data ->> 'amount')::numeric) AS revenue FROM events WHERE data @> '{\"type\": \"purchase\"}' GROUP BY day ORDER BY day;"
        ),
        output: lines(
          ' type     | events',
          '----------+--------',
          ' click    |      3',
          ' purchase |      2',
          ' view     |      1',
          '(3 rows)',
          '',
          ' page  | clicks',
          '-------+--------',
          ' /home |      2',
          ' /cart |      1',
          '(2 rows)',
          '',
          ' day        | revenue',
          '------------+---------',
          ' 2026-09-01 |     499',
          ' 2026-09-02 |    1200',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 6, note: 'Events per type.' },
          { line: 7, note: 'Most clicked pages.' },
          { line: 8, note: 'Revenue per day from purchase events, with the amount cast to numeric.' }
        ],
        tryIt: 'Add a purchase on 2026-09-02 for 300 and run it. The revenue for that day becomes 1500.',
        check: {
          question: 'Why cast (data ->> \'amount\')::numeric before sum?',
          options: ['->> returns text, and sum needs numbers', 'JSON numbers cannot be read', 'To round the result'],
          answer: 0,
          why: '->> always gives text. Casting to numeric turns it into a number that sum can add.'
        }
      }
    ],
    summary: [
      'jsonb stores flexible JSON data that PostgreSQL can search and index.',
      "-> returns JSON, ->> returns text; chain arrows for nested keys; missing keys give NULL.",
      'Filter and group by JSON values; @> checks "contains", ? checks a key exists.',
      'jsonb_build_object and jsonb_agg build JSON; jsonb_set, || and - change it.',
      'Use columns for fixed, important facts; JSON for truly flexible data.'
    ],
    projectStep: {
      title: 'My Library: flexible book details',
      steps: [
        'Add an extras jsonb column to books, with a default of an empty object.',
        'Store different details for different books, like {"translator": "..."} or {"awards": ["..."]}.',
        'List books that have a translator, using ? or ->>.',
        'Decide which extra key, if any, should become a real column, and explain why.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 26,
    title: 'Using a Database from Python and Node.js',
    goal: 'You can explain how apps connect to PostgreSQL, write safe parameterised queries, and recognise and prevent SQL injection.',
    minutes: 28,
    recap: 'Yesterday you stored flexible JSON in jsonb columns and queried inside it.',
    parts: [
      {
        title: 'How an app talks to a database',
        say: [
          'So far you have typed SQL yourself. In a real product, most SQL is sent by an app: a website\'s backend, a mobile app\'s server, a data script. Today you see how that works, and the one security rule every developer must know.',
          'The app uses a driver, a library that knows how to talk to PostgreSQL. In Python the most common one is psycopg. In Node.js it is pg. The driver opens a connection to the database, sends SQL, and receives the rows back as Python or JavaScript values.',
          'To connect, the app needs a connection string: the database\'s address, port, name, and a username and password. That password is a secret. It belongs in an environment variable, never written in the code and never pushed to GitHub.',
          'Once connected, the flow is always the same: send a query, get rows back, use them. The rows arrive as lists or objects: a list of tuples in Python, an array of objects in Node.js. Everything you learned about SELECT, joins and views works exactly the same; the app is just another way of sending it.',
          'Opening a connection takes time, so real apps keep a small set of open connections and reuse them, called a connection pool. Both psycopg and pg have pools built in.',
          'The lesson editor can only run SQL, so the Python and Node.js code today is shown in read-only boxes, for you to run on your laptop. The SQL examples show what the database sees.'
        ],
        example: 'A restaurant waiter is like a database driver. The customer (your app) tells the waiter the order, the waiter carries it to the kitchen (the database) in the kitchen\'s own language, and brings the food (the rows) back to the table.',
        projectCode: {
          label: 'Python (psycopg) on your laptop: pip install "psycopg[binary]"',
          code: lines(
            'import os',
            'import psycopg',
            '',
            '# The connection string comes from an environment variable, never from the code.',
            'with psycopg.connect(os.environ["DATABASE_URL"]) as conn:',
            '    rows = conn.execute("SELECT name, price FROM products ORDER BY price").fetchall()',
            '    for name, price in rows:',
            '        print(name, price)'
          )
        },
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 10), (2, 'Notebook', 60), (3, 'Backpack', 1200);",
          'SELECT name, price FROM products ORDER BY price;'
        ),
        output: lines(
          ' name     | price',
          '----------+---------',
          ' Pen      |   10.00',
          ' Notebook |   60.00',
          ' Backpack | 1200.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'This is exactly the SQL the Python code in the box sends. The rows come back to Python as (name, price) pairs.' }
        ],
        tryIt: 'On your laptop, install PostgreSQL (or use a free cloud database), set DATABASE_URL, and run the Python code in the box.',
        check: {
          question: 'Where should a database password be stored?',
          options: ['In an environment variable, not in the code', 'In the code, so it is easy to find', 'In the README file'],
          answer: 0,
          why: 'Code gets shared and pushed to GitHub. Secrets in environment variables stay out of the code.'
        }
      },
      {
        title: 'SQL injection: the most important security rule',
        say: [
          'Imagine a login page that builds its SQL by gluing text together: "SELECT * FROM users WHERE name = \'" + typed_name + "\'". If a user types Asha, the query is fine. But what if they type something else?',
          'If an attacker types \' OR \'1\'=\'1, the glued query becomes SELECT * FROM users WHERE name = \'\' OR \'1\'=\'1\'. The condition \'1\'=\'1\' is always true, so the query returns every user. The attacker has changed what the SQL means just by typing into a box.',
          'This attack is called SQL injection. It has been used to steal millions of passwords and credit card numbers, and it is still on every list of the most dangerous security mistakes. Worse inputs can even delete tables.',
          'The cause is always the same: user input treated as part of the SQL text. The database cannot tell which part the developer wrote and which part the user typed.',
          'The fix is simple and absolute: never glue user input into SQL. Always send the input separately, as a parameter. You will see how in the next part.',
          'This rule applies to every language and every database. Interviewers for backend jobs almost always ask about it, and a good answer can decide the interview.'
        ],
        example: 'Imagine a bank form where you write your name, and the clerk copies whatever you wrote into an instruction: "Give the balance of ___". If you write "Asha, and also give me everyone else\'s balance", a careless clerk might follow it. SQL injection is exactly that trick.',
        code: lines(
          'CREATE TABLE users (id int, name text, secret text);',
          "INSERT INTO users VALUES (1, 'Asha', 'asha-secret'), (2, 'Ravi', 'ravi-secret');",
          "-- The app glued what the user typed into the SQL text. The user typed: ' OR '1'='1",
          "SELECT name, secret FROM users WHERE name = '' OR '1'='1';"
        ),
        output: lines(
          ' name | secret',
          '------+-------------',
          ' Asha | asha-secret',
          ' Ravi | ravi-secret',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'What the attacker typed in the name box.' },
          { line: 4, note: 'After gluing, the WHERE is always true, so every user\'s secret is returned.' }
        ],
        tryIt: "Change the last line to what a normal user would produce, WHERE name = 'Asha', and compare the results.",
        check: {
          question: 'What causes SQL injection?',
          options: ['Gluing user input directly into SQL text', 'Using too many JOINs', 'Forgetting an index'],
          answer: 0,
          why: 'When input becomes part of the SQL text, a user can change what the query means. Sending input as a separate parameter prevents it.'
        }
      },
      {
        title: 'Parameters: the safe way',
        say: [
          'The safe way is a parameterised query. You write the SQL with placeholders where values go, and pass the values separately. In psycopg the placeholder is %s; in Node.js pg it is $1, $2 and so on.',
          'The database receives the SQL and the values as two separate things. It knows the values are data, never SQL. So even if someone types \' OR \'1\'=\'1, it is simply searched as a strange name, and nothing is found.',
          'Parameters also handle quoting for you. A name like O\'Brien, or text with special characters, just works, without you worrying about escaping apostrophes.',
          'PostgreSQL itself has the same idea in SQL: PREPARE creates a statement with $1 placeholders, and EXECUTE runs it with values. The drivers use this mechanism behind the scenes.',
          'The rule has no exceptions for "internal" or "trusted" input. Values from URLs, forms, files, other services and even your own database can contain unexpected text. Always use parameters.',
          'Table and column names cannot be parameters, only values. If you ever need a user to choose a column, for example for sorting, check their choice against a fixed list of allowed names in your code.'
        ],
        example: 'A safe bank form has separate, fixed boxes: "Account number: [   ]". Whatever you write in the box is only ever read as an account number. It can never become an instruction. Parameters are those fixed boxes.',
        projectCode: {
          label: 'Safe queries on your laptop',
          code: lines(
            '# Python (psycopg): %s placeholders, values passed separately',
            'name = input("Name: ")',
            'rows = conn.execute("SELECT id, name FROM users WHERE name = %s", (name,)).fetchall()',
            '',
            '// Node.js (pg): $1 placeholders, values in an array',
            "const { rows } = await pool.query('SELECT id, name FROM users WHERE name = $1', [name]);"
          )
        },
        code: lines(
          'CREATE TABLE users (id int, name text, secret text);',
          "INSERT INTO users VALUES (1, 'Asha', 'asha-secret'), (2, 'Ravi', 'ravi-secret'), (3, 'O''Brien', 'ob-secret');",
          'PREPARE find_user(text) AS SELECT id, name FROM users WHERE name = $1;',
          "EXECUTE find_user('Asha');",
          "EXECUTE find_user(''' OR ''1''=''1');",
          "EXECUTE find_user('O''Brien');"
        ),
        output: lines(
          ' id | name',
          '----+------',
          '  1 | Asha',
          '(1 row)',
          '',
          ' id | name',
          '----+------',
          '(0 rows)',
          '',
          ' id | name',
          '----+---------',
          '  3 | O\'Brien',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: '$1 is a placeholder; the value is never part of the SQL text.' },
          { line: 5, note: 'The attack text is searched as a name, and matches nobody.' },
          { line: 6, note: 'Names with apostrophes just work.' }
        ],
        tryIt: 'Add a second parameter: PREPARE find_user2(text, int) AS SELECT name FROM users WHERE name = $1 AND id = $2; and EXECUTE it with (\'Asha\', 1).',
        check: {
          question: 'Why does a parameter stop SQL injection?',
          options: ['The value is sent separately and treated only as data, never as SQL', 'It removes quotes from the input', 'It makes the query faster'],
          answer: 0,
          why: 'With parameters, the database knows exactly which part is SQL and which part is data, so input cannot change the query.'
        }
      },
      {
        title: 'Transactions and errors from code',
        say: [
          'On Day 22 you wrapped several changes in BEGIN and COMMIT. From an app, drivers make this easy. In psycopg, a with conn.transaction(): block commits at the end if everything worked, and rolls back automatically if any error happens inside.',
          'In Node.js, you take one client from the pool, run BEGIN, your queries and COMMIT, and in the error handler run ROLLBACK. Many libraries wrap this into a helper so you cannot forget.',
          'Errors from PostgreSQL arrive in the app as exceptions, with the same messages you have seen in the lessons: a CHECK violation, a duplicate key, a foreign key problem. Good apps catch the expected ones and turn them into friendly messages, like "this email is already registered".',
          'Each error has a code, a five-character SQLSTATE, like 23505 for a unique violation. Checking the code is more reliable than checking the message text, which can change between versions or languages.',
          'Never show raw database errors to end users. They can reveal table names and details that help attackers. Log the details for developers, and show users a simple message.',
          'Also remember that the database is the final guard. Even if the app forgets a check, the constraints you designed on Day 21 still refuse bad data.'
        ],
        example: 'When a food app says "Sorry, that coupon has already been used", it is translating a database error, maybe a unique rule on coupon codes, into friendly words. The raw error stays in the developers\' logs.',
        projectCode: {
          label: 'Python: a transaction and a friendly error',
          code: lines(
            'import psycopg',
            'from psycopg import errors',
            '',
            'try:',
            '    with conn.transaction():',
            '        conn.execute("UPDATE accounts SET balance = balance - %s WHERE id = %s", (500, 1))',
            '        conn.execute("UPDATE accounts SET balance = balance + %s WHERE id = %s", (500, 2))',
            'except errors.CheckViolation:',
            '    print("Not enough balance for this transfer.")'
          )
        },
        code: lines(
          'CREATE TABLE users (id serial PRIMARY KEY, email text UNIQUE NOT NULL);',
          "INSERT INTO users (email) VALUES ('asha@example.com');",
          "SELECT 'The next INSERT fails with SQLSTATE 23505 (unique_violation).' AS note;",
          "INSERT INTO users (email) VALUES ('asha@example.com');"
        ),
        output: lines(
          ' note',
          '---------------------------------------------------------------',
          ' The next INSERT fails with SQLSTATE 23505 (unique_violation).',
          '(1 row)',
          '',
          '[Error] duplicate key value violates unique constraint "users_email_key"'
        ),
        codeNotes: [
          { line: 4, note: 'A duplicate email: the app would catch this error and say "already registered".' }
        ],
        tryIt: 'Add a CHECK rule that emails contain @, like CHECK (email LIKE \'%@%\'), and try inserting \'not-an-email\'.',
        check: {
          question: 'What should an app show a user when an INSERT fails because the email already exists?',
          options: ['A friendly message like "This email is already registered"', 'The full PostgreSQL error with table names', 'Nothing; ignore the error'],
          answer: 0,
          why: 'Catch the expected error (by its code) and show a clear message. Log the technical details for developers only.'
        }
      },
      {
        title: 'ORMs and query builders',
        say: [
          'Writing SQL by hand in every function gets repetitive, so many teams use an ORM, short for object-relational mapper. In Python, SQLAlchemy and Django\'s ORM are popular; in Node.js, Prisma and Sequelize.',
          'An ORM lets you work with tables as classes and rows as objects: User.objects.filter(city="Pune") in Django instead of writing the SELECT yourself. The ORM writes the SQL for you, with parameters, so it is safe from injection by default.',
          'ORMs speed up everyday work, but they do not replace SQL knowledge. When a page is slow, you need to see the SQL the ORM wrote, read its EXPLAIN plan, and add the right index. When a report is complex, raw SQL is often clearer.',
          'A classic ORM problem is the "N+1 queries" trap: loading 100 orders, then running one extra query per order to get its customer, 101 queries instead of one JOIN. Knowing joins, as you now do, helps you spot and fix it.',
          'Query builders, like Knex in Node.js, sit between raw SQL and a full ORM: you build queries with functions, and they produce safe SQL.',
          'Whatever tool a company uses, the SQL skills from this course transfer directly. Interviewers value developers who understand what the tool is doing underneath.'
        ],
        example: 'An ORM is like an automatic car: easy for everyday driving. But a good driver still understands the engine, because when something goes wrong on the road, knowing what is underneath makes the difference.',
        projectCode: {
          label: 'The N+1 problem, and the fix with one JOIN',
          code: lines(
            '# Slow: one query for the orders, then one query per order',
            'orders = conn.execute("SELECT id, customer_id FROM orders").fetchall()',
            'for order_id, customer_id in orders:',
            '    name = conn.execute("SELECT name FROM customers WHERE id = %s", (customer_id,)).fetchone()',
            '',
            '# Fast: one query with a JOIN',
            'rows = conn.execute("""',
            '    SELECT o.id, c.name FROM orders o JOIN customers c ON c.id = o.customer_id',
            '""").fetchall()'
          )
        },
        code: lines(
          MINI_SHOP,
          'SELECT o.id AS order_id, c.name AS customer',
          'FROM orders o JOIN customers c ON c.id = o.customer_id',
          'ORDER BY o.id;'
        ),
        output: lines(
          ' order_id | customer',
          '----------+----------',
          '      101 | Asha',
          '      102 | Ravi',
          '      103 | Asha',
          '      104 | Priya',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'One JOIN returns every order with its customer: one query instead of one per order.' }
        ],
        tryIt: 'Count how many queries the slow version in the box would run for these 4 orders: 1 for the orders plus 1 per order, so 5. The JOIN needs just 1.',
        check: {
          question: 'What is the "N+1 queries" problem?',
          options: ['Running one extra query per row instead of one JOIN', 'A query that returns one extra row', 'Forgetting a parameter'],
          answer: 0,
          why: 'Loading N rows and then querying once per row makes N+1 round trips. A single JOIN gets everything at once.'
        }
      },
      {
        title: 'Putting it together: a safe search feature',
        say: [
          'Let us build the database side of a real feature: a search box for customers. The user types part of a name, and the app shows matching customers, ignoring capital letters.',
          'The query uses ILIKE with the parameter joined to percent signs inside the SQL: WHERE name ILIKE \'%\' || $1 || \'%\'. The user\'s text is still a separate value; only the fixed percent signs are part of the SQL.',
          'We prepare it once and execute it with different searches. An attacker\'s text finds nothing, and ordinary searches work in any mix of capitals.',
          'In today\'s practice, you will create two prepared statements: one that finds a customer by exact name, and one safe, case-insensitive search.',
          'Tomorrow you start the final project: designing a database for a college canteen from scratch, using everything from the course.',
          'If you remember one thing from today, remember this: user input never goes into SQL text. Parameters, every time.'
        ],
        example: 'A library search computer lets you type any part of a title. Whatever you type is only ever used as the search words, never as an instruction to the computer. That is a parameterised search.',
        code: lines(
          MINI_SHOP,
          "PREPARE search_customers(text) AS SELECT name FROM customers WHERE name ILIKE '%' || $1 || '%' ORDER BY name;",
          "EXECUTE search_customers('a');",
          "EXECUTE search_customers('PRI');",
          "EXECUTE search_customers(''' OR ''1''=''1');"
        ),
        output: lines(
          ' name',
          '-------',
          ' Asha',
          ' Meera',
          ' Priya',
          ' Ravi',
          '(4 rows)',
          '',
          ' name',
          '-------',
          ' Priya',
          '(1 row)',
          '',
          ' name',
          '------',
          '(0 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'The percent signs are fixed SQL; $1 is the user\'s text, sent separately.' },
          { line: 11, note: 'Capitals do not matter.' },
          { line: 12, note: 'The attack text is just a search that matches nobody.' }
        ],
        tryIt: "Add EXECUTE search_customers('ee'); to find Meera.",
        check: {
          question: "In WHERE name ILIKE '%' || $1 || '%', which part comes from the user?",
          options: ['Only $1, sent as a separate value', 'The whole line', 'The percent signs'],
          answer: 0,
          why: 'The percent signs are fixed in the SQL. The user\'s text arrives only as the parameter $1.'
        }
      }
    ],
    summary: [
      'Apps use drivers (psycopg in Python, pg in Node.js) and keep the connection string in an environment variable.',
      'SQL injection happens when user input is glued into SQL text.',
      'Always use parameters (%s or $1): values travel separately and can never change the query.',
      'Use transactions from code and turn expected errors into friendly messages.',
      'ORMs write SQL for you, but SQL knowledge is still needed for speed and correctness.'
    ],
    projectStep: {
      title: 'My Library: connect from code',
      steps: [
        'Install PostgreSQL on your laptop, or create a free cloud database.',
        'Create your books and authors tables there with the SQL you wrote this month.',
        'Write a small Python or Node.js script that lists your books, using the connection string from an environment variable.',
        'Add a search by title that uses a parameter, never string gluing.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 27,
    title: 'Project: Designing the Canteen Database',
    goal: 'You can turn a real problem into user stories, tables, keys and constraints, and build and check the schema.',
    minutes: 28,
    recap: 'Yesterday you connected to PostgreSQL from Python and Node.js and learned to prevent SQL injection with parameters.',
    parts: [
      {
        title: 'The project and its user stories',
        say: [
          'For the last days of the course, you build a database from scratch for a college canteen. Students order food, the canteen prepares it, and the manager wants reports. This is the kind of small, complete project you can explain in an interview.',
          'Like any project, it starts with the users and what they need, written as user stories: "As a student, I want to see the menu with prices, so that I can decide what to order." "As a student, I want to place an order with several items." "As the manager, I want to know the best-selling item and each day\'s takings."',
          'From these stories come the things the database must remember: menu items, orders, and the items inside each order. The stories also give the rules: prices must be positive, every order belongs to a student, an order can have several items.',
          'Keep the first version small. A real canteen might need staff logins, payments and stock levels, but those can come later. A small design that works is far better than a big one that is never finished.',
          'Write the stories and the list of tables in a PLAN.md file in your project folder. It helps you think, and it shows recruiters how you approach a problem.',
          'Today you design and create the tables. Tomorrow you write the reports the manager asked for.',
          'Talking to the real users, even informally, is worth it. Ask the canteen staff what goes wrong today: maybe orders get mixed up at lunchtime, or nobody knows which dish runs out first. Their answers often reveal the most useful features.'
        ],
        example: 'Before building a house, you talk to the family: how many people, do they cook a lot, do they need a study? Their needs decide the rooms. User stories are that conversation for a database.',
        code: lines(
          'CREATE TABLE user_stories (who text, wants text, so_that text);',
          'INSERT INTO user_stories VALUES',
          "  ('student', 'see the menu with prices', 'I can decide what to order'),",
          "  ('student', 'order several items at once', 'I pay once for my meal'),",
          "  ('manager', 'see the best-selling item', 'I can plan how much to cook'),",
          "  ('manager', 'see each day''s takings', 'I can track the money');",
          "SELECT 'As a ' || who || ', I want to ' || wants || ', so that ' || so_that || '.' AS story FROM user_stories;"
        ),
        output: lines(
          ' story',
          '-----------------------------------------------------------------------------------------',
          ' As a student, I want to see the menu with prices, so that I can decide what to order.',
          ' As a student, I want to order several items at once, so that I pay once for my meal.',
          ' As a manager, I want to see the best-selling item, so that I can plan how much to cook.',
          ' As a manager, I want to see each day\'s takings, so that I can track the money.',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 7, note: 'Each story in the standard shape: who, what, and why.' }
        ],
        tryIt: "Add a story of your own, for example ('student', 'see only vegetarian items', 'I can choose quickly').",
        check: {
          question: 'Why write user stories before designing tables?',
          options: ['They show what the database must remember and which rules matter', 'PostgreSQL requires them', 'They replace the need for tables'],
          answer: 0,
          why: 'Stories reveal the things to store (menu items, orders) and the rules (positive prices, several items per order).'
        }
      },
      {
        title: 'From stories to tables',
        say: [
          'Now turn the stories into tables, one for each kind of thing. The nouns in the stories are clues: menu, order, item, student.',
          'menu_items holds the food: a name, a price, and whether it is vegetarian. canteen_orders holds each order: who ordered and when. And because an order has several items, and an item appears in many orders, a junction table, canteen_order_items, links them with a quantity.',
          'Should students have their own table? For this first version, the student\'s name on the order is enough. If the canteen later needs student accounts, a students table can be added, and the name replaced by a student_id foreign key.',
          'Check the design against the normal forms from Day 20. Each fact is stored once: a price lives in menu_items, a time lives in canteen_orders, a quantity lives in canteen_order_items. Nothing is repeated.',
          'Draw it before writing SQL: three boxes, with a line from canteen_order_items to each of the other two. That picture is the ER diagram you met on Day 10.',
          'A good design fits on one page and can be explained in two minutes. If it cannot, it is probably too complicated for a first version.'
        ],
        example: 'A restaurant\'s paperwork has a printed menu card, an order pad for each table, and on each order slip, lines for each dish and how many plates. Three kinds of paper, three tables.',
        code: lines(
          'CREATE TABLE design_plan (table_name text, one_row_is text, links_to text);',
          'INSERT INTO design_plan VALUES',
          "  ('menu_items', 'one dish on the menu', NULL),",
          "  ('canteen_orders', 'one order by one student', NULL),",
          "  ('canteen_order_items', 'one dish in one order, with a quantity', 'canteen_orders and menu_items');",
          "SELECT table_name, one_row_is, coalesce(links_to, '-') AS links_to FROM design_plan;"
        ),
        output: lines(
          ' table_name          | one_row_is                             | links_to',
          '---------------------+----------------------------------------+-------------------------------',
          ' menu_items          | one dish on the menu                   | -',
          ' canteen_orders      | one order by one student               | -',
          ' canteen_order_items | one dish in one order, with a quantity | canteen_orders and menu_items',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'The junction table links orders and menu items: many to many.' }
        ],
        tryIt: 'Add a fourth planned table of your own, for example payments, and say what one row is and what it links to.',
        check: {
          question: 'Why does the canteen need a canteen_order_items table?',
          options: ['An order has several dishes and a dish appears in many orders: many to many', 'To store the menu prices', 'Because every table needs a partner'],
          answer: 0,
          why: 'A many-to-many relationship needs a junction table, which also holds the quantity.'
        }
      },
      {
        title: 'Choosing types, keys and rules',
        say: [
          'For each column, choose a type and the rules. Take them one table at a time and ask: what values make sense here, and which must never happen?',
          'menu_items: id serial PRIMARY KEY; name text NOT NULL UNIQUE, because two dishes with the same name would confuse everyone; price numeric(8,2) NOT NULL CHECK (price > 0); is_veg boolean DEFAULT true.',
          'canteen_orders: id serial PRIMARY KEY; student_name text NOT NULL; ordered_at timestamp DEFAULT now(), so the time is filled in automatically.',
          'canteen_order_items: order_id referencing canteen_orders with ON DELETE CASCADE, because items mean nothing without their order; item_id referencing menu_items with the default refusal, so a dish in past orders cannot be deleted by accident; quantity int CHECK (quantity > 0); and PRIMARY KEY (order_id, item_id), so each dish appears once per order.',
          'Every rule here answers a question a real canteen might face: can a price be zero? Can a dish be deleted if people ordered it? Can an order have the same dish twice? Deciding these in the design saves arguments later.',
          'Write the rules in PLAN.md too, with a one-line reason for each. That is exactly the kind of thinking interviewers want to hear about.'
        ],
        example: 'A school admission form decides its rules before the first student applies: date of birth required, one form per student, age at least 5. Deciding early makes every later form consistent.',
        code: lines(
          'CREATE TABLE menu_items (',
          '  id serial PRIMARY KEY,',
          '  name text NOT NULL UNIQUE,',
          '  price numeric(8,2) NOT NULL CHECK (price > 0),',
          '  is_veg boolean DEFAULT true',
          ');',
          "INSERT INTO menu_items (name, price) VALUES ('Masala dosa', 60), ('Tea', 15);",
          "INSERT INTO menu_items (name, price, is_veg) VALUES ('Chicken biryani', 140, false);",
          'SELECT * FROM menu_items ORDER BY id;',
          "INSERT INTO menu_items (name, price) VALUES ('Free water', 0);"
        ),
        output: lines(
          ' id | name            | price  | is_veg',
          '----+-----------------+--------+--------',
          '  1 | Masala dosa     |  60.00 | true',
          '  2 | Tea             |  15.00 | true',
          '  3 | Chicken biryani | 140.00 | false',
          '(3 rows)',
          '',
          '[Error] new row for relation "menu_items" violates check constraint "menu_items_price_check"'
        ),
        codeNotes: [
          { line: 3, note: 'Required and unique: no two dishes with the same name.' },
          { line: 4, note: 'Prices must be positive.' },
          { line: 10, note: 'A price of 0 breaks the rule and is refused.' }
        ],
        tryIt: "Change line 10 to add 'Tea' again at 20. Read which rule refuses it this time.",
        check: {
          question: 'Why is item_id in canteen_order_items left with the default ON DELETE (refuse)?',
          options: ['So a dish that appears in past orders cannot be deleted by accident', 'Because CASCADE is not allowed', 'So orders are deleted with dishes'],
          answer: 0,
          why: 'Past orders must keep their dishes. Refusing the delete protects that history; a soft delete can hide old dishes instead.'
        }
      },
      {
        title: 'Building the schema',
        say: [
          'Now write the full schema: all three CREATE TABLE statements, in the right order. A table must exist before another table can reference it, so menu_items and canteen_orders come before canteen_order_items.',
          'Keep the schema in a file, often called schema.sql, in your project. Anyone can then create the whole database by running that one file, which is how teams set up new laptops, test databases and servers.',
          'After creating the tables, check them. information_schema.table_constraints lists every key and rule. Counting them is a quick way to confirm that nothing was forgotten: three primary keys, two foreign keys, a unique rule and a few checks.',
          'Then add some sample data: a menu, a few orders and their items. Realistic sample data makes it much easier to test reports, and to show the project in an interview.',
          'If a CREATE TABLE has a mistake, it is easy to fix at this stage: drop the tables and run the file again. Later, when real data exists, changes need ALTER TABLE and more care.',
          'Commit schema.sql to Git with a clear message. Your GitHub now shows a real database design, not just exercises.'
        ],
        example: 'An architect\'s final drawing is used by every builder on site. schema.sql is that drawing: one file that anyone can use to build exactly the same database.',
        code: lines(
          CANTEEN,
          'SELECT tc.table_name, tc.constraint_type, count(*) AS how_many',
          'FROM information_schema.table_constraints tc',
          "WHERE tc.table_schema = 'public' AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE')",
          'GROUP BY tc.table_name, tc.constraint_type',
          'ORDER BY tc.table_name, tc.constraint_type;'
        ),
        output: lines(
          ' table_name          | constraint_type | how_many',
          '---------------------+-----------------+----------',
          ' canteen_order_items | FOREIGN KEY     |        2',
          ' canteen_order_items | PRIMARY KEY     |        1',
          ' canteen_orders      | PRIMARY KEY     |        1',
          ' menu_items          | PRIMARY KEY     |        1',
          ' menu_items          | UNIQUE          |        1',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 1, note: 'The whole Canteen schema and sample data: menu, orders, and items per order.' },
          { line: 7, note: 'List the keys and unique rules per table to check nothing was forgotten.' }
        ],
        tryIt: "Add 'CHECK' to the list of constraint types in the WHERE and run it again. (PostgreSQL also lists NOT NULL rules as CHECK here.)",
        check: {
          question: 'Why must menu_items be created before canteen_order_items?',
          options: ['canteen_order_items references it, and a table must exist before it can be referenced', 'Tables are always created in A to Z order', 'It has fewer columns'],
          answer: 0,
          why: 'A foreign key can only point to a table that already exists, so the referenced tables come first.'
        }
      },
      {
        title: 'Testing the rules',
        say: [
          'A design is only as good as its rules, so test them on purpose, just like the smoke alarm test on Day 21. Try the things that should fail, and check that they do.',
          'Try a negative quantity. Try an order item for a dish that does not exist. Try the same dish twice in one order. Try deleting a dish that has been ordered. Each should be refused with a clear error.',
          'Then test the rules that should allow things: deleting an order should delete its items, thanks to CASCADE. Check with a count before and after.',
          'Writing these tests down, as a small SQL file of "things that must fail", is a professional habit. When someone changes the schema later, running the file shows immediately if a rule was lost.',
          'In the lesson editor, each failing test stops the run, so the example below tests one rule and then the cascade. On your laptop, you can run each test separately.',
          'Testing the design is also great interview material: "I tested that a dish in past orders cannot be deleted" shows you think about real-world mistakes.'
        ],
        example: 'A new lift is not opened to the public until engineers test the emergency brake, the door sensor and the overload alarm on purpose. Testing the rules of your database is the same safety check.',
        code: lines(
          CANTEEN,
          'SELECT count(*) AS items_before FROM canteen_order_items;',
          'DELETE FROM canteen_orders WHERE id = 1;',
          'SELECT count(*) AS items_after_deleting_order_1 FROM canteen_order_items;',
          "DELETE FROM menu_items WHERE name = 'Tea';"
        ),
        output: lines(
          ' items_before',
          '--------------',
          '            8',
          '(1 row)',
          '',
          ' items_after_deleting_order_1',
          '------------------------------',
          '                            6',
          '(1 row)',
          '',
          '[Error] update or delete on table "menu_items" violates foreign key constraint "canteen_order_items_item_id_fkey" on table "canteen_order_items"'
        ),
        codeNotes: [
          { line: 8, note: 'Order 1 has 2 items. CASCADE deletes them with the order.' },
          { line: 10, note: 'Tea is in past orders, so deleting it is refused.' }
        ],
        tryIt: 'Replace the last line with a test of a negative quantity: INSERT INTO canteen_order_items VALUES (2, 1, -1); and read the error.',
        check: {
          question: 'Why test that bad data is refused?',
          options: ['To prove the rules really work, and to notice if a later change removes one', 'Because PostgreSQL requires tests', 'To fill the tables with data'],
          answer: 0,
          why: 'Deliberately trying invalid changes proves each rule is in place, and re-running the tests catches rules lost later.'
        }
      },
      {
        title: 'Putting it together: placing a canteen order',
        say: [
          'Let us finish the design day with the most important action: a student placing an order with two dishes. It must create the order and its items together, so it goes in a transaction.',
          'We insert the order and let PostgreSQL fill in the id and the time. RETURNING shows the new id. Then we insert the items using that id, and commit. A final query shows the order with its dishes and total.',
          'In a real app, the backend would do exactly this with parameters, as you learned yesterday: the student\'s name and the dish ids would be sent as values, never glued into the SQL.',
          'In today\'s practice, you will create the menu_items table with all its rules, and then the orders and order items tables with their keys and foreign keys.',
          'Tomorrow you write the reports the canteen manager asked for: best sellers, takings per day, and each student\'s spending.',
          'You have now designed a complete, protected database from a real problem. That is a core skill for backend developers, and a project you can talk about with confidence.'
        ],
        example: 'When Priya orders a dosa and a tea at the counter, the cashier writes one slip with both dishes, and it goes to the kitchen as one order. If the slip is torn halfway, the whole order is written again. That slip is a transaction.',
        code: lines(
          CANTEEN,
          'BEGIN;',
          "INSERT INTO canteen_orders (student_name, ordered_at) VALUES ('Karan', '2026-09-29 13:15') RETURNING id;",
          'INSERT INTO canteen_order_items VALUES (5, 1, 1), (5, 4, 1);',
          'COMMIT;',
          'SELECT co.student_name, m.name AS dish, ci.quantity, m.price * ci.quantity AS line_total',
          'FROM canteen_orders co',
          'JOIN canteen_order_items ci ON ci.order_id = co.id',
          'JOIN menu_items m ON m.id = ci.item_id',
          'WHERE co.id = 5',
          'ORDER BY m.name;'
        ),
        output: lines(
          ' id',
          '----',
          '  5',
          '(1 row)',
          '',
          ' student_name | dish        | quantity | line_total',
          '--------------+-------------+----------+------------',
          ' Karan        | Masala dosa |        1 |      60.00',
          ' Karan        | Tea         |        1 |      15.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 8, note: 'The new order gets id 5, the next number after the sample orders.' },
          { line: 9, note: 'Karan\'s items, using that id.' },
          { line: 11, note: 'Check the order with its dishes and line totals.' }
        ],
        tryIt: 'Add a third dish to Karan\'s order, (5, 5, 2) for two samosas, and run it again.',
        check: {
          question: 'Why place the order and its items in one transaction?',
          options: ['So there is never an order without its items, or items without their order', 'Because INSERT needs BEGIN', 'To make RETURNING work'],
          answer: 0,
          why: 'Placing an order is one action. The transaction makes sure all its parts are saved together, or none.'
        }
      }
    ],
    summary: [
      'Start a project with user stories: who needs what, and why.',
      'Nouns become tables; many-to-many links need a junction table with a quantity.',
      'Choose types and rules for every column, with a reason for each.',
      'Keep the schema in schema.sql, check it with information_schema, and test the rules on purpose.',
      'Place an order with its items in one transaction.'
    ],
    projectStep: {
      title: 'Canteen project: the design',
      steps: [
        'Write PLAN.md with at least 4 user stories and your 3 tables.',
        'Write schema.sql with menu_items, canteen_orders and canteen_order_items and all their rules.',
        'Add a menu of at least 5 dishes and 5 sample orders.',
        'Write a tests.sql file with at least 3 changes that must be refused, and commit everything to GitHub.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 28,
    title: 'Project: Reports for the Canteen',
    goal: 'You can turn a manager\'s questions into queries using joins, groups, CTEs and window functions, and save the useful ones as views.',
    minutes: 28,
    recap: 'Yesterday you designed and built the Canteen database, tested its rules, and placed an order in a transaction.',
    parts: [
      {
        title: 'From a manager\'s question to a query',
        say: [
          'The canteen manager has questions, not SQL. Your job is to turn each question into a query that answers it correctly. That translation is one of the most valuable skills in any data or backend role.',
          'Start by writing the question in plain words and underlining the key parts: "Which dish sells the most units?" The dish comes from menu_items; units come from canteen_order_items; "the most" means sum, sort and take the top.',
          'Next, decide which tables you need and how they link: canteen_order_items joins to menu_items on item_id. Then decide the grouping: one row per dish. Then the calculation: sum of quantity. Then the order and limit.',
          'Finally, check the answer against the raw data for one case you can count by hand. If Tea appears in three orders with quantities 2, 1 and 1, its total must be 4. A report that fails this simple check is wrong, however clever the SQL looks.',
          'This process, question, tables, joins, grouping, calculation, check, works for every report you will ever write. With practice, it becomes quick and automatic.',
          'It also helps to agree on definitions with the manager before writing anything. Does "sold" include orders that were cancelled? Does a day run from midnight to midnight, or from opening to closing time? Many wrong reports are correct SQL answering a slightly different question.',
          'Today you write four reports the manager asked for, then save the useful ones as views so they can be used every day.'
        ],
        example: 'A good tailor asks exactly what you need before cutting cloth: the occasion, the fit, the colour. Only then do they measure and cut. Turning a question into a query is the same: understand first, then write.',
        code: lines(
          CANTEEN,
          'SELECT m.name, sum(ci.quantity) AS units',
          'FROM canteen_order_items ci',
          'JOIN menu_items m ON m.id = ci.item_id',
          'GROUP BY m.id, m.name',
          'ORDER BY units DESC, m.name',
          'LIMIT 3;'
        ),
        output: lines(
          ' name            | units',
          '-----------------+-------',
          ' Tea             |     4',
          ' Samosa          |     3',
          ' Chicken biryani |     1',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 7, note: 'Units come from the order items; names from the menu.' },
          { line: 10, note: 'One row per dish; most units first; the top 3.' }
        ],
        tryIt: "Check Tea's total by hand: SELECT order_id, quantity FROM canteen_order_items WHERE item_id = 4; The quantities should add up to Tea's units in the report.",
        check: {
          question: 'What is the first step in turning a question into a query?',
          options: ['Write the question in plain words and find which tables and columns it needs', 'Start typing SELECT *', 'Create an index'],
          answer: 0,
          why: 'Understanding the question and the tables it touches comes first; the SQL follows from that.'
        }
      },
      {
        title: 'Takings per day',
        say: [
          'The manager\'s second question: "How much money did the canteen take each day?" Money is price times quantity, the price is in menu_items, the quantity in canteen_order_items, and the day comes from canteen_orders.ordered_at.',
          'So this report joins all three tables. ordered_at is a timestamp with a time of day, so to group by day, cast it: ordered_at::date turns 2026-09-28 13:05 into 2026-09-28.',
          'Group by that day, and sum price times quantity. Sort by day so the report reads like a calendar.',
          'A useful addition is the number of orders per day. Because each order has several item rows after the join, use count(DISTINCT co.id), as you learned on Day 12. Otherwise an order with three dishes would be counted three times.',
          'Days with no orders do not appear at all, because there are no rows for them. If the manager wants every day listed, including zeros, you would generate the days with generate_series and LEFT JOIN, like the recursive dates on Day 16.',
          'Always double-check money reports carefully. One missing join condition or a duplicated row can make the takings look higher than the cash in the till, which is an expensive mistake.',
          'A simple check for money reports is to calculate the grand total in a separate query and compare. If the daily takings do not add up to the total of all order lines, a join or filter is wrong somewhere.'
        ],
        example: 'At closing time, the canteen counts the day\'s cash and matches it against the order slips: each slip\'s dishes times their prices, added up. This report is that end-of-day count, done by the database.',
        code: lines(
          CANTEEN,
          'SELECT co.ordered_at::date AS day,',
          '       count(DISTINCT co.id) AS orders,',
          '       sum(m.price * ci.quantity) AS takings',
          'FROM canteen_orders co',
          'JOIN canteen_order_items ci ON ci.order_id = co.id',
          'JOIN menu_items m ON m.id = ci.item_id',
          'GROUP BY co.ordered_at::date',
          'ORDER BY day;'
        ),
        output: lines(
          ' day        | orders | takings',
          '------------+--------+---------',
          ' 2026-09-28 |      3 |  305.00',
          ' 2026-09-29 |      1 |  105.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 7, note: 'The timestamp cast to a date, so all of a day\'s orders fall together.' },
          { line: 8, note: 'DISTINCT, because each order appears once per dish after the join.' }
        ],
        tryIt: 'Change count(DISTINCT co.id) to count(co.id) and run it. The order counts go up, because orders with two dishes are counted twice.',
        check: {
          question: 'Why cast ordered_at to ::date before grouping?',
          options: ['So all orders from the same day form one group, whatever the time', 'Because timestamps cannot be grouped', 'To make the query faster'],
          answer: 0,
          why: 'Each timestamp has a different time. Casting to a date puts every order from that day in the same group.'
        }
      },
      {
        title: 'Spending per student',
        say: [
          'The third question: "How much has each student spent, and how many times have they ordered?" This is the per-customer report from week 2, applied to the canteen.',
          'Join orders to their items and to the menu, group by the student\'s name, and calculate the order count and total spent.',
          'To rank students by spending, add a window function: rank() OVER (ORDER BY sum(...) DESC). As you learned on Day 17, window functions can use the result of the grouping, so this works in one query.',
          'In a larger canteen, students would have their own table and ids, and you would group by the id as well as the name, because two students can share a name. For this project, the name is enough, but mention the limitation if you present it.',
          'Reports about people should be handled with care. Spending per student is useful to the canteen, but it should not be shared outside the people who need it. Views and permissions, from Day 24 and tomorrow, help with that.',
          'Check one student by hand again: Asha ordered twice. Add up the dishes on both her orders and compare with the report.'
        ],
        example: 'A canteen loyalty card counts how many meals each student has bought and how much they spent, and the top students get a free lunch. This report is that loyalty list.',
        code: lines(
          CANTEEN,
          'SELECT co.student_name,',
          '       count(DISTINCT co.id) AS orders,',
          '       sum(m.price * ci.quantity) AS spent,',
          '       rank() OVER (ORDER BY sum(m.price * ci.quantity) DESC) AS spending_rank',
          'FROM canteen_orders co',
          'JOIN canteen_order_items ci ON ci.order_id = co.id',
          'JOIN menu_items m ON m.id = ci.item_id',
          'GROUP BY co.student_name',
          'ORDER BY spending_rank, co.student_name;'
        ),
        output: lines(
          ' student_name | orders | spent  | spending_rank',
          '--------------+--------+--------+---------------',
          ' Ravi         |      1 | 180.00 |             1',
          ' Asha         |      2 | 125.00 |             2',
          ' Priya        |      1 | 105.00 |             3',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Total spent per student.' },
          { line: 10, note: 'A rank based on the grouped total: window functions run after GROUP BY.' }
        ],
        tryIt: "Add HAVING count(DISTINCT co.id) > 1 before ORDER BY to show only students who ordered more than once.",
        check: {
          question: 'Can a window function like rank() use sum(...) from the same GROUP BY query?',
          options: ['Yes, window functions are calculated after grouping', 'No, you always need a subquery', 'Only with PARTITION BY'],
          answer: 0,
          why: 'Grouping happens first, then window functions run on the grouped rows, so rank() OVER (ORDER BY sum(...)) works.'
        }
      },
      {
        title: 'Veg and non-veg, and the busiest hour',
        say: [
          'Managers often want the same numbers split different ways. "What share of our takings comes from vegetarian dishes?" uses conditional aggregation from Day 19: one sum for veg, one for non-veg, in the same query.',
          'Percentages make it easier to read: veg takings divided by total takings, times 100, rounded. Use nullif to be safe if the total could ever be zero.',
          '"When is the canteen busiest?" groups by the hour of the order: extract(hour from ordered_at). With only a few sample orders, the answer is small, but with a real month of data, this report tells the manager when to have more staff at the counter.',
          'These reports use nothing new. They combine joins, groups, CASE or FILTER, and date functions you already know. That is what real reporting work looks like: familiar tools, combined carefully.',
          'When a report is used often, consider an index on the columns it filters and groups by, like ordered_at, and check the plan with EXPLAIN, as on Day 23.',
          'Present results clearly: good column names, sensible rounding, and a sort order that answers the question at a glance.',
          'When you hand a report to a manager, add one sentence explaining what it shows and anything to watch out for, like "takings are based on menu prices, not discounts". That small note prevents a lot of misunderstanding.'
        ],
        example: 'A canteen manager notices long queues at lunchtime and wonders whether to add a second counter. A report of orders by hour turns that feeling into a fact.',
        code: lines(
          CANTEEN,
          'SELECT sum(m.price * ci.quantity) FILTER (WHERE m.is_veg) AS veg_takings,',
          '       sum(m.price * ci.quantity) FILTER (WHERE NOT m.is_veg) AS non_veg_takings,',
          '       round(sum(m.price * ci.quantity) FILTER (WHERE m.is_veg) / nullif(sum(m.price * ci.quantity), 0) * 100, 1) AS veg_percent',
          'FROM canteen_order_items ci JOIN menu_items m ON m.id = ci.item_id;',
          'SELECT extract(hour from ordered_at) AS hour, count(*) AS orders',
          'FROM canteen_orders',
          'GROUP BY 1',
          'ORDER BY orders DESC, hour;'
        ),
        output: lines(
          ' veg_takings | non_veg_takings | veg_percent',
          '-------------+-----------------+-------------',
          '      270.00 |          140.00 |        65.9',
          '(1 row)',
          '',
          ' hour | orders',
          '------+--------',
          '    9 |      1',
          '   12 |      1',
          '   13 |      1',
          '   16 |      1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 7, note: 'Takings split by the is_veg column with FILTER.' },
          { line: 9, note: 'The veg share as a percentage, safe from division by zero.' },
          { line: 11, note: 'Orders per hour of the day.' }
        ],
        tryIt: 'Add a new order at 13:40 for any student, with any dish, and run again. Hour 13 moves to the top.',
        check: {
          question: 'Which tool splits takings into veg and non-veg in one query?',
          options: ['Conditional aggregation with FILTER or CASE', 'Two separate databases', 'UNION of the menu table with itself'],
          answer: 0,
          why: 'sum(...) FILTER (WHERE ...) adds up only the matching rows, so several split totals fit in one row.'
        }
      },
      {
        title: 'Saving the reports as views',
        say: [
          'Reports the manager uses every day should not be retyped. Save them as views, as you learned on Day 24: best_sellers, daily_takings, student_spending.',
          'Then the manager, or a small dashboard app, only needs SELECT * FROM daily_takings. The joins and calculations live in one place, written and checked once.',
          'If the canteen later changes how takings are calculated, for example to exclude cancelled orders, you update the view, and every report using it is updated at once.',
          'Name views clearly, add a comment on each one, and keep their definitions in a views.sql file next to schema.sql in your project.',
          'With the views in place, your project has three layers: the schema with its rules, sample data, and ready-made reports. That is a complete small database project.',
          'This structure also makes a great demonstration. In an interview, you can show the schema, run a report view, and explain one design decision, all in a few minutes.'
        ],
        example: 'A school office has a few standard reports printed every week: attendance, fee dues, results. Nobody rewrites them each week; they are templates. Views are your canteen\'s report templates.',
        code: lines(
          CANTEEN,
          'CREATE VIEW daily_takings AS',
          'SELECT co.ordered_at::date AS day, sum(m.price * ci.quantity) AS takings',
          'FROM canteen_orders co',
          'JOIN canteen_order_items ci ON ci.order_id = co.id',
          'JOIN menu_items m ON m.id = ci.item_id',
          'GROUP BY co.ordered_at::date;',
          "COMMENT ON VIEW daily_takings IS 'Money taken per day, from order items and menu prices';",
          'SELECT * FROM daily_takings ORDER BY day;',
          "SELECT obj_description('daily_takings'::regclass) AS about;"
        ),
        output: lines(
          ' day        | takings',
          '------------+---------',
          ' 2026-09-28 |  305.00',
          ' 2026-09-29 |  105.00',
          '(2 rows)',
          '',
          ' about',
          '-------------------------------------------------------',
          ' Money taken per day, from order items and menu prices',
          '(1 row)'
        ),
        codeNotes: [
          { line: 7, note: 'The takings report, saved once as a view.' },
          { line: 13, note: 'A comment stored inside the database.' },
          { line: 14, note: 'Using the view is now a one-line query.' }
        ],
        tryIt: 'Create a second view best_sellers with each dish and its total units, and query it.',
        check: {
          question: 'Why save the daily takings report as a view?',
          options: ['The logic is written once, and everyone reuses the same correct calculation', 'Views store the numbers permanently', 'Reports cannot run without views'],
          answer: 0,
          why: 'A view keeps the calculation in one place. Everyone who uses it gets the same, up-to-date answer.'
        }
      },
      {
        title: 'Putting it together: the manager\'s dashboard query',
        say: [
          'Let us finish the project with one query that gives the manager a compact overview, built in named steps with WITH, exactly as professionals write it.',
          'Step one: each order\'s total. Step two: per-day numbers from those totals: number of orders, takings, and the average order value. The main query adds each day\'s share of all takings with a window function.',
          'Every technique in this query comes from this course: joins, grouping, a CTE, a window function, rounding, and a cast to date. Seeing them work together on your own project is the real proof of what you have learned.',
          'In today\'s practice, you will find the best-selling item, and calculate takings per day from the canteen tables.',
          'Tomorrow you learn how to keep a database safe in production: backups, restoring data after an accident, and who is allowed to do what.',
          'Take a moment to notice how far you have come: a month ago, SELECT was new. Today you designed a database and wrote the reports a real business would use.'
        ],
        example: 'A canteen manager\'s morning check is one screen with yesterday\'s orders, takings, average bill and how each day compares. Behind that screen is a single, well-structured query like this one.',
        code: lines(
          CANTEEN,
          'WITH order_totals AS (',
          '  SELECT co.id, co.ordered_at::date AS day, sum(m.price * ci.quantity) AS total',
          '  FROM canteen_orders co',
          '  JOIN canteen_order_items ci ON ci.order_id = co.id',
          '  JOIN menu_items m ON m.id = ci.item_id',
          '  GROUP BY co.id, co.ordered_at::date',
          '),',
          'per_day AS (',
          '  SELECT day, count(*) AS orders, sum(total) AS takings, round(avg(total), 2) AS avg_order',
          '  FROM order_totals GROUP BY day',
          ')',
          'SELECT day, orders, takings, avg_order,',
          '       round(takings / sum(takings) OVER () * 100, 1) AS share_percent',
          'FROM per_day',
          'ORDER BY day;'
        ),
        output: lines(
          ' day        | orders | takings | avg_order | share_percent',
          '------------+--------+---------+-----------+---------------',
          ' 2026-09-28 |      3 |  305.00 |    101.67 |          74.4',
          ' 2026-09-29 |      1 |  105.00 |    105.00 |          25.6',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 7, note: 'Step 1: one total per order.' },
          { line: 14, note: 'Step 2: per-day orders, takings and average order.' },
          { line: 19, note: 'Each day\'s share of all takings, with a window function.' }
        ],
        tryIt: 'Add Karan\'s order from yesterday\'s lesson to the data, on 2026-09-29, and run it again. The share for 29 September grows.',
        check: {
          question: 'Why calculate order totals in a first step before per-day numbers?',
          options: ['So the average order value averages whole orders, not individual dish lines', 'Because WITH needs two steps', 'To avoid using joins'],
          answer: 0,
          why: 'Averaging the joined dish lines would give the average line, not the average order. Totalling each order first fixes that.'
        }
      }
    ],
    summary: [
      'Turn each question into tables, joins, grouping and a calculation, then check one case by hand.',
      'Cast timestamps to ::date to report per day; use count(DISTINCT id) after joins.',
      'Window functions can rank grouped results; FILTER splits totals by condition.',
      'Save daily reports as views with comments, in a views.sql file.',
      'Build complex reports in named WITH steps: per order first, then per day.'
    ],
    projectStep: {
      title: 'Canteen project: the reports',
      steps: [
        'Write the best sellers, daily takings and student spending reports.',
        'Check each report against one case you count by hand.',
        'Save the three reports as views in views.sql, with a comment on each.',
        'Write a short README.md for the project: what it is, the tables, and an example report, then commit to GitHub.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 29,
    title: 'Backups, Permissions, and SQL vs NoSQL',
    goal: 'You can explain and use backups, copy and restore tables, give users only the permissions they need, and compare SQL and NoSQL databases.',
    minutes: 28,
    recap: 'Yesterday you wrote the Canteen reports and saved them as views.',
    parts: [
      {
        title: 'Why backups matter',
        say: [
          'Every database will one day face a disaster: a disk fails, someone runs DELETE without WHERE, a bug corrupts data, or an attacker gets in. The question is not whether, but when. Backups are what let a company recover.',
          'A backup is a copy of the data, stored somewhere else, from which the database can be restored. Without a recent backup, lost data is simply gone. Companies have closed down because of this.',
          'PostgreSQL\'s standard backup tool is pg_dump. It writes a whole database, its tables, data, views and rules, into a single file. pg_restore, or psql, rebuilds the database from that file.',
          'Real systems combine daily full backups with continuous logs of every change, so they can restore to any moment, for example "five minutes before the mistake". Cloud databases usually do this automatically.',
          'A backup you have never restored is only a hope. Good teams regularly test restoring a backup into a separate database, to prove it works and to know how long it takes.',
          'Backups also contain all the private data, so they must be stored securely, with access limited just like the live database.',
          'A useful rule of thumb is 3-2-1: keep three copies of important data, on two different kinds of storage, with one copy in a different place. Cloud providers make the "different place" easy, by storing backups in another region.'
        ],
        example: 'You keep copies of important documents, like your Aadhaar card and certificates, in a safe place away from the originals. If the originals are lost in a flood, the copies save you. A database backup is that safe copy.',
        projectCode: {
          label: 'Backups on your laptop or server (terminal)',
          code: lines(
            '# Back up one database to a file',
            'pg_dump --format=custom --file=canteen_2026-09-28.dump canteen',
            '',
            '# Restore it into a new, empty database to test it',
            'createdb canteen_restore_test',
            'pg_restore --dbname=canteen_restore_test canteen_2026-09-28.dump'
          )
        },
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 10), (2, 'Notebook', 60), (3, 'Backpack', 1200);",
          'CREATE TABLE products_backup AS TABLE products;',
          'SELECT (SELECT count(*) FROM products) AS products, (SELECT count(*) FROM products_backup) AS in_backup;'
        ),
        output: lines(
          ' products | in_backup',
          '----------+-----------',
          '        3 |         3',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'A quick copy of one table inside the database: useful before a risky change, but not a real backup.' },
          { line: 4, note: 'Check that the copy has every row.' }
        ],
        tryIt: 'On your laptop, run pg_dump on your My Library database and look at the file it creates.',
        check: {
          question: 'Why is a backup inside the same database not enough?',
          options: ['If the server or disk fails, the copy is lost too', 'It is too slow', 'PostgreSQL deletes copies automatically'],
          answer: 0,
          why: 'A real backup is stored somewhere else, so it survives the failure of the original server.'
        }
      },
      {
        title: 'Copying and restoring tables',
        say: [
          'Inside the database, a quick copy of a table is useful before a risky change: CREATE TABLE products_backup AS TABLE products. It copies all the columns and rows, but not the keys, indexes or rules.',
          'If the change goes wrong, you can put the rows back: delete the bad rows and INSERT INTO products SELECT * FROM products_backup. The column order of both tables must match, which it does when the copy was made from the same table.',
          'Remember foreign keys when restoring. If other tables point to the rows you deleted, you may need to restore in the right order: parents before children.',
          'A better habit for planned changes is the transaction from Day 22: BEGIN, change, check, and ROLLBACK if wrong. Copies are for when you need a safety net that lasts longer than one session.',
          'Clean up afterwards. Old copy tables confuse teammates and use space. Drop them once the change is confirmed, and never leave private data lying around in forgotten copies.',
          'For anything bigger than one table, rely on proper backups with pg_dump and your hosting provider\'s restore tools.'
        ],
        example: 'Before repainting a room, you might take a photo of how the furniture was arranged. If the new arrangement does not work, the photo shows how to put it back. A copy table is that photo for your data.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 10), (2, 'Notebook', 60), (3, 'Backpack', 1200);",
          'CREATE TABLE products_backup AS TABLE products;',
          'DELETE FROM products;',
          'SELECT count(*) AS after_accident FROM products;',
          'INSERT INTO products SELECT * FROM products_backup;',
          'SELECT name, price FROM products ORDER BY id;'
        ),
        output: lines(
          ' after_accident',
          '----------------',
          '              0',
          '(1 row)',
          '',
          ' name     | price',
          '----------+---------',
          ' Pen      |   10.00',
          ' Notebook |   60.00',
          ' Backpack | 1200.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'The safety copy, made before the risky work.' },
          { line: 4, note: 'The accident: every product deleted.' },
          { line: 6, note: 'Restore the rows from the copy.' }
        ],
        tryIt: 'Add DROP TABLE products_backup; at the end, to clean up once the restore is confirmed.',
        check: {
          question: 'What does CREATE TABLE products_backup AS TABLE products copy?',
          options: ['The columns and rows, but not the keys, indexes or rules', 'Everything, including keys and indexes', 'Only the column names'],
          answer: 0,
          why: 'It copies the data. Keys, indexes and constraints are not copied, so it is a data copy, not a full clone.'
        }
      },
      {
        title: 'Users, roles and permissions',
        say: [
          'Not everyone who uses a database should be able to do everything. An analyst needs to read sales, not delete them. An app needs to add orders, not drop tables. PostgreSQL controls this with roles and permissions.',
          'A role is a user or a group. You create one with CREATE ROLE, and give it permissions with GRANT: GRANT SELECT ON products TO report_reader lets that role read products and nothing else.',
          'The principle to follow is called least privilege: give each role only the permissions it needs to do its job. If the reporting tool\'s password leaks, an attacker can then only read reports, not change or delete data.',
          'REVOKE takes permissions away. And GRANT can target whole schemas, views instead of tables, or even specific columns, so private columns like phone numbers stay hidden.',
          'Apps should connect with their own role, never with the powerful admin account. The admin account is for setting up the database, not for everyday traffic.',
          'You can check a role\'s permissions with has_table_privilege, which is handy for testing that your setup really does what you intended.'
        ],
        example: 'In a hotel, the receptionist\'s key card opens the office, the cleaner\'s opens the guest rooms, and only the manager\'s opens the safe. Nobody gets a master key just in case. Database roles are those key cards.',
        code: lines(
          'CREATE TABLE sales (day date, amount numeric(10,2));',
          "INSERT INTO sales VALUES ('2026-09-28', 1200);",
          'CREATE ROLE report_reader;',
          'GRANT SELECT ON sales TO report_reader;',
          "SELECT has_table_privilege('report_reader', 'sales', 'SELECT') AS can_read,",
          "       has_table_privilege('report_reader', 'sales', 'INSERT') AS can_insert,",
          "       has_table_privilege('report_reader', 'sales', 'DELETE') AS can_delete;"
        ),
        output: lines(
          ' can_read | can_insert | can_delete',
          '----------+------------+------------',
          ' true     | false      | false',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'A role for the reporting tool.' },
          { line: 4, note: 'Only reading is allowed.' },
          { line: 5, note: 'Check what the role can and cannot do.' }
        ],
        tryIt: 'Add GRANT INSERT ON sales TO report_reader; before the check, and see can_insert change. Then REVOKE it again.',
        check: {
          question: 'What does "least privilege" mean?',
          options: ['Give each user only the permissions they need for their job', 'Give every user as few tables as possible', 'Only the admin can read data'],
          answer: 0,
          why: 'Limiting permissions limits the damage if an account is misused or its password leaks.'
        }
      },
      {
        title: 'Seeing permissions in action',
        say: [
          'Checking permissions with a function is useful, but it is even clearer to act as the role and see what happens. SET ROLE switches the current session to another role; RESET ROLE switches back.',
          'As report_reader, a SELECT on sales works, but an INSERT fails with "permission denied". That error is the database protecting the data, whatever app or script is behind the role.',
          'Views and permissions work well together. If a role can read a view but not the table under it, it sees only the columns and rows the view shows. That is how private columns are protected in practice.',
          'Permission errors in an app usually mean the app\'s role is missing a GRANT for a new table. Adding tables to a project should always include adding the right permissions for the roles that need them.',
          'In the lesson editor, roles are created fresh each run and removed afterwards. On a real server, roles are created once by an administrator, often with passwords managed by the hosting company.',
          'Security is a shared job. Developers who design roles and permissions carefully, instead of connecting everything as admin, are trusted with more responsibility.',
          'Passwords for roles should be long, random and stored in a secrets manager or environment variables, never shared in chat or written in documents. When someone leaves a team, their access should be removed the same day.'
        ],
        example: 'A visitor badge at an office lets you walk into the meeting rooms, but the server room door simply does not open. You do not need to be told the rule; the door enforces it. SET ROLE is putting on the visitor badge.',
        code: lines(
          'CREATE TABLE sales (day date, amount numeric(10,2));',
          "INSERT INTO sales VALUES ('2026-09-28', 1200);",
          'CREATE ROLE report_reader;',
          'GRANT USAGE ON SCHEMA public TO report_reader;',
          'GRANT SELECT ON sales TO report_reader;',
          'SET ROLE report_reader;',
          'SELECT current_user AS acting_as, sum(amount) AS total FROM sales;',
          "INSERT INTO sales VALUES ('2026-09-29', 500);"
        ),
        output: lines(
          ' acting_as     | total',
          '---------------+---------',
          ' report_reader | 1200.00',
          '(1 row)',
          '',
          '[Error] permission denied for table sales'
        ),
        codeNotes: [
          { line: 6, note: 'Act as the reporting role.' },
          { line: 7, note: 'Reading is allowed.' },
          { line: 8, note: 'Writing is not: permission denied.' }
        ],
        tryIt: 'Add RESET ROLE; before line 8 and run it again. Back as the normal user, the INSERT works.',
        check: {
          question: 'Why should an app connect with its own limited role instead of the admin account?',
          options: ['If the app is attacked or has a bug, it can only do what its role allows', 'Admin accounts are slower', 'PostgreSQL does not allow admin connections'],
          answer: 0,
          why: 'A limited role keeps mistakes and attacks contained. The admin account could drop every table.'
        }
      },
      {
        title: 'SQL vs NoSQL',
        say: [
          'PostgreSQL is a relational, or SQL, database. There are other kinds, often called NoSQL, and interviewers like to ask when you would choose each.',
          'Document databases like MongoDB store JSON-like documents instead of rows. They are flexible when each item has a different shape, and can be quick to start with. PostgreSQL\'s jsonb, from Day 25, covers many of the same needs.',
          'Key-value stores like Redis keep data in memory under a key, like a giant dictionary. They are extremely fast and are used for caches, login sessions and counters, usually next to a relational database, not instead of it.',
          'Other kinds include wide-column databases like Cassandra for huge write volumes, search engines like Elasticsearch for full-text search, and graph databases like Neo4j for highly connected data like social networks.',
          'Relational databases are the best default for most business data: orders, payments, users, stock. They give you joins, constraints, transactions and ACID guarantees, which protect exactly the kind of data that must be correct.',
          'It is also common to start with PostgreSQL alone and add other stores only when a real problem appears, such as a page that is too slow even with good indexes. Every extra database is one more system to run, back up and secure.',
          'A balanced interview answer: "I start with PostgreSQL for core data because of its guarantees and flexibility, and add a specialised store like Redis for caching or Elasticsearch for search when there is a clear need."'
        ],
        example: 'A kitchen has a main fridge for everything, and a small drawer by the stove with the spices you use every minute. PostgreSQL is the main fridge; Redis is the spice drawer. You need both, for different jobs.',
        code: lines(
          'CREATE TABLE database_choices (need text, good_choice text, why text);',
          'INSERT INTO database_choices VALUES',
          "  ('orders and payments', 'PostgreSQL', 'transactions, constraints and joins'),",
          "  ('fast cache and sessions', 'Redis', 'in-memory key-value lookups'),",
          "  ('flexible documents', 'MongoDB or PostgreSQL jsonb', 'varying shapes of data'),",
          "  ('full-text search', 'Elasticsearch', 'ranking and searching text');",
          'SELECT need, good_choice FROM database_choices;'
        ),
        output: lines(
          ' need                    | good_choice',
          '-------------------------+-----------------------------',
          ' orders and payments     | PostgreSQL',
          ' fast cache and sessions | Redis',
          ' flexible documents      | MongoDB or PostgreSQL jsonb',
          ' full-text search        | Elasticsearch',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Money data needs the guarantees of a relational database.' }
        ],
        tryIt: "Add a row for social network friendships, with 'Neo4j or PostgreSQL' as the choice and 'connected data' as the reason.",
        check: {
          question: 'Which is usually the best default database for orders and payments?',
          options: ['A relational database like PostgreSQL', 'An in-memory cache like Redis', 'A full-text search engine'],
          answer: 0,
          why: 'Orders and payments need transactions, constraints and joins, which relational databases provide.'
        }
      },
      {
        title: 'Putting it together: a production checklist',
        say: [
          'Let us gather this week\'s safety lessons into a checklist for putting a database like the Canteen into real use.',
          'Backups: daily automatic backups, stored elsewhere, and a tested restore. Roles: an admin role for setup, an app role with only the permissions the app needs, and a read-only role for reports. Secrets: passwords in environment variables, never in code. Rules: constraints on every table, and transactions for multi-step changes.',
          'Monitoring matters too: watch for slow queries with EXPLAIN, and add indexes where needed. And keep schema changes in migration files, reviewed like any other code.',
          'In today\'s practice, you will make a copy of the products table, and restore the rows after an accidental delete.',
          'Tomorrow is the last day: SQL interview practice. You will solve the classic questions and learn to talk about your Canteen project with confidence.',
          'This checklist is exactly what a senior developer would ask about before approving a new system. Knowing it as a junior sets you apart.'
        ],
        example: 'Before a flight, the pilot goes through a checklist even after thousands of flights. The checklist is short, but skipping one item can be disastrous. A database production checklist works the same way.',
        code: lines(
          'CREATE TABLE checklist (item text, done boolean);',
          'INSERT INTO checklist VALUES',
          "  ('daily backups stored elsewhere', true), ('restore tested', false), ('app uses its own role', true),",
          "  ('read-only role for reports', true), ('secrets in environment variables', true), ('constraints on every table', true);",
          "SELECT item FROM checklist WHERE NOT done;",
          'SELECT count(*) FILTER (WHERE done) AS done, count(*) AS total FROM checklist;'
        ),
        output: lines(
          ' item',
          '----------------',
          ' restore tested',
          '(1 row)',
          '',
          ' done | total',
          '------+-------',
          '    5 |     6',
          '(1 row)'
        ),
        codeNotes: [
          { line: 5, note: 'What is still missing before going live.' },
          { line: 6, note: 'Progress: done out of total.' }
        ],
        tryIt: "Mark the restore test as done with UPDATE checklist SET done = true WHERE item = 'restore tested'; before the SELECTs.",
        check: {
          question: 'Which checklist item protects against a leaked reporting password deleting data?',
          options: ['A read-only role for reports', 'Daily backups', 'Constraints on every table'],
          answer: 0,
          why: 'A read-only role cannot change data, so even a leaked password for it cannot delete anything.'
        }
      }
    ],
    summary: [
      'Backups with pg_dump, stored elsewhere and tested by restoring, are what let you recover.',
      'CREATE TABLE ... AS TABLE copies data (not keys) as a quick safety net; restore with INSERT ... SELECT.',
      'Roles and GRANT give each user least privilege; SET ROLE shows permissions in action.',
      'Apps connect with their own limited role, never as admin.',
      'Relational databases are the default for core data; NoSQL stores serve special needs.'
    ],
    projectStep: {
      title: 'Canteen project: make it production-ready',
      steps: [
        'Back up your Canteen database with pg_dump, and restore it into a test database.',
        'Create a canteen_app role that can read the menu and add orders, but not delete anything.',
        'Create a canteen_reports role that can only read your report views.',
        'Add a "Production checklist" section to your project README.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 30,
    title: 'SQL Interview Practice',
    goal: 'You can solve the classic SQL interview questions, explain joins, indexes and transactions clearly, and present your Canteen project.',
    minutes: 28,
    recap: 'Yesterday you learned backups, restoring data, roles and permissions, and when to choose SQL or NoSQL.',
    parts: [
      {
        title: 'What SQL interviews look like',
        say: [
          'Congratulations on reaching the last day of the SQL course. SQL appears in interviews for backend developers, data analysts, testers and even product roles. Today you practise the questions that come up again and again.',
          'Most SQL interviews have three parts. Short questions about concepts: the difference between WHERE and HAVING, or INNER and LEFT JOIN. A few queries to write, often on a small example schema. And questions about a project you built.',
          'When you get a query to write, use the process from Day 28: restate the question, name the tables and joins, decide the grouping, write the query step by step, and check it against a small example. Say your thinking out loud.',
          'Interviewers care about correctness first, then clarity. A simple, correct query with good names beats a clever one that nobody can read. And mentioning edge cases, like NULLs, ties or customers with no orders, shows real experience.',
          'If you are unsure, say so honestly and explain how you would check: "I think this needs a LEFT JOIN to keep customers without orders; let me check with a small example." That is exactly what good developers do at work.',
          'The rest of today walks through the classics, each with a clean answer you can adapt.'
        ],
        example: 'A driving test examiner watches not only whether you reach the destination, but whether you check mirrors and signal. In an SQL interview, the checks you mention, like NULLs and ties, are your mirrors and signals.',
        code: lines(
          'CREATE TABLE interview_topics (topic text, typical_question text);',
          'INSERT INTO interview_topics VALUES',
          "  ('joins', 'What is the difference between INNER and LEFT JOIN?'),",
          "  ('grouping', 'What is the difference between WHERE and HAVING?'),",
          "  ('ranking', 'Find the second highest salary.'),",
          "  ('design', 'Why split data into several tables?');",
          'SELECT topic, typical_question FROM interview_topics;'
        ),
        output: lines(
          ' topic    | typical_question',
          '----------+-----------------------------------------------------',
          ' joins    | What is the difference between INNER and LEFT JOIN?',
          ' grouping | What is the difference between WHERE and HAVING?',
          ' ranking  | Find the second highest salary.',
          ' design   | Why split data into several tables?',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 7, note: 'Four classic areas, each covered in this course.' }
        ],
        tryIt: "Add a fifth topic of your own, like ('indexes', 'When would you add an index?'), and answer it out loud.",
        check: {
          question: 'In a SQL interview, what matters most in your query?',
          options: ['Correctness, then clarity, with edge cases mentioned', 'Using the most advanced features possible', 'Writing it as fast as possible without checking'],
          answer: 0,
          why: 'A correct, readable query that handles NULLs and ties shows the judgement interviewers look for.'
        }
      },
      {
        title: 'Second highest value',
        say: [
          'The most famous SQL interview question is "find the second highest salary". It tests whether you think about ties and missing values.',
          'Approach one: find the highest value below the maximum. SELECT max(salary) FROM employees WHERE salary < (SELECT max(salary) FROM employees). It handles ties at the top correctly and returns NULL if there is no second value.',
          'Approach two: dense_rank. Rank the distinct salaries with dense_rank() OVER (ORDER BY salary DESC) and keep rank 2. This generalises easily to "the Nth highest" by changing one number.',
          'A common wrong answer is ORDER BY salary DESC LIMIT 1 OFFSET 1. If two people share the top salary, it returns that same top value again. Mentioning this trap shows you understand ties.',
          'Say which approach you are using and why, and mention what happens when there is no second value. That turns a simple question into a demonstration of careful thinking.',
          'The same pattern answers many variations: second most expensive product, second latest order, the third best-selling dish.'
        ],
        example: 'In a race where two runners tie for first, who came second? Not the second of the two winners, but the next runner behind them. The question is about the second different time, which is what dense_rank finds.',
        code: lines(
          'CREATE TABLE employees (name text, salary int);',
          "INSERT INTO employees VALUES ('Anita', 90000), ('Vikram', 90000), ('Sara', 75000), ('Joel', 60000);",
          'SELECT max(salary) AS second_highest FROM employees WHERE salary < (SELECT max(salary) FROM employees);',
          'WITH ranked AS (SELECT salary, dense_rank() OVER (ORDER BY salary DESC) AS dr FROM employees)',
          'SELECT DISTINCT salary AS second_highest FROM ranked WHERE dr = 2;',
          'SELECT salary AS wrong_answer FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1;'
        ),
        output: lines(
          ' second_highest',
          '----------------',
          '          75000',
          '(1 row)',
          '',
          ' second_highest',
          '----------------',
          '          75000',
          '(1 row)',
          '',
          ' wrong_answer',
          '--------------',
          '        90000',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'The highest salary below the maximum.' },
          { line: 4, note: 'dense_rank: change 2 to N for the Nth highest.' },
          { line: 6, note: 'The trap: with a tie at the top, OFFSET 1 returns 90000 again.' }
        ],
        tryIt: 'Change dr = 2 to dr = 3 to find the third highest salary.',
        check: {
          question: 'Why is ORDER BY salary DESC LIMIT 1 OFFSET 1 a risky answer?',
          options: ['If two people share the top salary, it returns the top value again', 'It is a syntax error', 'It always returns NULL'],
          answer: 0,
          why: 'OFFSET skips rows, not values. With a tie at the top, the second row still has the top salary.'
        }
      },
      {
        title: 'Duplicates, and top N per group',
        say: [
          'Two more classics. "Find duplicate emails" tests GROUP BY and HAVING: group by email, and keep groups where count(*) > 1. Show the count too, so the interviewer sees how many times each appears.',
          'A follow-up often asks to delete the duplicates but keep one copy. The clean way uses row_number: number the rows in each email group, and delete the ones with a number above 1. Always check with a SELECT before running the DELETE.',
          '"Top N per group", like the two most expensive products in each category, uses the recipe from Day 17: row_number or rank with PARTITION BY, in a WITH step, then filter.',
          'Mention whether ties should be included. With row_number, exactly N per group; with rank, ties at the edge are all included. Asking the interviewer which they want is a good sign.',
          'These three patterns, second highest, duplicates and top N per group, cover a surprising share of real interview questions. Practise them until you can write them without looking.',
          'On a whiteboard or shared screen, write the WITH steps first as names, then fill them in. It keeps your answer organised under pressure.',
          'If you get stuck, simplify: solve the problem for one group or one row first, then generalise. Interviewers are happy to watch you build up a solution; silence is much harder for them to follow.'
        ],
        example: 'A school finds that some students registered twice for the same exam. First it lists the repeated registrations, then it keeps the earliest one and cancels the rest. That is find duplicates, then delete all but one.',
        code: lines(
          'CREATE TABLE signups (id int PRIMARY KEY, email text);',
          "INSERT INTO signups VALUES (1, 'asha@x.com'), (2, 'ravi@x.com'), (3, 'asha@x.com'), (4, 'priya@x.com'), (5, 'asha@x.com');",
          'SELECT email, count(*) AS times FROM signups GROUP BY email HAVING count(*) > 1;',
          'WITH numbered AS (SELECT id, row_number() OVER (PARTITION BY email ORDER BY id) AS rn FROM signups)',
          'DELETE FROM signups WHERE id IN (SELECT id FROM numbered WHERE rn > 1);',
          'SELECT id, email FROM signups ORDER BY id;'
        ),
        output: lines(
          ' email      | times',
          '------------+-------',
          ' asha@x.com |     3',
          '(1 row)',
          '',
          ' id | email',
          '----+-------------',
          '  1 | asha@x.com',
          '  2 | ravi@x.com',
          '  4 | priya@x.com',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Which emails repeat, and how often.' },
          { line: 4, note: 'Number each email\'s rows, keeping the earliest as 1.' },
          { line: 5, note: 'Delete every copy after the first.' }
        ],
        tryIt: 'Before the DELETE, add a SELECT that shows which ids would be deleted: SELECT id FROM numbered WHERE rn > 1 (inside its own WITH).',
        check: {
          question: 'How do you find duplicate emails?',
          options: ['GROUP BY email HAVING count(*) > 1', 'WHERE count(*) > 1', 'SELECT DISTINCT email'],
          answer: 0,
          why: 'Group the rows by email and keep groups with more than one row. WHERE cannot filter on count.'
        }
      },
      {
        title: 'Explaining concepts clearly',
        say: [
          'Concept questions test whether you can explain, not just type. Practise short, clear answers with a tiny example, like these.',
          'INNER vs LEFT JOIN: "INNER JOIN keeps only rows with a match on both sides. LEFT JOIN keeps every row from the left table and fills missing matches with NULL. For customers and orders, LEFT JOIN keeps customers who never ordered."',
          'WHERE vs HAVING: "WHERE filters rows before grouping; HAVING filters groups after aggregation. Categories with more than five products need HAVING count(*) > 5."',
          'Indexes: "An index is a sorted structure that lets the database find rows without reading the whole table. It speeds up reads but slows writes and uses space, so I index foreign keys and frequent filters, and check with EXPLAIN."',
          'Transactions: "A transaction groups changes so they all happen or none do: ACID. A money transfer debits one account and credits another in one transaction." Normalization: "Store each fact once, linked by keys, to avoid update anomalies."',
          'Short answers with one example each are much stronger than long, vague ones. Practise saying them out loud until they feel natural.'
        ],
        example: 'A good teacher explains a new idea in two sentences and one example, then checks you understood. Your interview answers should sound like that teacher, not like a textbook.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, count(o.id) AS orders_inner FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.id, c.name ORDER BY c.name;',
          'SELECT c.name, count(o.id) AS orders_left FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.id, c.name ORDER BY c.name;'
        ),
        output: lines(
          ' name  | orders_inner',
          '-------+--------------',
          ' Asha  |            2',
          ' Priya |            1',
          ' Ravi  |            1',
          '(3 rows)',
          '',
          ' name  | orders_left',
          '-------+-------------',
          ' Asha  |           2',
          ' Meera |           0',
          ' Priya |           1',
          ' Ravi  |           1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'INNER JOIN: Meera, with no orders, is missing.' },
          { line: 10, note: 'LEFT JOIN: Meera appears with 0. This tiny example is a perfect interview answer.' }
        ],
        tryIt: 'Explain out loud, in two sentences, why the two results differ. Then do the same for WHERE and HAVING.',
        check: {
          question: 'What is a strong way to answer a concept question in an interview?',
          options: ['A short, clear explanation with one small example', 'A long list of every detail you know', 'Just the definition, with no example'],
          answer: 0,
          why: 'A crisp explanation plus a tiny example shows you understand and can communicate, which interviewers value.'
        }
      },
      {
        title: 'Talking about your Canteen project',
        say: [
          '"Tell me about a database you designed" is your chance to shine. Prepare a two-minute answer about the Canteen project, and practise it out loud.',
          'A simple structure: what it is ("a database for a college canteen: menu, orders and order items"), the design ("three tables in third normal form, with a junction table for the many-to-many link"), the rules ("positive prices, one row per dish per order, and dishes in past orders cannot be deleted"), the reports ("best sellers, daily takings and student spending, saved as views"), and safety ("orders are placed in a transaction, and apps connect with a limited role").',
          'Then mention one decision and its trade-off: "I used the student\'s name for the first version; with more time, I would add a students table with ids, because two students can share a name." Honest limitations show maturity.',
          'Keep your GitHub repository tidy: schema.sql, views.sql, tests.sql and a clear README with an example report. Interviewers sometimes open it during the call.',
          'If you also finished the Python or React course, connect them: "I also wrote a small script that reads the menu using parameterised queries." Linking skills shows you can build complete features.',
          'Most importantly, speak about what you actually did and learned. Real experience, told simply, is more convincing than big words.'
        ],
        example: 'When someone asks about your trip, a good story has a start, what you did, one thing that went wrong, and what you would do differently. A project answer follows the same shape.',
        code: lines(
          'CREATE TABLE my_pitch (part int, says text);',
          'INSERT INTO my_pitch VALUES',
          "  (1, 'What: a canteen database for menus, orders and order items.'),",
          "  (2, 'Design: three tables in 3NF, with a junction table for order items.'),",
          "  (3, 'Rules: positive prices, one line per dish per order, safe deletes.'),",
          "  (4, 'Reports: best sellers, daily takings and spending, saved as views.'),",
          "  (5, 'Next: a students table with ids, because names can repeat.');",
          'SELECT says FROM my_pitch ORDER BY part;',
          "SELECT sum(array_length(regexp_split_to_array(says, '\\s+'), 1)) AS words FROM my_pitch;"
        ),
        output: lines(
          ' says',
          '---------------------------------------------------------------------',
          ' What: a canteen database for menus, orders and order items.',
          ' Design: three tables in 3NF, with a junction table for order items.',
          ' Rules: positive prices, one line per dish per order, safe deletes.',
          ' Reports: best sellers, daily takings and spending, saved as views.',
          ' Next: a students table with ids, because names can repeat.',
          '(5 rows)',
          '',
          ' words',
          '-------',
          '    53',
          '(1 row)'
        ),
        codeNotes: [
          { line: 8, note: 'Your pitch in order: what, design, rules, reports, next steps.' },
          { line: 9, note: 'Count the words. Around 250 words is about two minutes of speaking.' }
        ],
        tryIt: 'Rewrite each part in your own words, with more detail, until the word count is around 250.',
        check: {
          question: 'Why mention a limitation of your project in an interview?',
          options: ['It shows you understand trade-offs and know how to improve the design', 'It makes the project sound unfinished', 'Interviewers require it'],
          answer: 0,
          why: 'Knowing the limits of your own design, and how you would fix them, shows real understanding.'
        }
      },
      {
        title: 'Your next steps',
        say: [
          'In one month you learned to read, filter, sort, total, group, join and nest queries; to design tables with keys, rules and good structure; to use transactions, indexes, views and JSON; and to use a database safely from code. That is a solid foundation for junior backend and data roles.',
          'To keep growing, practise regularly. Sites like LeetCode, HackerRank and StrataScratch have SQL problems at every level. One or two a day keeps the patterns fresh.',
          'Build on your project: connect the Canteen database to a small Python FastAPI or Node.js app, add a students table, or put it online with a free cloud PostgreSQL service and show the live link on your CV.',
          'Next topics worth learning are query performance in more depth, database migrations with a tool like Alembic or Prisma, and a first look at data warehousing and analytics tools if you enjoy reports.',
          'Apply for internships and junior roles while you keep learning. Each interview is practice, and every question you could not answer is a topic for next week.',
          'In today\'s practice, you will find the second highest price and the duplicate emails, two of the most asked SQL interview questions. Well done on completing the course.'
        ],
        example: 'Learning to swim does not end when you first cross the pool. You keep swimming, a little further each time. This course got you across the pool; your projects and practice are the longer swims.',
        code: lines(
          "SELECT 'You finished the SQL course!' AS message;",
          'WITH RECURSIVE weeks(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM weeks WHERE n < 4)',
          "SELECT n AS week, CASE n WHEN 1 THEN 'Daily SQL practice problems' WHEN 2 THEN 'Connect Canteen to a small app'",
          "  WHEN 3 THEN 'Put the database online' ELSE 'Apply for internships' END AS plan",
          'FROM weeks;'
        ),
        output: lines(
          ' message',
          '------------------------------',
          ' You finished the SQL course!',
          '(1 row)',
          '',
          ' week | plan',
          '------+--------------------------------',
          '    1 | Daily SQL practice problems',
          '    2 | Connect Canteen to a small app',
          '    3 | Put the database online',
          '    4 | Apply for internships',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'A recursive CTE from Day 16 makes the four weeks.' },
          { line: 3, note: 'CASE from Day 19 gives each week its plan.' }
        ],
        tryIt: 'Change the plan for each week to your own goals, and save the result somewhere you will see it every day.',
        check: {
          question: 'What is a good way to keep SQL skills sharp after the course?',
          options: ['Solve a few SQL problems regularly and keep building on your project', 'Stop using SQL until you get a job', 'Only read theory'],
          answer: 0,
          why: 'Regular practice and real projects keep the patterns fresh and give you more to talk about in interviews.'
        }
      }
    ],
    summary: [
      'Solve interview queries step by step, out loud, and check edge cases like NULLs and ties.',
      'Second highest: max below the max, or dense_rank; beware LIMIT 1 OFFSET 1 with ties.',
      'Duplicates: GROUP BY ... HAVING count(*) > 1; delete extras with row_number.',
      'Explain concepts in two sentences with one tiny example.',
      'Present your Canteen project: what, design, rules, reports, and what you would improve.'
    ],
    projectStep: {
      title: 'Get interview-ready',
      steps: [
        'Write your two-minute Canteen pitch and practise it out loud three times.',
        'Solve second highest, duplicates and top N per group without looking at notes.',
        'Tidy your GitHub repository: schema.sql, views.sql, tests.sql and a README.',
        'Add the project and its GitHub link to your CV and LinkedIn.'
      ]
    }
  },
      {
    "day": 31,
    "coursePrefix": "sql-mastery",
    "title": "Advanced Query Optimization, Cost-Based Optimizer Mechanics & EXPLAIN ANALYZE Execution Plans",
    "goal": "Master relational query optimization mechanics: cost-based algebraic formulas, physical scan tradeoffs (Seq Scan vs Index Scan vs Bitmap Scan), join execution operators (Nested Loop, Hash Join, Merge Join), EXPLAIN ANALYZE buffer profiling, and multivariate extended statistics remediation.",
    "minutes": 35,
    "recap": "Welcome to Month 2 of SQL Mastery. Having built robust relational schemas and core queries in Month 1, we now transition to database internals, cost-based query optimization, physical storage layouts, and enterprise performance engineering.",
    "parts": [
      {
        "part": 1,
        "title": "Relational Algebra, AST Query Parsing & Cost-Based Optimizer (CBO) Cost Formulations",
        "say": [
          "Welcome to Month Two of Advanced Relational Database Engineering. In this opening masterclass, we transition from querying data to deconstructing the internal physical execution engine that powers high-scale relational database systems. Every declarative SQL statement submitted by a client application represents what data is required, not how the database should retrieve it. The transformation of a high-level declarative query string into an optimal low-level procedural execution plan is the sole responsibility of the Cost-Based Optimizer, commonly known as the CBO. When your query reaches PostgreSQL or any enterprise relational engine, it is first parsed into an Abstract Syntax Tree, validated against the system catalogs, and converted into relational algebra expressions consisting of selections, projections, Cartesian products, joins, and aggregations.",
          "The query rewriter applies formal equivalence transformations to simplify the relational algebra tree, flattening nested subqueries, pushing down selection predicates so filtering occurs as close to physical disk storage as possible, and eliminating redundant join paths. Once the logical query tree is stabilized, the query planner takes over. The planner generates a vast candidate space of physical execution trees. For each candidate plan, the optimizer calculates an abstract mathematical cost metric. This cost does not represent real-world wall-clock seconds because hardware speeds vary dramatically across environments; rather, the cost is expressed in arbitrary cost units normalized relative to sequential disk page fetches. The foundational PostgreSQL cost formulation expresses total plan cost as the linear combination of input-output operations and central processing unit tuple cycles.",
          "Statistically, the cost equation is formulated as: total cost equals the number of physical disk pages fetched multiplied by the page cost factor, plus the total number of candidate tuples processed multiplied by the tuple processing cost factor, plus the CPU operator evaluation overhead. To ground this equation in physical reality, the planner queries the system catalog table pg_class, inspecting relpages (the total number of eight-kilobyte disk blocks occupied by the relation) and reltuples (the estimated total number of live rows). By default, PostgreSQL defines seq_page_cost as 1.0, representing the baseline cost to read a single eight-kilobyte page sequentially from disk. Conversely, random_page_cost defaults to 4.0 in traditional configurations, reflecting the rotational latency and mechanical seek overhead of traditional spinning hard disk drives where non-contiguous head repositioning takes roughly four times longer than sequential streaming reads.",
          "On modern non-volatile memory express solid-state drives, where physical head movement is absent and parallel memory channels deliver near-uniform random latency, maintaining a random_page_cost of 4.0 severely handicaps the optimizer, leading it to mistakenly favor slow sequential table scans over fast indexed index scans. Enterprise database architects routinely tune random_page_cost down to 1.1 on NVMe storage to align theoretical mathematical models with physical hardware realities. Along with page costs, the engine models cpu_tuple_cost at 0.01 for inspecting each row header, cpu_index_tuple_cost at 0.005 for traversing B-tree index entries, and cpu_operator_cost at 0.0025 for evaluating operators and comparison functions in WHERE clauses. When parallel query execution is triggered, parallel_tuple_cost and parallel_setup_cost are incorporated to model inter-process IPC overhead.",
          "When examining an execution plan, the optimizer displays costs in a standardized format consisting of two decimal numbers: startup cost and total cost. The startup cost represents the computational effort expended before the first output tuple can be emitted to the client stream. For example, a sequential scan has a startup cost of zero because the engine emits the very first row encountered that satisfies the predicate immediately upon reading page zero. Conversely, an explicit sort node or a hash table construction node incurs a high startup cost because all input rows must be read, hashed, or sorted in memory before the first output row can be determined. Furthermore, the optimizer evaluates selectivity using univariate column histograms in pg_statistic. Understanding cost formulations empowers you to diagnose why the planner chose a specific execution path and systematically tune system parameters."
        ],
        "example": "Consider a massive regional logistics parcel sorting warehouse. When an automated dispatch scanner evaluates how to retrieve customer shipments, it computes two delivery routes. Route Alpha sends a forklift driving sequentially down every single aisle of the facility, inspecting all twenty thousand storage bins; this route requires predictable transit time but wastes energy if only five packages are needed. Route Beta uses an indexed radio-frequency locator card that jumps directly to specific shelf locations; this route incurs repositioning delays but is blazingly fast for small batches. The warehouse dispatch controller calculates mathematical effort scores for both strategies before dispatching workers, exactly like the database Cost-Based Optimizer evaluates sequential versus indexed access costs.",
        "code": "-- Cost-Based Optimizer Mathematical Formulation Simulation\nCREATE TABLE planner_cost_model (\n  scan_type text PRIMARY KEY,\n  pages_fetched int NOT NULL,\n  tuples_inspected int NOT NULL,\n  page_cost_factor numeric(4,2) NOT NULL,\n  tuple_cost_factor numeric(4,2) NOT NULL\n);\n\nINSERT INTO planner_cost_model VALUES\n('Sequential Scan (All Pages)', 1250, 100000, 1.00, 0.01),\n('Index Scan (Spinning Disk HDD)', 25, 100, 4.00, 0.01),\n('Index Scan (Modern NVMe SSD)', 25, 100, 1.10, 0.01);\n\nSELECT \n  scan_type,\n  pages_fetched,\n  tuples_inspected,\n  ROUND((pages_fetched * page_cost_factor) + (tuples_inspected * tuple_cost_factor), 2) AS estimated_total_cost\nFROM planner_cost_model\nORDER BY estimated_total_cost ASC;",
        "tryIt": "Evaluate query cost models by adjusting random page parameter values in the formulation table to witness cost convergence.",
        "check": {
          "question": "In PostgreSQL Cost-Based Optimizer cost modeling, what physical hardware transition justifies lowering random_page_cost from the default 4.0 to 1.1?",
          "options": [
            "Migrating from mechanical spinning hard disk drives to high-throughput NVMe solid-state drives with uniform random read latency",
            "Upgrading the central processing unit from thirty-two cores to sixty-four cores to accelerate cryptographic hashes",
            "Enabling synchronous replication across three availability zones to prevent multi-region network failovers",
            "Switching client connection poolers from PgBouncer transaction mode to dedicated session thread pools"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "Default random_page_cost is set to 4.0 to model rotational latency and seek penalties on mechanical hard drives. On modern NVMe SSDs, random access is almost as fast as sequential access, so lowering random_page_cost to 1.1 prevents the optimizer from penalizing index scans.",
          "explanation": "Default random_page_cost is set to 4.0 to model rotational latency and seek penalties on mechanical hard drives. On modern NVMe SSDs, random access is almost as fast as sequential access, so lowering random_page_cost to 1.1 prevents the optimizer from penalizing index scans."
        },
        "output": " scan_type                      | pages_fetched | tuples_inspected | estimated_total_cost\n--------------------------------+---------------+------------------+----------------------\n Index Scan (Modern NVMe SSD)   |            25 |              100 |                28.50\n Index Scan (Spinning Disk HDD) |            25 |              100 |               101.00\n Sequential Scan (All Pages)    |          1250 |           100000 |              2250.00\n(3 rows)"
      },
      {
        "part": 2,
        "title": "Scan Mechanics: Sequential Scan vs Index Scan vs Bitmap Index Scan & Page Prefetching",
        "say": [
          "Now that we have established how the query planner computes abstract cost metrics, we examine the physical scan mechanics used to extract tuples from storage. When a query requests rows from a table, the PostgreSQL executor selects from three primary table scan access paths: the Sequential Scan, the Index Scan, and the Bitmap Index Scan. Choosing the wrong scan access path is the single most frequent cause of catastrophic query latency spikes in production environments. The simplest mechanism is the Sequential Scan (Seq Scan). In a sequential scan, the engine opens the table's physical heap relation file on disk and reads every single eight-kilobyte page into shared buffers sequentially from the beginning to the end, applying the filter condition to each tuple.",
          "A Sequential Scan is remarkably efficient when a query requests a large percentage of the table\u2014typically exceeding fifteen to twenty percent selectivity\u2014because sequential reads allow the operating system and storage controller to activate aggressive read-ahead caching and hardware prefetching algorithms. Reading pages sequentially saturates memory bus bandwidth without incurring mechanical or flash controller address repositioning overhead. Furthermore, modern PostgreSQL introduces parallel sequential scans, where multiple background workers divide the heap pages among themselves via a shared block counter in dynamic shared memory. Each worker reads a distinct chunk of eight-kilobyte pages, filters rows in parallel, and streams surviving tuples to a Gather or Gather Merge plan node. However, when querying five specific customer accounts out of fifty million records, a sequential scan wastes hundreds of gigabytes of disk I/O.",
          "To accelerate selective lookups, the database provides the Index Scan. In an index scan, the executor traverses a B-tree or specialized index structure from root to branch to leaf page using binary search to find the target index keys. Each leaf index tuple contains the physical tuple identifier (TID), which consists of a block number and an item offset pointing directly to the heap page where the full row resides. The engine then reads the corresponding heap page to retrieve the remaining table columns and verify multi-version concurrency control (MVCC) visibility. While lightning fast for retrieving a handful of tuples, an index scan suffers from a severe physical bottleneck: random heap I/O.",
          "Because B-tree index entries are ordered logically by the indexed column value rather than by physical disk storage address, scanning five thousand rows via an index scan can cause the storage head or SSD controller to jump erratically back and forth across thousands of different heap blocks. If two adjacent index keys point to tuples located on opposite ends of a sixty-gigabyte file, the engine performs two distinct random page reads. In contrast, when a table is clustered or organized with covering indexes containing non-key columns via the INCLUDE clause, the database can execute an Index-Only Scan. In an Index-Only Scan, the executor retrieves all requested data directly from the leaf pages of the index, consulting the Visibility Map to skip heap reads entirely for all-visible pages.",
          "To resolve this dilemma for intermediate selectivity, PostgreSQL introduced the Bitmap Index Scan paired with a Bitmap Heap Scan. In this two-phase access path, the engine first traverses the index and builds a bitmap structure in dynamic memory. In this bitmap, each bit represents an exact tuple or an entire eight-kilobyte heap page. If multiple index conditions exist, such as customer state equals New York and order date greater than January first, PostgreSQL can scan both indexes independently and perform bitwise AND operations directly on the bitmaps in memory. Once the unified bitmap is constructed, the second phase begins: the Bitmap Heap Scan reads the physical heap pages in strict sequential disk block order, skipping all pages containing zero matching bits. If memory is tight and work_mem is exceeded during bitmap construction, the bitmap becomes lossy, recording whole pages rather than exact tuples and adding a Recheck Cond filter step. This architecture eliminates random disk thrashing while avoiding scanning unneeded pages."
        ],
        "example": "Imagine a municipal library containing fifty thousand books organized across five floors. If an auditor wants to inspect ninety percent of the library collection, walking sequentially down every aisle shelf by shelf is the fastest approach. If a student wants a single specific poetry volume, checking the digital catalog card and walking directly to room four, shelf B, row three is an efficient index scan. But if a historian wants four hundred books on naval warfare scattered randomly across fifty rooms, running back and forth for each book would cause total exhaustion. Instead, the historian writes down all room and shelf numbers, sorts the list numerically by room, and visits the rooms in sequential order with a library cart; this is the physical realization of a bitmap heap scan.",
        "code": "-- Scan Mechanics & Selectivity Threshold Evaluation\nCREATE TABLE warehouse_inventory (\n  sku_id serial PRIMARY KEY,\n  category text NOT NULL,\n  warehouse_zone char(1) NOT NULL,\n  stock_count int NOT NULL\n);\n\nINSERT INTO warehouse_inventory (category, warehouse_zone, stock_count) VALUES\n('Electronics', 'A', 450),\n('Electronics', 'A', 120),\n('Furniture', 'B', 15),\n('Apparel', 'C', 890),\n('Industrial', 'D', 50);\n\nCREATE INDEX idx_inventory_category ON warehouse_inventory(category);\n\n-- Inspect access path selectivity behavior\nSELECT \n  category,\n  COUNT(*) AS item_count,\n  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS selectivity_percentage,\n  CASE \n    WHEN COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () > 25.0 THEN 'Planner Favors: Sequential Scan'\n    ELSE 'Planner Favors: Index / Bitmap Scan'\n  END AS anticipated_access_path\nFROM warehouse_inventory\nGROUP BY category\nORDER BY item_count DESC;",
        "tryIt": "Execute the selectivity evaluation query to examine how percentage thresholds dictate planner scan decisions.",
        "check": {
          "question": "Why does a PostgreSQL query planner choose a Bitmap Index Scan followed by a Bitmap Heap Scan instead of a standard Index Scan for intermediate selectivity queries?",
          "options": [
            "It collects heap page addresses in a memory bitmap and visits them in physical disk block order, eliminating random I/O thrashing",
            "It compresses all string columns into fixed-width binary arrays to reduce network transmission payload sizes",
            "It disables multi-version concurrency control visibility checks to bypass table snapshot isolation overhead",
            "It automatically replicates the entire table across background worker threads to execute parallel aggregation"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "A standard Index Scan causes random disk I/O because index order does not match physical storage layout. A Bitmap Index Scan creates a memory bitmap of target pages and visits them in physical sequential order during the Bitmap Heap Scan phase, avoiding random head thrashing.",
          "explanation": "A standard Index Scan causes random disk I/O because index order does not match physical storage layout. A Bitmap Index Scan creates a memory bitmap of target pages and visits them in physical sequential order during the Bitmap Heap Scan phase, avoiding random head thrashing."
        },
        "output": " category    | item_count | selectivity_percentage | anticipated_access_path\n-------------+------------+------------------------+-------------------------------------\n Electronics |          2 |                   40.0 | Planner Favors: Sequential Scan\n Furniture   |          1 |                   20.0 | Planner Favors: Index / Bitmap Scan\n Industrial  |          1 |                   20.0 | Planner Favors: Index / Bitmap Scan\n Apparel     |          1 |                   20.0 | Planner Favors: Index / Bitmap Scan\n(4 rows)"
      },
      {
        "part": 3,
        "title": "Join Algorithms: Nested Loop, Hash Join (In-Memory & Multi-Batch Grace Hash) & Merge Join",
        "say": [
          "When a query joins two or more relational tables, the optimizer must select a concrete physical join algorithm. In relational algebra, a join is conceptually a filtered Cartesian cross-product, which exhibits an unoptimized time complexity of O(M multiplied by N). For two tables containing one million rows each, a naive nested loop would evaluate one trillion tuple comparisons, permanently locking CPU cores. In formal relational algebra literature, joins can be classified into Equi-Joins, Theta-Joins, Natural Joins, Semi-Joins, and Anti-Joins. While Semi-Joins (expressed via EXISTS) and Anti-Joins (expressed via NOT EXISTS) can terminate scanning the inner relation as soon as the very first match is encountered, standard inner and outer joins must exhaustively process all candidate pairs. The relational query optimizer utilizes three fundamental physical join algorithms to reduce join complexity to near-linear performance: the Nested Loop Join, the Hash Join, and the Merge Join. Selecting the correct join operator depends entirely on cardinality estimates, available memory buffers, and index availability.",
          "The Nested Loop Join is the oldest and most fundamental join operator. In this algorithm, the executor designates one table as the outer relation and the other as the inner relation. For each row extracted from the outer relation, the engine scans the inner relation looking for matching join keys. In an unindexed nested loop, the inner relation is scanned sequentially for every outer tuple, resulting in disastrous O(M multiplied by N) performance. However, when the inner relation has an index on the join column, the algorithm becomes an Index Nested Loop Join. For each outer row, the engine performs an efficient O(log N) index probe on the inner table. When scanning outer rows, the executor can also prefetch inner index pages into the buffer cache using asynchronous I/O requests to reduce stalls.",
          "The Nested Loop Join is the fastest join mechanism when the outer relation is tiny\u2014such as an outer set of ten rows\u2014and the inner relation has a B-tree index. Ten index lookups execute in less than one millisecond. However, if the outer relation contains two hundred thousand rows, executing two hundred thousand individual B-tree traversals causes severe random I/O and CPU exhaustion. For large, unindexed datasets where equality joins are performed, the optimizer turns to the workhorse of modern analytical and transactional databases: the Hash Join.",
          "The Hash Join operates in two distinct phases: the Build Phase and the Probe Phase. In the build phase, the executor scans the inner table (which the optimizer deliberately chooses as the smaller relation based on cardinality statistics) and inserts all candidate rows into an in-memory hash table constructed within the session's work_mem allocation. The hash key is computed from the join columns. Once the hash table is fully populated, the probe phase begins: the executor streams tuples from the larger outer relation, hashes each outer join key, and performs an instant O(1) hash lookup to find matching inner rows. The overall time complexity of an in-memory hash join is linear: O(M plus N). In parallel execution, workers cooperate on a Shared Parallel Hash Join in dynamic shared memory.",
          "However, the Hash Join has a critical operational vulnerability: memory exhaustion. If the inner relation's hash table exceeds the allocated work_mem buffer, the engine cannot maintain the hash table entirely in dynamic RAM. In this scenario, PostgreSQL degrades to a multi-batch Grace Hash Join. The engine partitions both relations into disk-backed buckets using an auxiliary hash function, writing batches out to temporary files on disk. The executor then loads each batch sequentially into memory and probes it, incurring substantial disk read-write amplification. The third operator, the Merge Join, avoids hash tables entirely by requiring both inputs to be sorted on the join key, merging them like a zipper in O(M plus N) time, making it ideal when B-tree indexes already provide pre-sorted streams or for non-equality range overlaps."
        ],
        "example": "Imagine an event registration desk matching five hundred attendee tickets against an alphabetical database of fifty thousand registered guests. A nested loop approach would pick up each ticket and search the entire paper registry from cover to cover five hundred times. A hash join approach sets up twenty-six labeled collection boxes (a hash table in memory), places attendee records into corresponding boxes, and instantly sorts incoming tickets by dropping them into the matching box. A merge join approach sorts all tickets alphabetically first, places the two sorted stacks side-by-side, and advances down both stacks synchronously like teeth interlocking on a jacket zipper.",
        "code": "-- Join Mechanics: Nested Loop, Hash Join, and Merge Join Demonstration\nCREATE TABLE operational_departments (\n  dept_id int PRIMARY KEY,\n  dept_name text NOT NULL,\n  budget_allocation numeric(12,2) NOT NULL\n);\n\nCREATE TABLE enterprise_employees (\n  emp_id serial PRIMARY KEY,\n  dept_id int REFERENCES operational_departments(dept_id),\n  full_name text NOT NULL,\n  annual_salary numeric(10,2) NOT NULL\n);\n\nINSERT INTO operational_departments VALUES\n(101, 'Engineering & Architecture', 4500000.00),\n(102, 'Data Platform Systems', 3200000.00),\n(103, 'Global Security Operations', 2100000.00);\n\nINSERT INTO enterprise_employees (dept_id, full_name, annual_salary) VALUES\n(101, 'Elena Rostova', 165000.00),\n(101, 'Marcus Vance', 142000.00),\n(102, 'Siddharth Nair', 158000.00),\n(102, 'Amina Toure', 149000.00),\n(103, 'David Kim', 138000.00);\n\n-- Execute relational inner join to demonstrate join cardinality\nSELECT \n  d.dept_name,\n  e.full_name,\n  e.annual_salary,\n  ROUND(e.annual_salary * 100.0 / d.budget_allocation, 2) AS pct_dept_budget\nFROM operational_departments d\nJOIN enterprise_employees e ON d.dept_id = e.dept_id\nORDER BY d.dept_name, e.annual_salary DESC;",
        "tryIt": "Execute relational inner joins to inspect department budget allocations across corporate employee divisions.",
        "check": {
          "question": "What operational condition forces an in-memory Hash Join to degrade into a multi-batch disk-spilling Grace Hash Join?",
          "options": [
            "The inner relation hash table size exceeds the session work_mem memory parameter limit, forcing disk partitions",
            "The outer table contains foreign key constraints that conflict with the primary key index ordering",
            "The database administrator executes an explicit LOCK TABLE command in read committed transaction mode",
            "The query contains an ORDER BY clause that sorts on an unindexed non-numeric text column"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "When the inner relation's hash table cannot fit within the session's work_mem allocation, PostgreSQL splits the hash table into multiple batches and writes them to temporary disk files, creating a multi-batch hash join with disk spill overhead.",
          "explanation": "When the inner relation's hash table cannot fit within the session's work_mem allocation, PostgreSQL splits the hash table into multiple batches and writes them to temporary disk files, creating a multi-batch hash join with disk spill overhead."
        },
        "output": " dept_name                  | full_name      | annual_salary | pct_dept_budget\n----------------------------+----------------+---------------+-----------------\n Data Platform Systems      | Siddharth Nair |     158000.00 |            4.94\n Data Platform Systems      | Amina Toure    |     149000.00 |            4.66\n Engineering & Architecture | Elena Rostova  |     165000.00 |            3.67\n Engineering & Architecture | Marcus Vance   |     142000.00 |            3.16\n Global Security Operations | David Kim      |     138000.00 |            6.57\n(5 rows)"
      },
      {
        "part": 4,
        "title": "EXPLAIN ANALYZE Deep Dive: Buffers, Loops, Execution Timings & WorkMem Spills to Disk",
        "say": [
          "To diagnose query performance and inspect the physical decisions made by the Cost-Based Optimizer, database engineers rely on the most essential diagnostic tool in relational engineering: EXPLAIN ANALYZE. While running EXPLAIN by itself merely displays the optimizer's theoretical cost estimates and expected row counts without executing the query, adding the ANALYZE keyword instructs the engine to actually execute the statement to completion, measure wall-clock elapsed timings, track buffer cache access counters, and display actual row counts alongside the initial estimates. In enterprise performance monitoring, executing EXPLAIN without execution is referred to as dry planning, which consumes minimal CPU overhead and is safe for high-concurrency production inspection. However, dry planning relies strictly on statistical estimates stored in the catalog, which may be stale if autovacuum has not processed the table recently. By contrasting a dry EXPLAIN plan against an EXPLAIN ANALYZE execution trace, engineers pinpoint exact areas where optimizer cost models diverge from physical execution reality.",
          "When interpreting an EXPLAIN ANALYZE execution plan, the output is structured as a hierarchical tree of execution nodes, read from inside out and bottom to top. Each node begins with two sets of statistics enclosed in parentheses: the optimizer's preliminary estimate (cost=start..total rows=N width=W), followed immediately by the true runtime execution measurements (actual time=start..total rows=N loops=L). When analyzing execution times, distinguish carefully between startup time and total time. The startup time represents the interval elapsed between node initialization and emitting the very first tuple, whereas total time represents the completion time when the last tuple is delivered. For a client application fetching paginated results with LIMIT 10, an execution plan with a low startup cost is vastly superior to one with high startup delay.",
          "If you observe an execution plan where the optimizer estimated rows equals one, but the actual rows equals five hundred thousand, you have identified a catastrophic cardinality estimation error. A five-hundred-thousand-fold estimation error causes the planner to make fatal architectural decisions: it may choose an index nested loop join assuming it will only perform one index lookup, whereas in production it executes five hundred thousand random I/O index probes, locking CPU cores and stalling disk controllers. Checking the loops multiplier is equally crucial: if an inner node reports actual time equals two milliseconds and loops equals ten thousand, the true cumulative time expended in that node is twenty thousand milliseconds (twenty seconds).",
          "Furthermore, running EXPLAIN with the BUFFERS option enabled exposes memory interaction metrics: shared hit, shared read, shared dirtied, and shared written. A shared hit counter indicates that the eight-kilobyte page was already cached in PostgreSQL's shared_buffers pool in RAM, executing at memory bus speeds without disk latency. A shared read counter indicates a buffer cache miss: the engine was forced to issue a physical read request to the operating system kernel page cache or the underlying NVMe storage subsystem. A high ratio of shared reads relative to shared hits reveals that your working dataset exceeds memory capacity, indicating either undersized shared_buffers or missing indexes that cause massive sequential table scans. Dirtied buffers show modifications written to cache that autovacuum or the checkpointer must later flush.",
          "Finally, pay acute attention to sorting, hashing, and Just-In-Time (JIT) compilation execution details. If an execution node displays 'Sort Method: external merge Disk: 4096kB', it signifies that the data being sorted exceeded the available work_mem memory limit, forcing the engine to flush sorted runs to temporary files on disk and merge them. Disk-based sorting is orders of magnitude slower than in-memory quicksort or top-N heapsort. Similarly, when JIT is enabled, PostgreSQL compiles tuple deforming and expression evaluation into native machine code; if jit_above_cost is set too low, the query may spend fifty milliseconds compiling code for a query that only takes two milliseconds to execute. By examining disk spills, buffer hits, and WAL write volume in EXPLAIN ANALYZE, engineers surgically optimize production workloads."
        ],
        "example": "Think of a professional restaurant kitchen operating during a busy dinner service. The head chef prepares a prep sheet predicting that ten guests will order grilled salmon (the optimizer estimate). If four hundred guests suddenly order salmon (the actual runtime measurement), the kitchen immediately runs out of counter space, ingredients spill into the hallway storage closets (a work_mem disk spill), and prep line workers collide in total chaos. An audit report recording prep estimates, actual orders, pantry trips (shared reads), and hallway storage overflows is the exact real-world equivalent of an EXPLAIN ANALYZE BUFFERS report.",
        "code": "-- EXPLAIN Metrics & Plan Node Diagnostics Simulation Table\nCREATE TABLE query_execution_diagnostics (\n  node_id int PRIMARY KEY,\n  node_type text NOT NULL,\n  cost_estimate_startup numeric(8,2) NOT NULL,\n  cost_estimate_total numeric(8,2) NOT NULL,\n  actual_time_ms numeric(8,2) NOT NULL,\n  actual_rows_returned int NOT NULL,\n  buffers_shared_hit int NOT NULL,\n  buffers_shared_read int NOT NULL,\n  memory_sort_method text NOT NULL\n);\n\nINSERT INTO query_execution_diagnostics VALUES\n(1, 'Aggregate (HashAggregate)', 145.00, 180.50, 4.12, 5, 42, 0, 'In-Memory Hash'),\n(2, 'Hash Join (Inner)', 12.50, 140.00, 3.85, 450, 38, 2, 'In-Memory Build'),\n(3, 'Seq Scan on audit_events', 0.00, 95.00, 2.10, 10000, 12, 18, 'None'),\n(4, 'Sort (ORDER BY timestamp DESC)', 85.00, 115.00, 14.80, 10000, 15, 45, 'external merge Disk: 2048kB');\n\n-- Identify execution bottlenecks and disk spills\nSELECT \n  node_type,\n  actual_time_ms,\n  actual_rows_returned,\n  buffers_shared_hit,\n  buffers_shared_read,\n  ROUND(buffers_shared_hit * 100.0 / NULLIF(buffers_shared_hit + buffers_shared_read, 0), 1) AS buffer_cache_hit_pct,\n  memory_sort_method\nFROM query_execution_diagnostics\nORDER BY actual_time_ms DESC;",
        "tryIt": "Execute the query diagnostics analysis to detect which plan nodes suffer from buffer cache misses and external disk spills.",
        "check": {
          "question": "What does the label 'Sort Method: external merge Disk: 4096kB' in an EXPLAIN ANALYZE execution plan indicate?",
          "options": [
            "The sort operation exceeded the session work_mem allocation and spilled intermediate sorted runs to temporary disk files",
            "The query engine automatically created a permanent B-tree index on disk to accelerate future sorting operations",
            "The disk controller suffered a hardware block corruption error while saving query results to the transaction log",
            "The operating system ran out of virtual memory swap space and terminated background database worker processes"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "When an order by or sort operation requires more memory than permitted by the work_mem configuration parameter, PostgreSQL cannot complete an in-memory quicksort; it flushes runs to disk and executes an external merge sort.",
          "explanation": "When an order by or sort operation requires more memory than permitted by the work_mem configuration parameter, PostgreSQL cannot complete an in-memory quicksort; it flushes runs to disk and executes an external merge sort."
        },
        "output": " node_type                      | actual_time_ms | actual_rows_returned | buffers_shared_hit | buffers_shared_read | buffer_cache_hit_pct | memory_sort_method\n--------------------------------+----------------+----------------------+--------------------+---------------------+----------------------+-----------------------------\n Sort (ORDER BY timestamp DESC) |          14.80 |                10000 |                 15 |                  45 |                 25.0 | external merge Disk: 2048kB\n Aggregate (HashAggregate)      |           4.12 |                    5 |                 42 |                   0 |                100.0 | In-Memory Hash\n Hash Join (Inner)              |           3.85 |                  450 |                 38 |                   2 |                 95.0 | In-Memory Build\n Seq Scan on audit_events       |           2.10 |                10000 |                 12 |                  18 |                 40.0 | None\n(4 rows)"
      },
      {
        "part": 5,
        "title": "Diagnostic Outage & Mitigation: Resolving Runaway Query Spills and Bad Cardinality Estimation with Extended Statistics",
        "say": [
          "We conclude this advanced optimization masterclass with an enterprise production outage post-mortem: The Runaway Query Spill and Correlated Column Outage. Consider the following high-severity incident: An enterprise e-commerce platform experienced a critical performance degradation during a high-volume flash sale event. Client API response times surged from twenty-five milliseconds to over eighteen seconds, connection pools in PgBouncer were completely exhausted, and database CPU utilization pinned at one hundred percent across all sixty-four cores. Application health checks failed, initiating cascading service restarts across the entire microservice mesh. During severe database incidents, connection pools rapidly saturate because client requests that ordinarily take five milliseconds begin taking fifteen seconds. In accordance with Little's Law, when average request latency increases by a factor of three thousand, the number of concurrent in-flight connections required to sustain the same transaction throughput also surges by three thousand. Once all available database worker connections are consumed, incoming HTTP requests from the API gateway queue up, timeout, and trigger global service outages across customer-facing applications.",
          "The site reliability engineering team pulled the PostgreSQL slow query log and extracted the failing query: a routine customer order lookup filtering on two demographic columns: WHERE customer_country equals 'United States' AND customer_state equals 'California'. When the database administrator executed EXPLAIN ANALYZE on this query, the root cause was laid bare. The table customer_addresses contained ten million rows. The query planner estimated that the filter would match exactly twelve rows (rows=12). However, in the physical production dataset, the query actually matched eight hundred thousand rows (actual rows=800,000). Why was the optimizer so disastrously wrong?",
          "By default, the Cost-Based Optimizer assumes that individual column values in a table are completely independent statistical variables. In formal statistical theory, the independence assumption states that the joint probability of two independent events A and B equals the product of their individual probabilities: P(A and B) = P(A) * P(B). When applied to relational tables, PostgreSQL reads single-column univariate statistics from pg_stats, multiplying the frequency of country equals 'US' (0.10) by the frequency of state equals 'CA' (0.02) to produce an estimated selectivity of 0.002. If the table has 10,000,000 rows, the planner calculates expected matching rows as 10,000,000 * 0.002 = 20,000 rows, or if additional selective filters exist, as few as twelve rows. However, because every person residing in California is by definition residing in the United States, the true conditional probability P(country='US' | state='CA') is 1.0! The actual joint selectivity is simply the frequency of California alone (0.02), yielding 200,000 to 800,000 matching rows in production.",
          "Because the planner estimated a tiny result set of only twelve rows, it selected an unindexed Nested Loop Join against the order_items table, expecting to execute twelve fast indexed probes. In production reality, the executor had to execute eight hundred thousand nested loop iterations! The eight hundred thousand random disk seeks overwhelmed the NVMe controller queues, saturated shared buffer locks, and crippled the entire database cluster. No amount of hardware scaling, connection pool tuning, or single-column index creation can solve a query plan rooted in an eight-hundred-thousand-fold statistical miscalculation by the planner.",
          "The definitive architectural remediation for cross-column correlation in modern PostgreSQL is the creation of Multivariate Extended Statistics. By executing the command 'CREATE STATISTICS stats_customer_geo (dependencies, mcv) ON customer_country, customer_state FROM customer_addresses', the administrator instructs the statistics collector to inspect joint frequency distributions and functional dependencies across both columns simultaneously during the next ANALYZE pass. The statistics collector populates pg_statistic_ext with joint MCV frequency matrices and dependency coefficients. When the query planner detects predicates on columns covered by an extended statistics object, it bypasses the naive independent product rule and queries the joint MCV matrix directly. This architectural correction ensures that the optimizer accurately anticipates eight hundred thousand rows, immediately abandons the toxic Nested Loop Join in favor of an instant Hash Join, and restores production query latency from eighteen seconds down to four milliseconds."
        ],
        "example": "Imagine an international airline ticketing engine estimating how many passengers will board a flight from Heathrow Airport in London to John F Kennedy Airport in New York. If the dispatch computer assumes that passenger departure city (London) and departure airport (Heathrow) are independent random variables, it multiplies the percentage of global travelers in London by the percentage of global flights at Heathrow, concluding that only two passengers will show up. In reality, London and Heathrow have a direct geographic dependency, meaning thousands of passengers show up at once. Extended statistics teach the dispatch system that London and Heathrow are correlated, preventing total terminal collapse.",
        "code": "-- Production Outage Remediation: Multivariate Extended Statistics Simulation\nCREATE TABLE customer_geography_audit (\n  metric_id serial PRIMARY KEY,\n  optimization_state text NOT NULL,\n  estimated_cardinality int NOT NULL,\n  actual_cardinality int NOT NULL,\n  planner_join_choice text NOT NULL,\n  execution_latency_ms numeric(8,2) NOT NULL,\n  incident_status text NOT NULL\n);\n\nINSERT INTO customer_geography_audit VALUES\n('Default Independent Statistics (P(A)*P(B))', 12, 800000, 'Nested Loop Join (800,000 probes)', 18450.00, 'PRODUCTION_OUTAGE_CRITICAL'),\n('Multivariate Extended Statistics (CREATE STATISTICS)', 795000, 800000, 'Hash Join (Linear Single-Pass)', 4.25, 'INCIDENT_RESOLVED_HEALTHY');\n\nSELECT \n  optimization_state,\n  estimated_cardinality,\n  actual_cardinality,\n  ROUND(ABS(estimated_cardinality - actual_cardinality) * 100.0 / actual_cardinality, 2) AS estimation_error_pct,\n  planner_join_choice,\n  execution_latency_ms,\n  incident_status\nFROM customer_geography_audit\nORDER BY execution_latency_ms DESC;",
        "tryIt": "Execute the production incident audit query to analyze multivariate statistics.",
        "check": {
          "question": "How does executing 'CREATE STATISTICS ... (dependencies, mcv)' resolve catastrophic nested loop degradation on correlated columns?",
          "options": [
            "It collects joint multivariate frequencies and functional dependencies, providing accurate cardinality estimates so the planner chooses a Hash Join",
            "It automatically partitions the physical table into sharded micro-databases across multiple availability zones",
            "It forces the query executor to cache all eight hundred thousand records in the operating system swap file permanently",
            "It converts the declarative SQL statement into a pre-compiled C-language stored procedure bypass module"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "Default statistics assume column independence, multiplying individual probabilities and drastically underestimating row counts for correlated columns. Extended statistics capture multivariate dependencies and Most Common Value (MCV) lists, enabling accurate cardinality estimates.",
          "explanation": "Default statistics assume column independence, multiplying individual probabilities and drastically underestimating row counts for correlated columns. Extended statistics capture multivariate dependencies and Most Common Value (MCV) lists, enabling accurate cardinality estimates."
        },
        "output": "[Error] invalid input syntax for type integer: \"Default Independent Statistics (P(A)*P(B))\""
      }
    ],
    "summary": [
      "The Cost-Based Optimizer transforms relational algebra trees into physical execution plans by evaluating estimated I/O page costs and CPU tuple evaluation cycles.",
      "Sequential Scans excel at high selectivity (>15-20%) via sequential prefetching, whereas Index Scans deliver single-digit millisecond lookups for pinpoint queries.",
      "Bitmap Index Scans bridge the gap for intermediate selectivity by constructing in-memory page bitmaps and visiting heap pages in physical disk block order.",
      "Hash Joins provide linear O(M+N) join execution in memory, but degrade into multi-batch disk spills when candidate hash tables exceed the session work_mem limit.",
      "Multivariate extended statistics (CREATE STATISTICS) eliminate catastrophic nested loop outages caused by false independent probability assumptions on correlated columns."
    ],
    "projectStep": {
      "title": "Enterprise Query Optimizer Profiling",
      "steps": [
        "Audit existing table scan access paths across high-volume production tables using pg_stat_user_tables.",
        "Profile slow analytical queries with EXPLAIN (ANALYZE, BUFFERS) to verify whether join nodes spill to disk.",
        "Tune session work_mem and random_page_cost parameters to align planner cost modeling with NVMe storage hardware.",
        "Deploy multivariate extended statistics on strongly correlated demographic and geographic column sets."
      ]
    }
  },
  {
    "day": 32,
    "coursePrefix": "sql-mastery",
    "title": "B-Tree vs LSM-Tree Internal Index Architectures, Write Amplification & Page Layouts",
    "goal": "Master low-level database index storage architectures: slotted page layouts, B-link tree latching, LSM-tree MemTable and SSTable compaction lifecycles, Write Amplification Factor (WAF) formulations, GIN/GiST/BRIN specialization, and random UUID page split elimination.",
    "minutes": 35,
    "recap": "Yesterday we explored the Cost-Based Optimizer and execution plan operators. Today we deconstruct physical on-disk storage representations, contrasting in-place B+ Tree page layouts against sequential Log-Structured Merge Trees.",
    "parts": [
      {
        "part": 1,
        "title": "B+ Tree Physical Layout: Slotted Pages, Fillfactor, Leaf Page Doubly Linked Lists & High-Concurrency Latching",
        "say": [
          "Welcome to Day Thirty-Two of Advanced Relational Database Engineering. Today we journey deep into the physical storage substrate to examine how index structures organize, traverse, and persist keys on disk. In relational database architecture, the B+ Tree remains the foundational index mechanism, having served as the backbone of online transaction processing systems for over four decades. However, understanding how a B+ Tree functions at an abstract algorithmic level is vastly different from understanding its physical layout inside an operating database like PostgreSQL. To design resilient, high-throughput systems, you must understand the exact physical structure of an eight-kilobyte database page, how leaf pages chain together, and how concurrent updates trigger structural modifications.",
          "Inside PostgreSQL, every table heap relation and every B-tree index is stored as an array of fixed-size eight-kilobyte pages on disk. The physical architecture of a single database page follows the Slotted Page layout. At the very top of the page sits the PageHeaderData structure, consuming twenty-four bytes. The header records the page Log Sequence Number (LSN) for write-ahead log recovery, a checksum verifying data integrity, transaction visibility flags, and two dynamic memory pointers: pd_lower and pd_upper. Immediately following the header is the line pointer array (ItemIdData). Each line pointer consumes four bytes and stores the exact byte offset and length of a tuple located elsewhere in the page. When analyzing the line pointer array, notice that each pointer maintains flags that signify tuple state: LP_USED indicates a valid tuple address, LP_UNUSED marks dead space reclaimed by vacuuming, and LP_REDIRECT supports Heap-Only Tuple (HOT) optimizations.",
          "Heap-Only Tuple optimization is a premier PostgreSQL performance feature: when an UPDATE modifies columns that are NOT indexed, the database places the new row version inside the exact same eight-kilobyte page if free space permits, leaving the existing B-tree index completely untouched and simply creating an in-page pointer redirection. This completely eliminates index write amplification and page split overhead for non-key updates. The physical tuples themselves are inserted starting from the bottom of the page and growing upwards toward the line pointer array. The unallocated space between pd_lower and pd_upper represents free space. When inserting new tuples into a B-tree leaf page, the engine must insert the key in strict sorted order. As long as free space exists between pd_lower and pd_upper, the operation executes smoothly. However, when an eight-kilobyte leaf page reaches capacity and cannot accommodate an incoming key, the engine is forced to execute an expensive structural modification: the B-Tree Page Split.",
          "During a leaf page split, the executor allocates a brand new eight-kilobyte page, transfers approximately half of the existing keys to the new sibling page, and updates the doubly linked list pointers\u2014bpto_next and bpto_prev\u2014that connect adjacent leaf pages for fast range scans. Crucially, the engine must also insert an uplink routing key into the parent branch node. If the parent branch page is also full, the split cascades upwards toward the root node, acquiring exclusive write latches that block concurrent reader queries. In addition to fillfactor tuning, PostgreSQL 14 introduced bottom-up index deletion: when inserting keys into a nearly full B-tree leaf page, instead of immediately splitting the page, the engine first scans line pointers to purge dead or superseded MVCC tuple versions on the fly, delaying page splits by up to ninety percent on update-heavy workloads. Reducing fillfactor to seventy or eighty percent leaves intentional free space on each leaf page to absorb future inserts.",
          "Concurrency in B-trees is governed by the high-performance Lehman and Yao B-link tree algorithm. In traditional B-trees, splitting a page required acquiring exclusive write locks on both the child and parent nodes simultaneously, creating a global concurrency bottleneck. Lehman and Yao introduced high-concurrency B-link trees by adding a right-sibling pointer and a high-key attribute to every internal node. When a concurrent reader navigates down a branch node that is actively splitting, the reader detects that the search key exceeds the page high-key and simply follows the right-sibling link, eliminating the need to lock parent nodes during descent. Understanding slotted pages, fillfactor headroom, and B-link latching enables database engineers to design high-concurrency transactional architectures."
        ],
        "example": "Consider a corporate physical archive storing client document binders in a bank vault. Each binder represents an eight-kilobyte page. At the front of the binder is an index tab list (the line pointer array), while client contract cards are filed starting from the back pocket (the tuple storage area). If a clerk attempts to insert a new contract into an overflowing binder, the clerk must split the binder into two separate binders, transfer half the contracts, update the shelf call labels on the master vault directory (the parent branch node), and connect the two binders with a physical chain link (the sibling pointers). Reserving empty binder sleeves (fillfactor) prevents disruptive archive reorganization.",
        "code": "-- B-Tree Slotted Page Physical Layout & Fillfactor Headroom Simulation\nCREATE TABLE btree_page_internals (\n  page_id int PRIMARY KEY,\n  page_fillfactor int NOT NULL,\n  total_page_bytes int NOT NULL DEFAULT 8192,\n  header_and_pointers_bytes int NOT NULL,\n  tuples_payload_bytes int NOT NULL\n);\n\nINSERT INTO btree_page_internals VALUES\n(1, 100, 8192, 424, 7600), -- 100% Fillfactor: Saturated, near split threshold\n(2, 75, 8192, 320, 5800);  -- 75% Fillfactor: Reserving headroom for in-place updates\n\nSELECT \n  page_id,\n  page_fillfactor,\n  total_page_bytes,\n  (header_and_pointers_bytes + tuples_payload_bytes) AS bytes_allocated,\n  (total_page_bytes - (header_and_pointers_bytes + tuples_payload_bytes)) AS free_space_headroom_bytes,\n  ROUND((header_and_pointers_bytes + tuples_payload_bytes) * 100.0 / total_page_bytes, 1) AS page_density_pct,\n  CASE \n    WHEN (total_page_bytes - (header_and_pointers_bytes + tuples_payload_bytes)) < 200 THEN 'CRITICAL: Imminent Leaf Page Split'\n    ELSE 'HEALTHY: Absorbing Concurrent Inserts'\n  END AS structural_split_risk\nFROM btree_page_internals\nORDER BY page_id ASC;",
        "tryIt": "Execute the slotted page layout query to evaluate how lowering fillfactor reserves free space and eliminates leaf page splits.",
        "check": {
          "question": "In PostgreSQL B-tree internal architecture, how does the Lehman and Yao B-link tree algorithm maintain high concurrency during page splits?",
          "options": [
            "It equips every node with a right-sibling pointer and high-key value, allowing concurrent readers to traverse splitting pages without locking parent nodes",
            "It converts the entire index into an in-memory hash table whenever more than five concurrent transactions execute writes",
            "It locks the entire database cluster in exclusive read-only mode until all background splits complete",
            "It flushes all modified leaf pages directly to secondary cloud storage before updating memory line pointers"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "The Lehman and Yao B-link tree algorithm adds a right-sibling link and high-key to internal nodes, enabling readers to safely navigate to the right sibling if a split occurred without requiring exclusive locks on parent nodes.",
          "explanation": "The Lehman and Yao B-link tree algorithm adds a right-sibling link and high-key to internal nodes, enabling readers to safely navigate to the right sibling if a split occurred without requiring exclusive locks on parent nodes."
        },
        "output": " page_id | page_fillfactor | total_page_bytes | bytes_allocated | free_space_headroom_bytes | page_density_pct | structural_split_risk\n---------+-----------------+------------------+-----------------+---------------------------+------------------+---------------------------------------\n       1 |             100 |             8192 |            8024 |                       168 |             97.9 | CRITICAL: Imminent Leaf Page Split\n       2 |              75 |             8192 |            6120 |                      2072 |             74.7 | HEALTHY: Absorbing Concurrent Inserts\n(2 rows)"
      },
      {
        "part": 2,
        "title": "LSM-Trees (Log-Structured Merge Trees): MemTable, Write-Ahead Log (WAL), SSTables & Leveled Compaction",
        "say": [
          "While B+ Trees have dominated transactional systems for decades, the explosion of massive write-heavy streaming architectures, time-series telemetry, and distributed key-value stores revealed their fundamental physical limitation: random disk write overhead. Whenever a B-tree updates a key, it must locate the specific eight-kilobyte leaf page on disk, read it into memory, modify the slot, and eventually flush the entire eight-kilobyte page back to physical storage. If you update a single ten-byte integer, writing an entire eight-kilobyte block causes immense write amplification. The fundamental architectural divergence between B-trees and LSM-trees mirrors the difference between mutable in-place update paradigms and immutable functional append paradigms. In modern high-throughput distributed database engineering, understanding when to deploy an in-place B-tree storage engine versus an append-only LSM storage engine is one of the definitive architectural competencies required to prevent massive production I/O bottlenecks. To solve this dilemma, storage researchers developed the Log-Structured Merge Tree, universally known as the LSM-Tree.",
          "LSM-trees are the underlying storage engine of modern high-throughput database systems including Apache Cassandra, RocksDB, ClickHouse, ScyllaDB, and CockroachDB. The core architectural philosophy of an LSM-tree is radical simplicity: convert all random disk writes into high-speed sequential disk appends. In an LSM-tree, an incoming write never modifies data in-place on disk. Instead, the write executes in two coordinated steps: first, the record is appended sequentially to an on-disk Write-Ahead Log (WAL) to guarantee crash durability; second, the record is inserted directly into an in-memory sorted structure known as the MemTable.",
          "The MemTable serves as both the active write buffer and the initial read cache. Modern implementations in RocksDB and CockroachDB utilize Lock-Free Concurrent SkipLists, which provide expected O(log N) insertion and lookup latencies while scaling linearly across dozens of simultaneous CPU writer threads without lock contention. Furthermore, when the MemTable flushes, it uses Direct I/O (bypassing the operating system page cache) to prevent memory double-buffering and avoid triggering operating system kernel dirty-page writeback stalls. As client writes continue to stream into the database, the MemTable grows until it crosses an allocated threshold\u2014typically sixty-four or one hundred twenty-eight megabytes. When this threshold is breached, the engine freezes the MemTable, opens a fresh active MemTable, and delegates a background worker to serialize the frozen MemTable to disk as an immutable Sorted String Table (SSTable).",
          "An SSTable contains keys and values stored in strict lexicographical order, complete with an internal sparse index and an in-memory Bloom filter. Because the SSTable is written sequentially in a single pass from start to finish, the disk controller writes at maximum hardware sequential throughput, completely bypassing mechanical seek latency and SSD random write degradation. However, because SSTables are strictly immutable, updates and deletes cannot alter existing files. A delete is executed by inserting a special marker known as a Tombstone. In Size-Tiered Compaction, common in Apache Cassandra for append-only time-series, the engine groups SSTables of similar sizes into tiers. Once four files accumulate in a tier, they are merged into a larger SSTable, requiring low immediate write overhead but incurring high space amplification.",
          "To prevent uncontrolled read degradation and reclaim space occupied by overwritten values and deleted tombstones, the LSM storage engine runs continuous background Compaction processes. In Leveled Compaction, disk storage is divided into discrete hierarchical tiers: Level Zero (L0), Level One (L1), Level Two (L2), up to Level N. When the cumulative size of a level exceeds its quota, background workers read overlapping SSTables, execute a multi-way merge sort in memory, eliminate obsolete versions and tombstones, and write new compacted SSTables to the next level. Leveled compaction guarantees that ninety percent of all keys in Level 1 and higher reside in exactly one SSTable per level, delivering predictable, tightly bounded read latencies at the expense of continuous background compaction I/O. Furthermore, modern LSM architectures utilize Partitioned Indexing and Prefix Bloom Filters, which partition Bloom filters into discrete blocks that correspond directly with SSTable data blocks, significantly reducing RAM footprint while preserving fast negative lookup guarantees."
        ],
        "example": "Imagine a fast-paced emergency room hospital intake desk. When injured patients arrive, the triage nurse scribbles their symptoms immediately on an append-only paper intake ledger (the WAL) and organizes their names on a magnetic whiteboard sorted by urgency (the MemTable). When the whiteboard fills with fifty names, the staff photographs it, archives it into an immutable folder in filing cabinet Level Zero (an SSTable), and clears the board. At midnight, hospital archivists take all folders from Level Zero, sort them alphabetically into a master permanent registry (Leveled Compaction), discarding duplicate update notes and archived records.",
        "code": "-- LSM-Tree Architecture & Compaction Level Simulation\nCREATE TABLE lsm_storage_hierarchy (\n  tier_level text PRIMARY KEY,\n  storage_medium text NOT NULL,\n  is_immutable boolean NOT NULL,\n  capacity_limit_mb int NOT NULL,\n  current_occupancy_mb int NOT NULL,\n  read_amplification_cost int NOT NULL\n);\n\nINSERT INTO lsm_storage_hierarchy VALUES\n('MemTable', 'Dynamic RAM', false, 128, 115, 1),\n('Level 0 (L0)', 'NVMe SSD', true, 512, 480, 4),\n('Level 1 (L1)', 'NVMe SSD', true, 5120, 4200, 1),\n('Level 2 (L2)', 'NVMe SSD', true, 51200, 31000, 1);\n\nSELECT \n  tier_level,\n  storage_medium,\n  is_immutable,\n  capacity_limit_mb,\n  current_occupancy_mb,\n  ROUND(current_occupancy_mb * 100.0 / capacity_limit_mb, 1) AS level_fullness_pct,\n  CASE \n    WHEN current_occupancy_mb * 100.0 / capacity_limit_mb > 85.0 THEN 'TRIGGER: Background Compaction Required'\n    ELSE 'IDLE: Normal Operation'\n  END AS compaction_trigger_status\nFROM lsm_storage_hierarchy\nORDER BY capacity_limit_mb ASC;",
        "tryIt": "Execute the LSM hierarchy query to evaluate how occupancy thresholds trigger background compaction across storage tiers.",
        "check": {
          "question": "What is the primary architectural purpose of background Compaction in Log-Structured Merge (LSM) storage engines?",
          "options": [
            "To merge-sort overlapping SSTables, eliminate obsolete overwritten keys and tombstones, and prevent read amplification degradation",
            "To encrypt all client connection packets using hardware-accelerated elliptic curve cryptography",
            "To convert all immutable SSTable files into live transactional PostgreSQL B-tree leaf pages",
            "To automatically shut down idle database worker threads when CPU utilization exceeds ninety percent"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "Because SSTables are immutable, background compaction merge-sorts overlapping files, purges deleted tombstones and overwritten versions, and bounds read amplification across hierarchical storage levels.",
          "explanation": "Because SSTables are immutable, background compaction merge-sorts overlapping files, purges deleted tombstones and overwritten versions, and bounds read amplification across hierarchical storage levels."
        },
        "output": " tier_level   | storage_medium | is_immutable | capacity_limit_mb | current_occupancy_mb | level_fullness_pct | compaction_trigger_status\n--------------+----------------+--------------+-------------------+----------------------+--------------------+-----------------------------------------\n MemTable     | Dynamic RAM    | false        |               128 |                  115 |               89.8 | TRIGGER: Background Compaction Required\n Level 0 (L0) | NVMe SSD       | true         |               512 |                  480 |               93.8 | TRIGGER: Background Compaction Required\n Level 1 (L1) | NVMe SSD       | true         |              5120 |                 4200 |               82.0 | IDLE: Normal Operation\n Level 2 (L2) | NVMe SSD       | true         |             51200 |                31000 |               60.5 | IDLE: Normal Operation\n(4 rows)"
      },
      {
        "part": 3,
        "title": "Write Amplification Factor (WAF) & Read Amplification: Analytical Modeling and Comparative Benchmark",
        "say": [
          "Having deconstructed both physical layouts, we now perform an advanced analytical comparison of their performance trade-offs: Write Amplification Factor (WAF), Read Amplification, and Space Amplification. In modern enterprise infrastructure, understanding these amplification factors is not merely an academic exercise; it directly determines storage hardware lifespan, input-output throughput saturation, and multi-cloud infrastructure operating costs. In modern cloud database deployments running on AWS EBS gp3 volumes or Google Cloud Persistent Disk, storage costs and IOPS limits are strictly bounded. Every single input-output operation and every gigabyte written incurs direct financial charges. Consequently, an unoptimized storage engine with high Write Amplification directly inflates cloud infrastructure bills while causing premature throttling from cloud volume IOPS credit exhaustion. The most critical operational metric in write-heavy environments is the Write Amplification Factor.",
          "Formally, Write Amplification Factor is defined as the ratio between the total volume of bytes written to the underlying physical storage subsystem and the volume of logical data bytes written by the user application: WAF equals physical bytes written divided by logical bytes written. In a traditional B-Tree engine, consider what occurs when an application updates a single ten-byte status column in a customer record. To persist this ten-byte change durably, the engine must write the modification to the Write-Ahead Log, and subsequently, during a checkpoint or buffer eviction, flush the entire eight-kilobyte dirty page back to disk.",
          "To accurately model Write Amplification in enterprise storage, we must also account for filesystem and SSD internal write amplification. Modern enterprise NVMe drives employ their own Flash Translation Layer (FTL) that executes internal wear leveling and garbage collection. When a relational database issues small random eight-kilobyte writes, the SSD controller cannot overwrite flash memory cells directly; it must erase entire flash blocks (typically two to eight megabytes) before rewriting. Consequently, the compounding effect of database-level page flushes and hardware-level FTL garbage collection can push total end-to-end write amplification past one thousand, destroying solid-state drive lifespan within months. In stark contrast, an LSM-Tree initially achieves a near-optimal WAF of approximately one point zero to two point zero, because incoming writes are appended sequentially to the WAL and absorbed in the in-memory MemTable.",
          "However, the LSM-tree does not escape write amplification entirely; it merely defers it to background compaction. During Leveled Compaction, when an SSTable from Level N is merged into Level N plus one, the entire file must be read from disk, merge-sorted with overlapping SSTables in the target level, and rewritten back to disk. If the level capacity ratio (compaction fanout) is ten, an SSTable may be rewritten ten times during its lifecycle. In write-heavy analytical architectures, database architects also model Compaction Debt. If client write volume exceeds the throughput of background compaction workers, SSTables accumulate faster than they can be merged. This condition causes read latency to spike exponentially as queries must search hundreds of unmerged SSTables, eventually forcing write stalls. Proper tuning of compaction thread pools and write buffers is therefore essential for maintaining stable latency percentiles.",
          "Space Amplification Factor (SAF) represents another vital dimension of storage efficiency: SAF equals physical disk bytes occupied divided by logical database bytes. B-trees typically exhibit a space amplification factor of one point three to one point five due to average sixty-seven percent leaf page fill density resulting from random splits. LSM-trees under size-tiered compaction can suffer SAF exceeding two point zero because deleted records and older overwritten versions remain on disk until multi-gigabyte compaction passes complete. Balancing write amplification against space amplification and read amplification is known in database theory as the RUM Conjecture: a storage engine can optimize at most two of the three dimensions (Read, Update, Memory/Space), always trading off the third."
        ],
        "example": "Consider a cargo logistics company delivering letters. The B-tree approach drives a ten-ton delivery truck to transport a single envelope to each doorstep; the fuel waste represents massive B-tree write amplification for small updates. The LSM approach collects five thousand letters into one large shipping container and drives it once across the country (efficient sequential write); however, at the central distribution hub, workers must unload, re-sort, and repack containers multiple times (LSM compaction write amplification). The B-tree wastes fuel on individual trips; the LSM expends energy in the sorting warehouse.",
        "code": "-- Write Amplification Factor (WAF) & Flash Storage Wear Model\nCREATE TABLE storage_engine_waf_benchmark (\n  engine_architecture text PRIMARY KEY,\n  logical_payload_bytes int NOT NULL,\n  physical_storage_bytes_written int NOT NULL,\n  io_write_pattern text NOT NULL,\n  nvme_endurance_impact text NOT NULL\n);\n\nINSERT INTO storage_engine_waf_benchmark VALUES\n('B-Tree In-Place Page Flush', 64, 8192, 'Random 8KB Page I/O', 'SEVERE: High P/E Cycle Burn'),\n('LSM-Tree Sequential Append (L0 Flush)', 64, 68, 'Sequential Streamed I/O', 'MINIMAL: Near 1.0 Baseline'),\n('LSM-Tree Post-Compaction (Cumulative)', 64, 896, 'Sequential Multi-Level Rewrite', 'MODERATE: Bounded Compaction Wear');\n\nSELECT \n  engine_architecture,\n  logical_payload_bytes,\n  physical_storage_bytes_written,\n  ROUND(physical_storage_bytes_written * 1.0 / logical_payload_bytes, 1) AS write_amplification_factor,\n  io_write_pattern,\n  nvme_endurance_impact\nFROM storage_engine_waf_benchmark\nORDER BY write_amplification_factor DESC;",
        "tryIt": "Execute the WAF benchmark query to examine how in-place page flushes cause massive write amplification compared to sequential LSM appends.",
        "check": {
          "question": "Why does updating a 64-byte row in an unbuffered B-tree database cause a Write Amplification Factor (WAF) exceeding 100?",
          "options": [
            "Because the database engine must flush an entire 8,192-byte physical disk page to persist a single 64-byte in-place modification",
            "Because the query optimizer recompiles all foreign key triggers and stored procedures on every transaction commit",
            "Because the operating system kernel duplicates the transaction log across sixty-four background worker threads",
            "Because the storage controller automatically converts relational data into uncompressed text strings before saving"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "In B-tree architectures, data is managed in fixed-size 8KB pages. Modifying even a tiny 64-byte tuple dirties the whole 8,192-byte page, requiring the entire block to be written to disk, producing high WAF.",
          "explanation": "In B-tree architectures, data is managed in fixed-size 8KB pages. Modifying even a tiny 64-byte tuple dirties the whole 8,192-byte page, requiring the entire block to be written to disk, producing high WAF."
        },
        "output": " engine_architecture                   | logical_payload_bytes | physical_storage_bytes_written | write_amplification_factor | io_write_pattern               | nvme_endurance_impact\n---------------------------------------+-----------------------+--------------------------------+----------------------------+--------------------------------+-----------------------------------\n B-Tree In-Place Page Flush            |                    64 |                           8192 |                      128.0 | Random 8KB Page I/O            | SEVERE: High P/E Cycle Burn\n LSM-Tree Post-Compaction (Cumulative) |                    64 |                            896 |                       14.0 | Sequential Multi-Level Rewrite | MODERATE: Bounded Compaction Wear\n LSM-Tree Sequential Append (L0 Flush) |                    64 |                             68 |                        1.1 | Sequential Streamed I/O        | MINIMAL: Near 1.0 Baseline\n(3 rows)"
      },
      {
        "part": 4,
        "title": "Specialized Indexes: GiST, GIN (Inverted Indexes for JSONB & Full-Text) and BRIN (Block Range Index for Append-Only Time Series)",
        "say": [
          "While standard B-trees excel at scalar equality and range queries on integers and timestamps, modern applications process complex semi-structured data: JSON documents, spatial geometries, full-text corpora, and terabyte-scale append-only time series. Standard B-trees fail completely on these workloads. For example, indexing a ten-kilobyte JSON document in a B-tree only indexes the document as a single opaque string; it cannot index internal nested keys or arrays. The architectural flexibility of PostgreSQL's Generalized Search Tree and Generalized Inverted Index architectures stems from its modular operator class (opclass) framework. Rather than hardcoding fixed indexing algorithms, PostgreSQL allows engineers to define custom distance metrics, comparison strategies, and decomposition functions, enabling the exact same GiST tree framework to index geographic coordinates, IPv4/IPv6 network ranges, and multidimensional geometry. To address these specialized domains, PostgreSQL provides three world-class index architectures: GIN (Generalized Inverted Index), GiST (Generalized Search Tree), and BRIN (Block Range Index).",
          "The Generalized Inverted Index (GIN) is the premier indexing engine for multi-element and semi-structured data types, including JSONB documents, integer arrays, and full-text search tsvector vectors. In a standard B-tree, an index row maps a single key to a single tuple identifier (TID). In a GIN index, the relationship is inverted: the index breaks composite items into individual constituent elements (lexemes, keys, or array values). Each distinct element forms an entry in a B-tree, pointing to a posting list or posting tree of all heap TIDs that contain that specific element. In a GIN index, the postings for a specific key can be represented in two distinct physical formats based on cardinality: a Posting List or a Posting Tree.",
          "If an item appears in only a few hundred tuples, GIN stores the heap TIDs in a flat, compressed integer array (Posting List) using varint compression. However, if a key is extremely frequent (such as a common tag appearing in ten million rows), the posting list expands into a full-fledged dedicated B-tree structure known as a Posting Tree. This dynamic transition prevents posting lists from exceeding the eight-kilobyte page boundary and guarantees logarithmic lookup performance regardless of element frequency. When you execute a JSONB containment query such as WHERE metadata contains key equals value, GIN navigates directly to the key and value lexemes and performs an instant intersection of their posting lists, delivering sub-millisecond retrieval across millions of complex JSON documents.",
          "Because updating GIN posting lists on every single insert would cause severe write latency, PostgreSQL equips GIN with a fastupdate pending list buffer. New inserts are written sequentially to an unindexed pending buffer page; when the pending list fills, background autovacuum flushes and bulk-inserts entries into the main GIN tree in a single efficient pass. Configuring gin_pending_list_limit allows administrators to tune batch ingestion speed. The second specialized architecture is the Generalized Search Tree (GiST). GiST is an extensible, balanced tree structure designed for non-scalar, multi-dimensional, and hierarchical data where values do not have a natural linear ordering, powering PostGIS spatial geometry bounding boxes and temporal range overlaps.",
          "Finally, for massive multi-terabyte append-only tables such as time-series metrics, clickstream logs, and financial ledger audits, PostgreSQL provides the Block Range Index (BRIN). While a B-tree index on a one-billion-row table consumes twenty to thirty gigabytes of disk and RAM, a BRIN index consumes mere megabytes. BRIN operates by grouping adjacent physical disk pages into fixed block ranges\u2014typically one hundred twenty-eight pages per range (one megabyte of data). For each range, BRIN stores only two values: the minimum value and the maximum value found in that range. Setting the autosummarize parameter ensures that newly appended blocks are summarized automatically in the background without manual maintenance. In modern high-velocity telemetry systems, combining BRIN with table partitioning delivers optimal price-performance, ensuring queries targeting specific time windows execute with instant partition pruning and precise block range elimination."
        ],
        "example": "Think of reference systems in a large library. A traditional card catalog organized alphabetically by author last name is a standard B-tree. The comprehensive subject index at the very back of an encyclopedia\u2014listing every page where 'photosynthesis' or 'chlorophyll' is mentioned across dozens of volumes\u2014is a Generalized Inverted Index (GIN). A three-dimensional architectural map showing floor layouts and room boundaries is a Generalized Search Tree (GiST). And a summary label taped to the outside of a warehouse storage crate reading 'Contains manufacturing receipts from March 2024 to June 2024' is a Block Range Index (BRIN).",
        "code": "-- Specialized Index Architecture & Footprint Comparison Simulation\nCREATE TABLE specialized_index_catalog (\n  index_type text PRIMARY KEY,\n  target_data_domain text NOT NULL,\n  supported_operators text NOT NULL,\n  sample_100gb_table_index_mb int NOT NULL,\n  write_overhead_profile text NOT NULL\n);\n\nINSERT INTO specialized_index_catalog VALUES\n('Standard B-Tree', 'Scalar integers, dates, text', '=, <, <=, >, >=', 22000, 'Moderate: Page split risk on random inserts'),\n('GIN (Inverted Index)', 'JSONB documents, text arrays', '@>, ?, @@, &&', 35000, 'High: Deconstructs rows into posting lists'),\n('GiST (Search Tree)', 'PostGIS geometries, ranges', '&&, @>, <@, <->', 18000, 'Moderate: Bounding box recalculations'),\n('BRIN (Block Range)', 'Append-only time series, logs', '=, <, <=, >, >=', 12, 'Near Zero: Appends min-max range summaries');\n\nSELECT \n  index_type,\n  target_data_domain,\n  sample_100gb_table_index_mb,\n  ROUND(sample_100gb_table_index_mb * 100.0 / 22000, 2) AS relative_size_vs_btree_pct,\n  write_overhead_profile\nFROM specialized_index_catalog\nORDER BY sample_100gb_table_index_mb ASC;",
        "tryIt": "Execute the specialized index comparison query to evaluate how BRIN delivers massive storage savings compared to traditional B-trees.",
        "check": {
          "question": "Why is a Block Range Index (BRIN) extraordinarily efficient for indexing multi-terabyte append-only time series data?",
          "options": [
            "It stores only the minimum and maximum values for physical ranges of pages, reducing index storage footprint by over ninety-nine percent",
            "It compresses all table columns into an in-memory hash table using hardware-accelerated dictionary encoding",
            "It converts relational tables into distributed microservice queues to bypass transactional consistency checks",
            "It deletes old records automatically as soon as the index size exceeds one hundred megabytes"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "BRIN summarizes ranges of physical disk pages (e.g., 128 pages) by storing only their minimum and maximum values, enabling massive index size reductions on physically ordered data.",
          "explanation": "BRIN summarizes ranges of physical disk pages (e.g., 128 pages) by storing only their minimum and maximum values, enabling massive index size reductions on physically ordered data."
        },
        "output": " index_type           | target_data_domain            | sample_100gb_table_index_mb | relative_size_vs_btree_pct | write_overhead_profile\n----------------------+-------------------------------+-----------------------------+----------------------------+---------------------------------------------\n BRIN (Block Range)   | Append-only time series, logs |                          12 |                       0.05 | Near Zero: Appends min-max range summaries\n GiST (Search Tree)   | PostGIS geometries, ranges    |                       18000 |                      81.82 | Moderate: Bounding box recalculations\n Standard B-Tree      | Scalar integers, dates, text  |                       22000 |                     100.00 | Moderate: Page split risk on random inserts\n GIN (Inverted Index) | JSONB documents, text arrays  |                       35000 |                     159.09 | High: Deconstructs rows into posting lists\n(4 rows)"
      },
      {
        "part": 5,
        "title": "Diagnostic Architecture Puzzle: High-Throughput Ingestion Failure \u2014 Diagnosing B-Tree Leaf Page Split Saturation and Switching to BRIN/LSM",
        "say": [
          "We culminate this storage architecture masterclass with an enterprise infrastructure outage post-mortem: The B-Tree Leaf Page Split Saturation and Ingestion Collapse. Consider the following high-severity production incident: An industrial Internet of Things telematics platform was ingesting one hundred fifty thousand telemetry events per second from connected vehicles and smart grid sensors into an PostgreSQL database. Each incoming JSON payload was written to a centralized telemetry_stream table, which had grown to over four billion records across sixty-four partitions.",
          "During peak morning traffic, the ingestion pipeline suffered a catastrophic failure. Write latencies on the database surged from two milliseconds to over eight hundred fifty milliseconds per insert. Kafka consumer lag spiked to tens of millions of uncommitted messages, consumer group rebalances triggered across the streaming tier, and the database server's NVMe storage array reported ninety-nine percent I/O utilization. Furthermore, the infrastructure team discovered that the primary NVMe SSDs had consumed thirty-five percent of their total lifetime write endurance in less than three weeks! The system was rapidly heading toward complete physical storage burnout.",
          "The senior database architect conducted an emergency diagnostic audit using pg_stat_activity, pg_stat_user_indexes, and Linux iostat. The storage telemetry revealed that disk queue depth was pinned at sixty-four, with average wait times (await) exceeding eight hundred milliseconds. The physical NVMe storage subsystem was not failing due to raw data throughput; the aggregate bandwidth was a modest forty megabytes per second. Rather, it was dying from IOPS saturation: the drive was bombarded with over ninety-five thousand random four-kilobyte and eight-kilobyte read-modify-write cycles per second, completely filling the internal controller command queues and starving critical Write-Ahead Log sync operations.",
          "The root cause was discovered in the table's index definitions: a composite B-tree index defined on (device_uuid, recorded_timestamp) where device_uuid was generated as random UUID Version Four (UUIDv4). Because UUIDv4 values are completely random, uniform 128-bit hashes, each newly arriving telemetry event generated a random index key that mapped to an arbitrary location across the multi-gigabyte B-tree index. In relational database systems, primary keys generated by client applications dictate the physical insertion order of clustered tables and unique indexes. When developers blindly adopt random UUIDv4 identifiers without considering storage layout implications, they introduce a ticking performance timebomb into high-throughput systems. Because the working dataset far exceeded available shared_buffers memory, almost every single incoming write struck a cold B-tree leaf page that was not present in RAM, forcing physical random reads, leaf page splits, and catastrophic write amplification across the storage controller.",
          "The architectural remediation was executed in three coordinated phases: First, the engineering team dropped the toxic B-tree index on live ingestion partitions and replaced it with a Block Range Index (BRIN) on recorded_timestamp with pages_per_range set to one hundred twenty-eight. Second, for device-specific lookups, the team migrated from random UUIDv4 to monotonic time-ordered UUIDv7 identifiers. UUIDv7 embeds a 48-bit timestamp in the leading bits, ensuring that B-tree inserts append strictly to the rightmost leaf page without splitting historical interior pages. Third, table fillfactor was tuned to eighty-five percent. The result was transformative: index storage footprint dropped from eighty-four gigabytes down to eighteen megabytes (a 4,600-fold reduction), write latency plummeted from eight hundred fifty milliseconds down to zero point six milliseconds, and storage write wear was completely eliminated.",
          "To prevent future regression across the engineering organization, the architectural review board codified strict physical storage design standards into the continuous integration schema validation pipeline. Any migration script attempting to create a B-tree index over non-monotonic identifiers or high-cardinality unbounded text fields without an explicit fillfactor configuration is automatically rejected by linter checks. Furthermore, production database instances now export continuous B-tree leaf page split metrics directly to Prometheus dashboards using pg_stat_database and custom kernel tracepoints, triggering automated alerts whenever leaf page split rates exceed fifty operations per second on high-throughput analytical ingestion partitions."
        ],
        "example": "Imagine a regional postal sorting facility where letters arrive marked with completely random twenty-digit codes instead of postal zip codes. For every incoming letter, a worker must search through hundreds of thousands of filing cabinets, find the exact alphabetical slot, discover the drawer is jammed full, split the drawer contents into a new cabinet, and rebuild the master vault directory. Traffic backs up onto the interstate. Replacing the random code system with chronological date-stamped delivery bins (a BRIN index) allows incoming mail to be dropped instantly into active bins, clearing the gridlock permanently.",
        "code": "-- Production Post-Mortem Remediation: B-Tree Leaf Page Split vs BRIN Replacement\nCREATE TABLE telemetry_ingestion_incident_audit (\n  metric_id serial PRIMARY KEY,\n  index_architecture text NOT NULL,\n  index_storage_footprint_mb int NOT NULL,\n  avg_write_latency_ms numeric(8,2) NOT NULL,\n  leaf_page_splits_per_sec int NOT NULL,\n  nvme_write_iops int NOT NULL,\n  production_status text NOT NULL\n);\n\nINSERT INTO telemetry_ingestion_incident_audit VALUES\n('Random UUIDv4 B-Tree Index (Saturated Splits)', 84000, 850.00, 14200, 95000, 'PRODUCTION_OUTAGE_CRITICAL'),\n('Chronological Monotonic BRIN (128 Pages/Range)', 18, 0.60, 0, 450, 'INCIDENT_RESOLVED_HEALTHY');\n\nSELECT \n  index_architecture,\n  index_storage_footprint_mb,\n  avg_write_latency_ms,\n  leaf_page_splits_per_sec,\n  nvme_write_iops,\n  ROUND(84000.0 / NULLIF(index_storage_footprint_mb, 0), 1) AS index_compression_ratio,\n  production_status\nFROM telemetry_ingestion_incident_audit\nORDER BY avg_write_latency_ms DESC;",
        "tryIt": "Execute the telemetry incident audit query to evaluate how replacing random B-tree indexes with BRIN eliminates page split bottlenecks.",
        "check": {
          "question": "Why does using random UUIDv4 keys in high-throughput B-tree indexes cause catastrophic write pipeline degradation?",
          "options": [
            "Because random keys scatter inserts uniformly across the entire index tree, triggering continuous leaf page splits and random I/O thrashing",
            "Because UUIDv4 contains secret cryptographic padding that causes PostgreSQL to fail SHA-256 data validation checks",
            "Because the operating system terminates client connections when string columns exceed sixteen characters in length",
            "Because random keys force the database to disable WAL logging and revert to unbuffered direct memory access"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "Random UUIDv4 keys scatter inserts across cold B-tree pages, causing constant buffer cache misses, severe leaf page splits, and immense write amplification on physical storage.",
          "explanation": "Random UUIDv4 keys scatter inserts across cold B-tree pages, causing constant buffer cache misses, severe leaf page splits, and immense write amplification on physical storage."
        },
        "output": "[Error] invalid input syntax for type integer: \"Random UUIDv4 B-Tree Index (Saturated Splits)\""
      }
    ],
    "summary": [
      "PostgreSQL stores B-trees and heap tables in 8KB slotted pages, where line pointers grow downward and tuples grow upward from page bottom.",
      "When an 8KB leaf page fills up, a page split allocates a new block, redistributes keys, updates sibling pointers, and inserts an uplink into parent nodes.",
      "LSM-trees convert random writes into sequential disk appends via memory MemTables and immutable SSTables, deferring work to background compaction.",
      "B-trees suffer from high Write Amplification (WAF > 100) on small random updates, whereas LSM-trees exhibit higher Read Amplification requiring Bloom filters.",
      "Specialized Block Range Indexes (BRIN) summarize ranges of physical pages with min-max boundaries, eliminating index bloat on append-only time series."
    ],
    "projectStep": {
      "title": "Physical Index Architecture & WAF Optimization",
      "steps": [
        "Audit production B-tree leaf page fillfactor and page split metrics using pg_stat_user_indexes.",
        "Profile table bloat and write amplification across high-throughput transactional and time-series tables.",
        "Deploy GIN indexes on nested JSONB document queries to eliminate full-table scanning.",
        "Replace unoptimized random UUID B-tree indexes with BRIN indexes or time-ordered UUIDv7 sequences."
      ]
    }
  },
  {
    "day": 33,
    "coursePrefix": "sql-mastery",
    "title": "Advanced Window Functions, Frame Specifications & Moving Aggregations",
    "goal": "Master advanced relational windowing mechanics: physical ROWS versus logical RANGE and GROUPS framing, peer group duplicate mechanics, rolling Bollinger Band volatility, ranking and navigation primitives, named WINDOW clauses, and WindowAgg memory spill optimization.",
    "minutes": 35,
    "recap": "Yesterday we mastered low-level B-Tree and LSM-Tree storage layouts and write amplification. Today we master advanced window framing, rolling moving analytics, and WindowAgg executor mechanics.",
    "parts": [
      {
        "part": 1,
        "title": "Window Framing Fundamentals: Physical ROWS vs Logical RANGE vs GROUPS Peer Offsets",
        "say": [
          "Window functions are among the most expressive and computationally sophisticated capabilities in relational database systems, yet their execution mechanics are frequently misunderstood by backend engineers. While standard GROUP BY operations collapse multiple rows into a single aggregated summary tuple, a window function evaluates an aggregation or ranking calculation across a defined set of related rows while preserving the distinct identity of every individual row in the result set. The set of rows available to the window function is governed by the OVER clause, which defines partitioning, ordering, and most importantly, the frame specification. The frame specification controls the exact moving subset of rows within the partition that feeds the calculation for each current row.",
          "The SQL standard specifies three distinct framing modes: ROWS, RANGE, and GROUPS. The fundamental divergence between these three modes lies in how offsets are interpreted relative to the current row. The ROWS mode specifies the frame boundary using physical row counts. When you specify ROWS BETWEEN one PRECEDING AND CURRENT ROW, the database executor simply steps backward by exactly one physical tuple in the sorted partition stream, regardless of the column values. In contrast, the RANGE mode specifies the frame boundary using logical value offsets along the ordering column. When you specify RANGE BETWEEN one PRECEDING AND CURRENT ROW on a numeric timestamp column, the database includes all rows whose sort key value falls between the current row key minus one and the current row key.",
          "Understanding the subtle behavior of RANGE is critical when duplicate values exist in the sort key. In SQL terminology, rows sharing identical values in the ORDER BY clause are known as peers. When RANGE is used, all peer rows are processed as a single indivisible unit. If multiple rows share the exact same timestamp, a RANGE frame expands to encompass every single peer, causing all peer rows to receive the identical aggregated result. This behavior explains the dangerous hidden pitfall of the ANSI SQL default window frame. When an ORDER BY clause is provided without an explicit frame specification, the SQL standard mandates the default frame of RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. This default can cause silent bugs and massive memory overhead, because the engine cannot stream rows continuously; it must buffer and inspect ahead to detect peer duplicates.",
          "Inside the PostgreSQL kernel, window frames are represented by the WindowObjectData and WindowState internal C structures. When executing an unconstrained RANGE frame, the WindowObject manager cannot determine if subsequent tuples in the sort stream are peers of the current row without inspecting ahead in the tuple spool. Consequently, the executor must actively prefetch and buffer candidate peer tuples into an internal tuplestore memory buffer. If the sort column contains millions of duplicate timestamps\u2014common in high-frequency trading logs or batch data ingestions\u2014the tuplestore rapidly overflows the allocated session work_mem, spilling raw tuples to temporary disk files on physical NVMe arrays and introducing massive input-output serialization stalls.",
          "The third and newest framing mode introduced in SQL:2016 is GROUPS. While ROWS counts individual physical records and RANGE measures logical numerical or temporal distances, GROUPS counts groups of peer rows. Specifying GROUPS BETWEEN one PRECEDING AND CURRENT ROW instructs the window executor to include the entire current group of peers plus the entirety of the preceding group of peers, regardless of how many individual physical records exist in either peer group. This provides an elegant, deterministic framing abstraction for grouped events such as multi-leg options orders or batch sensor bursts.",
          "Finally, advanced frame specifications allow frame exclusion clauses: EXCLUDE CURRENT ROW, EXCLUDE GROUP, EXCLUDE TIES, and EXCLUDE NO OTHERS. These exclusion modifiers give database engineers surgical control over moving calculations. For instance, EXCLUDE TIES removes peer rows sharing the current sort key from the aggregation window while retaining the current row itself, enabling clean outlier filtering in high-frequency statistical calculations. Mastering the physical and logical distinctions between ROWS, RANGE, and GROUPS enables engineers to write provably correct analytical queries that maximize memory streaming efficiency and eliminate catastrophic buffer spooling."
        ],
        "example": "Imagine a passenger train traveling down a track where each railcar represents a database row. A ROWS frame is like an inspector who looks backward through the physical doorway into exactly one preceding railcar, regardless of what cargo is inside. A RANGE frame is like an inspector who checks a digital manifest and examines every car that entered the station within sixty seconds of the current car; if three cars arrived simultaneously during the same second, the inspector must evaluate all three together as peers. A GROUPS frame evaluates whole coupled train sections regardless of car length.",
        "code": "CREATE TABLE ticker_feed (\n    event_time INT,\n    price NUMERIC(8,2)\n);\nINSERT INTO ticker_feed VALUES\n(1, 100.00),\n(2, 102.50),\n(2, 103.00),\n(3, 101.00),\n(5, 105.00);\n\nSELECT \n    event_time, \n    price,\n    ROUND(AVG(price) OVER (ORDER BY event_time ROWS BETWEEN 1 PRECEDING AND CURRENT ROW), 2) AS rows_avg,\n    ROUND(AVG(price) OVER (ORDER BY event_time RANGE BETWEEN 1 PRECEDING AND CURRENT ROW), 2) AS range_avg,\n    ROUND(AVG(price) OVER (ORDER BY event_time GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW), 2) AS groups_avg\nFROM ticker_feed\nORDER BY event_time, price;",
        "tryIt": "Execute the ticker feed query to observe how peer duplicates at event_time 2 produce distinct values under ROWS but evaluate identical peer windows under RANGE and GROUPS.",
        "check": {
          "question": "What is the critical behavioral difference between ROWS BETWEEN 1 PRECEDING AND CURRENT ROW versus RANGE BETWEEN 1 PRECEDING AND CURRENT ROW when duplicate sort keys exist?",
          "options": [
            "ROWS offsets by physical record counts ignoring values, whereas RANGE offsets by logical value intervals and encompasses all peer duplicates simultaneously",
            "ROWS requires the sort column to be indexed with a B-tree, whereas RANGE only works on tables with hash partitioning",
            "RANGE executes exclusively in temporary disk files, whereas ROWS is processed entirely in CPU L1 cache",
            "ROWS automatically removes NULL values from calculation, whereas RANGE replaces NULLs with zeroes"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "ROWS counts physical tuples regardless of duplicate key values, while RANGE evaluates logical value offsets and must expand to include all peer rows sharing the exact same sort value.",
          "explanation": "ROWS counts physical tuples regardless of duplicate key values, while RANGE evaluates logical value offsets and must expand to include all peer rows sharing the exact same sort value."
        },
        "output": " event_time | price  | rows_avg | range_avg | groups_avg\n------------+--------+----------+-----------+------------\n          1 | 100.00 |   100.00 |    100.00 |     100.00\n          2 | 102.50 |   101.25 |    101.83 |     101.83\n          2 | 103.00 |   102.75 |    101.83 |     101.83\n          3 | 101.00 |   102.00 |    102.17 |     102.17\n          5 | 105.00 |   103.00 |    105.00 |     103.00\n(5 rows)"
      },
      {
        "part": 2,
        "title": "High-Performance Moving Windows: Rolling Volatility, Bollinger Bands & Exponential Weighting",
        "say": [
          "Moving window aggregations form the algorithmic backbone of quantitative trading systems, time-series telemetry pipelines, and real-time operational monitoring. In capital markets, price action is inherently noisy; quantitative algorithms rely on rolling statistics\u2014such as rolling simple moving averages, rolling standard deviations, and exponential moving smoothing\u2014to filter market microstructure noise, identify mean-reverting price channels, and compute dynamic risk limits. Implementing these calculations natively inside the relational database engine via optimized window specifications eliminates the need to extract raw tick data into application memory, achieving order-of-magnitude performance gains.",
          "A premier quantitative tool built directly on window framing is Bollinger Bands, formulated by John Bollinger in the 1980s. A Bollinger Band structure consists of three lines: a middle band representing a simple moving average over a sliding lookback window of N periods; an upper band positioned at K standard deviations above the middle band; and a lower band positioned at K standard deviations below the middle band. In financial econometrics, price distributions frequently exhibit volatility clustering, where periods of low volatility are followed by sharp regime changes. When market volatility compresses, the Bollinger Bands contract; when volatility explodes, the bands widen dynamically to reflect risk.",
          "Executing rolling statistical calculations in SQL requires combining statistical aggregate functions with precise frame specifications. PostgreSQL provides standard deviation aggregates: STDDEV_SAMP computes the sample standard deviation using Bessel's correction (dividing by N minus one), while STDDEV_POP computes the population standard deviation (dividing by N). When calculating rolling standard deviation over a small sliding window\u2014such as three trading days\u2014STDDEV_SAMP provides an unbiased estimator of asset return dispersion. If the window contains only a single row, STDDEV_SAMP returns NULL, reflecting the statistical impossibility of computing sample variance from one observation.",
          "Under the hood, PostgreSQL calculates sample variance and standard deviation using Welford's algorithm, an online single-pass formulation that updates running mean and squared differences incrementally. Welford's algorithm is mathematically engineered to prevent catastrophic numerical cancellation\u2014a phenomenon where subtracting two large floating-point numbers of similar magnitude causes severe loss of precision. In naive two-pass algorithms that compute the sum of squares directly, rounding errors can yield negative variances when evaluating tightly clustered financial instrument prices. PostgreSQL's internal numeric aggregate transitions preserve arbitrary-precision numeric accumulators, guaranteeing exact mathematical correctness across millions of market ticks.",
          "To handle cold-start conditions gracefully, quantitative engineers employ the COALESCE function to substitute a baseline variance of zero during the initial warm-up period. Furthermore, when computing rolling aggregations across millions of time-series observations, specifying a bounded physical frame such as ROWS BETWEEN N PRECEDING AND CURRENT ROW enables the PostgreSQL executor to deploy optimized streaming aggregation algorithms. Rather than recalculating the entire window from scratch for every row in O(W) time, an optimized window executor maintains running accumulators, adding the incoming row and subtracting the departing row in O(1) constant time per record.",
          "In addition to simple moving averages, quantitative pipelines frequently require Exponential Moving Averages (EMA), which apply exponentially decaying weights to historical observations to give greater importance to recent price ticks. While pure recursive EMA formulations traditionally required recursive Common Table Expressions or custom procedural aggregate states, combining window functions like LAG and SUM over logarithmic decay weights enables scalable, high-throughput signal generation natively within declarative SQL queries without application-tier overhead.",
          "Finally, when designing high-throughput analytical query architectures, database engineers must consider parallel query execution interactions. PostgreSQL can parallelize the scanning and filtering stages of queries feeding window functions; however, the actual WindowAgg operation itself is evaluated in the leader backend process after a Gather Merge node when partitions are small. By properly tuning work_mem and specifying bounded physical row frames, engineers prevent parallel worker processes from dumping intermediate tuplestore spools to disk, maintaining ultra-low execution latency across institutional algorithmic trading engines."
        ],
        "example": "Imagine an airport security scanner measuring passenger throughput. A standard cumulative counter records the total number of travelers since midnight, which obscures recent spikes. A rolling window of three minutes is like a rotating mechanical turnstile counter that continuously monitors the immediate pace of travelers passing through right now, sounding a chime whenever the rate surges two standard deviations above the recent hourly average.",
        "code": "CREATE TABLE daily_trades (\n    day_id INT,\n    close_price NUMERIC(8,2)\n);\nINSERT INTO daily_trades VALUES\n(1, 150.00),\n(2, 152.00),\n(3, 149.00),\n(4, 155.00),\n(5, 158.00),\n(6, 154.00),\n(7, 160.00);\n\nSELECT \n    day_id,\n    close_price,\n    ROUND(AVG(close_price) OVER w3, 2) AS rolling_mean_3d,\n    ROUND(STDDEV_SAMP(close_price) OVER w3, 2) AS rolling_std_3d,\n    ROUND(AVG(close_price) OVER w3 + 2 * COALESCE(STDDEV_SAMP(close_price) OVER w3, 0), 2) AS upper_bollinger\nFROM daily_trades\nWINDOW w3 AS (ORDER BY day_id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)\nORDER BY day_id;",
        "tryIt": "Run the daily trades query to inspect how the rolling mean, sample standard deviation, and upper Bollinger Band dynamically adapt to incoming closing prices.",
        "check": {
          "question": "Why does STDDEV_SAMP return NULL on the very first row of a rolling window calculation?",
          "options": [
            "Because sample standard deviation divides by N minus 1, which results in division by zero when only one observation exists in the sample",
            "Because PostgreSQL requires at least one thousand rows before initializing statistical floating-point registers",
            "Because the database driver cannot serialize floating point numbers without an explicit cast to character varying",
            "Because the query optimizer skips statistical calculation on the initial partition boundary"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "Sample standard deviation (STDDEV_SAMP) applies Bessel's correction with denominator (N - 1). For N = 1, the denominator is zero, making sample variance mathematically undefined and returning NULL.",
          "explanation": "Sample standard deviation (STDDEV_SAMP) applies Bessel's correction with denominator (N - 1). For N = 1, the denominator is zero, making sample variance mathematically undefined and returning NULL."
        },
        "output": " day_id | close_price | rolling_mean_3d | rolling_std_3d | upper_bollinger\n--------+-------------+-----------------+----------------+-----------------\n      1 |      150.00 |          150.00 |           NULL |          150.00\n      2 |      152.00 |          151.00 |           1.41 |          153.83\n      3 |      149.00 |          150.33 |           1.53 |          153.39\n      4 |      155.00 |          152.00 |           3.00 |          158.00\n      5 |      158.00 |          154.00 |           4.58 |          163.17\n      6 |      154.00 |          155.67 |           2.08 |          159.83\n      7 |      160.00 |          157.33 |           3.06 |          163.44\n(7 rows)"
      },
      {
        "part": 3,
        "title": "Ranking, Lead/Lag, Offsets & Value Navigation: DENSE_RANK, NTILE and Partition Cohorts",
        "say": [
          "Beyond statistical aggregation, window functions provide powerful value navigation and relative ranking primitives. In enterprise reporting, risk analysis, and personnel evaluation, queries frequently demand comparisons between adjacent records: computing quarter-over-quarter revenue growth, calculating trader performance rankings within asset desks, or determining percentile cohorts. Before window functions, such queries required expensive self-joins and correlated subqueries that crippled relational database performance. Modern SQL provides dedicated ranking functions\u2014ROW_NUMBER, RANK, and DENSE_RANK\u2014alongside value navigation functions like LAG, LEAD, FIRST_VALUE, and NTH_VALUE.",
          "Understanding the precise differences among the ranking functions is essential for correct business reporting. ROW_NUMBER assigns a strictly unique, sequential integer to every row within a partition, breaking ties arbitrarily based on internal physical tuple order unless additional deterministic order expressions are specified. In contrast, RANK assigns identical ordinal ranks to tied peer rows, but skips subsequent rank numbers by the number of duplicate peers (for example, rank values one, two, two, four). DENSE_RANK also assigns identical rank values to tied peers, but never skips subsequent ranks, producing a contiguous sequence (for example, rank values one, two, two, three).",
          "In terms of execution complexity, ROW_NUMBER is computationally the most lightweight ranking function because it requires no peer-comparison state tracking; the executor simply increments an integer counter with every advancing tuple in the partition. In contrast, RANK and DENSE_RANK must retain the sort key values of the previous row in local memory, performing tuple attribute comparisons on every iteration to determine whether the incoming record constitutes a duplicate peer. If peer equality is detected, RANK increments an internal peer counter while keeping the emitted rank fixed, skipping ahead when a distinct sort key eventually arrives.",
          "In financial regulatory reporting and high-frequency order book tracking, LAG and LEAD provide direct positional lookups relative to the current row without self-joins. LAG accesses a column value from a row positioned N physical tuples prior to the current row within the partition, while LEAD accesses a column value N physical tuples ahead. Both functions accept an optional default value argument to replace NULL when the offset extends beyond partition boundaries. When computing inter-tick price slippage or bid-ask spread duration, LAG allows instantaneous computation of deltas between successive executions.",
          "For percentile grouping and cohort segmentation, NTILE(k) divides an ordered partition into K as-equal-as-possible bucket groups, numbering the buckets from one to K. If the partition row count is not evenly divisible by K, larger bucket groups are placed first. For example, dividing seven trading records into two NTILE buckets produces a top cohort of four rows (bucket one) and a bottom cohort of three rows (bucket two). In addition, CUME_DIST (cumulative distribution) and PERCENT_RANK compute relative fractional ranks between zero and one, allowing statistical percentile cutoffs to be calculated dynamically across large populations.",
          "Finally, navigation functions like FIRST_VALUE, LAST_VALUE, and NTH_VALUE retrieve boundary values across the window frame. A notorious trap for database developers occurs with LAST_VALUE: when used with an ORDER BY clause without an explicit frame, the default frame (RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) causes LAST_VALUE to evaluate only up to the current row, returning the current row instead of the true partition terminus! To retrieve the true final value of the partition, engineers must explicitly declare ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.",
          "Internally, PostgreSQL optimizes value navigation by managing an in-memory ring buffer within the tuplesort subsystem. When LAG or LEAD requests a row with offset one, the engine does not perform secondary index lookups or disk reads; it reads directly from the sorted tuple slot already resident in memory, ensuring that multi-attribute positional navigation adds zero discernible I/O overhead to analytical query pipelines."
        ],
        "example": "Imagine a marathon race leaderboard. ROW_NUMBER is like giving every runner a sequential bib tag based on the millisecond camera finish. RANK gives two runners crossing the line together shared second place, but gives the next runner fourth place. DENSE_RANK gives those tied runners shared second place and awards the next runner third place. NTILE divides the marathon finishers into elite, advanced, and amateur qualification corrals.",
        "code": "CREATE TABLE desk_traders (\n    trader_name TEXT,\n    desk_id TEXT,\n    pnl NUMERIC(10,2)\n);\nINSERT INTO desk_traders VALUES\n('Elena', 'Equities', 450000.00),\n('Marcus', 'Equities', 450000.00),\n('Aarav', 'Equities', 320000.00),\n('Sophia', 'Equities', 180000.00),\n('Kai', 'FixedIncome', 620000.00),\n('Zara', 'FixedIncome', 410000.00);\n\nSELECT \n    trader_name,\n    desk_id,\n    pnl,\n    RANK() OVER w AS rnk,\n    DENSE_RANK() OVER w AS dense_rnk,\n    NTILE(2) OVER w AS performance_tier,\n    COALESCE(LAG(pnl, 1) OVER w - pnl, 0.00) AS gap_to_higher_peer,\n    FIRST_VALUE(trader_name) OVER w AS desk_top_performer\nFROM desk_traders\nWINDOW w AS (PARTITION BY desk_id ORDER BY pnl DESC)\nORDER BY desk_id, pnl DESC, trader_name;",
        "tryIt": "Execute the trader performance query to verify how RANK skips rank numbers on ties while DENSE_RANK maintains dense contiguous integer rankings.",
        "check": {
          "question": "Why does LAST_VALUE(column) return the current row's value instead of the last row in the partition when used with ORDER BY and no explicit frame?",
          "options": [
            "Because the default ANSI window frame is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, restricting the frame boundary to the current row",
            "Because LAST_VALUE is deprecated and automatically converted to FIRST_VALUE by the relational rewrite engine",
            "Because PostgreSQL requires an explicit backward B-tree index scan to evaluate reverse window offsets",
            "Because temporary sort files drop trailing partition tuples during query plan execution"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "The default window frame when ORDER BY is present is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. Therefore, the last value in the current frame is simply the current row. To evaluate the true partition end, use ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.",
          "explanation": "The default window frame when ORDER BY is present is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. Therefore, the last value in the current frame is simply the current row. To evaluate the true partition end, use ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING."
        },
        "output": " trader_name | desk_id     | pnl       | rnk | dense_rnk | performance_tier | gap_to_higher_peer | desk_top_performer\n-------------+-------------+-----------+-----+-----------+------------------+--------------------+--------------------\n Elena       | Equities    | 450000.00 |   1 |         1 |                1 |               0.00 | Elena\n Marcus      | Equities    | 450000.00 |   1 |         1 |                1 |               0.00 | Elena\n Aarav       | Equities    | 320000.00 |   3 |         2 |                2 |          130000.00 | Elena\n Sophia      | Equities    | 180000.00 |   4 |         3 |                2 |          140000.00 | Elena\n Kai         | FixedIncome | 620000.00 |   1 |         1 |                1 |               0.00 | Kai\n Zara        | FixedIncome | 410000.00 |   2 |         2 |                2 |          210000.00 | Kai\n(6 rows)"
      },
      {
        "part": 4,
        "title": "Named Window Clauses & WindowAgg Optimizer Mechanics: Multi-Window Consolidation and Memory Buffering",
        "say": [
          "In complex analytical SQL queries, it is common to invoke multiple window functions that share identical partitioning and ordering specifications. Writing out repetitive OVER (PARTITION BY department_id ORDER BY hire_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) clauses across eight distinct SELECT expressions clutters query text, invites subtle framing mismatches, and impairs maintainability. To address this, the SQL standard introduces the WINDOW clause, positioned between the HAVING and ORDER BY clauses, enabling engineers to declare named reusable window specifications.",
          "The syntax WINDOW window_name AS (window_spec) allows multiple window functions in the SELECT list to reference a centralized window definition by name. Furthermore, named windows can inherit and extend one another: a base window defining common partitioning can be extended by a derived window that appends specific ordering or custom framing boundaries. This modularity ensures that if business logic changes\u2014such as updating partition boundaries or modifying frame lookbacks\u2014the modification is made in a single location, guaranteeing architectural consistency across the entire query projection.",
          "To master window functions, engineers must also internalize the strict logical query processing order enforced by the ANSI SQL standard. A relational query evaluates clauses in the following deterministic sequence: first FROM (including table joins and cartesian products), second WHERE (tuple filtering), third GROUP BY (row clustering), fourth HAVING (group filtering), fifth WINDOW (window function evaluation), sixth SELECT (column projection), seventh DISTINCT (duplicate elimination), eighth ORDER BY (result set presentation ordering), and ninth LIMIT/OFFSET (row pagination).",
          "Because the WINDOW phase occurs strictly after the WHERE and HAVING phases, window functions cannot appear inside a WHERE or HAVING clause. If an engineer attempts to filter for top-ranked records using WHERE RANK() OVER (...) <= 3, the database parser rejects the query with a syntax error. To filter based on the results of a window function, the calculation must be projected inside a Common Table Expression (CTE) or derived subquery, allowing the outer query's WHERE clause to filter the computed rank values cleanly.",
          "Behind the scenes, the PostgreSQL query optimizer treats window functions with specialized execution plan nodes. When you inspect an EXPLAIN plan for a query containing window functions, you will observe one or more WindowAgg plan nodes. The WindowAgg node receives an ordered stream of tuples from an underlying Sort node or an index scan that matches the PARTITION BY and ORDER BY keys. Because the input stream is pre-sorted by partition and order keys, the WindowAgg node can process rows sequentially, detecting partition transitions whenever the partition key value changes.",
          "Inside the PostgreSQL query planner, canonicalization rules analyze the set of window functions present in the query tree. If two window functions require identical partitioning and ordering, the planner merges them under a single WindowAgg plan node. However, if window functions specify different ORDER BY columns or conflicting PARTITION BY clauses, the optimizer is forced to construct a cascade of multiple Sort and WindowAgg nodes. In an unoptimized query with three conflicting window specifications, the dataset will be sorted three separate times, increasing CPU cycle consumption and spilling intermediate sort runs to temporary disk files.",
          "By consolidating window specifications onto compatible partitioning and ordering keys using named WINDOW definitions, database engineers enable the optimizer to evaluate all calculations in a single unified WindowAgg pass. In high-concurrency analytical reporting, this architectural consolidation preserves database buffer headroom, prevents memory fragmentation, and reduces end-to-end query execution latency by orders of magnitude.",
          "In enterprise software architecture, named window specifications also serve as an invaluable documentation mechanism. By assigning semantic identifiers such as monthly_cumulative_pnl or desk_relative_percentile to complex framing clauses, subsequent backend engineers can immediately understand the analytical intent of the calculation without deciphering verbose mathematical offset expressions. Furthermore, modular named windows dramatically simplify unit testing and regression auditing across enterprise data pipelines."
        ],
        "example": "Imagine an architectural drafting firm creating blueprints for a skyscraper. Instead of redrawing the building structural grid coordinates by hand on the electrical, plumbing, and ventilation layers, the engineers create a master CAD grid template named CoreGrid. Every engineering discipline overlays CoreGrid, ensuring perfect geometric alignment and zero duplicate drafting effort.",
        "code": "CREATE TABLE portfolio_ledger (\n    asset_class TEXT,\n    trade_date DATE,\n    position_usd NUMERIC(12,2)\n);\nINSERT INTO portfolio_ledger VALUES\n('Crypto', '2026-03-01', 1200000.00),\n('Crypto', '2026-03-02', 1350000.00),\n('Crypto', '2026-03-03', 1100000.00),\n('Forex', '2026-03-01', 8500000.00),\n('Forex', '2026-03-02', 8200000.00);\n\nSELECT \n    asset_class,\n    trade_date,\n    position_usd,\n    SUM(position_usd) OVER win_asset AS cumulative_asset_pnl,\n    ROUND(position_usd / SUM(position_usd) OVER win_global * 100, 2) AS pct_global_alloc\nFROM portfolio_ledger\nWINDOW \n    win_asset AS (PARTITION BY asset_class ORDER BY trade_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),\n    win_global AS ()\nORDER BY asset_class, trade_date;",
        "tryIt": "Execute the portfolio ledger query to observe how named window definitions win_asset and win_global cleanly calculate partitioned cumulative sums and global portfolio percentages simultaneously.",
        "check": {
          "question": "What happens in the PostgreSQL execution plan when a query contains multiple window functions with conflicting PARTITION BY or ORDER BY clauses?",
          "options": [
            "The query planner must inject multiple Sort and WindowAgg node pairs, sorting the dataset repeatedly for each distinct ordering key",
            "The query optimizer merges the conflicting keys into a single hash table and evaluates them concurrently in parallel workers",
            "PostgreSQL raises a syntax error because all window functions within a single query must share identical ordering",
            "The database converts the window functions into nested subqueries and executes them via temporary tables"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "When window functions have conflicting partitioning or sorting requirements, the executor cannot process them in a single stream; it must sort the data stream repeatedly, creating a pipeline of multiple Sort and WindowAgg nodes.",
          "explanation": "When window functions have conflicting partitioning or sorting requirements, the executor cannot process them in a single stream; it must sort the data stream repeatedly, creating a pipeline of multiple Sort and WindowAgg nodes."
        },
        "output": " asset_class | trade_date | position_usd | cumulative_asset_pnl | pct_global_alloc\n-------------+------------+--------------+----------------------+------------------\n Crypto      | 2026-03-01 |   1200000.00 |           1200000.00 |             5.90\n Crypto      | 2026-03-02 |   1350000.00 |           2550000.00 |             6.63\n Crypto      | 2026-03-03 |   1100000.00 |           3650000.00 |             5.41\n Forex       | 2026-03-01 |   8500000.00 |           8500000.00 |            41.77\n Forex       | 2026-03-02 |   8200000.00 |          16700000.00 |            40.29\n(5 rows)"
      },
      {
        "part": 5,
        "title": "Diagnostic Architecture Puzzle: High-Frequency FinTech Execution Slippage \u2014 Debugging WindowAgg Unbounded Buffer Spills",
        "say": [
          "We culminate this window optimization masterclass with an enterprise FinTech infrastructure post-mortem: The Market Close Unbounded Buffer Spill Outage. Consider the following high-severity production incident: An institutional algorithmic trading desk operated a real-time risk engine that calculated Volume-Weighted Average Price (VWAP) and rolling fill slippage across millions of continuous execution ticks during the final thirty minutes of market trading.",
          "During normal market hours, execution ticks arrived at a moderate rate of five thousand transactions per second, and analytical risk queries completed within twenty-five milliseconds. However, during the market closing cross, execution volume surged to one hundred twenty thousand ticks per second across correlated index constituents. Suddenly, database CPU utilization surged to one hundred percent, query response times degraded from twenty-five milliseconds to over forty-two seconds, and risk monitoring pipelines stalled. Client order fills were delayed, triggering automated circuit breakers and threatening millions of dollars in execution penalties.",
          "The lead database reliability engineer conducted an immediate forensic triage using EXPLAIN (ANALYZE, BUFFERS) and system activity telemetry from pg_stat_database. The telemetry revealed that temporary file creation had skyrocketed, with temp_bytes exceeding ninety gigabytes across sixty concurrent risk worker sessions. Storage performance graphs indicated that NVMe queue depths were pinned at sixty-four, with disk service times (svctm) degrading from two hundred microseconds to seventy milliseconds. The database server was thrashing under intense write amplification caused entirely by temporary disk spooling.",
          "The root cause was discovered in the primary VWAP query, which utilized the default window frame specification: AVG(execution_price) OVER (PARTITION BY symbol ORDER BY trade_time). Because no explicit framing mode was defined, the SQL standard mandated RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. Under the hood, the default RANGE specification prevented the PostgreSQL WindowAgg engine from executing a streaming pass. Because hundreds of trades occurred at the exact same millisecond timestamp during the closing cross, they shared identical peer values.",
          "To ensure that all peer rows received the exact same aggregated value, the WindowAgg node was forced to materialize and buffer all incoming peer rows in memory. As the peer groups expanded during the volume burst, the memory footprint exceeded the session work_mem allocation of four megabytes. Consequently, the executor began spilling buffered tuples to temporary disk files, generating massive random disk I/O on NVMe arrays and thrashing the operating system page cache.",
          "The architectural remediation was executed in two coordinated steps: First, the engineering team refactored the window specification to an explicit bounded physical frame: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW, ordering deterministically by trade_time and fill_id. Second, they tuned session work_mem to sixty-four megabytes for analytical worker roles. Switching from unconstrained logical RANGE to bounded physical ROWS eliminated peer buffering completely. The WindowAgg node shifted to pure streaming evaluation, maintaining a tiny sliding window accumulator in CPU registers. Query execution latency dropped from forty-two seconds down to one point four milliseconds\u2014a thirty-thousand-fold performance recovery\u2014and temporary disk spills were eliminated entirely.",
          "To guarantee architectural compliance across all future algorithmic code deployments, the engineering governance team instituted automated static analysis linter rules in their continuous deployment pipeline. Any pull request containing an OVER clause with an ORDER BY expression that lacks an explicit ROWS or GROUPS framing specification is automatically flagged and blocked from production deployment. Furthermore, production monitoring agents now track pg_stat_database temp_bytes and temp_files deltas in real-time, alerting the infrastructure operations center long before disk spooling degrades critical financial trading platforms.",
          "Additionally, the database engineering group created runbook procedures detailing exact emergency remediation steps for production on-call engineers. If a sudden traffic surge triggers elevated disk spooling, engineers can dynamically increase session work_mem or execute an emergency ALTER TABLE statement to re-cluster high-velocity partitions by physical timestamp. Standardizing these architectural guardrails guarantees five-nines database availability across volatile market sessions."
        ],
        "example": "Imagine a conveyor belt at an airport luggage carousel where handlers tally luggage weight. A default RANGE system forces workers to stop the conveyor belt, gather every bag that arrived in the same flight minute into a giant holding pen, wait until all possible bags arrive, weigh the entire pen together, and then restart the belt. When ten flights land simultaneously, the holding pen overflows onto the tarmac. Switching to a bounded ROWS system allows handlers to continuously weigh just the last three passing bags on the moving belt without ever halting luggage flow.",
        "code": "-- Production Incident Audit: Resolving catastrophic WindowAgg disk spill\n-- Unbounded RANGE frame forces disk spooling; bounded ROWS frame processes in single streaming pass\nCREATE TABLE execution_stream (\n    fill_id INT,\n    trade_time INT,\n    execution_price NUMERIC(8,2)\n);\nINSERT INTO execution_stream VALUES\n(101, 1, 99.50),\n(102, 1, 99.60),\n(103, 2, 100.10),\n(104, 3, 100.40);\n\nSELECT \n    fill_id,\n    trade_time,\n    execution_price,\n    -- Bounded streaming window: Eliminates tuple materialization and disk spills\n    ROUND(AVG(execution_price) OVER (\n        ORDER BY trade_time, fill_id \n        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n    ), 2) AS streaming_vwap,\n    -- Lag offset within streaming window\n    COALESCE(LAG(execution_price, 1) OVER (\n        ORDER BY trade_time, fill_id\n    ), execution_price) AS prev_tick\nFROM execution_stream\nORDER BY trade_time, fill_id;",
        "tryIt": "Execute the execution stream audit to verify how deterministic ordering on trade_time and fill_id enables streaming VWAP calculation without peer group buffering.",
        "check": {
          "question": "Why did the default window frame specification cause massive temporary disk spills during the high-frequency trading volume surge?",
          "options": [
            "Because the default RANGE mode had to buffer all peer rows sharing identical timestamps to guarantee identical aggregate values, exceeding work_mem and spilling to disk",
            "Because PostgreSQL requires SSD drives to be formatted with the ZFS filesystem to support window functions",
            "Because LAG functions cannot execute without creating temporary unlogged tables on physical storage",
            "Because the query executor disabled CPU vectorized execution when trade prices contained fractional cents"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "The default RANGE specification requires the engine to identify and buffer all peer rows sharing the same ORDER BY key. During high-concurrency bursts with identical timestamps, peer groups grow huge, exhausting work_mem and triggering catastrophic disk spills.",
          "explanation": "The default RANGE specification requires the engine to identify and buffer all peer rows sharing the same ORDER BY key. During high-concurrency bursts with identical timestamps, peer groups grow huge, exhausting work_mem and triggering catastrophic disk spills."
        },
        "output": " fill_id | trade_time | execution_price | streaming_vwap | prev_tick\n---------+------------+-----------------+----------------+-----------\n     101 |          1 |           99.50 |          99.50 |     99.50\n     102 |          1 |           99.60 |          99.55 |     99.50\n     103 |          2 |          100.10 |          99.73 |     99.60\n     104 |          3 |          100.40 |         100.03 |    100.10\n(4 rows)"
      }
    ],
    "summary": [
      "Window functions perform aggregations across moving partitions while preserving the individual identity and cardinality of every row in the result set.",
      "The default frame when ORDER BY is specified is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which expands across all peer duplicates and can trigger memory spills.",
      "Bounded physical frames (ROWS BETWEEN N PRECEDING AND CURRENT ROW) allow constant-time O(1) streaming aggregation without tuple materialization.",
      "Statistical aggregates like STDDEV_SAMP combine with bounded frames to produce real-time quantitative metrics like rolling Bollinger Bands.",
      "Named WINDOW clauses eliminate duplicated partitioning logic and enable the query optimizer to consolidate calculations into unified WindowAgg execution passes."
    ],
    "projectStep": {
      "title": "Quantitative Analytics & Window Optimization",
      "steps": [
        "Audit analytical queries for unconstrained default RANGE window frames causing hidden memory spills.",
        "Implement high-throughput rolling standard deviation and Bollinger Band metrics using bounded ROWS frames.",
        "Consolidate repetitive window specifications into modular named WINDOW declarations.",
        "Profile execution plans with EXPLAIN (ANALYZE, BUFFERS) to verify WindowAgg nodes stream tuples in memory."
      ]
    }
  },
  {
    "day": 34,
    "coursePrefix": "sql-mastery",
    "title": "Table Partitioning & Sharding Architectures for Terabyte-Scale Warehouses",
    "goal": "Master enterprise table partitioning and horizontal sharding: declarative Range, List, and Hash partitioning syntax, static and run-time partition pruning mechanics, hash modulus distribution, zero-downtime concurrent detaching, and autovacuum freeze lock mitigation.",
    "minutes": 35,
    "recap": "Yesterday we mastered advanced window framing, moving aggregations, and WindowAgg memory optimization. Today we master declarative partitioning architectures to scale tables into hundreds of millions of records.",
    "parts": [
      {
        "part": 1,
        "title": "Declarative Table Partitioning: Range, List and Hash Routing Architecture",
        "say": [
          "As relational databases scale into multi-terabyte and petabyte domains, monolithic unpartitioned tables inevitably encounter severe physical bottlenecks: B-tree indexes outgrow available RAM, checkpoint flush cycles saturate storage controllers, and full-table administrative maintenance like VACUUM and REINDEX locks the database for days. To overcome these scaling barriers, PostgreSQL provides Declarative Table Partitioning. Partitioning divides a logically massive table into smaller, physically independent child tables\u2014known as partitions\u2014while presenting a unified, transparent relational interface to client applications.",
          "PostgreSQL supports three primary declarative partitioning methods: Range Partitioning, List Partitioning, and Hash Partitioning. In Range Partitioning, the table is partitioned across contiguous intervals of key values, most commonly date ranges or chronological sequence identifiers. Each partition declares non-overlapping upper and lower bounds using FOR VALUES FROM (start) TO (end), where the lower bound is inclusive and the upper bound is exclusive. In List Partitioning, partitions are mapped to explicit enumerations of discrete scalar values\u2014such as country codes, currency symbols, or geographical regions\u2014using FOR VALUES IN (value_list). In Hash Partitioning, incoming rows are distributed uniformly across partitions using modulus arithmetic on the 32-bit hash of the partition key.",
          "Under the hood, a partitioned table in PostgreSQL is represented as a routed root relation. The root parent table itself contains no physical data tuples; its heap relfilenode on disk is empty. Instead, incoming INSERT statements pass through an internal tuple routing layer managed by ExecInsert and ExecFindPartition. The routing engine evaluates the incoming tuple partition key attributes against the boundary constraints registered in the pg_partitioned_table and pg_class system catalogs, selecting the target child partition and inserting the tuple directly into the child heap page.",
          "Inside PostgreSQL's catalog architecture, the relationship between parent and child tables is tracked within pg_inherits. However, unlike legacy table inheritance from PostgreSQL 9, declarative partitioning enforces strict boundary validation at the executor level. When a client executes an UPDATE statement that modifies a row's partition key\u2014such as changing an order status from pending to archived\u2014PostgreSQL automatically deletes the tuple from the origin partition and inserts it into the destination partition in an atomic transaction, eliminating manual application-level partition migration.",
          "Handling unmapped data is an essential architectural consideration in declarative partitioning. If an incoming row contains a key value that does not match any existing partition boundary, PostgreSQL raises an unrouted partition error and aborts the transaction. To prevent ingestion failures, database engineers attach a DEFAULT partition. Any tuple that does not fall into a defined range or list boundary is automatically routed into the default partition, ensuring continuous operational availability while alert systems notify engineers to provision new seasonal partition bounds.",
          "Furthermore, PostgreSQL allows multi-level hierarchical sub-partitioning, where a partition can itself be declared as a partitioned table. For instance, an enterprise global logistics platform can partition top-level orders by LIST (continent_region) and sub-partition each continent child table by RANGE (order_month). This hierarchical partitioning architecture ensures that queries filtering on both region and date can instantly discard non-matching child tables, preserving memory bandwidth and accelerating analytical aggregations across hundreds of millions of supply chain records.",
          "From an indexing perspective, PostgreSQL automatically creates partitioned indexes on all existing and future child partitions when a CREATE INDEX command is executed on the root parent table. Each child table maintains its own independent B-tree index, guaranteeing that individual partition indexes fit entirely within shared_buffers memory and eliminating the multi-gigabyte cache eviction thrashing typical of monolithic unpartitioned indexes.",
          "When designing schema architectures for partitioned tables, primary key and unique constraint enforcement presents a crucial invariant: in PostgreSQL, any UNIQUE or PRIMARY KEY constraint declared on a partitioned table MUST include all columns that constitute the partition key. Because each child partition maintains its own local index without global cross-partition B-tree indexing, PostgreSQL cannot verify uniqueness across multiple independent child tables unless the partition key is present in the unique index definition. Database architects must account for this constraint when migrating legacy single-column surrogate key schemas."
        ],
        "example": "Imagine a massive central post office handling mail for an entire nation. In a monolithic system, workers dump every letter into a single gigantic warehouse room, forcing inspectors to search through millions of letters to find one address. In a partitioned post office, the entrance hall routes incoming letters into dedicated regional sorting bays: Eastern Mail, Western Mail, and an Overflow Default Bin. Workers in each bay process compact local mailbags independently without stepping on each other.",
        "code": "CREATE TABLE metric_log (\n    log_id INT,\n    region TEXT,\n    recorded_at DATE\n) PARTITION BY LIST (region);\n\nCREATE TABLE metric_log_us PARTITION OF metric_log FOR VALUES IN ('US-EAST', 'US-WEST');\nCREATE TABLE metric_log_eu PARTITION OF metric_log FOR VALUES IN ('EU-WEST', 'EU-CENTRAL');\nCREATE TABLE metric_log_def PARTITION OF metric_log DEFAULT;\n\nINSERT INTO metric_log VALUES\n(1, 'US-EAST', '2026-03-01'),\n(2, 'EU-WEST', '2026-03-01'),\n(3, 'AP-SOUTH', '2026-03-01');\n\nSELECT \n    tableoid::regclass AS target_partition,\n    log_id,\n    region,\n    recorded_at\nFROM metric_log\nORDER BY log_id;",
        "tryIt": "Execute the metric log query to verify how PostgreSQL transparently routes incoming records to metric_log_us, metric_log_eu, and metric_log_def via declarative list partitioning.",
        "check": {
          "question": "What happens in PostgreSQL declarative partitioning when an incoming INSERT contains a partition key value that does not match any existing partition and no DEFAULT partition exists?",
          "options": [
            "PostgreSQL raises an error stating no partition of relation exists for the given values and rolls back the transaction",
            "The database automatically creates a new partition on the fly using operating system cron daemons",
            "The record is silently converted into an unindexed JSON document in shared memory",
            "The database writes the tuple to an external flat file in the data directory without WAL logging"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "Declarative partitioning requires every inserted row to match an existing partition's declared bounds. If no partition matches and no DEFAULT partition is configured, PostgreSQL rejects the insert with an error.",
          "explanation": "Declarative partitioning requires every inserted row to match an existing partition's declared bounds. If no partition matches and no DEFAULT partition is configured, PostgreSQL rejects the insert with an error."
        },
        "output": " target_partition | log_id | region   | recorded_at\n------------------+--------+----------+-------------\n metric_log_us    |      1 | US-EAST  | 2026-03-01\n metric_log_eu    |      2 | EU-WEST  | 2026-03-01\n metric_log_def   |      3 | AP-SOUTH | 2026-03-01\n(3 rows)"
      },
      {
        "part": 2,
        "title": "Static and Run-Time Partition Pruning: Query Planner and Executor Optimization",
        "say": [
          "The primary performance justification for deploying table partitioning in analytical databases is Partition Pruning. Partition pruning is an advanced query optimization technique where the PostgreSQL planner and executor analyze query WHERE clauses to identify which child partitions cannot possibly contain qualifying rows, completely eliminating those tables from the physical query execution plan. When querying a partitioned table with five hundred daily partitions, pruning four hundred ninety-nine non-matching partitions reduces physical disk I/O, lock contention, and buffer memory consumption by ninety-nine point eight percent.",
          "PostgreSQL implements partition pruning in two distinct execution phases: Static Partition Pruning (at query planning time) and Run-Time Partition Pruning (during query execution). Static pruning occurs when query WHERE predicates contain constant literal values or immutable expressions known during query compilation, such as WHERE reading_date >= '2026-02-01' AND reading_date < '2026-03-01'. The planner compares these constant predicates directly against the check constraints of all child partitions, pruning non-matching partitions and appending only the relevant partitions to the plan tree before execution begins.",
          "However, in modern enterprise architectures, queries rarely contain hardcoded literal constants; they utilize parameterized prepared statements, object-relational mapping (ORM) bind variables, or correlated subquery expressions like WHERE reading_date = CURRENT_DATE or WHERE sensor_id = (SELECT active_sensor FROM session_state). Because the parameter values are unknown when the generic execution plan is compiled, static pruning cannot prune partitions during the planning phase. To solve this, PostgreSQL executes Run-Time Partition Pruning.",
          "During run-time pruning, the query executor initializes the plan with an Append or MergeAppend node containing candidate partitions. As soon as the parameter values or subquery results materialize at runtime, the executor evaluates the boundary constraints and dynamically skips non-matching child partitions. In an EXPLAIN (ANALYZE, BUFFERS) trace, run-time pruning is explicitly evidenced by the annotation (Subplans Removed: N) or (Partitions Removed: N), demonstrating that the database avoided scanning unneeded partitions even under parameterized queries.",
          "In PostgreSQL's prepared statement architecture, the interaction between generic plans and custom plans is controlled by plan_cache_mode. When an application prepares a query, PostgreSQL creates custom plans for the first five executions. If a generic plan is subsequently chosen to save planning time, run-time partition pruning ensures that performance does not degrade, dynamically evaluating parameter bounds during each execution cycle.",
          "Controlling partition pruning behavior is governed by the server configuration parameter enable_partition_pruning, which defaults to on. Disabling this parameter forces the executor to scan every single child table via an unpruned Append scan, destroying analytical query performance. Furthermore, engineers must ensure that filter expressions on the partition key do not wrap the key column in non-immutable functions or cross-type casts (such as WHERE reading_date::text = '2026-02-14'), as functional type coercion defeats the planner's ability to match boundary constraints.",
          "When partition pruning is combined with index scans, queries against multi-terabyte data warehouses achieve single-digit millisecond response times. The executor navigates directly to the single target child table's localized B-tree index, scanning only tens of kilobytes of data pages while bypassing terabytes of historical warehouse storage.",
          "In distributed data warehousing pipelines, partition pruning also coordinates with PostgreSQL's Foreign Data Wrapper architecture. When combining declarative table partitioning with foreign child tables residing on remote database clusters using postgres_fdw, the planner evaluates partition pruning before dispatching queries across the network. Non-matching remote partitions are pruned locally on the coordinator node, preventing unnecessary network socket allocation, remote connection pooling exhaustion, and distributed query deserialization overhead across large-scale distributed analytics clusters.",
          "Furthermore, modern cloud data warehouse orchestrators take advantage of partition pruning to scale compute and memory dynamically. By inspecting the pruned plan tree before scheduling cluster execution, query engines can avoid spinning up costly distributed query workers for partitions that contain zero relevant records, saving enterprise cloud expenditures while accelerating execution times."
        ],
        "example": "Imagine a municipal archive storing property deeds in fifty individual physical filing cabinets labeled by decade (1970s, 1980s, 1990s, up to 2020s). A citizen requests a deed from February 2026. A static pruning archivist immediately walks directly to the 2020s cabinet and opens the 2026 drawer, leaving all other forty-nine filing cabinets untouched. Searching through fifty cabinets would take hours; opening only the 2020s cabinet takes two seconds.",
        "code": "CREATE TABLE warehouse_sensor_data (\n    sensor_id INT,\n    reading_val NUMERIC(6,2),\n    reading_date DATE\n) PARTITION BY RANGE (reading_date);\n\nCREATE TABLE sensor_p2026_01 PARTITION OF warehouse_sensor_data\n    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');\nCREATE TABLE sensor_p2026_02 PARTITION OF warehouse_sensor_data\n    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');\nCREATE TABLE sensor_p2026_03 PARTITION OF warehouse_sensor_data\n    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');\n\nINSERT INTO warehouse_sensor_data VALUES\n(10, 24.50, '2026-01-15'),\n(20, 22.80, '2026-02-14'),\n(30, 28.10, '2026-03-10');\n\n-- Query targeting a single partition: Verifying partition routing\nSELECT \n    tableoid::regclass AS active_partition,\n    sensor_id,\n    reading_val,\n    reading_date\nFROM warehouse_sensor_data\nWHERE reading_date >= '2026-02-01' AND reading_date < '2026-03-01';",
        "tryIt": "Execute the warehouse sensor query to verify that the query targeting February 2026 routes exclusively to the sensor_p2026_02 partition.",
        "check": {
          "question": "What query plan annotation in PostgreSQL EXPLAIN (ANALYZE) confirms that run-time partition pruning successfully eliminated non-matching partitions?",
          "options": [
            "Partitions Removed or Subplans Removed indicating skipped child partitions",
            "Vectorized SIMD Kernel Active indicating GPU offload",
            "Heap Page Bypass Mode indicating raw disk access",
            "Zero-Copy Memory Stream indicating network bypass"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "PostgreSQL EXPLAIN output displays 'Partitions Removed: N' or 'Subplans Removed: N' under Append nodes when run-time partition pruning successfully skips non-matching child partitions during execution.",
          "explanation": "PostgreSQL EXPLAIN output displays 'Partitions Removed: N' or 'Subplans Removed: N' under Append nodes when run-time partition pruning successfully skips non-matching child partitions during execution."
        },
        "output": " active_partition | sensor_id | reading_val | reading_date\n------------------+-----------+-------------+--------------\n sensor_p2026_02  |        20 |       22.80 | 2026-02-14\n(1 row)"
      },
      {
        "part": 3,
        "title": "Hash Partitioning for High-Concurrency Write Scaling & Partition-Wise Joins",
        "say": [
          "While Range and List partitioning excel at organizing temporal and regional datasets for analytical query pruning, high-throughput transactional architectures face an entirely different engineering challenge: Write Hotspotting. In transactional systems processing hundreds of thousands of concurrent inserts\u2014such as payments gateways, user authentication logs, or digital ad bidding\u2014using sequential auto-incrementing IDs or current timestamps as the partition key causes every single incoming write to hammer the exact same physical partition simultaneously.",
          "This phenomenon, known as the Rightmost Page Split Bottleneck, exhausts storage controller queue depth and creates severe lock contention on buffer page headers. To distribute write throughput evenly across multiple physical storage volumes and CPU cores, database architects implement Hash Partitioning. Hash Partitioning distributes rows pseudo-randomly yet deterministically by hashing the partition key column and computing the modulus across a configured number of child partitions.",
          "In PostgreSQL, hash partitions are declared using the syntax PARTITION BY HASH (column_name) on the root table, with child partitions declaring their modulus and remainder via FOR VALUES WITH (MODULUS N, REMAINDER R). The modulus N defines the total number of hash buckets in the partition group, while remainder R (ranging from zero to N minus one) designates the specific bucket assigned to the child table. For optimal mathematical distribution, the modulus should be a power of two (such as four, eight, sixteen, or thirty-two) to prevent hash skew across partitions.",
          "Under the hood, PostgreSQL computes a 32-bit hash of the partition key using an internal MurmurHash-style algorithm. When an incoming row arrives with account_id 101, the routing engine hashes 101, computes the remainder modulo the configured modulus, and instantly routes the record to the designated child partition. Because hash values are uniformly distributed across the 32-bit integer space, write volume is dispersed evenly across all child tables. This uniform distribution ensures that no single table or index absorbs excessive write pressure.",
          "From an infrastructure perspective, hash partitions can be placed on separate physical tablespaces mapped to distinct NVMe storage volumes or cloud disk arrays. By spreading child partitions across independent disk volumes, high-throughput systems achieve near-linear write throughput scaling, multiplying total available IOPS and completely bypassing single-volume storage saturation.",
          "Furthermore, hash partitioning provides efficient partition-wise joins. When two large tables partitioned on the same key with identical modulus and boundaries are joined in a query (such as accounts JOIN transactions ON accounts.id = transactions.account_id), the PostgreSQL optimizer executes a Partition-Wise Join when enable_partitionwise_join is enabled. Instead of executing one massive hash join across two multi-million row tables, the planner matches corresponding child partitions pairwise, performing N small in-memory joins in parallel with negligible memory footprint.",
          "Similarly, when aggregating over the partition key with enable_partitionwise_aggregate enabled, each partition computes its group aggregation independently before merging, scaling linear performance across multi-core database servers.",
          "When deciding between hash partitioning and range partitioning in high-velocity streaming architectures, data engineers evaluate the query access patterns against write patterns. If queries frequently request time-bounded intervals (such as transactions in the past twenty-four hours), range partitioning provides optimal read pruning but risks rightmost write bottlenecks. Conversely, if queries filter by customer account or entity ID across arbitrary time windows, hash partitioning provides optimal write distribution and parallel partition-wise aggregations, maximizing hardware utilization across NVMe storage arrays.",
          "In addition, PostgreSQL allows combining both paradigms through composite two-tier partitioning: tables can be partitioned by RANGE on chronological event dates at the root level, with each daily or monthly partition sub-partitioned by HASH on tenant_id into four or eight sub-shards. This composite partitioning architecture delivers the best of both worlds: daily partitions facilitate instantaneous zero-downtime data archival and bulk drops, while tenant hash sub-partitions eliminate single-page write latch contention across high-volume ingestion streams."
        ],
        "example": "Imagine a stadium entrance with ten turnstiles. If all ten thousand attendees are forced to enter based on ticket purchase date (range partitioning), everyone who bought tickets today rushes the exact same turnstile, causing an uncontrollable crush. In a hash-partitioned stadium, attendees look at the last digit of their ticket barcode modulo ten and walk directly to their assigned turnstile, dividing the crowd evenly across all ten gates without queuing.",
        "code": "CREATE TABLE high_throughput_events (\n    event_uuid INT,\n    account_id INT,\n    event_payload TEXT\n) PARTITION BY HASH (account_id);\n\nCREATE TABLE events_hash_mod0 PARTITION OF high_throughput_events\n    FOR VALUES WITH (MODULUS 3, REMAINDER 0);\nCREATE TABLE events_hash_mod1 PARTITION OF high_throughput_events\n    FOR VALUES WITH (MODULUS 3, REMAINDER 1);\nCREATE TABLE events_hash_mod2 PARTITION OF high_throughput_events\n    FOR VALUES WITH (MODULUS 3, REMAINDER 2);\n\nINSERT INTO high_throughput_events VALUES\n(1, 101, 'login_success'),\n(2, 102, 'payment_processed'),\n(3, 103, 'token_refreshed'),\n(4, 104, 'balance_queried'),\n(5, 105, 'password_reset');\n\nSELECT \n    tableoid::regclass AS hash_shard,\n    account_id,\n    COUNT(*) AS shard_event_count\nFROM high_throughput_events\nGROUP BY tableoid::regclass, account_id\nORDER BY hash_shard, account_id;",
        "tryIt": "Execute the high-throughput events query to observe how accounts 101 through 105 are uniformly distributed across hash partitions events_hash_mod0, mod1, and mod2.",
        "check": {
          "question": "What is the primary architectural advantage of Hash Partitioning in high-concurrency transactional database systems?",
          "options": [
            "It disperses write throughput evenly across multiple physical partitions, eliminating single-page latch bottlenecks and write hotspots",
            "It eliminates the need for Write-Ahead Logging by writing transactions directly into volatile RAM caches",
            "It automatically compresses string columns using gzip compression algorithms on physical disk blocks",
            "It converts SQL tables into non-relational document collections across distributed message queues"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "Hash partitioning distributes inserts uniformly across multiple physical partitions based on the hash of the partition key, eliminating write hotspots and index split contention on high-concurrency ingestion tables.",
          "explanation": "Hash partitioning distributes inserts uniformly across multiple physical partitions based on the hash of the partition key, eliminating write hotspots and index split contention on high-concurrency ingestion tables."
        },
        "output": " hash_shard       | account_id | shard_event_count\n------------------+------------+-------------------\n events_hash_mod0 |        104 |                 1\n events_hash_mod2 |        101 |                 1\n events_hash_mod2 |        102 |                 1\n events_hash_mod2 |        103 |                 1\n events_hash_mod2 |        105 |                 1\n(5 rows)"
      },
      {
        "part": 4,
        "title": "Zero-Downtime Partition Lifecycle Management: Detaching and Attaching Partitions Concurrently",
        "say": [
          "One of the most powerful operational capabilities of table partitioning is Zero-Downtime Lifecycle Management. In enterprise data warehousing and regulatory compliance environments, tables accumulate billions of historical transactions. Eventually, aging data must be archived to cold object storage (such as AWS S3 or Google Cloud Storage) or purged entirely to comply with data retention mandates like GDPR. In a monolithic unpartitioned table, deleting ten million historical records using DELETE FROM table WHERE created_at < '2025-01-01' is an operational disaster: it generates gigabytes of WAL churn, bloats table pages with dead tuples, triggers autovacuum storms, and holds locks that block live production queries.",
          "With declarative partitioning, data lifecycle operations become instantaneous metadata-only operations. Dropping or archiving an entire seasonal partition requires no row-by-row tuple deletions. The administrator simply issues DROP TABLE partition_name, which instantly unlinks the underlying disk files and reclaims storage space in milliseconds without generating dead tuple bloat. However, in mission-critical applications that cannot tolerate downtime, directly detaching or attaching partitions can still cause severe locking hazards if executed carelessly.",
          "When you execute ALTER TABLE parent DETACH PARTITION child, PostgreSQL acquires an AccessExclusiveLock on both the root parent table and the child partition. An AccessExclusiveLock conflicts with every other lock mode, including simple SELECT queries. If a long-running analytical query or background transaction is actively reading from the partitioned table, the DETACH command is forced to wait in the lock queue. Crucially, in PostgreSQL's locking model, any incoming SELECT query that arrives after the DETACH command will queue behind the DETACH request, causing an immediate connection pool exhaustion outage.",
          "To solve this locking dilemma, modern PostgreSQL introduces the CONCURRENTLY modifier: ALTER TABLE parent DETACH PARTITION child CONCURRENTLY. When CONCURRENTLY is specified, PostgreSQL detaches the partition in two non-blocking phases using low-level ShareUpdateExclusiveLock, which allows concurrent SELECT, INSERT, UPDATE, and DELETE operations to proceed without interruption. In the first transaction, the partition is marked as detached in the catalog; in the second transaction, after active transactions complete, the relationship is severed permanently, converting the child partition into an independent standalone table.",
          "Similarly, when attaching a new partition to an active parent using ALTER TABLE parent ATTACH PARTITION child, the engine must verify that no existing rows in the child table violate the partition boundary constraints. If no pre-existing constraint is present, the ATTACH command performs a full sequential scan of the child table while holding an exclusive lock. To execute a zero-downtime attach, engineers pre-create an identical CHECK constraint on the child table with NOT VALID, validate the constraint concurrently via ALTER TABLE child VALIDATE CONSTRAINT, and then attach the partition. Because the constraint is already validated, the ATTACH command executes instantaneously in sub-milliseconds without table scanning.",
          "Once detached into a standalone table, historical partitions can be dumped to Parquet files using pg_bulkload or foreign data wrappers, migrated to cold cloud object storage, or mounted as read-only archive tables, achieving complete data lifecycle governance without a single second of customer downtime.",
          "By establishing automated partition lifecycle maintenance workers using pg_partman or custom database orchestration scripts, modern engineering organizations automate partition creation, validation, and concurrent archival months in advance, guaranteeing seamless operational continuity across terabyte-scale analytical platforms.",
          "In addition to concurrent detaching, modern PostgreSQL supports detaching partitions as finalized read-only archives. Once detached, administrators can run VACUUM FREEZE and CLUSTER on the standalone table without impacting parent table queries, convert table storage to compressed columnar formats using external extensions like cstore_fdw or pg_analytics, and set the table tablespace to lower-cost archival block storage tiers. This tiered storage hierarchy dramatically slashes cloud infrastructure expenditures while preserving instant analytical SQL queryability for compliance audits."
        ],
        "example": "Imagine a high-speed passenger train traveling on an express track. In an unpartitioned system, removing an old railcar requires stopping the entire train on the main line, unbolting the car with heavy cranes, and stranding all passengers for hours. In a partitioned system with concurrent detaching, the train tracks feature automated high-speed switching turnouts: the obsolete railcar uncouples smoothly onto a secondary spur line while the main passenger train continues hurtling forward at full speed without even slowing down.",
        "code": "CREATE TABLE financial_archive (\n    fiscal_quarter INT,\n    revenue_usd NUMERIC(12,2)\n) PARTITION BY RANGE (fiscal_quarter);\n\nCREATE TABLE fin_q1 PARTITION OF financial_archive FOR VALUES FROM (1) TO (2);\nCREATE TABLE fin_q2 PARTITION OF financial_archive FOR VALUES FROM (2) TO (3);\n\nINSERT INTO financial_archive VALUES\n(1, 45000000.00),\n(2, 52000000.00);\n\n-- Detach partition for archival: Detaching converts child partition into standalone table\nALTER TABLE financial_archive DETACH PARTITION fin_q1;\n\n-- Verify parent table now only contains active partition\nSELECT \n    tableoid::regclass AS current_partition,\n    fiscal_quarter,\n    revenue_usd\nFROM financial_archive;",
        "tryIt": "Execute the financial archive query to verify how detaching fin_q1 converts it into an independent table while financial_archive immediately reflects only active partition fin_q2.",
        "check": {
          "question": "Why does executing ALTER TABLE parent DETACH PARTITION child CONCURRENTLY prevent production connection pool exhaustion outages?",
          "options": [
            "Because it executes in non-blocking phases under ShareUpdateExclusiveLock, avoiding AccessExclusiveLock and allowing concurrent reads and writes to proceed",
            "Because it compresses the table into a background ZIP archive before detaching from disk storage",
            "Because it offloads the partition detachment to client-side database drivers via WebSockets",
            "Because it disables relational integrity checks permanently on the physical database server"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "DETACH PARTITION CONCURRENTLY operates under ShareUpdateExclusiveLock rather than AccessExclusiveLock, preventing lock queues from stalling concurrent SELECT, INSERT, and UPDATE queries during live production maintenance.",
          "explanation": "DETACH PARTITION CONCURRENTLY operates under ShareUpdateExclusiveLock rather than AccessExclusiveLock, preventing lock queues from stalling concurrent SELECT, INSERT, and UPDATE queries during live production maintenance."
        },
        "output": " current_partition | fiscal_quarter | revenue_usd\n-------------------+----------------+-------------\n fin_q2            |              2 | 52000000.00\n(1 row)"
      },
      {
        "part": 5,
        "title": "Diagnostic Architecture Puzzle: Unpartitioned Billing Ledger Lock Saturation and Wraparound Freeze",
        "say": [
          "We culminate this partitioning and sharding masterclass with an enterprise infrastructure outage post-mortem: The Monolithic Billing Ledger Lock Saturation and Wraparound Freeze. Consider the following high-severity production incident: A global cloud infrastructure provider operated a centralized billing ledger table, enterprise_billing_ledger, which recorded hourly billing charges across millions of virtual machines and storage volumes.",
          "Over four years of exponential company growth, the billing ledger table remained a single monolithic, unpartitioned table containing over eight hundred million rows and consuming three hundred fifty gigabytes of NVMe storage, with composite B-tree indexes totaling another two hundred gigabytes. Each hour, high-throughput automated billing microservices inserted two million billing items while customer portal dashboards executed analytical aggregation queries across monthly billing cycles.",
          "On the final day of the fiscal quarter, disaster struck: the database server's autovacuum worker triggered an emergency Anti-Wraparound Freeze on the eight-hundred-million-row billing table. In PostgreSQL's MVCC architecture, transaction IDs (XIDs) are 32-bit cyclical integers. To prevent historical transactions from wrapping around past two billion transactions and becoming invisible, autovacuum must freeze old tuple XIDs. Because the billing table was massive and unpartitioned, the emergency vacuum held heavy I/O locks and saturated NVMe disk queues for over seven continuous hours.",
          "While autovacuum churned through hundreds of gigabytes of cold historical data, live billing insertion pipelines began queuing. Concurrently, customer support queries running EXPLAIN without partition pruning performed full-table sequential scans across the 350GB heap, evicting the entire working set from shared_buffers memory. Connection pools hit max_connections limits within minutes, database CPU utilization pinned at one hundred percent, and live invoicing halted globally, causing severe contractual SLA breaches.",
          "The lead database architect performed an emergency forensic audit using pg_stat_user_tables, pg_locks, and system activity graphs. The audit revealed that ninety-five percent of all incoming queries only accessed billing data from the current or previous calendar month. The remaining seven hundred million historical records were purely cold audit logs that had not been modified in years, yet they were forcing live transactional writes to pay catastrophic vacuum and indexing penalties.",
          "The architectural remediation was executed via zero-downtime declarative range partitioning: First, the engineering team created a new partitioned root table, enterprise_billing_ledger_v2, partitioned by RANGE (billing_month) with dedicated monthly child partitions. Second, they established an upstream logical replication and database trigger bridge to dual-write incoming billing records. Third, historical monthly intervals were copied into pre-created partitions and attached concurrently with validated check constraints. Once synchronized, client connection strings were seamlessly switched to the partitioned relation.",
          "The operational transformation was immediate: monthly partition indexes shrank from two hundred gigabytes to five gigabytes, fitting entirely inside RAM. Autovacuum freeze runs completed in four minutes per localized monthly partition rather than seven hours, and query latency dropped from eighteen seconds to two milliseconds via static partition pruning. Lock contention and transaction wraparound risk were eliminated permanently.",
          "To ensure permanent resilience, the platform team deployed automated Prometheus monitoring tracking the maximum age of unvacuumed transaction IDs via txid_current() - relfrozenxid from pg_class. If any partition approaches autovacuum_freeze_max_age, automated alerts trigger long before emergency database freezes can impact production billing systems.",
          "Finally, the engineering team codified automated continuous integration linting checks for database migration scripts. Any migration attempting to add unpartitioned tables expected to grow past fifty million records or any script creating B-tree indexes without evaluating partition boundaries is automatically flagged for architectural review. By proactively designing declarative partitioning into application data models during initial schema creation, enterprise software organizations safeguard their infrastructure against catastrophic database lockouts and ensure predictable linear scalability as business volumes expand. Additionally, runbook procedures were established for automated table vacuum health audits across all production clusters, guaranteeing zero transaction ID freezing surprises during peak financial reporting periods."
        ],
        "example": "Imagine a university library keeping a single gargantuan ledger book recording every book borrowed since 1850. The book is eight feet thick and weighs six hundred pounds. Every morning, librarians must hoist the entire six-hundred-pound volume onto a crane to dust every single page from 1850 before students can check out books, blocking the checkout desk until noon. Dividing the library into annual ledger volumes allows librarians to dust only the slim 2026 volume in two minutes while leaving historical archive books resting peacefully in archival vaults.",
        "code": "-- Production Incident Audit: Resolving transaction wraparound lock starvation\n-- Converting massive unpartitioned ledger into range-partitioned ledger eliminates autovacuum freezes\nCREATE TABLE enterprise_billing_ledger (\n    invoice_id INT,\n    billing_month DATE,\n    amount_usd NUMERIC(10,2)\n) PARTITION BY RANGE (billing_month);\n\nCREATE TABLE billing_p2026_01 PARTITION OF enterprise_billing_ledger\n    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');\nCREATE TABLE billing_p2026_02 PARTITION OF enterprise_billing_ledger\n    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');\n\nINSERT INTO enterprise_billing_ledger VALUES\n(1001, '2026-01-25', 12500.00),\n(1002, '2026-02-15', 18400.00);\n\nSELECT \n    tableoid::regclass AS partition_name,\n    COUNT(*) AS invoice_count,\n    SUM(amount_usd) AS monthly_revenue\nFROM enterprise_billing_ledger\nGROUP BY tableoid::regclass\nORDER BY partition_name;",
        "tryIt": "Execute the enterprise billing ledger query to verify how declarative range partitioning isolates January and February billing batches into discrete physical partitions.",
        "check": {
          "question": "How does migrating a monolithic 800-million-row table to declarative monthly range partitioning eliminate catastrophic autovacuum wraparound freeze outages?",
          "options": [
            "By dividing the dataset into discrete physical partitions so autovacuum freezes each small partition independently in minutes without locking the global dataset",
            "By disabling transaction IDs entirely and storing records in unversioned raw byte buffers",
            "By executing database queries through remote browser web workers rather than database server backends",
            "By converting relational tables into immutable flat text CSV files on network NFS shares"
          ],
          "answer": 0,
          "answerIndex": 0,
          "why": "Declarative partitioning allows autovacuum to operate on individual, localized monthly partitions independently. Historical partitions freeze once and remain untouched, preventing massive multi-hour table locks across the entire active dataset.",
          "explanation": "Declarative partitioning allows autovacuum to operate on individual, localized monthly partitions independently. Historical partitions freeze once and remain untouched, preventing massive multi-hour table locks across the entire active dataset."
        },
        "output": " partition_name   | invoice_count | monthly_revenue\n------------------+---------------+-----------------\n billing_p2026_01 |             1 |        12500.00\n billing_p2026_02 |             1 |        18400.00\n(2 rows)"
      }
    ],
    "summary": [
      "Declarative table partitioning divides monolithic tables into physical child relations while preserving a unified relational interface for client queries.",
      "Static and run-time partition pruning eliminates non-matching partitions during planning or execution, reducing physical disk I/O by orders of magnitude.",
      "Hash partitioning distributes high-concurrency writes uniformly across physical disks, eliminating index leaf page split hotspots.",
      "Zero-downtime partition lifecycle management uses ALTER TABLE DETACH PARTITION CONCURRENTLY to prevent connection pool exhaustion lock queues.",
      "Migrating massive unpartitioned tables to localized range partitions isolates autovacuum freeze operations, permanently preventing transaction wraparound outages."
    ],
    "projectStep": {
      "title": "Enterprise Partitioning Architecture Deployment",
      "steps": [
        "Audit production tables exceeding fifty million records for partition migration candidates using pg_stat_user_tables.",
        "Design declarative range partitioning schemas with automated monthly partition pre-creation procedures.",
        "Verify partition pruning efficiency using EXPLAIN (ANALYZE, BUFFERS) across parameterized reporting queries.",
        "Implement zero-downtime concurrent partition detaching runbooks for historical data lifecycle archival."
      ]
    }
  }
];

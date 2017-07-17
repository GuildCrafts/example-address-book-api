# Example Address Book API

An example application implementing a simple address book. Uses Express + PostgreSQL.

Supports:

- Contacts have name, email, phone, birthday, and company
- Contacts can be organized into groups
- Contacts can belong to zero or many groups

## Ways to Use this Repo

### Practice writing tests

There are only a few tests written. Add more tests to the `test/` directory and files within to test the full behavior of the API and to ensure that all the database queries function as expected.

### Practice refactoring

For example, the functions in `actions.js` suffer from deep nesting and lots of independent queries. To improve code organization, change these functions to instead use transactions and [multi-row inserts](https://stackoverflow.com/questions/37300997/multi-row-insert-with-pg-promise).

### As a baseline for experimentation

Build extra features on top of this application to practice things like:

- Adding a web UI => make this into a human-usable web app (with HTML/CSS/JS)
- Extending an existing database => add more columns/tables to your database to support more complext data modeling
- Migrating to a different tool/library/framework => pick a different library (like `knex` for SQL queries) and update the code to use this library

## Getting Started

1. Clone this repo
2. Install all npm packages

    ```
    $ npm install
    ```
3. Create development and test database and update schemas

    ```
    $ npm run db:create
    ...
    $ npm run db:schema
    ...
    $ npm run test:db:create
    ...
    $ npm run test:db:schema
    ```
4. Start the server

    ```
    $ npm start
    ```

To see other available commands, use `$ npm run` or read the `package.json` file.

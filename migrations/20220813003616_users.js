//creating a schema using knexjs database ORM:
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) =>{
    table.increments("id");
    table.string('first_name');
    table.string('last_name');
    table.text('email').unique();
    table.integer('password').unique();
    table.integer('user_password').unique();
    table.integer('confirmPassword').unique();
    table.integer('account_no').unique();
    table.integer('transaction_pin');
    table.integer('token');
    table.integer('amount');
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
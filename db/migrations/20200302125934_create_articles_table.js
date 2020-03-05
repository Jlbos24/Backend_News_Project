exports.up = function(knex) {
  return knex.schema.createTable("articles", function(tableBuilder) {
    tableBuilder.increments("article_id").primary();
    tableBuilder.string("title").notNullable();
    tableBuilder.string("body", [5000]).notNullable();
    tableBuilder.integer("votes").defaultTo(0);
    tableBuilder
      .string("topic", [1000])
      .references("topics.slug")
      .notNullable();
    tableBuilder
      .string("author")
      .references("users.username")
      .notNullable();
    tableBuilder.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};

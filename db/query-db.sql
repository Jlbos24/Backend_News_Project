\c nc_news_test;

\dt;

SELECT * FROM topics Order BY slug LIMIT(10);
SELECT * FROM users Order BY username LIMIT(10);
SELECT * FROM articles Order BY article_id LIMIT(10);
SELECT * FROM comments Order BY article_id LIMIT(10);
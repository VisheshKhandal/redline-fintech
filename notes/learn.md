PRISMA + NEON + BETTER AUTH — QUICK NOTES

1. PostgreSQL is a relational database using tables, rows, columns, keys and SQL.
2. Neon hosts and manages PostgreSQL in the cloud.
3. Prisma ORM maps application models to relational database operations.
4. schema.prisma describes the desired models and relations.
5. Prisma Migrate produces versioned SQL migrations and applies them.
6. migration.sql contains actual SQL operations such as CREATE TABLE, CREATE INDEX and ALTER TABLE.
7. prisma generate produces the type-safe Prisma Client; it does not create database tables.
8. Better Auth manages authentication, OAuth accounts and sessions.
9. User = application identity; Account = authentication method; Session = login state; Verification = verification data.
10. Foreign keys enforce relations; unique constraints reject duplicates; indexes help queries.
11. migrate dev is for development; migrate deploy applies pending migrations in production.
12. Use pooled Neon connection for runtime queries and direct connection for migrations.
13. OAuth callback URL is not the same as the final post-login dashboard URL.
14. Authentication confirms identity; authorization checks permissions.
15. Verify schema with Neon SQL Editor and verify login with an actual end-to-end test.



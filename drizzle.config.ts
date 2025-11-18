import { defineConfig } from 'drizzle-kit';
import { env } from "./src/config/env";

export default defineConfig({
    // Specify the PostgreSQL driver
    schema: './src/schema', // Path to schema file
    out: './src/drizzle/migrations', // Directory where migration files will be saved
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL!,
    },
    // Supabase uses the public schema by default, so we specify it
    schemaFilter: ['public'],
});
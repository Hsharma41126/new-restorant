const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Read and execute migration file
    const migrationPath = path.join(__dirname, '001_create_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and filter out empty statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    const connection = await pool.getConnection();
    
    for (const statement of statements) {
      try {
        await connection.execute(statement);
        console.log('✅ Executed statement successfully');
      } catch (error) {
        console.error('❌ Error executing statement:', error.message);
        console.log('Statement:', statement.substring(0, 100) + '...');
      }
    }
    
    connection.release();
    console.log('🎉 Database migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations().then(() => {
    process.exit(0);
  });
}

module.exports = { runMigrations };
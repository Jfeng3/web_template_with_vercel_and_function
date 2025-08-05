import { migrateReadyToDraft } from './src/migrations/migrate-ready-to-draft.ts';

// Run the migration
console.log('Starting migration...');
migrateReadyToDraft()
  .then((result) => {
    console.log('Migration completed successfully');
    console.log('Updated notes:', result);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
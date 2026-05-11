import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db, pg } from './index.js'

async function runMigrations() {
  console.log('🔄 Executando migrations...')
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('✅ Migrations executadas com sucesso!')
  await pg.end()
}

runMigrations().catch((err) => {
  console.error('❌ Erro ao executar migrations:', err)
  process.exit(1)
})

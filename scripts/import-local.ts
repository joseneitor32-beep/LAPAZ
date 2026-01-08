import { PrismaClient } from '@prisma/client'
import ExcelJS from 'exceljs'
import path from 'path'
import { z } from 'zod'

const prisma = new PrismaClient()

const PostulanteSchema = z.object({
  nro: z.number().nullable(),
  unidad: z.string().min(1),
  codPreinsc: z.string().min(1),
  nombrePostulante: z.string().min(1),
  ci: z.string().min(1),
  grupo: z.string().nullable().optional(),
});

async function main() {
  const filePath = path.join(process.cwd(), 'LAPAZ.xlsx')
  console.log(`Reading file: ${filePath}`)

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)
  const worksheet = workbook.getWorksheet(1)

  if (!worksheet) {
    console.error('No worksheet found')
    process.exit(1)
  }

  // CLEAR EXISTING DATA
  console.log('Clearing existing Postulante data...')
  await prisma.postulante.deleteMany({})
  console.log('Previous data cleared.')

  console.log(`Worksheet loaded. Processing rows...`)

  let stats = {
    total: 0,
    inserted: 0,
    updated: 0,
    errors: 0,
  }

  const rows: any[] = []

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return // Skip header

    // Adjust these indices based on the actual file columns if needed
    // 1: Nro
    // 2: Unidad
    // 3: Cod Preinsc
    // 4: Nombre
    // 5: CI
    // 6: Genero (Skip)
    // 7: GRUPO (Actual)
    
    const nroVal = row.getCell(1).value
    const nro = typeof nroVal === 'number' ? nroVal : parseInt(String(nroVal)) || null
    
    const unidad = row.getCell(2).text?.trim().toUpperCase()
    const codPreinsc = row.getCell(3).text?.trim().toUpperCase()
    const nombrePostulante = row.getCell(4).text?.trim().toUpperCase()
    const ci = row.getCell(5).text?.trim()
    const grupo = row.getCell(7).text?.trim().toUpperCase() || null

    if (!codPreinsc || !ci) {
       // Skip empty rows usually found at end of excel
       return 
    }

    rows.push({
      rowNumber,
      nro,
      unidad,
      codPreinsc,
      nombrePostulante,
      ci,
      grupo,
    })
  })

  stats.total = rows.length
  console.log(`Found ${stats.total} rows to process.`)

  for (const row of rows) {
    const validation = PostulanteSchema.safeParse({
      nro: row.nro,
      unidad: row.unidad,
      codPreinsc: row.codPreinsc,
      nombrePostulante: row.nombrePostulante,
      ci: row.ci,
      grupo: row.grupo,
    })

    if (!validation.success) {
      console.error(`Row ${row.rowNumber} invalid:`, validation.error.issues)
      stats.errors++
      continue
    }

    try {
      const existing = await prisma.postulante.findUnique({
        where: { codPreinsc: row.codPreinsc }
      })

      if (existing) {
        await prisma.postulante.update({
          where: { codPreinsc: row.codPreinsc },
          data: validation.data
        })
        stats.updated++
      } else {
        await prisma.postulante.create({
          data: validation.data
        })
        stats.inserted++
      }
      
      if ((stats.inserted + stats.updated + stats.errors) % 100 === 0) {
        process.stdout.write('.')
      }

    } catch (e) {
      console.error(`Error saving row ${row.rowNumber}:`, e)
      stats.errors++
    }
  }

  console.log('\nDone!')
  console.log(stats)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

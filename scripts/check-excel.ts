import ExcelJS from 'exceljs'
import path from 'path'

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

  console.log('--- HEADERS (Row 1) ---')
  const headers = worksheet.getRow(1).values
  if (Array.isArray(headers)) {
      headers.forEach((val, index) => {
          console.log(`Col ${index}: ${val}`)
      })
  }

  console.log('\n--- FIRST 3 DATA ROWS ---')
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 1 || rowNumber > 4) return
    console.log(`Row ${rowNumber}:`)
    row.eachCell((cell, colNumber) => {
        console.log(`  Col ${colNumber}: ${cell.text}`)
    })
  })
}

main()

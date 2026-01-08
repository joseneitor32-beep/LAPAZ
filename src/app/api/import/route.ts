import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const PostulanteSchema = z.object({
  nro: z.number().nullable(),
  unidad: z.string().min(1),
  codPreinsc: z.string().min(1),
  nombrePostulante: z.string().min(1),
  ci: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      return NextResponse.json({ error: "No worksheet found" }, { status: 400 });
    }

    let stats = {
      total: 0,
      inserted: 0,
      updated: 0,
      errors: 0,
      errorDetails: [] as any[],
    };

    const rows: any[] = [];
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      // Column 1: Nro
      // Column 2: Unidad
      // Column 3: Cod Preinsc
      // Column 4: Nombre
      // Column 5: CI
      
      const nroVal = row.getCell(1).value;
      const nro = typeof nroVal === 'number' ? nroVal : parseInt(String(nroVal)) || null;
      
      const unidad = row.getCell(2).text?.trim().toUpperCase();
      const codPreinsc = row.getCell(3).text?.trim().toUpperCase();
      const nombrePostulante = row.getCell(4).text?.trim().toUpperCase();
      const ci = row.getCell(5).text?.trim();

      rows.push({
        rowNumber,
        nro,
        unidad,
        codPreinsc,
        nombrePostulante,
        ci,
      });
    });

    stats.total = rows.length;

    for (const row of rows) {
      const validation = PostulanteSchema.safeParse({
        nro: row.nro,
        unidad: row.unidad,
        codPreinsc: row.codPreinsc,
        nombrePostulante: row.nombrePostulante,
        ci: row.ci,
      });

      if (!validation.success) {
        stats.errors++;
        stats.errorDetails.push({ 
          row: row.rowNumber, 
          codPreinsc: row.codPreinsc,
          error: validation.error.issues 
        });
        continue;
      }

      try {
        const existing = await prisma.postulante.findUnique({
          where: { codPreinsc: row.codPreinsc }
        });

        if (existing) {
          await prisma.postulante.update({
            where: { codPreinsc: row.codPreinsc },
            data: validation.data
          });
          stats.updated++;
        } else {
          await prisma.postulante.create({
            data: validation.data
          });
          stats.inserted++;
        }
      } catch (e) {
        console.error(e);
        stats.errors++;
        stats.errorDetails.push({ 
          row: row.rowNumber, 
          codPreinsc: row.codPreinsc,
          error: "Database error" 
        });
      }
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

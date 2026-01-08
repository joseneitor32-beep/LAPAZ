import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  // Use insensitive search for Postgres
  const where = search ? {
    OR: [
      { ci: { contains: search, mode: 'insensitive' as const } },
      { unidad: { contains: search, mode: 'insensitive' as const } },
      { codPreinsc: { contains: search, mode: 'insensitive' as const } },
      { nombrePostulante: { contains: search, mode: 'insensitive' as const } },
    ]
  } : {};

  try {
    const [data, total] = await Promise.all([
      prisma.postulante.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.postulante.count({ where })
    ]);

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

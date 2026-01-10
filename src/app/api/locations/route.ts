import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 默认演示用户 ID
const DEMO_USER_ID = "demo-user";

// 确保演示用户存在
async function ensureDemoUser() {
  const user = await prisma.user.findUnique({
    where: { id: DEMO_USER_ID },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        id: DEMO_USER_ID,
        name: "Demo User",
        email: "demo@example.com",
      },
    });
  }
}

// GET - 获取所有地点
export async function GET() {
  try {
    await ensureDemoUser();

    const locations = await prisma.location.findMany({
      where: { userId: DEMO_USER_ID },
      orderBy: { createdAt: "desc" },
      include: {
        photos: true,
      },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error("获取地点失败:", error);
    return NextResponse.json(
      { error: "获取地点失败" },
      { status: 500 }
    );
  }
}

// POST - 创建新地点
export async function POST(request: NextRequest) {
  try {
    await ensureDemoUser();

    const body = await request.json();
    const { name, lat, lng, country, city, date, notes } = body;

    if (!name || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: "缺少必需字段: name, lat, lng" },
        { status: 400 }
      );
    }

    const location = await prisma.location.create({
      data: {
        name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        country,
        city,
        date: date ? new Date(date) : null,
        notes,
        userId: DEMO_USER_ID,
      },
      include: {
        photos: true,
      },
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error("创建地点失败:", error);
    return NextResponse.json(
      { error: "创建地点失败" },
      { status: 500 }
    );
  }
}

// DELETE - 删除地点
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "缺少地点 ID" },
        { status: 400 }
      );
    }

    await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除地点失败:", error);
    return NextResponse.json(
      { error: "删除地点失败" },
      { status: 500 }
    );
  }
}

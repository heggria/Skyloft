import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - 获取所有地点
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授权" },
        { status: 401 }
      );
    }

    const locations = await prisma.location.findMany({
      where: { userId: session.user.id },
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
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授权" },
        { status: 401 }
      );
    }

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
        userId: session.user.id,
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
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授权" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "缺少地点 ID" },
        { status: 400 }
      );
    }

    // 验证地点属于当前用户
    const location = await prisma.location.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!location) {
      return NextResponse.json(
        { error: "地点不存在" },
        { status: 404 }
      );
    }

    if (location.userId !== session.user.id) {
      return NextResponse.json(
        { error: "无权删除此地点" },
        { status: 403 }
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

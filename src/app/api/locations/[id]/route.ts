import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - 更新地点
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, lat, lng, country, city, date, notes } = body;

    const location = await prisma.location.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(lat !== undefined && { lat: parseFloat(lat) }),
        ...(lng !== undefined && { lng: parseFloat(lng) }),
        ...(country !== undefined && { country }),
        ...(city !== undefined && { city }),
        ...(date !== undefined && { date: date ? new Date(date) : null }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        photos: true,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("更新地点失败:", error);
    return NextResponse.json(
      { error: "更新地点失败" },
      { status: 500 }
    );
  }
}

// DELETE - 删除地点
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

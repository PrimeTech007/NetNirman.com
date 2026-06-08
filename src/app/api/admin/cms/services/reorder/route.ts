import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Service } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const schema = z.object({
      items: z.array(z.object({ id: z.string(), order: z.number() })),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    await connectDB();
    await Promise.all(
      parsed.data.items.map((item) =>
        Service.findByIdAndUpdate(item.id, { order: item.order })
      )
    );

    return NextResponse.json({ message: "Reordered" });
  } catch (err) {
    console.error("PATCH reorder:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

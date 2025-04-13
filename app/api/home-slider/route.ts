import { NextResponse } from "next/server";
import { prisma } from "@/helper/db"; // Adjust this path as needed
import pako from "pako";

/**
 * Helper: Convert Base64 string (without prefix) to Uint8Array.
 */
function base64ToUint8Array(base64: string): Uint8Array {
  return Uint8Array.from(Buffer.from(base64, "base64"));
}

/**
 * Helper: Convert Uint8Array to Base64 string with a mime prefix.
 */
function uint8ArrayToBase64(bytes: Uint8Array, mimeType = "image/jpeg"): string {
  const base64 = Buffer.from(bytes).toString("base64");
  return `data:${mimeType};base64,` + base64;
}

/**
 * Decompress a compressed Base64 string using pako.
 */
function decompressImageBase64(compressedBase64: string): string {
  let cleaned = compressedBase64;
  if (compressedBase64.startsWith("data:")) {
    cleaned = compressedBase64.split(",")[1];
  }
  const compressedBytes = base64ToUint8Array(cleaned);
  const decompressedBytes = pako.inflate(compressedBytes);
  return uint8ArrayToBase64(decompressedBytes, "image/jpeg");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const slider = await prisma.home_slider.findUnique({
        where: { id: Number(id) },
      });
      if (!slider)
        return NextResponse.json({ error: "Slider not found" }, { status: 404 });
      slider.image_url = decompressImageBase64(slider.image_url);
      return NextResponse.json(slider);
    } else {
      const home_sliders = await prisma.home_slider.findMany();
      const decompressedSliders = home_sliders.map((slider) => ({
        ...slider,
        image_url: decompressImageBase64(slider.image_url),
      }));
      return NextResponse.json(decompressedSliders);
    }
  } catch (e) {
    console.error("Error fetching home_slider records:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : e }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const slider = await prisma.home_slider.create({
      data: {
        image_url: data.image, // already compressed on the client
        title: data.english_title,
        m_title: data.marathi_title,
      },
    });
    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    console.error("Error creating home_slider record:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : error || "Failed to create home slider" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    console.log("Deleting slider with id:", data.id);
    const slider = await prisma.home_slider.delete({
      where: { id: Number(data.id) },
    });
    return NextResponse.json(slider, { status: 200 });
  } catch (error) {
    console.error("Error deleting home_slider record:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete home slider" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
  const data = await request.json();
  console.log("Received update payload:", data);
  const event = await prisma.home_slider.update({
      where: { id: Number(data.id) },
      data: {
      image_url: data.image,
      title: data.english_title,
      m_title: data.marathi_title,
      },
  });
  return NextResponse.json(event, { status: 200 });
  } catch (error) {
  console.error("Error updating home_slider record:", error);
  return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update home slider" },
      { status: 500 }
  );
  }
}
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
      const event = await prisma.home_events.findUnique({
        where: { id: Number(id) },
      });
      if (!event)
        return NextResponse.json({ error: "event not found" }, { status: 404 });
      event.image_url = decompressImageBase64(event.image_url);
      return NextResponse.json(event);
    } else {
      const home_events = await prisma.home_events.findMany();
      const decompressedevents = home_events.map((event) => ({
        ...event,
        image_url: decompressImageBase64(event.image_url),
      }));
      return NextResponse.json(decompressedevents);
    }
  } catch (e) {
    console.error("Error fetching home_event records:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : e }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const event = await prisma.home_events.create({
      data: {
        image_url: data.image, // already compressed on the client
        title: data.english_title,
        m_title: data.marathi_title,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating home_event record:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : error || "Failed to create home event" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    console.log("Deleting event with id:", data.id);
    const event = await prisma.home_events.delete({
      where: { id: Number(data.id) },
    });
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error deleting home_event record:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete home event" },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) {
    try {
      const data = await request.json();
      console.log("Received update payload:", data);
      const event = await prisma.home_events.update({
        where: { id: Number(data.id) },
        data: {
          image_url: data.image,
          title: data.english_title,
          m_title: data.marathi_title,
        },
      });
      return NextResponse.json(event, { status: 200 });
    } catch (error) {
      console.error("Error updating home_event record:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to update home event" },
        { status: 500 }
      );
    }
  }
  
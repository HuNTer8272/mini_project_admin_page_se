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
 * Helper: Convert Uint8Array to Base64 string with a MIME prefix.
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
      const member = await prisma.member_details.findUnique({
        where: { id: Number(id) },
      });
      if (!member)
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      member.image_url = decompressImageBase64(member.image_url);
      return NextResponse.json(member);
    } else {
      const members = await prisma.member_details.findMany();
      const decompressedMembers = members.map((member) => ({
        ...member,
        image_url: decompressImageBase64(member.image_url),
      }));
      return NextResponse.json(decompressedMembers);
    }
  } catch (e) {
    console.error("Error fetching member_details records:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : e }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Expected payload: { name, m_name, position, m_position, image }
    const member = await prisma.member_details.create({
      data: {
        image_url: data.image, // already compressed on the client
        name: data.name,
        m_name: data.m_name,
        position: data.position,
        m_position: data.m_position,
      },
    });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating member_details record:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : error || "Failed to create member" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    // Expected payload: { id, name, m_name, position, m_position, image }
    console.log("Received update payload:", data);
    const member = await prisma.member_details.update({
      where: { id: Number(data.id) },
      data: {
        image_url: data.image,
        name: data.name,
        m_name: data.m_name,
        position: data.position,
        m_position: data.m_position,
      },
    });
    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    console.error("Error updating member_details record:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update member" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing member ID" }, { status: 400 });
    }

    const member = await prisma.member_details.delete({
      where: { id: Number(id) },
    });
    
    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete member" },
      { status: 500 }
    );
  }
}
import { type NextRequest, NextResponse } from "next/server";
import {
  readLinksData,
  writeLinksData,
  addLinksItem,
  updateLinksItem,
  deleteLinksItem,
  getCategories,
  getAllTags,
} from "@/components/links/management/links-manage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "data";

    switch (action) {
      case "data": {
        const data = readLinksData();
        return NextResponse.json(data);
      }
      case "categories": {
        const categories = getCategories();
        return NextResponse.json(categories);
      }
      case "tags": {
        const tags = getAllTags();
        return NextResponse.json(tags);
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in links management API:", error);
    return NextResponse.json(
      {
        error: "Failed to read links data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case "add": {
        const newItem = addLinksItem(data);
        return NextResponse.json(newItem, { status: 201 });
      }
      case "write": {
        writeLinksData(data);
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in links management API:", error);

    if (error instanceof Error) {
      if (error.message.includes("URL already exists")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes("Missing required fields")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      {
        error: "Failed to manage links data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    const body = await request.json();
    const updatedItem = updateLinksItem(id, body);

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);

    if (error instanceof Error) {
      if (error.message.includes("URL already exists")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes("Links item not found")) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    return NextResponse.json(
      {
        error: "Failed to update item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    deleteLinksItem(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);

    if (error instanceof Error) {
      if (error.message.includes("Links item not found")) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    return NextResponse.json(
      {
        error: "Failed to delete item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

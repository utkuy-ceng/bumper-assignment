import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";

// Data file path
const dataFilePath = path.join(process.cwd(), "data", "partners.json");

// Ensure data directory exists
try {
  if (!fs.existsSync(path.join(process.cwd(), "data"))) {
    fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
  }

  // Create empty partners file if it doesn't exist
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
  }
} catch (error) {
  console.error("Error initializing data file:", error);
}

// Form validation schema
const partnerSchema = z
  .object({
    name: z.string().max(255),
    company: z.string().max(255),
    mobile_phone: z.string().regex(/^0(\s*)(7)(\s*)(\d(\s*)){9}$/),
    email_address: z.string().min(5).max(255).email(),
    postcode: z.string().max(30),
    pay_later: z.boolean(),
    pay_now: z.boolean(),
  })
  .refine((data) => data.pay_later || data.pay_now, {
    message: "At least one of 'Pay Later' or 'Pay Now' must be selected",
    path: ["services"],
  });

type Partner = z.infer<typeof partnerSchema>;

// GET handler for retrieving all partners
export async function GET(request: NextRequest) {
  try {
    // Extract search params for company filter
    const { searchParams } = new URL(request.url);
    const companyFilter = searchParams.get("company");

    // Read partners data
    const partnersData = JSON.parse(
      fs.readFileSync(dataFilePath, "utf-8")
    ) as Partner[];

    // Filter partners by company name if filter is provided
    const filteredPartners = companyFilter
      ? partnersData.filter((partner) =>
          partner.company.toLowerCase().includes(companyFilter.toLowerCase())
        )
      : partnersData;

    return NextResponse.json({ partners: filteredPartners }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving partners:", error);
    return NextResponse.json(
      { error: "Failed to retrieve partners" },
      { status: 500 }
    );
  }
}

// POST handler for adding a new partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = partnerSchema.parse(body);

    // Add a timestamp and ID to the partner data
    const newPartner = {
      ...validatedData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    // Read current partners data
    const partnersData = JSON.parse(
      fs.readFileSync(dataFilePath, "utf-8")
    ) as Partner[];

    // Add new partner to the list
    partnersData.push(newPartner);

    // Write updated data back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(partnersData, null, 2));

    return NextResponse.json(
      { success: true, partner: newPartner },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding partner:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add partner" },
      { status: 500 }
    );
  }
}

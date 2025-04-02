import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const partnerSchema = z
  .object({
    name: z.string().max(255),
    company: z.string().max(255),
    mobile_phone: z
      .string()
      .regex(
        /^0(\s*)(7)(\s*)(\d(\s*)){9}$/,
        "Mobile phone must be in UK format starting with 07"
      ),
    email_address: z.string().min(5).max(255).email(),
    postcode: z.string().max(30),
    pay_later: z.boolean(),
    pay_now: z.boolean(),
  })
  .refine((data) => data.pay_later || data.pay_now, {
    message: "At least one of 'Pay Later' or 'Pay Now' must be selected",
  });

// This would normally be stored in a database
let partners: z.infer<typeof partnerSchema>[] = [
  {
    name: "John Smith",
    company: "Bumper Garages",
    mobile_phone: "07123456789",
    email_address: "john@bumpergarages.com",
    postcode: "BT1 1QR",
    pay_later: true,
    pay_now: false,
  },
  {
    name: "Jane Doe",
    company: "Bumper Independent Test",
    mobile_phone: "07891234567",
    email_address: "jane@bumperindependent.co.uk",
    postcode: "EH1 1DE",
    pay_later: true,
    pay_now: true,
  },
  {
    name: "Greg Smith",
    company: "A Gregory Service And Repair",
    mobile_phone: "07234567890",
    email_address: "service@asgregoryandrepair.com",
    postcode: "PL1 3QR",
    pay_later: false,
    pay_now: true,
  },
];

export async function GET() {
  return NextResponse.json(partners);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = partnerSchema.parse(body);

    // Add the new partner to the list
    partners.push(validatedData);

    return NextResponse.json(validatedData, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

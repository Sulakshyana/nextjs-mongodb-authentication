import { getTokenData } from "@/helpers/getTokenData";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModels";
import { connect } from "@/dbConfig/dbConfig";
await connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getTokenData(request);
    const user = await User.findById(userId).select("-password");
    return NextResponse.json({
      message: "User found successfully",
      success: true,
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";
await connect();

export async function POST(request: NextRequest) {
  console.log({ "reached post": "reached post" });
  try {
    const reqBody = await request.json();
    console.log("REQ BODY:", reqBody);
    const { email, password } = reqBody;
    console.log({ reqBody });

    const user = await User.findOne({ email });
    console.log("USER FROM DB:", user);

    if (!user) {
      console.log(" USER NOT FOUND");
      return NextResponse.json(
        { error: "User does not exists." },
        { status: 400 }
      );
    }
    console.log("HASHED PASSWORD:", user.password);

    console.log("LOGIN USER PASSWORD:", user.password);

    const validPassword = await bcryptjs.compare(password, user.password);
    console.log("PASSWORD MATCH:", validPassword);
    if (!validPassword) {
      console.log(" PASSWORD MISMATCH");
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 400 }
      );
    }

    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    //create jwt token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "User logged in successfully",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    console.log("signup error", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

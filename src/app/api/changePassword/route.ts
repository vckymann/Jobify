import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
    await dbConnect();
    const { oldPassword, newPassword } = await req.json();

    const session = await getServerSession(authOptions);
    const email = session?.user.email

    const user = await UserModel.findOne({ email });

    if (!user) {
        return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.password !== oldPassword) {
        return Response.json({success: false, message: 'Old password is incorrect'}, { status: 400 });
    }

    user.password = newPassword;
    await user.save();

    return Response.json({ success: true, message: 'Password changed successfully' }, { status: 200 });

}
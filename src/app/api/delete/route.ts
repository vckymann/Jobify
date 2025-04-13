import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function DELETE() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({
            error:'user is not logged in'    
        },{status:404})
    }

    const email = session?.user.email

    const user = await UserModel.findOne({ email });

    user?.deleteOne({ email }).then(() => {
        return Response.json({ success: true, message: "User deleted successfully" }, { status: 200 });
    }).catch(() => {
        return Response.json({ error: "Error deleting user" }, { status: 500 });
    });
}
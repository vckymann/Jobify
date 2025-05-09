import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function DELETE() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json(
            { success: false, message: 'User is not logged in' },
            { status: 401 } 
        );
    }

    const email = session.user.email;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        await user.deleteOne();

        return Response.json(
            { success: true, message: "Your account has been deleted successfully" },
            { status: 200 }
        );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return Response.json(
            { success: false, message: "Failed to delete your account" },
            { status: 500 }
        );
    }
}

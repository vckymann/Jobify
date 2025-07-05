import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';
import { v2 as cloudinary }  from 'cloudinary';
import UserModel from '@/model/User';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
})

export async function POST(req: NextRequest) {
    
    
    const session = await getServerSession(authOptions);
    const user = session?.user.email

    const data = await req.formData();
    const resume = data.get('file');    

    if(!resume || !(resume instanceof Blob)) {
        return NextResponse.json({ success:false, message: 'No resume uploaded' }, { status: 400 });
    }
    

    if (!resume) {
        return NextResponse.json({ success:false, message: 'No resume uploaded' }, { status: 400 });
    }

    const bytes = await resume.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload: Promise<string>  = new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
        {
        resource_type: 'raw',
        folder: 'jobify/resumes',        
        public_id: `resume-${user?.replace(/[@.]/g, '_')}.pdf`,
        overwrite: true
        },
        (error, result) => {
            if (error) {
            reject(error);
            } else {
            resolve(result?.secure_url ?? '');
            }
        }
        ).end(buffer);
    })

    const url =  await upload;    

    if (!url) {
        return NextResponse.json({ success:false, message: 'Error uploading resume' }, { status: 500 });
    }

    await UserModel.findOneAndUpdate({ email: user }, { resume: url });

    return NextResponse.json({ success: true, message: 'Resume uploaded successfully', data: url });
    
}

export async function DELETE() {

    const session = await getServerSession(authOptions);
    const user = session?.user.email

    try {
        await cloudinary.uploader.destroy(`jobify/resumes/resume-${user?.replace(/[@.]/g, '_')}.pdf`, {resource_type: 'raw'});
        await UserModel.updateOne({ email: user }, { $unset: {resume: 1 }});
        return NextResponse.json({ success: true, message: 'Resume deleted successfully' });
    } catch (error) {
        console.error(error, "error deleting resume");
        return NextResponse.json({ success: false, message: 'Error deleting resume' }, { status: 500 });
    }
    
}

export async function GET() {

    const session = await getServerSession(authOptions);
    const user = session?.user.email

    if (!user) {
        return NextResponse.json({ success:false, message: 'User is not logged in' }, { status: 401 });
    }

    try {
        const result = await UserModel.findOne({ email: user }).select('resume');                
        return NextResponse.json({ success: true, message: 'Resume fetched successfully', data: result }, { status: 200 });
    } catch (error) {
        console.error(error, "error fetching resume");
        return NextResponse.json({ success: false, message: 'Error fetching resume' }, { status: 500 });
    }        
}


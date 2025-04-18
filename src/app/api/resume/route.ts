import { stat, writeFile } from 'fs/promises';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { rm } from 'fs/promises';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
    const data = await req.formData();
    console.log(data);
    
    const resume: File | null = data.get('file') as unknown as File
    console.log(resume);

    const session = await getServerSession(authOptions);
    const user = session?.user.email
    

    if (!resume) {
        return NextResponse.json({ success:false, message: 'No resume uploaded' }, { status: 400 });
    }

    const bytes = await resume.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = join(process.cwd(), 'public', `resume${user}.pdf`);
    await writeFile(path, buffer);
    console.log(`open ${path}`);

    return NextResponse.json({ success: true, message: 'Resume uploaded successfully' });
    
}

export async function DELETE() {

    const session = await getServerSession(authOptions);
    const user = session?.user.email

    const path = join(process.cwd(), 'public', `resume${user}.pdf`);
    await rm(path, { force: true });
    return NextResponse.json({ success: true, message: 'Resume deleted successfully' });
}

export async function GET() {

    const session = await getServerSession(authOptions);
    const user = session?.user.email

    const path = join(process.cwd(), 'public', `resume${user}.pdf`);
    try {
        await stat(path);
      } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: 'No resume found' }, { status: 404 });
      }
        
    const publicPath = `/resume${user}.pdf`;
    return NextResponse.json({ success: true, message: 'Resume fetched successfully', data: publicPath }, { status: 200 });
}


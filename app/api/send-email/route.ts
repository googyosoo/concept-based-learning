import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const pdfFile = formData.get('file') as File;

        if (!email || !pdfFile) {
            return NextResponse.json({ error: 'Email and file are required' }, { status: 400 });
        }

        const buffer = Buffer.from(await pdfFile.arrayBuffer());

        // Check Env Vars
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing Email Credentials in Env");
            return NextResponse.json({ error: 'Server configuration error: Missing email credentials' }, { status: 500 });
        }

        // Configure Nodemailer with Gmail
        // ⚠️ 중요: Gmail을 사용하려면 '앱 비밀번호(App Password)'를 발급받아 환경변수에 설정해야 합니다.
        // 2단계 인증이 켜져 있는 계정에서는 일반 비밀번호로 로그인할 수 없습니다.
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // .env.local 파일에 EMAIL_USER=본인임메일 설정
                pass: process.env.EMAIL_PASS, // .env.local 파일에 EMAIL_PASS=앱비밀번호 설정
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '[Concept Design] 단원 설계 PDF 파일입니다.',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">Concept-Based Inquiry Learning Design</h2>
          <p>작성하신 단원 설계안을 PDF로 첨부하여 보내드립니다.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">이 메일은 자동 발송되었습니다.</p>
        </div>
      `,
            attachments: [
                {
                    filename: 'lesson-plan.pdf',
                    content: buffer,
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Email send error:', error);
        return NextResponse.json({
            error: `메일 발송 실패: ${error.message || 'Unknown error'}. (Check server logs)`
        }, { status: 500 });
    }
}

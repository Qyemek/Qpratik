import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CertificateService {
  async generateCertificate(userName: string, level: string, score: number): Promise<string> {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const fileName = `certificate-${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), 'uploads', 'certificates', fileName);

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    doc.pipe(fs.createWriteStream(filePath));

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f0f0');
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke('#333');

    doc.fontSize(40).fillColor('#333').text('Certificate of Achievement', 100, 100, {
      align: 'center',
    });

    doc.fontSize(20).text('This is to certify that', 100, 200, { align: 'center' });

    doc.fontSize(30).fillColor('#0066cc').text(userName, 100, 250, { align: 'center' });

    doc.fontSize(18).fillColor('#333').text(
      `has successfully completed the ${level} level English test`,
      100,
      320,
      { align: 'center' },
    );

    doc.fontSize(16).text(`with a score of ${score}%`, 100, 370, { align: 'center' });

    doc.fontSize(12).text(new Date().toLocaleDateString(), 100, 450, { align: 'center' });

    doc.fontSize(14).text('Qpratik - English Learning Platform', 100, 500, {
      align: 'center',
    });

    doc.end();

    return `/uploads/certificates/${fileName}`;
  }
}

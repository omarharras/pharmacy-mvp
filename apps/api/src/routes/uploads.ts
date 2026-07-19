import fs from 'node:fs';
import path from 'node:path';

import { Router } from 'express';
import multer from 'multer';

import { prisma } from '../lib/prisma';

const uploadDirectory = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_request, file, callback) => {
      const extension = path.extname(file.originalname);
      const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(null, `${baseName}${extension}`);
    },
  }),
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
});

export const uploadsRouter = Router();

uploadsRouter.post('/prescriptions', upload.single('prescription'), async (request, response, next) => {
  try {
    if (!request.file) {
      response.status(400).json({
        error: 'Prescription file is required',
      });
      return;
    }

    const prescription = await prisma.prescriptionUpload.create({
      data: {
        originalName: request.file.originalname,
        fileName: request.file.filename,
        mimeType: request.file.mimetype,
        sizeBytes: request.file.size,
      },
    });

    response.status(201).json({
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
});

import {
  Res,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ValidationFiles } from './validation';
import { Response } from 'express';


@Controller('upload')
export class UploadController {
  constructor(private readonly validationFiles: ValidationFiles) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // specify the path where files should be saved
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`); // specify the filename
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadFile(@UploadedFile() file, @Res() res: Response) {
    try {
      await this.validationFiles.validateFile(file);
      res.status(200).send({ message: 'File uploaded successfully' });
    } catch (error) {
      res.status(500).send({ message: 'File upload failed', error: error.message });

    }
    
  }
}

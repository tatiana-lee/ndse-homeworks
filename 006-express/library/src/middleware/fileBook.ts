import multer from 'multer';
import { v4 as uuid } from 'uuid';

const storage = multer.diskStorage({
  destination(req: any, file: any, cb: any) {
    cb(null, 'public/books');
  },
  filename(req: any, file: any, cb: any) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, `${uuid()}-${file.originalname}`);
  },
});

export const fileMiddleware = multer({ storage });

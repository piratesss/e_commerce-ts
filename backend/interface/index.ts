export * from './users.interface';

export interface MulterRequest extends Request {
    files?: Express.Multer.File[];
}

import 'express';
import { IUser } from '../../src/models/User.js';
import { Types } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            user?: IUser & { _id: Types.ObjectId };
        }
    }
}

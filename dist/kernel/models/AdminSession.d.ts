import mongoose from 'mongoose';
export declare const AdminSession: mongoose.Model<{
    adminId: mongoose.Types.ObjectId;
    deviceId: string;
    token: string;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    adminId: mongoose.Types.ObjectId;
    deviceId: string;
    token: string;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    adminId: mongoose.Types.ObjectId;
    deviceId: string;
    token: string;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    adminId: mongoose.Types.ObjectId;
    deviceId: string;
    token: string;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    adminId: mongoose.Types.ObjectId;
    deviceId: string;
    token: string;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    adminId: mongoose.Types.ObjectId;
    deviceId: string;
    token: string;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    adminId: mongoose.Types.ObjectId;
    deviceId: string;
    token: string;
    lastActive: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    adminId: mongoose.Types.ObjectId;
    deviceId: string;
    token: string;
    lastActive: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=AdminSession.d.ts.map
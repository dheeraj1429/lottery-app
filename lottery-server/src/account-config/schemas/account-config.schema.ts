import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type AccountConfigDocument = HydratedDocument<AccountConfig>;

@Schema()
export class AccountConfig {
   @Prop({ type: mongoose.Types.ObjectId, ref: 'auth', required: true })
   userId: ObjectId;

   @Prop({ required: true })
   clientId: string;

   @Prop({ default: false })
   accountEnable: boolean;
}

export const AccountConfigSchema = SchemaFactory.createForClass(AccountConfig);

AccountConfigSchema.index({ userId: 1 });
AccountConfigSchema.index({ clientId: 1 });

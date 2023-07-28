import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
   @Prop()
   email: string;

   @Prop()
   password: string;

   @Prop({
      default:
         'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
   })
   avatar: string;

   @Prop({ type: Date, default: Date.now })
   createdAt: Date;

   @Prop({ type: mongoose.Types.ObjectId, ref: 'roles' })
   roleId: Types.ObjectId;

   @Prop()
   ownerClientId: string;

   @Prop({ type: mongoose.Types.ObjectId, ref: 'auths' })
   createdBy: Types.ObjectId;
}

const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.index({ email: 1 });
AuthSchema.index({ roleId: 1 });
AuthSchema.index({ createdBy: 1 });

export default AuthSchema;

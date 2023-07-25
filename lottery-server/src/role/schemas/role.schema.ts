import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
   @Prop({ required: true })
   roleName: string;

   @Prop({ default: false })
   isDefault: boolean;

   @Prop({ type: Date, default: Date.now })
   createdAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role).index({
   roleName: 1,
});

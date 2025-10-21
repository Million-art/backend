import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MaterialDocument = Material & Document;

@Schema({ timestamps: true })
export class Material {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  url?: string;

  @Prop()
  filePath?: string;

  @Prop()
  fileName?: string;

  @Prop()
  fileSize?: number;

  @Prop()
  mimeType?: string;

  @Prop()
  category?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ default: 'easy' })
  difficulty: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  viewCount: number;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ _id: false })
export class GrammarMistake {
  @Prop({ required: true })
  mistake: string;

  @Prop({ required: true })
  correction: string;

  @Prop({ required: true })
  grammarType: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ _id: false })
export class Lesson {
  @Prop({ required: true })
  topic: string;

  @Prop()
  details?: string;

  @Prop()
  content?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ _id: false })
export class ChatEntry {
  @Prop({ required: true })
  userMessage: string;

  @Prop({ required: true })
  aiResponse: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ type: [GrammarMistake], default: [] })
  grammarMistakes: GrammarMistake[];

  @Prop({ type: [Lesson], default: [] })
  lessons: Lesson[];

  @Prop({ type: [ChatEntry], default: [] })
  chatHistory: ChatEntry[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

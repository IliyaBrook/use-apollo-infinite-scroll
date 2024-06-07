import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

interface ItemInterface {
	_id: mongoose.Schema.Types.ObjectId;
	name: string;
	description: string;
}

const itemSchema = new Schema<ItemInterface>({
	_id	:mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	description: { type: String, required: true }
});

export default model<ItemInterface>('Item', itemSchema);

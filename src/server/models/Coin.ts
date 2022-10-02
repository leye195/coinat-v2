import mongoose from 'mongoose';

const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'name is required',
  },
  KRW: {
    type: Boolean,
    default: false,
  },
  BTC: {
    type: Boolean,
    default: false,
  },
  img: {
    type: String,
    default: '',
  },
  upbit: {
    type: Boolean,
    default: false,
  },
  binance: {
    type: Boolean,
    default: false,
  },
  bithumb: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const coinModel = mongoose.models.Coin || mongoose.model('Coin', coinSchema);
export default coinModel;

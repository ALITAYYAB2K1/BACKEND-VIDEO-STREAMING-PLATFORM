import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      // The user who is subscribing
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    channel: {
      // The user who is being subscribed to
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["SUBSCRIBED", "UNSUBSCRIBED"],
      default: "SUBSCRIBED",
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

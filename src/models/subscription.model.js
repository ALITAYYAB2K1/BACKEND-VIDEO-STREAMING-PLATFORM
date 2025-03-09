import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      // The user who is subscribing
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      // The user who is being subscribed to
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

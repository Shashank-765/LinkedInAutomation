
const User = require('../models/User.js');
const Plan = require('../models/Plan.js');

const Stripe = require("stripe");

const stripe = new Stripe('sk_test_51Sus6JLmNeb3s9IbPwIfzlPRYM5rpWbSVwFKpfVz0p9LIDfqB1tSSCUfe8OBzaI0bM7m6uNnNiUIOpGwKbgJOeH100opQDhE2L');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // We need the RAW body for Stripe signature verification
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.client_reference_id || session.metadata.userId;
      const planId = session.metadata.planId;

      if (userId && planId) {
        try {
          await User.findByIdAndUpdate(userId, {
            $set: { 
              planId: planId,
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
              subscriptionStatus: 'active'
            }
          });
          console.log(`✅ User ${userId} upgraded to plan ${planId}`);
        } catch (dbErr) {
          console.error('❌ Error updating user plan after checkout:', dbErr);
        }
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      // Handle recurring payment success if needed
      await User.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        { $set: { subscriptionStatus: 'active' } }
      );
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      try {
        // Find user by subscription ID and reset plan
        await User.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          { 
            $set: { 
              planId: null, // Revert to free or basic
              subscriptionStatus: 'canceled' 
            } 
          }
        );
        console.log(`📉 Subscription ${subscription.id} canceled. User downgraded.`);
      } catch (dbErr) {
        console.error('❌ Error downgrading user after cancellation:', dbErr);
      }
      break;
    }

    default:
      console.log(`ℹ️ Unhandled Stripe event type: ${event.type}`);
  }

  res.json({ received: true });
};

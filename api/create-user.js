// Vercel Serverless Function — Stripe Webhook → Create Supabase User
// POST /api/create-user
// Called by Stripe after a successful payment (webhook: checkout.session.completed)

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

module.exports = async (req, res) => {
  // Only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify Stripe webhook signature
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  if (endpointSecret && sig) {
    try {
      // Stripe signature verification
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: 'Invalid signature' });
    }
  } else {
    // For testing without signature verification
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  // Only handle checkout.session.completed
  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true, skipped: true });
  }

  const session = event.data.object;
  const customerEmail = session.customer_details?.email || session.customer_email;

  if (!customerEmail) {
    console.error('No email found in checkout session');
    return res.status(400).json({ error: 'No customer email' });
  }

  // Determine plan from Stripe metadata or price
  const plan = session.metadata?.plan || 'solo';

  // Init Supabase Admin client (service_role key)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Generate random password (12 chars)
  const tempPassword = crypto.randomBytes(6).toString('hex');

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === customerEmail);

    if (existingUser) {
      // User already exists — update metadata with new plan
      await supabase.auth.admin.updateUserById(existingUser.id, {
        user_metadata: { plan, updated_at: new Date().toISOString() }
      });

      return res.status(200).json({
        success: true,
        message: 'User already exists, plan updated',
        email: customerEmail,
        plan
      });
    }

    // Create new user
    const { data, error } = await supabase.auth.admin.createUser({
      email: customerEmail,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        plan,
        created_via: 'stripe_webhook',
        created_at: new Date().toISOString()
      }
    });

    if (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: error.message });
    }

    // Send welcome email with credentials via Supabase (inviteUserByEmail)
    // Or use a custom email service. For now, Supabase sends the invite.
    // The user receives an email from Supabase with their credentials.

    // Alternative: send custom email via Resend/SendGrid
    // For now, we log and return the temp password (Stripe can show it on success page)
    console.log(`User created: ${customerEmail} with plan: ${plan}`);

    return res.status(200).json({
      success: true,
      message: 'User created successfully',
      email: customerEmail,
      tempPassword, // This will be shown on Stripe success page
      plan,
      guideUrl: 'https://koda-landing-khaki.vercel.app/guide.html'
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

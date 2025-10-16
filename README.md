# 🏠 NivaasMitra

[![CI](https://github.com/Nsanjayboruds/NivaasMitra/actions/workflows/blank.yml/badge.svg)](https://github.com/Nsanjayboruds/NivaasMitra/actions/workflows/blank.yml)
![GitHub forks](https://img.shields.io/github/forks/Nsanjayboruds/NivaasMitra?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/Nsanjayboruds/NivaasMitra)

---


An end-to-end platform for house booking and visualization. NivaasMitra combines secure Razorpay payments with an interactive 3D house model viewer so users can explore properties in 3D and complete bookings/payments in a smooth flow.

This README is organized in an advanced structure to help contributors, integrators and maintainers quickly understand architecture, environment, deployment, payment integration and 3D model integration details.

---

## Table of contents

- Project overview
- Key features
- Architecture & tech stack
- Getting started (local development)
  - Prerequisites
  - Quick start
- Razorpay integration (server + client)
  - Payment flow
  - Server: create order & verify signature (example Node.js/Express)
  - Client: Razorpay checkout integration (example)
  - Best practices & security
- 3D House Model Viewer
  - Recommended approaches (model-viewer, three.js, Babylon)
  - Example: <model-viewer> (fast, simple)
  - Example: three.js (full control)
  - Hosting models & performance tips
- Environment variables (.env example)
- API reference (core endpoints)
- Deployment
- Testing & local QA
- Troubleshooting
- Contributing
- License & contacts

---

## Project overview

NivaasMitra provides:
- A searchable list of houses/properties.
- Interactive 3D viewing of each property (supports GLB/GLTF).
- Booking flow with Razorpay payment integration (create order server-side, verify signature).
- Admin/owner dashboard for adding/updating house models and metadata.

---

## Key features

- Interactive 3D model viewer for houses (GLB/GLTF)
- Secure payments via Razorpay (order creation & signature verification)
- Responsive web UI with mobile-ready payment flow
- Extensible backend API for property management
- Cloud-friendly static hosting for 3D assets (S3, Cloudflare R2)

---

## Architecture & tech stack

- Frontend: React / Vue / plain HTML+JS (examples use React snippets), Model viewer (model-viewer) or three.js for custom viewers
- Backend: Node.js + Express (examples), could be any server (Python/Django, Ruby, Go)
- Database: PostgreSQL / MongoDB (optional)
- Storage: S3 / object storage for GLB/GLTF assets
- Payment Gateway: Razorpay
- Deployment: Vercel / Netlify for frontend, Heroku / Railway / Render for backend

---

## Getting started (local development)

### Prerequisites
- Node.js >= 16
- npm / yarn
- Razorpay account for keys (test mode available)
- Git

### Quick start (example using Node + React)
1. Clone repository
   ```bash
   git clone https://github.com/Nsanjayboruds/NivaasMitra.git
   cd NivaasMitra
   ```
2. Install backend deps
   ```bash
   cd server
   npm install
   ```
3. Install frontend deps
   ```bash
   cd ../client
   npm install
   ```
4. Create a `.env` files in both server and client as required (see Environment variables below)
5. Run backend (example)
   ```bash
   # from /server
   npm run dev
   ```
6. Run frontend (example)
   ```bash
   # from /client
   npm start
   ```

---

## Razorpay integration

This section provides a secure and practical integration pattern for Razorpay: create orders on the server, pass order id to the client, complete payment in client, then verify signature server-side.

### Payment flow (recommended)
1. Client requests "create order" from your backend for a specific booking amount.
2. Backend calls Razorpay Orders API with key secret, receives an order object containing `id` (e.g., `order_DBJOWzybf0sJbb`).
3. Backend returns the order `id` and other necessary details to the client.
4. Client calls Razorpay Checkout with the `order_id`.
5. After payment, Razorpay returns `razorpay_payment_id`, `razorpay_order_id` and `razorpay_signature`.
6. Client posts the payment response to your backend for signature verification.
7. Backend verifies signature using the secret and finalizes booking.

### Server: create order & verify signature (Node.js / Express example)

```js
// server/controllers/payment.js
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;
    // amount in paise
    const options = {
      amount: amount, // integer: e.g., 50000 = INR 500.00
      currency,
      receipt,
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify signature
exports.verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    // mark booking as paid
    return res.json({ success: true, verified: true });
  } else {
    return res.status(400).json({ success: false, verified: false });
  }
};
```

Add routes:
```js
// server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const payment = require('../controllers/payment');

router.post('/create-order', payment.createOrder);
router.post('/verify', payment.verifyPayment);

module.exports = router;
```

### Client: Razorpay checkout integration (example)
Using the Razorpay Checkout script and the order id from your backend:

```html
<!-- Include Razorpay script -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<script>
async function pay(amount, currency = 'INR') {
  // 1. request backend to create order
  const resp = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency })
  });
  const { order } = await resp.json();

  const options = {
    key: 'YOUR_RAZORPAY_KEY_ID', // publishable key
    amount: order.amount,
    currency: order.currency,
    name: 'NivaasMitra',
    description: 'Property booking',
    order_id: order.id,
    handler: async function (response) {
      // send response to server for verification
      const verifyResp = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      });
      const verification = await verifyResp.json();
      if (verification.verified) {
        alert('Payment successful and verified');
      } else {
        alert('Payment verification failed');
      }
    },
    prefill: {
      name: 'Customer Name',
      email: 'customer@example.com'
    },
    theme: { color: '#3399cc' }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
</script>
```

### Best practices & security
- Never call Razorpay Orders API from the browser. Always from a server with secret keys.
- Use test keys while developing. Switch to live keys in production.
- Verify the signature on the server for every successful payment.
- Use webhooks for asynchronous events (payment failure, refund, capture) and secure webhook endpoints using signature verification.
- Store minimal sensitive data; never log secrets.

---

## 3D House Model Viewer

You can choose a simple web component or a full 3D engine. Two recommended approaches:

1. model-viewer (web component) — easiest, supports GLB/GLTF, PBR materials and AR.
   - Pros: minimal JS, good mobile support, quick to integrate.
   - Cons: less control than three.js.
2. three.js — full control for custom interactions and optimizations.
   - Pros: highest flexibility.
   - Cons: requires more code.

### Example A — <model-viewer> (fast integration)
Add CDN and embed a GLB model:

```html
<head>
  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
</head>
<body>
  <model-viewer id="houseViewer"
    src="https://your-cdn.com/models/house.glb"
    alt="3D model of the house"
    ar
    ar-modes="webxr scene-viewer quick-look"
    camera-controls
    auto-rotate
    exposure="1"
    style="width:100%; height:600px;">
  </model-viewer>
</body>
```

Tip: enable `loading="lazy"` for performance, and `reveal="interaction"` if you want the model to load only once user interacts.

### Example B — three.js (more control)
Minimal loader for GLTF models:

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
scene.add(hemi);

// Load model
const loader = new GLTFLoader();
loader.load('https://your-cdn.com/models/house.glb', gltf => {
  const model = gltf.scene;
  scene.add(model);
  // optional: center, scale, set shadows
});

camera.position.set(0, 1.6, 3);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

Add orbit controls, environment maps, LODs and baked lightmaps as needed.

### Hosting models & performance tips
- Use GLB (binary glTF) for best performance.
- Keep texture sizes reasonable (2k max for large surfaces).
- Use Draco compression for meshes; use KTX2 / Basis Universal for textures if supported.
- Serve models from a CDN or object storage with CORS configured.
- Lazy load the model only when the viewer is in viewport.
- Provide fallback 2D images while models load.

---

## Environment variables (.env example)

Server (.env)
```env
PORT=4000
NODE_ENV=development
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret
MODEL_ASSETS_BASE_URL=https://cdn.yourdomain.com/models
DB_URL=postgres://user:pass@host:5432/dbname
JWT_SECRET=some-long-secret
```

Client (.env)
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
REACT_APP_API_BASE_URL=http://localhost:4000/api
```

Never commit your `.env` to source control.

---

## API reference (core endpoints)

- POST /api/payment/create-order
  - Body: { amount: number (paise), currency: "INR", receipt?: string }
  - Response: { order: { id, amount, currency, ... } }

- POST /api/payment/verify
  - Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
  - Response: { verified: boolean }

- GET /api/properties
  - Lists properties (with metadata and model URLs)

- GET /api/properties/:id
  - Returns property details incl. GLB model URL

- POST /api/properties (admin)
  - Create property entry, set model URL, etc.

---

## Deployment

- Frontend (static): Vercel / Netlify — environment variables: REACT_APP_*
- Backend: Railway / Render / Heroku — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in platform env
- Models: Serve GLB from S3 with CloudFront or any CDN

Suggested steps:
1. Deploy backend and set secrets in platform.
2. Upload models to object storage and ensure public URL or signed URLs.
3. Configure frontend to point to deployed backend and use live Razorpay key id.
4. Switch Razorpay to live keys only when thoroughly tested.

---

## Testing & local QA

- Use Razorpay test keys and the test cards provided by Razorpay.
- Test signature verification by tampering with the request to ensure verification catches it.
- Test model loading on multiple devices and network speeds (use throttling in DevTools).
- Validate webhook endpoint signatures if using webhooks.

---

## Troubleshooting

- Razorpay "bad request" on create order: check amount is integer in smallest currency unit (paise).
- Signature mismatch: ensure you use exact string template: `${order_id}|${payment_id}` and use the same secret.
- Model not loading: check CORS and that Content-Type is correct (model.glb served as application/octet-stream or model/gltf-binary).
- Performance issues: reduce textures, use Draco compression, lazy-load the model.

---

## Contributing

- Fork the repo and open a PR with a concise description.
- Use branches named feature/* or fix/*.
- Add tests for backend endpoints where applicable.
- For UI changes, include screenshots or GIFs.

---

## License

MIT (or choose whichever license your project uses). Add a LICENSE file to the repo.

---

## Contact & Maintainers

- Repo owner: @Nsanjayboruds
- For payment-related issues, ensure keys are not leaked — update secrets immediately if exposed.

---

Appendix: Useful links
- Razorpay docs: https://razorpay.com/docs/
- model-viewer: https://modelviewer.dev/
- three.js: https://threejs.org/
- glTF 2.0: https://www.khronos.org/gltf/

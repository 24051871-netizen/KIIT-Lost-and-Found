# 🎓 KIIT-Find: Campus Lost and Found Recovery Portal
### Software Engineering Capstone & Subject Project (2026 Edition)
**Institution:** KIIT Deemed to be University, Bhubaneswar  
**Target Community:** Students, Faculty & Hostel Residents (Campuses 1 to 24, KP/QC Hostels)  

---

## 🌟 Key Highlights & 2026 Innovations

1. **Restricted `@kiit.ac.in` Google OAuth**: Ensures only authentic university members can post or claim items, automatically resolving student roll numbers (e.g. `2105xxx`).
2. **Double-Blind Ownership Verification**: Solves the critical flaw of lost-and-found apps. The finder sets a secret question (e.g. *"What sticker is on the back?"*). Only claimants with the correct answer unlock the handover phase.
3. **Cryptographic QR Code Proof of Handover**: Generates an HMAC-SHA256 signed, time-expiring (24h) QR token. Scanned via mobile camera at campus gates (Campus 15, KP Gate, KSAC) to close the ticket with an immutable audit log.
4. **Vercel Serverless Ready**: Uses global Mongoose connection caching (`maxPoolSize: 10`) to eliminate MongoDB Atlas pool exhaustion, with zero-crash fallback demo mode.
5. **Cloudinary CDN Integration**: Direct media storage with client preview and automated privacy masking for sensitive ID cards.
6. **Academic Artifacts Built-In**: IEEE 830 SRS and interactive UML diagrams accessible directly at `/docs`.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js v18+ (tested on Node v24)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd "SE Prompt"

# Install dependencies
npm install
```

### 3. Environment Variables Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

| Variable | Description |
| :--- | :--- |
| `NEXTAUTH_URL` | `http://localhost:3000` (or your Vercel URL in production) |
| `NEXTAUTH_SECRET` | Strong secret key for signing sessions and QR tokens |
| `GOOGLE_CLIENT_ID` | Google Cloud Console OAuth 2.0 Client ID (restricted to `kiit.ac.in`) |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console OAuth 2.0 Client Secret |
| `MONGODB_URI` | MongoDB Atlas connection string (`mongodb+srv://...`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

> **Note for Demonstrations & Grading:**  
> The application includes a **Graceful Resilience Architecture**. If `MONGODB_URI` or Google OAuth keys are left empty, the portal seamlessly operates using its pre-seeded in-memory KIIT store and instant demo logins (`Aman Sharma - 2105128@kiit.ac.in` and `Campus 15 Gate Security Desk`).

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🚢 Deploying to Vercel

1. Push this repository to GitHub or GitLab.
2. Go to **[Vercel Dashboard](https://vercel.com/)** &rarr; **Add New Project**.
3. Select your repository. Next.js App Router will be auto-detected.
4. Add your Environment Variables in the Vercel project settings:
   - `NEXTAUTH_SECRET`: Generate a random string (`openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your Vercel production URL (e.g. `https://kiit-find.vercel.app`)
   - (Optional) `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CLOUDINARY_*`
5. Click **Deploy**. Vercel will build and launch the project globally in seconds!

---

## 🧪 How to Demonstrate the Project to Examiners

1. **Browse Campus Feed (`/browse`)**: Filter items by *Campus 15 (School of Computer Engineering)*, *Central Library*, or *Hostels (KP/QC)*.
2. **Double-Blind Verification Flow**:
   - Open item **"Hostel Room Key with Marvel Keychain"** or **"Casio fx-991CW Calculator"**.
   - Click **Claim This Item**. Notice the finder's secret challenge question: *"What number is punched onto the key head?"*.
   - Enter `402`. The claim is pre-approved!
3. **QR Handover Verification (`/scan`)**:
   - Open **"Black Dell 65W Type-C Laptop Charger"** and click **View Handover QR Pass**.
   - Navigate to `/scan` (or test with another device/phone camera).
   - Scan the QR code or click **Auto-Test** with the sample token.
   - Watch the celebratory confetti animation as the item status transitions to `RETURNED` with timestamped audit logs!
4. **Academic Documentation (`/docs`)**:
   - Click **SE Docs (SRS & UML)** in the navigation bar to present the IEEE 830 requirements and UML sequence/statechart models directly to the professor.

---

## 🏛️ Architecture & Project Structure

```
├── docs/
│   ├── IEEE_830_SRS.md           # Formal IEEE 830 SRS Document
│   └── UML_DIAGRAMS.md           # Use Case, Sequence, State, and ER Diagrams
├── src/
│   ├── app/
│   │   ├── api/                  # Serverless REST endpoints
│   │   ├── browse/               # Filterable catalog
│   │   ├── report/               # Item post form with Cloudinary upload
│   │   ├── items/[id]/           # Detail, double-blind challenge, QR pass
│   │   ├── scan/                 # In-app WebRTC camera QR scanner
│   │   ├── docs/                 # Interactive in-app SRS and UML viewer
│   │   ├── layout.tsx            # Global layout with KIIT Navbar and Footer
│   │   └── page.tsx              # Landing page with recovery metrics
│   ├── components/               # ItemCard, Navbar, Modals, QrScanner
│   ├── lib/
│   │   ├── db.ts                 # Cached Mongoose connection for Vercel
│   │   ├── auth.ts               # Google OAuth @kiit.ac.in domain validation
│   │   ├── qr.ts                 # Cryptographic HMAC-SHA256 signer/verifier
│   │   └── kiit-data.ts          # KIIT Campuses, Hostels & Categories
│   ├── models/                   # Mongoose Item, User, Claim, AuditLog schemas
│   └── types/                    # TypeScript interfaces
```

---

## 📜 Academic Attribution
Developed for the **Software Engineering Subject Project**, School of Computer Engineering, KIIT Deemed to be University.

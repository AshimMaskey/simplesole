# SoleMate - Modern Shoe E-commerce Platform

A modern, full-stack e-commerce platform for footwear built with Next.js, featuring a beautiful UI, secure authentication, and seamless shopping experience.

## ✨ Features

- 🛍️ **Product Browsing**: Browse and filter through a wide range of footwear
- 🔐 **Secure Authentication**: Powered by Clerk for secure user authentication
- 🛒 **Shopping Cart**: Add, remove, and manage items in your cart
- 📱 **Responsive Design**: Works seamlessly on all devices
- ⚡ **Fast Performance**: Built with Next.js 14 and Turbopack for optimal performance
- 📦 **Modern UI**: Built with shadcn UI and TailwindCSS for beautiful, accessible components

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: TailwindCSS, Radix UI
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Hook Form, React Context
- **UI Components**: Radix UI, Lucide Icons, Tabler Icons
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Sonner & React Hot Toast
- **Charts**: Recharts for data visualization
- **Email**: Nodemailer

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- PostgreSQL database
- Clerk account for authentication

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AshimMaskey/simplesole.git
   cd simplesole
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/simplesole?schema=public"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Email (Nodemailer with Gmail)
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-gmail-app-password  # Use App Password if 2FA is enabled

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   **Note for Gmail:**

   - If you have 2FA enabled on your Gmail account, you'll need to generate an App Password
   - Go to your Google Account > Security > 2-Step Verification > App passwords
   - Generate a new app password and use it in the `GMAIL_PASS` variable

4. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📦 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Clerk](https://clerk.com/) for authentication

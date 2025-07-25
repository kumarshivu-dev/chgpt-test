This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, check the prereqs below and install the dependencies.  Next run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

When you see "- ready started server on 0.0.0.0:3000, url: http://localhost:3000",  open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


### Prerequisites

- Node.js (v16.20.0)
- NPM (8.19.4)

### Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies by running the following command:
- npm install (to install all dependencies)
- npm run dev (to start the server)
- npm run build 

## Dependencies

1. mui/icons-material
2. mui/material
3. reduxjs/toolkit
4. axios


## Folder Structure
1. In pages folder the _app.js is entry point of our projects
2. In components folder we have common component like header, footer and other reusable components.
3. In pages folder we can create all pages(next js follow the file based system routing so we should follow this convention like we have to create pages with lowercase like about.js or services.js so the url created http://localhost:3000/about or http://localhost:3000/services)
4. In public folder we can put our assets like images stylesheet.p
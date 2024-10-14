## Getting Started

First, clone the repository:

```bash
git clone https://github.com/zeyneptekiin/user-auth-case.git
```

Navigate into the project directory:

```bash
cd user-auth-case
```

Install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Tests

### Jest Tests

To run the Jest tests:

```bash
npm run test:jest
```

### Cypress Tests

First, ensure the development server is running:

```bash
npm run dev
```

Then, in a new terminal window, run the Cypress tests:

```bash
npx cypress open
```

**Note:** If the server is not running, you may encounter the following error:

```
Cypress could not verify that this server is running:

http://localhost:3000

This server has been configured as your baseUrl, and tests will likely fail if it is not running.
```

## Continuous Integration and Continuous Deployment (CI/CD)

This project uses GitHub Actions for CI/CD. The workflow is configured to automatically run tests and deploy the application upon every push or pull request to the main branch.

### Deployment

The project is deployed on Vercel and can be accessed via the following URL:

[https://user-auth-case.vercel.app/](https://user-auth-case.vercel.app/)

Additionally, the Vercel deployment has been connected to a custom subdomain:

[https://ycc.usrt.xyz/](https://ycc.usrt.xyz/)

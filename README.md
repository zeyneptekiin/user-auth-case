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

## OTP Verification

To perform OTP verification, the system requires **email** and **password** to be sent again during the OTP request. To avoid asking the user to re-enter their email and password, these values are temporarily stored in **Zustand** state and cleared after the OTP request is completed.

### ⚠ Security Note:

Storing sensitive information like **email** and **password** in the frontend state management (such as **Zustand**) can pose a **security risk** because these values are stored in the browser's memory until they are cleared.

### Token Storage

The **auth token** is stored in a **cookie** for the following reasons:

- Cookies provide a secure and convenient way to persist session data across multiple pages or tabs in a browser.
- By setting proper attributes such as `HttpOnly`, `Secure`, and `SameSite`, cookies can offer improved security over alternatives like `localStorage` or `sessionStorage`.

The token stored in a cookie is used to maintain the authenticated state of the user, allowing seamless navigation between pages while keeping the session secure.

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

## Performance Improvements

This project has undergone performance optimizations based on **Google Lighthouse** test results to enhance load times and overall user experience.

### Lighthouse Tests & Optimizations

Several key improvements were implemented after running **Lighthouse** tests, focusing on optimizing the rendering of the page and reducing unnecessary file loads:

- **Enabled Just-In-Time (JIT) Mode**:
  The **JIT mode** for Tailwind CSS was enabled, allowing for faster build times and reducing the size of the generated CSS by only including the classes that are actually used. This led to a significant reduction in CSS file size, improving page load speed.

- **Moved Font Import to Layout**:
  Instead of importing the font in the CSS file, the web font import was moved to the **Next.js Layout component**. This reduces the render-blocking behavior caused by external CSS file loads and improves **First Contentful Paint (FCP)**. The web font is loaded with `font-display: swap`, ensuring text is immediately visible with a fallback font while the custom font loads.

These optimizations contributed to improved loading speeds, quicker interactivity, and better Lighthouse performance scores.

### Lighthouse Test Results

After making these optimizations, Lighthouse tests were run for both **desktop** and **mobile** versions of the application. Below are the results:

#### Desktop Results:
- **Performance**: 100
- **Accessibility**: 94
- **Best Practices**: 100
- **SEO**: 100

#### Mobile Results:
- **Performance**: 87
- **Accessibility**: 94
- **Best Practices**: 100
- **SEO**: 100


/**
 * Built-in demo account — signs in locally without calling the backend, so the
 * portal can be shown anywhere. Any other email goes to /partner_login.
 * This is public by design: never reuse these values for a real account.
 */
export const DEMO_CREDENTIALS = {
    email: "demo@gmail.com",
    password: "123456789",
};

export const DEMO_USER = {
    id: "demo-user",
    name: "Demo User",
    email: DEMO_CREDENTIALS.email,
    role: "Solution Provider",
};

/** Placeholder so the session passes validation — never sent to any API. */
export const DEMO_ACCESS_TOKEN = "demo-access-token";

export const isDemoLogin = ({ email, password }) =>
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;

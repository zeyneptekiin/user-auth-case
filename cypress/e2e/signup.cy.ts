describe('Sign Up Page', () => {
    beforeEach(() => {
        cy.visit('/signup');
    });

    it('displays all input fields and the submit button', () => {
        cy.get('input[name="username"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('input[name="confirmPassword"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible').contains('Sign Up');
    });

    it('shows validation errors if fields are empty on submit', () => {
        cy.get('button[type="submit"]').click();

        cy.wait(5000);

        cy.contains('Username is required!').should('be.visible');
        cy.contains('Email is required!').should('be.visible');
        cy.contains('Password is required!').should('be.visible');
        cy.contains('Confirm Password is required!').should('be.visible');
    });

    it('shows an error if passwords do not match', () => {
        // Fill in the form with mismatched passwords
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="confirmPassword"]').type('password456');

        cy.get('button[type="submit"]').click();

        cy.contains('Passwords do not match!').should('be.visible');
    });

    it('submits the form successfully and shows success message', () => {
        cy.intercept('POST', '/api/users/register', {
            statusCode: 200,
            body: { success: true },
        }).as('registerUser');

        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('Password123');
        cy.get('input[name="confirmPassword"]').type('Password123');

        cy.get('button[type="submit"]').click();

        cy.wait(2000);

        cy.wait('@registerUser');
        cy.contains('You will be redirected to login page in 5 seconds...').should('be.visible');

        cy.url().should('include', '/login');
    });

    it('displays error message on failed registration', () => {
        cy.intercept('POST', '/api/users/register', {
            statusCode: 400,
            body: { success: false, message: 'Registration failed' },
        }).as('registerUserFail');

        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="confirmPassword"]').type('password123');

        cy.get('button[type="submit"]').click();

        cy.wait('@registerUserFail');
        cy.contains('Registration failed').should('be.visible');
    });
});

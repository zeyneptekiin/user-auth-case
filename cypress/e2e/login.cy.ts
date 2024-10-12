describe('Login Page', () => {
    beforeEach(() => {
        cy.intercept('POST', '/api/users/verify', (req) => {
            req.reply({
                success: true,
            });
        }).as('verifyRequest');
    });

    it('submits the form with valid inputs and redirects to the verification page', () => {

        cy.visit('/login');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
        cy.wait('@verifyRequest');

        cy.url().should('include', '/login/verify');
    });

    it('displays error message on failed login', () => {
        cy.intercept('POST', '/api/users/verify', (req) => {
            req.reply({
                success: false,
                message: 'Invalid credentials',
            });
        }).as('verifyRequest');

        cy.visit('/login');

        cy.get('input[name="email"]').type('wrong@example.com');
        cy.get('input[name="password"]').type('wrongpassword');

        cy.get('button[type="submit"]').click();

        cy.wait('@verifyRequest');

        cy.get('.text-red-500').should('contain', 'Invalid credentials');
    });
});

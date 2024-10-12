describe('Home Page Navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should display the correct elements on the home page', () => {

        cy.contains('Welcome!').should('be.visible');

        cy.get('a[href="/signup"]').should('be.visible');
        cy.get('a[href="/login"]').should('be.visible');
    });

    it('should navigate to the Sign Up page when clicking on the Sign Up button', () => {

        cy.get('a[href="/signup"]').first().click();
        cy.url().should('include', '/signup');
        cy.contains('Sign Up').should('be.visible');
    });

    it('should navigate to the Log In page when clicking on the Log In button', () => {
        cy.get('a[href="/login"]').first().click();

        cy.url().should('include', '/login');

        cy.contains('Log In').should('be.visible');
    });
});

describe('OTP Verification Page', () => {
    let dynamicOtp: string = '123456';

    beforeEach(() => {
        cy.intercept('POST', '/api/auth/login', (req) => {
            req.reply((res) => {
                dynamicOtp = res.body.otp || '123456';
                res.send({
                    statusCode: 200,
                    body: { accessToken: 'dummyToken' },
                });
            });
        }).as('loginRequest');

        cy.visit('/login/verify');
    });

    it('displays the OTP input and submit button', () => {
        cy.get('input').should('have.length', 6);
        cy.contains('Submit').should('be.visible');
    });

    it('submits the form with valid OTP and redirects to home page', () => {
        dynamicOtp.split('').forEach((digit, index) => {
            cy.get('input').eq(index).type(digit);
        });

        cy.contains('Submit').click();

        cy.wait('@loginRequest', { timeout: 10000 });

        cy.location('pathname', { timeout: 10000 }).should('eq', '/');

        cy.contains('Welcome').should('be.visible');
    });

    it('displays an error message on invalid OTP', () => {
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 400,
            body: { message: 'Invalid OTP' },
        }).as('loginRequestFail');

        cy.get('input').each(($el, index) => {
            cy.wrap($el).type(`${index + 1}`);
        });

        cy.contains('Submit').click();

        cy.wait('@loginRequestFail', { timeout: 10000 });

        cy.contains('Invalid OTP').should('be.visible');
    });
});

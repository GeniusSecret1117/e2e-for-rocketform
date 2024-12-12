import { URLS, TIMEOUTS, LOG_OUT_TEXT, LOGIN_BUTTON_TEXT, ALERT_MESSAGES } from '../support/constants';

describe('Logout Tests', () => {
  beforeEach(() => {
    cy.visit(URLS.home);
    cy.loadSelector('autoModalLoginBtn').should('be.visible');
    cy.fixture('users.json').then((data) => {
        cy.clogin(data.validUser.email, data.validUser.password, 200);
    });
  });

  // This is when clicking the logout button.
  it('Should log the user out and redirect to the home page', () => {
    cy.fixture('users.json').then((data) => {
        cy.loadSelector('dropdown')
          .contains('div', data.validUser.name, { timeout: TIMEOUTS.elementVisibility })
          .parent()
          .click();
        cy.intercept('POST', `${URLS.api}/auth/logout`).as('logoutRequest');
        cy.contains(LOG_OUT_TEXT, { timeout: TIMEOUTS.elementVisibility }).click();
        cy.wait('@logoutRequest').then((interception) => {
            const { response } = interception;
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.have.property('success', true);
        });
    });
    // cy.wait(TIMEOUTS.urlCheck);
    cy.url({ timeout: TIMEOUTS.urlCheck }).should('eq', Cypress.config('baseUrl'));
    // cy.getCookie('session_id').should('not.exist');
  });
});
describe('User Flow', () => {
  it('logs in and creates a post', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type('test@example.com');
    cy.get('input[name=password]').type('password123');
    cy.get('button[type=submit]').click();

    cy.url().should('include', '/dashboard');

    cy.visit('/create-post');
    cy.get('input[name=title]').type('E2E Test Post');
    cy.get('textarea[name=content]').type('Post from Cypress');
    cy.get('select[name=category]').select(1); // or use categoryId if dynamic
    cy.get('button[type=submit]').click();

    cy.contains('E2E Test Post');
  });
});

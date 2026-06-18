/// <reference types="cypress" />

context('Dev Finances', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/#')
        cy.get('#data-table tbody tr').should('have.length', 0)
    });
    it('Cadastrar entradas', () => {

        cy.get('#transaction .button').click()
        cy.get('#description').type('Freelancer')
        cy.get('[name=amount]').type('500')
        cy.get('[type=date]').type('2024-06-01')
        cy.get('button').contains('Salvar').click()
    
        cy.get('#data-table tbody tr').should('have.length', 1)
    });

    it('Cadastrar saídas', () => {
        
        cy.get('#transaction .button').click()
        cy.get('#description').type('Aluguel')
        cy.get('[name=amount]').type('-800')
        cy.get('[type=date]').type('2024-06-01')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 1)
}); 

    it('Remover entradas e saídas', () => {
        const entries = [
            { description: 'Freelancer', amount: 500, date: '2024-06-01' },
            { description: 'Aluguel', amount: -800, date: '2024-06-01' }
        ];

        cy.get('#transaction .button').click()
        cy.get('#description').type(entries[0].description)
        cy.get('[name=amount]').type(entries[0].amount.toString())
        cy.get('[type=date]').type(entries[0].date)
        cy.get('button').contains('Salvar').click()

        cy.get('#transaction .button').click()
        cy.get('#description').type(entries[1].description)
        cy.get('[name=amount]').type(entries[1].amount.toString())
        cy.get('[type=date]').type(entries[1].date)
        cy.get('button').contains('Salvar').click()

        cy.get('td').contains(entries[0].description).parent().find('img[onclick*=remove]').click()
        cy.get('td').contains(entries[1].description).parent().find('img[onclick*=remove]').click()
        cy.get('#data-table tbody tr').should('have.length', 0)

}); });

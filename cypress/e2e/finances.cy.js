/// <reference types="cypress" />

    import { format, prepareLocalStorage } from '../support/utils'

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

}); 

   it('Validar saldo com diversas transações', () => {
  const entrada = 'Mesada'
    const saida = 'KinderOvo'

    cy.get('#transaction .button').click()
    cy.get('#description').type(entrada)
    cy.get('[name=amount]').type('100')
    cy.get('[type=date]').type('2024-06-01')
    cy.get('button').contains('Salvar').click()

    cy.get('#transaction .button').click()
    cy.get('#description').type(saida)
    cy.get('[name=amount]').type('-35')
    cy.get('[type=date]').type('2024-06-01')
    cy.get('button').contains('Salvar').click()

  let incomes = 0
  let expenses = 0

  cy.get('#data-table tbody tr')
    .each(($el, index, $list) => {
      cy.get($el).find('td.income, td.expense').invoke('text').then((text) => {
          if (text.includes('-')) {
            expenses += format(text)
          } else {
            incomes += format(text)
          }

          cy.log('entradas', incomes)
          cy.log('saidas', expenses)
        })
    })

  cy.get('#totalDisplay').invoke('text').then((text) => {
      const formattedTotalDisplay = format(text)
      const expectedTotal = incomes + expenses

      expect(formattedTotalDisplay).to.eq(expectedTotal)
    })
}); });

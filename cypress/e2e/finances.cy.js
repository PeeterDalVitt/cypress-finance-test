/// <reference types="cypress" />

    import { format, prepareLocalStorage } from '../support/utils'

context('Dev Finances', () => {

    beforeEach(() => {
        cy.visit('https://devfinance.netlify.app/', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }

        })
        
    });
    it('Cadastrar entradas', () => {

        cy.contains('#transaction .button', 'Nova Transação').click()
        cy.get('#description').type('Freelancer')
        cy.get('[name=amount]').type('500')
        cy.get('[type=date]').type('2024-06-01')
        cy.get('button').contains('Salvar').click()
    
        cy.get('#data-table tbody tr').should('have.length', 3)
    });

    it('Cadastrar saídas', () => {
        
        cy.contains('#transaction .button', 'Nova Transação').click()
        cy.get('#description').type('Aluguel')
        cy.get('[name=amount]').type('-800')
        cy.get('[type=date]').type('2024-06-01')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 3)
}); 

    it('Remover entradas e saídas', () => {
        

        cy.get('td.description').contains("Mesada").parent().find('img[onclick*=remove]').click()
        cy.get('td.description').contains('Suco Kapo').parent().find('img[onclick*=remove]').click()
        cy.get('#data-table tbody tr').should('have.length', 0)

}); 

   it('Validar saldo com diversas transações', () => {
 

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

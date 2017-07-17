const chai = require('chai')
const expect = chai.expect

const { resetDatabase } = require('./helpers.js')
const { allContacts } = require('../database/queries.js')

describe('Database queries', () => {
  beforeEach(resetDatabase)

  context('allContacts()', () => {
    it('returns all records in the contacts table', () => {
      return allContacts().then((records) => {
        expect(records.length).to.equal(20)
      })
    })

    it('includes id, name, email, phone, birthday, and company', () => {
      return allContacts().then((records) => {
        expect(records[0])
          .to.have.all.keys('id', 'name', 'email', 'phone', 'birthday', 'company')
      })
    })
  })
})

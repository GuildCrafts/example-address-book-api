const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect

const { api } = require('../api.js')
const { resetDatabase } = require('./helpers.js')

chai.use(chaiHTTP)

describe('Address book API', () => {
  beforeEach(resetDatabase)

  context('GET /contacts', () => {
    it('responds with a JSON array of all contact data', () => {
      return chai.request(api)
        .get('/contacts')
        .then((res) => {
          expect(res.body).to.be.a('array')
          expect(res.body.length).to.equal(20)
        })
        .catch(err => { throw err })
    })

    it('includes contact id, name, email, phone, birthday, company, and groups', () => {
      return chai.request(api)
        .get('/contacts')
        .then((res) => {
          const sampleContact = res.body[0]
          const props = ['id', 'name', 'email', 'phone', 'birthday', 'company', 'groups']

          expect(sampleContact).to.have.all.keys(props)
          expect(sampleContact.groups).to.be.a('array')
        })
        .catch(err => { throw err })
    })
  })
})

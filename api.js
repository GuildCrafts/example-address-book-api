const express = require('express')
const bodyParser = require('body-parser')

const actions = require('./actions')

const api = express()

api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())


api.get('/contacts', (req, res) => {
  actions.getAllContactsAndTheirGroups()
    .then((contacts) => {
      res.json(contacts)
    })
    .catch(res.json)
})

api.get('/contacts/:id', (req, res) => {
  const contactID = req.params.id

  actions.getContactAndTheirGroups(contactID)
    .then((contact) => {
      res.json(contact)
    })
    .catch(res.json)
})

api.post('/contacts', (req, res) => {
  const { contact, groups } = req.body

  actions.createContactWithGroups(contact, groups)
    .then((contactID) => {
      res.status(201)
      res.json({ id: contactID, message: 'Contact created' })
    })
    .catch(res.json)
})

api.delete('/contacts/:id', (req, res) => {
  const contactID = req.params.id

  actions.deleteContactAndTheirMemberships(contactID)
    .then((contact) => {
      res.json({ id: contact.id, message: 'Contact deleted' })
    })
    .catch(res.json)
})

api.delete('/groups/:id', (req, res) => {
  const groupID = req.params.id

  actions.deleteGroupAndTheirMemberships(groupID)
    .then((group) => {
      res.json({ id: group.id, message: 'Group deleted' })
    })
    .catch(res.json)
})



if (!module.parent) {
  const port = process.env.PORT || 3000

  api.listen(port, function () {
    console.log(`Address book API listening on port ${port}!`)
  })
}

module.exports = { api }

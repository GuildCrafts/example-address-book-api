const sql = require('../database/queries.js')
const contactsFixtures = require('./fixtures/contacts.json')
const groupsFixtures = require('./fixtures/groups.json')

function clearDatabase() {
  return sql.deleteAllMemberships()
    .then(() => sql.deleteAllContacts())
    .then(() => sql.deleteAllGroups())
    .catch(console.error)
}

function resetSequences() {
  // sets all id series back to 1 so that we can deterministically work with ids
  return sql.db.any('ALTER SEQUENCE "contacts_id_seq" RESTART WITH 1;')
    .then(() => sql.db.any('ALTER SEQUENCE "groups_id_seq" RESTART WITH 1;'))
    .then(() => sql.db.any('ALTER SEQUENCE "group_members_id_seq" RESTART WITH 1;'))
}

function insertContactsFixtures() {
  return Promise.all(
    contactsFixtures.map((contact) => sql.createContact(contact))
  )
}

function insertGroupsFixtures() {
  return Promise.all(
    groupsFixtures.map((groupName) => sql.createGroup({name: groupName}))
  )
}

function resetDatabase() {
  return clearDatabase()
    .then(resetSequences)
    .then(insertContactsFixtures)
    .then(insertGroupsFixtures)
    .catch(console.error)
}

module.exports = {
  clearDatabase,
  insertContactsFixtures,
  insertGroupsFixtures,
  resetDatabase,
}

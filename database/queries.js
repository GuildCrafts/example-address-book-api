const pgp = require('pg-promise')()

const databaseName = process.env.NODE_ENV === 'test'
                       ? 'address_book_test'
                       : 'address_book'

const db = pgp({
  host: 'localhost',
  port: 5432,
  database: databaseName,
})

function allContacts() {
  return db.any("SELECT * FROM contacts;")
}

function createContact({name, email, phone, birthday, company}) {
  return db.one(`
    INSERT INTO contacts (name, email, phone, birthday, company)
    VALUES ($(name), $(email), $(phone), $(birthday), $(company))
    RETURNING contacts.id;
  `, {name, email, phone, birthday, company})
}

function getContactByID(id) {
  return db.oneOrNone(`
    SELECT * FROM contacts
    WHERE id = $1;
  `, id)
}

function contactsWithName(name) {
  return db.any(`
    SELECT * FROM contacts
    WHERE name = $1;
  `, name)
}

function deleteContact(id) {
  return db.oneOrNone(`
    DELETE FROM contacts
    WHERE id = $1
    RETURNING id;
  `, id)
}

function deleteAllContacts() {
  return db.oneOrNone("DELETE FROM contacts;")
}

function allGroups() {
  return db.any("SELECT * FROM groups;")
}

function createGroup({name}) {
  return db.one(`
    INSERT INTO groups (name)
    VALUES ($1)
    RETURNING groups.id, groups.name;
  `, name)
}

function groupWithName(name) {
  return db.oneOrNone(`
    SELECT * FROM groups
    WHERE name = $1;
  `, name)
}

function findOrCreateGroupByName(name) {
  return db.one(`
    SELECT * FROM groups
    WHERE name = $1;
  `, name).then((records) => {
    if (records.length === 0) {
      return createGroup({name: name})
    }
    return records
  })
}

function deleteGroup(id) {
  return db.oneOrNone(`
    DELETE FROM groups
    WHERE id = $1
    RETURNING id;
  `, id)
}

function deleteAllGroups() {
  return db.oneOrNone("DELETE FROM groups;")
}

function groupsForContact(contactID) {
  return db.any(`
    SELECT groups.* FROM groups
    INNER JOIN group_members
    ON groups.id = group_members.group_id
    INNER JOIN contacts
    ON group_members.contact_id = contacts.id
    WHERE contacts.id = $1;
  `, contactID)
}

function membersOfGroup(groupName) {
  return db.any(`
    SELECT contacts.* FROM contacts
    INNER JOIN group_members
    ON contacts.id = group_members.contact_id
    INNER JOIN groups
    ON group_members.group_id = groups.id
    WHERE groups.name = $1;
  `, groupName)
}

function allGroupsWithMembers() {
  return db.any(`
    SELECT groups.name AS group,
           contacts.id AS contact_id,
           contacts.name AS name
    FROM contacts
    INNER JOIN group_members
    ON contacts.id = group_members.contact_id
    INNER JOIN groups
    ON group_members.group_id = groups.id
    ORDER BY groups.name;
  `)
}

function addContactToGroup({contactID, groupID}) {
  return db.one(`
    INSERT INTO group_members (contact_id, group_id)
    VALUES ($1, $2)
    RETURNING group_members.id;
  `, [contactID, groupID])
}

function removeContactFromGroup({contactID, groupID}) {
  return db.oneOrNone(`
    DELETE FROM group_members
    WHERE contact_id = $1
    AND group_id = $2;
  `, [contactID, groupID])
}

function deleteMembershipsForGroup(groupID) {
  return db.oneOrNone(`
    DELETE FROM group_members
    WHERE group_id = $1;
  `, groupID)
}

function deleteMembershipsForContact(contactID) {
  return db.oneOrNone(`
    DELETE FROM group_members
    WHERE contact_id = $1;
  `, contactID)
}

function deleteAllMemberships() {
  return db.oneOrNone("DELETE FROM group_members;")
}

module.exports = {
  db,
  allContacts,
  createContact,
  getContactByID,
  contactsWithName,
  deleteContact,
  deleteAllContacts,
  allGroups,
  createGroup,
  groupWithName,
  findOrCreateGroupByName,
  deleteGroup,
  deleteAllGroups,
  groupsForContact,
  membersOfGroup,
  allGroupsWithMembers,
  addContactToGroup,
  removeContactFromGroup,
  deleteMembershipsForGroup,
  deleteMembershipsForContact,
  deleteAllMemberships,
}

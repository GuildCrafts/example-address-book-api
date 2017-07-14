const queries = require('./queries.js')

// seed data

const contacts = [
  ['Dinnie Feore', 'dfeore0@de.vu', '86-(483)661-7589', '4/12/1963', 'Pouros and Sons'],
  ['Kare Edmonson', 'kedmonson1@squarespace.com', '63-(247)322-6923', '11/16/1962', 'Leffler Group'],
  ['Clive Vlasyuk', 'cvlasyuk2@shutterfly.com', '30-(471)163-9446', '6/11/2004', 'McGlynn, Simonis and Ryan'],
  ['Jerad Teodorski', 'jteodorski3@networksolutions.com', '63-(315)148-4220', '11/11/1977', 'O\'Hara Inc'],
  ['Reina Akerman', 'rakerman4@plala.or.jp', '62-(878)605-5106', '3/5/1929', 'Altenwerth-Williamson'],
  ['Ervin Ferroni', 'eferroni5@typepad.com', '46-(360)718-2547', '9/15/1972', 'Flatley-Stroman'],
  ['Cedric Dagon', 'cdagon6@discovery.com', '47-(578)500-8599', '9/24/1990', 'Krajcik, Waelchi and Wilderman'],
  ['Godiva Peggs', 'gpeggs7@deliciousdays.com', '7-(873)790-2589', '9/10/1982', 'Fay-Johnson'],
  ['Dacie Henden', 'dhenden8@yolasite.com', '86-(271)941-6981', '4/1/2006', 'Lueilwitz-Zieme'],
  ['Belvia Greenall', 'bgreenall9@sphinn.com', '62-(755)792-9691', '6/16/1917', 'Murray LLC'],
  ['Micky Charnock', 'mcharnocka@simplemachines.org', '81-(366)761-6997', '8/9/1963', 'Bradtke and Sons'],
  ['Ninnetta Elbourne', 'nelbourneb@unblog.fr', '504-(417)542-0791', '12/19/1948', 'Predovic-Feil'],
  ['Ashley Haquard', 'ahaquardc@flickr.com', '7-(457)152-3330', '10/26/1987', 'Ullrich, Wunsch and Cormier'],
  ['Nico Tipton', 'ntiptond@marriott.com', '256-(548)887-3738', '8/29/1959', 'Anderson Group'],
  ['Cherise Dawtrey', 'cdawtreye@shop-pro.jp', '221-(287)886-6585', '10/27/1980', 'Lowe Group'],
  ['Binnie Graves', 'bgravesf@wikipedia.org', '56-(651)166-6577', '2/27/2013', 'Bernhard Inc'],
  ['Delmor McKelloch', 'dmckellochg@istockphoto.com', '46-(845)139-2340', '2/25/1978', 'Boyer LLC'],
  ['Chadd Burgoyne', 'cburgoyneh@jigsy.com', '86-(388)384-3744', '9/22/1983', 'Stanton Inc'],
  ['Coop Screen', 'cscreeni@examiner.com', '380-(645)527-8560', '12/26/1971', 'Towne-Barrows'],
  ['Wendel Shevlan', 'wshevlanj@amazon.com', '62-(894)592-1440', '6/9/1990', 'Mertz-Lueilwitz'],
]

const groups = [
  'Friends',
  'Colleagues',
  'Family',
  'Soccer Team',
  'Trivia Group',
  'Book Club',
]

// utility functions

function getRandomElem(array) {
  const randIndex = Math.floor(Math.random() * array.length)
  return array[randIndex]
}

function makeRandomMemberships(contactIDs, groupIDs) {
  const memberships = []

  for (var i = 0; i < 40; i++) {
    const randomContactID = getRandomElem(contactIDs).id
    const randomGroupID = getRandomElem(groupIDs).id

    memberships.push({ contactID: randomContactID, groupID: randomGroupID })
  }

  return memberships
}

// main function

function seedAllData() {
  return Promise.all(
    contacts.map((contact) => {
      const [name, email, phone, birthday, company] = contact
      return queries.createContact({name, email, phone, birthday, company})
    })
  ).then((contactIDs) => {
    console.log('Created contacts with ids:', contactIDs.map(c => c.id), '')

    return Promise.all(
      groups.map((groupName) => queries.createGroup({name: groupName}))
    ).then((groupIDs) => {
      console.log('Created groups with ids:', groupIDs.map(g => g.id), '')

      return Promise.all(
        makeRandomMemberships(contactIDs, groupIDs).map((membershipIDs) => {
          return queries.addContactToGroup(membershipIDs)
        })
      ).then((membershipIDs) => {
        console.log('Created group memberships with ids:', membershipIDs.map(m => m.id), '')
      }).catch(console.error)
    }).catch(console.error)
  }).catch(console.error)
}

if (!module.parent) {
  seedAllData().then((results) => {
    console.log("Seed completed")
    queries.pgp.end()
  })
}

module.exports = { seedAllData }

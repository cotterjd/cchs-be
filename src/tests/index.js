#!/bin/node

const fetch = require(`isomorphic-fetch`)
const R = require(`ramda`)
const assert = require(`assert`)
const printRed = str => console.log(`\x1b[31m %s \x1b[37m`, str)
const printGreen = str => console.log(`\x1b[32m %s \x1b[37m`, str)
const fail = errorStr => Promise.reject(errorStr)
const testServer = () => {
  return new Promise((resolve, reject) => {
     console.log(`Testing Server...`)
     fetch(`http://localhost:4000/graphql`, {
       method: `POST`,
       headers: {
         'Content-Type': `application/json`,
       },
       body: JSON.stringify({ query: `query { __typename }` }),
     }).then(r => r.json()).then(resolve).catch(reject) 
  })
}
const newUnitCode = {
   unit: `E123`,
   user: `John`,
   property: `Eagle Hieghts`,
   codes: `Completed. No Issues`,
}
const updatedUnitCode = {
  ...newUnitCode,
  codes: `Missing Damper`,
}
const testCreateUnitCode = (unit) => {
  console.log(`Testing POST /`)
  return new Promise((resolve, reject) => {
     fetch(`http://localhost:4000/unitcode`, {
       method: `POST`,
       headers: {
         'Content-Type': `application/json`,
       },
       body: JSON.stringify(unit),
     }).then(r => r.json()).then(resolve).catch(reject) 
  })
}
const testListUnitCodes = () => {
  console.log(`Testing GET /unitcodes`)
  return new Promise((resolve, reject) => {
     fetch(`http://localhost:4000/unitcodes`, {
       method: `GET`,
       headers: {
         'Content-Type': `application/json`,
       },
     }).then(r => r.json()).then(resolve).catch(reject) 
  })
}
const testListProperties = () => {
  console.log(`Testing GET /properties`)
  return new Promise((resolve, reject) => {
     fetch(`http://localhost:4000/properties`, {
       method: `GET`,
       headers: {
         'Content-Type': `application/json`,
       },
     }).then(r => r.json()).then(resolve).catch(reject) 
  })
}
const testListUnitCodesByProperty = () => {
  console.log(`Testing GET /unitcodes?job=`)
  return new Promise((resolve, reject) => {
     fetch(`http://localhost:4000/unitcodes?job=${newUnitCode.property}`, {
       method: `GET`,
       headers: {
         'Content-Type': `application/json`,
       },
     }).then(r => r.json()).then(resolve).catch(reject) 
  })
}
const testGetUnitCode = () => {
  console.log(`Testing GET /unitcode`)
  return new Promise((resolve, reject) => {
     fetch(`http://localhost:4000/unitcode?unit=${newUnitCode.unit}&job=${newUnitCode.property}`, {
       method: `GET`,
       headers: {
         'Content-Type': `application/json`,
       },
     }).then(r => r.json()).then(resolve).catch(reject) 
  })
}
const testPut = (id) => {
  return new Promise((resolve, reject) => {
     fetch(`http://localhost:4000/unitcode/${id}`, {
       method: `PUT`,
       headers: {
         'Content-Type': `application/json`,
       },
       body: JSON.stringify(updatedUnitCode),
     }).then(r => r.json()).then(resolve).catch(reject) 
  })
}
const testDeleteUnitCode = (id) => {
  console.log(`Testing DELETE /`)
  return new Promise((resolve, reject) => {
     fetch(`http://localhost:4000/unitcode/${id}`, {
       method: `DELETE`,
     }).then(r => r.json()).then(resolve).catch(reject) 
  })
}
const testBadPut = (id) => {
  console.log(`Testing PUT /`)
  return testPut(`foo`) 
}
const testPutUnitCode = (id) => {
  console.log(`Testing PUT /`)
  return testPut(id) 
}


const otherProperty = { ...newUnitCode, property: `Other property` }
let unitCodeId = 13 
function runTests () {
  testServer()
    .then(res => {
        assert.ok(res)
        assert.ok(res.data)
        assert.equal(res.data.__typename, `Query`, `data should have typename of 'Query', but got ${res.data.__typename}`)
        printGreen(`passed`)
     })
     .then(() => testCreateUnitCode(otherProperty))
     .then(() => testCreateUnitCode(newUnitCode))
     .then(unitCode => {
         // console.log(unitCode)
         unitCodeId = unitCode.id
         assert.ok(unitCode)
         assert.ok(unitCode.id)
         assert.ok(unitCode.unit)
         assert.ok(unitCode.property)
         assert.ok(unitCode.user)
         assert.ok(unitCode.codes)

         assert.equal(unitCode.unit, newUnitCode.unit)
         assert.equal(unitCode.property, newUnitCode.property)
         assert.equal(unitCode.user, newUnitCode.user)
         assert.equal(unitCode.codes, newUnitCode.codes)
         printGreen(`passed`)
     })
     .then(testListUnitCodes)
     .then(unitCodes => {
         // console.log(unitCodes)
         assert.ok(unitCodes)
         assert.ok(unitCodes.length)
         assert.ok(unitCodes.find(x => x.unit === `E123`))
         printGreen(`passed`)
     })
     .then(testListUnitCodesByProperty)
     .then(unitCodes => {
         // console.log(unitCodes)
         assert.ok(unitCodes)
         assert.ok(unitCodes.length)
         assert.ok(unitCodes.find(x => x.property === newUnitCode.property))
         assert.ok(!unitCodes.find(x => x.property === otherProperty.property), `should not have other properties`)
         printGreen(`passed`)
     })
     .then(testListProperties)
     .then(properties => {
        console.log(properties)
        assert.ok(properties)
        assert.ok(properties.length)
        const uniq = R.uniq(properties)
        assert.equal(properties.length, uniq.length)
        printGreen(`passed`)
     })
     .then(testGetUnitCode)
     .then(unitCode => {
        assert.ok(unitCode)
        printGreen(`passed`)
     })
     .then(_ => testBadPut(unitCodeId))
     .then(res => {
       // console.log(res)
       assert.ok(!res.id)
       assert.ok(res.error)
       printGreen(`passed`)
     })
     .then(_ => testPutUnitCode(unitCodeId))
     .then(updateUnitCode => {
       // console.log(updateUnitCode)
       assert.ok(updateUnitCode.id)
       assert.equal(updateUnitCode.codes, updatedUnitCode.codes)
       printGreen(`passed`)
     })
     .then(_ => testDeleteUnitCode(unitCodeId))
     .then(res => {
         assert.ok(res)
         assert.ok(res.id)
         printGreen(`passed`)
     })
     .catch(printRed)
     .finally(_ => {
       console.log(`Tear down`)
       testDeleteUnitCode(unitCodeId)
     })
}

runTests()

import { gql } from 'apollo-server-express'

export default gql`

  scalar DateTime

  type Query {
    thing: String
  }
  type Mutation {
    createThing: String 
  }
`

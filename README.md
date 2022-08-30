# kahoa_resources_api

# Getting Started
`$ git clone git@github.com:cotterjd/kahoa_resources_api.git`<br>
`$ cd kahoa_resources_api`<br>
Add .env file with DATABASE_URL value<br>
`$ npm install && npm run dev`<br>

# Running Tests
`$ npm test`<br>
or <br>
`$ npm run test:watch`<br>

## Troubleshooting

If you have your env file and the server crashes because it can't read your DATABASE_URL value then try one of the following
<ol>
  <li>Make sure `?ssl=true` is at the end of your connection string</li>
  <li>Delete `node_modules` and reinstall. You have have accidently used `yarn` istead of `npm` or another install issue may be causing the error</li>
</ol>

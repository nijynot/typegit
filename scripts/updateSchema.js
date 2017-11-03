const fs = require('fs');
const path = require('path');
const { printSchema } = require('graphql');
const schema = require('../schema-es5/schema.js');

const schemaPath = path.resolve(__dirname, '../graph/schema.graphql');

fs.writeFileSync(schemaPath, printSchema(schema));

console.log(`Wrote: ${schemaPath}`);

const fs = require('fs-extra');
const path = require('path');
const { printSchema } = require('graphql');
const schema = require('../schema-es5/schema.js');

const schemaPath = path.resolve(__dirname, '../graph/schema.graphql');

fs.ensureFileSync(schemaPath);
fs.writeFileSync(schemaPath, printSchema(schema));

console.log(`Wrote: ${schemaPath}`);

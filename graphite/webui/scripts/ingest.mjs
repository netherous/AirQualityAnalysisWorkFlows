#!/usr/bin/env zx

/**
 * CSV ingestion script. Requires Node.js >= 14.13.1,
 * zx, and csv-parse installed to run.
 * 
 * Provide a CSV filename to the --csv argument. Make sure
 * Graphite dataport is serving on port 2003 before running.
 * 
 * This script will parse the CSV file and put read data under
 * `data.*`.
 */

const { parse } = require('csv-parse');

$.verbose = false;

// Check if CSV filename given as arg
if (!argv.csv) {
  console.log(`Usage: zx ${__filename} --csv [CSV_FILENAME]`);
  process.exit(0);
}

// Check if the container is running
try {
  await $`ping -c1 graphite:2003`;
} catch (p) {
  console.error("Graphite container port 2003 not responding");
  process.exit(p.exitCode);
}

// Read the CSV file
const parser = parse({
  columns: true,
  from: 1
});
const readStream = fs.createReadStream(argv.csv);
readStream.pipe(parser);
parser.on('readable', async () => {
  let record;
  while (record = parser.read()) {
    for (let [field, value] of Object.entries(record)) {
      if (['dateTime', 'id'].includes(field)) continue; // skip dateTime and id fields
      await nothrow($`echo "data.${field} ${value} ${Math.floor(new Date(record.dateTime).getTime() / 1000)}" | nc -w0 graphite 2003`);
    }
  }
});
parser.on('error', async (err) => {
  console.err(err);
});
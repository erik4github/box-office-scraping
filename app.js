const json = require('./movies.json');

const values = Object.values(json)
const shortest = values.reduce(function (p, c) { return p.length > c.length ? c : p; }, { length: 1000 });

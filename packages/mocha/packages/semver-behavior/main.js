// https://github.com/mochajs/mocha/issues/5763
import { gt } from "semver";
const vNew = "12.0.0-beta-10.1";
const vCurrent = "12.0.0-beta-10";
console.log(`${vNew} > ${vCurrent}`, gt(vNew, vCurrent));

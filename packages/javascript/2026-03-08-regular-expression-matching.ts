// https://leetcode.com/problems/regular-expression-matching/

// milestone 1: handle basic matching
// - lol this is just `pattern === input`
// milestone 2: handle `.`
// - done!
// milestone 2.5: handle `*` as `+` and without preceding `.`
// - `+` matches one or more, easier to start with
// - done
// - at this point, I'm considering TONS of test cases
// - I'm new to leetcode, but it'll be good to learn this tool
//   and show my dedication to scenario coverage
// - How do I organize test cases?
// - From simplest to most complex
// - How do I ensure scenario coverage?
// - Will never be perfect with this limited tool, but worth writing on paper as well
// - Ah, interviewers may suspect cheating, and won't have best visibility
// - Keep paper minimum and use block comments as much as possible
// milestone 3: handle `*` as `*` without preceding `.`
// - `*` matches zero or more, so we need to lookahead while matching
// - done, check out all my tests :)
// milestone 4: handle `*` with preceding `.`
// let's revisit the draft algo and make sure it's correct
// ew, draft algo is too minimal, I'm going to try folding code and reviewing implementation

/*
* Dot-star algo
need to introduce concept of "giving back"
we are greedy until it fails
once we fail, we give back until we find the first match
(this is why greedy matching is slow and can be vulnerable to DOS)

int fullyMatchedIndex // cannot give back beyond this point
bool isGivingBack
if at end of string and not end of pattern and not special case
- set isGivingBack to true
- bump iP by 2 to get to non-special char
- try to decrement iS
- if iS becomes <= fullyMatchedIndex, return false
- else go to next iteration
(got bored, started folding code and writing again)
*/

/*
Test cases (first draft, has errors, can you find them?)
* basic
"a", "a", true
"aa", "a", false, doesn't match entire string
* star (without dot): ending? zero? one? more?
* - ends with star
"aa", "a*", true
"aab", "a*", false, doesn't match entire string
"b", "a*", false, doesn't entire string
* - star in middle
"aab", "a*b", true
"ab", "a*b", true
"b", "a*b", true, zero `a` instances is fine
* dot (without star): position
"abc", "a.c", true
"abc", ".bc", true
"aabc", ".bc", false, just make sure dot isn't weird
"abc", "ab.", true
"abcc", "ab.", false, just make sure dot isn't weird
* dot with star: ending? zero? one? more?
* - ends with dot-star
"abc", ".*", true
"abc", "b.*", false, beginning doesn't match
* - star in middle
"aabcb", "a.*b", true
"b", ".*b", true, zero instances is fine
*/

/** Runs all test cases to bypass LeetCode weirdness */
function tests() {
  const cases: [str: string, pattern: string, expected: boolean][] = [
    // full basic
    ["a", "a", true],
    ["aa", "a", false],
    // star basic at end
    ["aa", "a*", true],
    ["aab", "a*", false],
    ["b", "a*", false], // needs to match full string
    ["b", "a*b", true],
    // star basic in middle
    ["aab", "a*b", true],
    ["ab", "a*b", true],
    ["b", "a*b", true],
    ["abc", "a*b", false],
    // star multiple
    ["aaabc", "a*d*bcd*", true],
    // dot basic
    ["abc", ".bc", true],
    ["abc", "a.c", true],
    ["abc", "ab.", true],
    ["aabc", ".bc", false],
    ["abbc", "a.c", false],
    ["abcc", "ab.", false],
    // dot-star at end
    ["abc", ".*", true],
    ["abc", "b.*", false],
    // dot-star in middle
    ["abc", "a.*c", true],
    ["abc", "a.*b", false],
    ["abc", "a.*bc", true],
    // multiple dot-stars
    ["abc", "a.*b.*c", true],
    ["abc", ".*.*", true],
    // more "multiple" cases?
    // the code **should** just work :/
    // when in doubt, ask interviewer
    // if interviewer gives unclear answer, err on side of more tests :)
    // star-dot?
    // greedy?
    ["aba", ".*a", true], // match greedy by default, non-greedy would be advanced regex
    // more more more cases
    // we've added `isGivingBack` and though we needed `fullyMatchedIndex` (fmi)
    // but tests are all passing without fmi!
    // can we think of a case that might fail without fmi?
    ["aba", ".*b", false],
    ["abcd", "a.*b", false],
    // nothing comes to mind, esp knowing the implementation
    // we are always setting `isGivingBack` to `false` before incrementing `iS`
    // (manually verified, in a non-toy I'd refactor to enforce)
    // we are always decrementing on non-matches when giving back
    // (manually verified, my console logs really helped here)
    // (again non-toy would refactor)
    // so this feels pretty solid, going to submit!
    // ...
    // this case failed, should be an easy fix
    ["ab", ".*c", false],
  ];
  let anyFailed = false;
  for (let myCase of cases) {
    console.log("case:", myCase);
    const matchFound = isMatch(myCase[0], myCase[1]);
    console.log("isMatch?", matchFound);
    const expected = myCase[2];
    console.log("expected", expected);
    const caseResult = matchFound === expected;
    if (!caseResult) {
      anyFailed = true;
      console.log("FAIL: case", myCase);
    }
  }
  if (anyFailed) {
    console.log("tests failed!!");
  }
  console.log("tests pass");
  console.log("---");
}

/*
Running test cases
Max 8 in LeetCode Free, not sure if premium gives more... yikes!
Probably just write quick test harness ;)
Ask interviewer if you can paste it in before doing so
If no, then choose your favorite 8 cases OR
- consider writing a very minimal printer
If yes, paste it in, stick to one LeetCode test case, then inspect the results to confirm
*/
tests();

/**
 * str: lowercase English letters (a-z). Not empty.
 * pattern: lowercase English letters or `.` or `*`. Not empty.
 * - `.`: match any single character
 * - `*`: match zero or more of preceding char (`*` is never first entry)
 * returns whether `pattern` covers **all** of `input`
 */
function isMatch(str: string, pattern: string): boolean {
  console.log(`isMatch(${str}, ${pattern})`);
  /** index of string */
  let iS = 0;
  /** index of pattern */
  let iP = 0;
  let isGivingBack = false;
  console.log(`iS\tcS\tiP\tcP\tigb\tfmi`);
  while (iS >= 0 && (iS < str.length || iP < pattern.length)) {
    // index access works anywhere in JS/TS
    // worst case, these vals are undefined
    const charStr = str[iS];
    const charP = pattern[iP];
    const nextCharP = pattern[iP + 1];
    console.log(`${iS}\t${charStr}\t${iP}\t${charP}\t${isGivingBack}`);
    if (iS >= str.length) {
      // we've matched the whole string
      // but not the whole pattern
      console.log("matched entire string, but not pattern");
      if (nextCharP === "*" && iP >= pattern.length - 2) {
        console.log("we're at end of pattern");
        console.log("pattern ends with `*`");

        console.log("returning true");
        return true;
      }
      console.log("not a special case");
      console.log("going to try giving back");
      isGivingBack = true;
      iS--;
      iP += 2; // move past the star, try matching the next char
      continue;
    }
    if (iP >= pattern.length) {
      // we're at the end of the pattern
      // but not the end of the string
      // we haven't matched the whole string
      // so return false
      console.log("matched entire pattern, but not string");
      console.log("returning false");
      return false;
    }

    if (nextCharP === "*") {
      console.log("nextCharP is `*`");
      if (charP === ".") {
        console.log("charP is `.`");
        console.log("Handling dot-star branch");
        console.log("Incrementing iS, keeping iP the same");
        isGivingBack = false;
        iS++;
        continue;
      }

      console.log("charP is not `.`");
      console.log("Handling `basic star` branch");
      if (charStr !== charP) {
        console.log("charS does not match charP");
        if (isGivingBack) {
          console.log("we're giving back");
          console.log("we're going to move back further");
          iS--;
          continue;
        }
        console.log("we're not giving back");
        console.log("bumping iP twice since `*` is fully matched");
        iP += 2;
        console.log("keeping iS here to make sure it matches next pattern char");
        console.log("going to next iteration");
        continue;
      }
      console.log("charS matches charP");
      console.log("going to next char in str");
      isGivingBack = false;
      iS++;
      console.log("staying on this char in pattern");
      continue;
    }

    if (charP === ".") {
      // match anything!
      console.log("charP is `.`");
      iP++;
      isGivingBack = false;
      iS++;
      console.log("moving to next char in both strings");
      continue;
    }

    // charP is not `.` or `*`
    console.log("charP is not `.` or `*`");
    console.log("nextCharP is not `*`");

    console.log("handling basic path, looking for exact match");
    if (charStr !== charP) {
      console.log("charS does not match charP");
      if (isGivingBack) {
        console.log("giving back");
        iS--;
        continue;
      }
      console.log("not giving back");
      console.log("returning false");
      return false;
    }

    console.log("charS matches charP");
    iP++;
    isGivingBack = false;
    iS++;
    console.log("moving to next char in both strings");
  }
  if (iS < str.length) {
    console.log("didn't get to end of string");
    console.log("returning false");
    return false;
  }
  console.log("returning true");
  return true;
}

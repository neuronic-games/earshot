
/*
const _NOUN_ = [
];
*/

/**
 * The list of plural nouns.
 * @const
 */
const _PLURALNOUN_ = [
    'Averages', 'Awards', 'Awarenesses', 'Babies', 'Backdrops'
];

/*
const _PLACE_ = [
    'Pub', 'University', 'Airport', 'Library', 'Mall', 'Theater', 'Stadium',
    'Office', 'Show', 'Gallows', 'Beach', 'Cemetery', 'Hospital', 'Reception',
    'Restaurant', 'Bar', 'Church', 'House', 'School', 'Square', 'Village',
    'Cinema', 'Movies', 'Party', 'Restroom', 'End', 'Jail', 'PostOffice',
    'Station', 'Circus', 'Gates', 'Entrance', 'Bridge'
];
*/

/**
 * The list of verbs.
 * @const
 */
/* const _VERB_ = [
    'Reserve', 'Reside', 'Resign', 'Resist', 'Resolve'
]; */

/**
 * The list of adverbs.
 * @const
 */
const _ADVERB_ = [
    'Way', 'Weakly', 'Wearily', 'Weekly', 'Weirdly'
];

/**
 * The list of adjectives.
 * @const
 */
const _ADJECTIVE_ = [
    'Able', 'Absent', 'Absolute', 'Abstract', 'Absurd'
];

/*
const _PRONOUN_ = [
];
*/

/*
const _CONJUNCTION_ = [
    'And', 'Or', 'For', 'Above', 'Before', 'Against', 'Between'
];
*/

/**
 * Maps a string (category name) to the array of words from that category.
 * @const
 */
const CATEGORIES = [
    _ADJECTIVE_,
    _ADVERB_,
    _PLURALNOUN_
   // _VERB_

//    _CONJUNCTION_,
//    _NOUN_,
//    _PLACE_,
//    _PRONOUN_,
];

/**
 * The list of room name patterns.
 * @const
 */
/* const PATTERNS = [
    //'_ADJECTIVE__PLURALNOUN__VERB__ADVERB_'
    '_ADJECTIVE__PLURALNOUN__ADVERB_'
]; */

/**
 * Generates a new room name.
 *
 * @returns {string} A newly-generated room name.
 */

export function generateRoomWithoutSeparator() {
    // XXX Note that if more than one pattern is available, the choice of 'name'
    // won't have a uniform distribution amongst all patterns (names from
    // patterns with fewer options will have higher probability of being chosen
    // that names from patterns with more options).

    //let name = randomElement(PATTERNS);
    //console.log(name, " name")

    let roomName = '';

    /* console.log(_hasTemplate(name))
    for (const template in CATEGORIES) {
        console.log(CATEGORIES[template], " temp")
    } */

    //while (_hasTemplate(name)) {
        for (const template in CATEGORIES) { // eslint-disable-line guard-for-in
            const word = randomElement(CATEGORIES[template]);

            //console.log(template, " temp")

            //name = name.replace(template, word);

            //console.log(name, " aName")
            roomName += word
        }
    //}
    return roomName;
}

//generateRoomWithoutSeparator()

/**
 * Generates random int within the range [min, max]
 * @param min the minimum value for the generated number
 * @param max the maximum value for the generated number
 * @returns random int number
 */
function randomInt(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



/**
 * Get random element from array or string.
 * @param {Array|string} arr source
 * @returns array element or string character
 */
function randomElement(arr:string[]) {
    return arr[randomInt(0, arr.length - 1)];
}

/**
 * Determines whether a specific string contains at least one of the
 * templates/categories.
 *
 * @param {string} s - String containing categories.
 * @private
 * @returns {boolean} True if the specified string contains at least one of the
 * templates/categories; otherwise, false.
 */
/* function _hasTemplate(s:string) {
    for (const template in CATEGORIES) {
        if (s.indexOf(template) >= 0) {
            return true;
        }
    }

    return false;
} */

/**
 * @file authentication.js
 * @author GPlay97
 * @description Generates a password hash for password user will be prompted (script that can be called via command line only)
 */
const passwordHash = require('password-hash');

/**
 * Prompts the user for a password and generates password hash for it
 * @param {Function} callback callback function
 */
const generatePassword = (callback) => {
    const stdin = process.stdin,
        stdout = process.stdout;

    // prompt user
    stdin.resume();
    stdout.write('Enter password to use for authentication for requests:\n');

    // listen for the incoming password
    stdin.once('data', password => {
        try {
            callback(null, passwordHash.generate(password.toString().trim(), {
                algorithm: 'sha512'
            })); // generate password hash
        } catch (e) {
            callback(e);
        }
    });
}

// generate the password hash, so user can paste it within config file
generatePassword((err, hash) => {
    if (err) console.error('Something went wrong..');
    else if (typeof hash === 'string') console.log('Copy and paste the following generated hash within the config.json file to the AUTHORIZED_HASH property:\n', hash);
    process.exit(1);
});
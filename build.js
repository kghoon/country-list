'use strict';

const fs = require('fs');
const path = require('path');
const config = {};

const supportedLocales = ['ar', 'de', 'es', 'fr', 'id', 'it', 'ja', 'ko', 'pt', 'ru', 'th', 'tr', 'vi', 'zh-s', 'zh-t'];


function resolveLocale (org) {
    const localeMap = {
        'zh-s': 'zh_Hans',
        'zh-t': 'zh_Hant',
    };

    return localeMap[org] || org;
}


function excludeCountryCode (code) {
    return ![ 'EZ' ].includes(code);
}


if (require.main == module) {
    config.runtime = require('minimist')(process.argv.slice(2));

    const targetDirectory = config.runtime.d || '.';

    if (!fs.existsSync(targetDirectory)) {
        throw new Error(`target directory '${targetDirectory}' does not exist`);
    }

    console.log(`Build start`);

    for (const locale of supportedLocales) {
        const countryMap = require(`./data/${resolveLocale(locale)}/country.json`);
        const sortedMap = Object.keys(countryMap)
        .filter(excludeCountryCode).sort()
        .reduce((doc, code) => {
            doc[code] = countryMap[code];
            return doc;
        }, {});

        const filename = path.join(targetDirectory, `countryname_${locale}.js`);
        const output = 'var isoCountries = ' + JSON.stringify(sortedMap, null, 2) + ';\n';

        console.log(`Generate ${filename}`);
        fs.writeFileSync(filename, output);
    }
    console.log('Done');

}


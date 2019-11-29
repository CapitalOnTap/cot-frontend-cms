const path = require('path');

const setup = {
    siteDetails: {
        siteName: 'Capital On Tap',
        siteNameShort: 'COT',
        siteDescription: 'Capital On Tap Business funding for the real world.',
        siteBackgroundColor: '#f6f7f9',
        siteThemeColor: '#273456',
        siteIconSrc: './src/img/icons/site-icon.png'
    },
    paths: {
        entry: './src/index.js',
        dist: '../dist',
        src: '../src',
        fileName: 'js/main.js',
        sassFile: '@import "./../src/scss/main";',
        imagesSrc: './../src/img',
        imagesDist: './../dist/img',
        fontsFolder: '../assets/fonts',
        fontsDist: './../public/assets/fonts',
        rootFilesSrc: './../src/rootfiles',
        rootFilesDist: './../dist',
    },
    pages: {
        pagesSrc: '../src/pages'
    },
};

module.exports = setup;

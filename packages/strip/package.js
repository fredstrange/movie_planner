Package.describe({
    summary: "A Less Intrusive Responsive Lightbox"
});

Package.on_use(function (api) {
    api.versionsFrom('METEOR@0.9.0');

    api.use(['jquery'], ['client']);;

    api.add_files(["js/strip.pkgd.js", "css/strip.css"], "client");

    var assetPath = 'css/strip-skins/strip/'
    var assetFiles = [
        assetPath + 'close.png',
        assetPath + 'close.svg',
        assetPath + 'error.png',
        assetPath + 'error.svg',
        assetPath + 'next.png',
        assetPath + 'next.svg',
        assetPath + 'next-hover.png',
        assetPath + 'next-small.png',
        assetPath + 'next-small.svg',
        assetPath + 'next-small-hover.png',
        assetPath + 'previous.png',
        assetPath + 'previous.svg',
        assetPath + 'previous-hover.png',
        assetPath + 'previous-small.png',
        assetPath + 'previous-small.svg',
        assetPath + 'previous-small-hover.png'
    ];

    api.add_files(assetFiles, "client");
});
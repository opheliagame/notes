
require("dotenv").config();
const settings = require("../helpers/constants");

const markdownIt = require("markdown-it");
const { getBacklinks, getOutboundLinks, getGraphViewData } = require("../helpers/linkUtils");
const { QuadTree, Rectangle, Point } = require('../helpers/quadtree')
const { CSSGrid } = require('../helpers/cssgrid')
const md = markdownIt({
    html: true,
}).use(require("../helpers/utils").namedHeadingsFilter);

const allSettings = settings.ALL_NOTE_SETTINGS;

module.exports = {
    eleventyComputed: {
        graphViewData: (data) => getGraphViewData(data),
        settings: (data) => {
            const currentnote = data.collections.gardenEntry && data.collections.gardenEntry[0];
            if (currentnote && currentnote.data) {
                const noteSettings = {};
                allSettings.forEach(setting => {
                    let noteSetting = currentnote.data[setting];
                    let globalSetting = process.env[setting];

                    let settingValue = (noteSetting || (globalSetting === 'true' && noteSetting !== false));
                    noteSettings[setting] = settingValue;
                });
                return noteSettings;

            }
            return {};
        },
        tags: (data) => {
            const currentnote = data.collections.gardenEntry && data.collections.gardenEntry[0];
            if (currentnote && currentnote.data) {
                return currentnote.data.tags;
            }
            return [];
        },
    }
}
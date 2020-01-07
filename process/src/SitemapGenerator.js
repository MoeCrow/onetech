"use strict";

const sm = require('sitemap');
const fs = require('fs');

const ObjectFilters = require('./ObjectFilters');

class SitemapGenerator {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  generate(objects, biomes) {
    const sitemap = sm.createSitemap({hostname: 'http://moetech.onehouronelife.cn'});

    sitemap.add({url: "/"});

    for (let filter of ObjectFilters.filters) {
      sitemap.add({url: `/filter/${filter.key}`});
    }

    for (let object of objects) {
      const path = encodeURIComponent(`${object.id}-${object.name.replace(/[^\w\u4e00-\u9fa5]+/g, '-')}`);
      if (object.isVisible()) {
        sitemap.add({url: `/${path}`});
        if (!object.isNatural() && object.transitionsToward[0]) {
          sitemap.add({url: `/${path}/tech-tree`});
          sitemap.add({url: `/${path}/recipe`});
        }
      }
    }

    for (let biome of biomes) {
      const path = encodeURIComponent(`${biome.id}-${biome.name().toString().replace(/[^\w\u4e00-\u9fa5]+/g, '-')}`);
      sitemap.add({url: `/biomes/${path}`});
    }

    fs.writeFileSync(this.rootDir + "public/sitemap.xml", sitemap.toString());
  }
}

module.exports = SitemapGenerator;

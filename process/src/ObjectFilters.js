"use strict";

const Clothing = {
  key: "clothing",
  name: "可合成衣物",
  filter(objects) {
    return objects.filter(o => o.isClothing() && o.canCraft());
  }
}

const CostClothing = {
  key: "costclothing",
  name: "氪金衣物",
  filter(objects) {
    return objects.filter(o => o.isClothing() && !o.canCraft());
  }
}

const Food = {
  key: "food",
  name: "食物",
  filter(objects) {
    return objects.filter(o => o.data.foodValue > 0);
  }
}

const Tools = {
  key: "tools",
  name: "工具",
  filter(objects) {
    return objects.filter(o => o.isTool());
  }
}

const Containers = {
  key: "containers",
  name: "容器",
  filter(objects) {
    return objects.filter(o => o.isCraftableContainer());
  }
}

const HeatSources = {
  key: "heat",
  name: "热源",
  filter(objects) {
    return objects.filter(o => o.data.heatValue > 0);
  }
}

const WaterSources = {
  key: "water",
  name: "水源",
  filter(objects) {
    return objects.filter(o => o.isWaterSource());
  }
}

const Natural = {
  key: "natural",
  name: "自然",
  filter(objects) {
    return objects.filter(o => o.isNatural());
  }
}

const Character = {
  key: "character",
  name: "角色",
  filter(objects) {
    return objects.filter(o => o.isCharacter());
  }
}

const ObjectFilters = {
  filters: [
    Clothing,
    CostClothing,
    Food,
    Tools,
    Containers,
    HeatSources,
    Natural,
	Character,
  ],
  jsonData(objects) {
    objects = objects.filter(o => o.canFilter());
    return this.filters.map(f => {
      return {
        key: f.key,
        name: f.name,
        ids: f.filter(objects).map(o => o.id),
      };
    });
  }
}

module.exports = ObjectFilters;

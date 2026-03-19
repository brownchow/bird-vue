export interface Bird {
  species: string;
  scientific_name: string;
  common_name: string;
  description: string;
  image: string;
}

export const birdDataset: Record<string, Bird> = {
  "Chloris chloris_European Greenfinch": {
    species: "Chloris chloris_European Greenfinch",
    scientific_name: "Chloris chloris",
    common_name: "欧金翅雀",
    description: "体型中等，羽色以黄绿色为主，翅膀上有明显的黄色斑块。鸣声清脆悦耳。",
    image: "https://images.unsplash.com/photo-1620668159339-7b5d90328b67?auto=format&fit=crop&q=80&w=400"
  },
  "Pica pica_Eurasian Magpie": {
    species: "Pica pica_Eurasian Magpie",
    scientific_name: "Pica pica",
    common_name: "喜鹊",
    description: "常见的鸦科鸟类，尾长，羽毛呈黑白两色，在阳光下有金属光泽。常在树上筑巢。",
    image: "https://images.unsplash.com/photo-1591608971362-f08b2a75731a?auto=format&fit=crop&q=80&w=400"
  },
  "Cyanopica cyanus_Azure-winged Magpie": {
    species: "Cyanopica cyanus_Azure-winged Magpie",
    scientific_name: "Cyanopica cyanus",
    common_name: "灰喜鹊",
    description: "头顶黑色，背部灰色，双翼及尾羽呈明亮的蓝灰色。性喜群居，鸣声嘈杂。",
    image: "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?auto=format&fit=crop&q=80&w=400"
  },
  "Corvus macrorhynchos_Large-billed Crow": {
    species: "Corvus macrorhynchos_Large-billed Crow",
    scientific_name: "Corvus macrorhynchos",
    common_name: "大嘴乌鸦",
    description: "全身黑色，喙部粗大，鸣声粗哑。常见于林缘及城镇环境，适应力极强。",
    image: "https://images.unsplash.com/photo-1522720833375-9c27ffb02a5e?auto=format&fit=crop&q=80&w=400"
  },
  "Passer hispaniolensis_Spanish Sparrow": {
    species: "Passer hispaniolensis_Spanish Sparrow",
    scientific_name: "Passer hispaniolensis",
    common_name: "黑胸麻雀",
    description: "体型略大于家麻雀，雄鸟胸部有大片黑色斑块。常在湿地附近的灌丛中活动。",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30eba3?auto=format&fit=crop&q=80&w=400"
  },
  "Passer domesticus_House Sparrow": {
    species: "Passer domesticus_House Sparrow",
    scientific_name: "Passer domesticus",
    common_name: "家麻雀",
    description: "分布极广的鸟类，雄鸟头顶灰色，喉部黑色。与人类活动密切相关。",
    image: "https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&q=80&w=400"
  }
};

export const getBirdData = (species: string): Bird => {
  // Try exact match
  if (birdDataset[species]) return birdDataset[species];
  
  // Try fuzzy match by common name or part of species string
  for (const key in birdDataset) {
    if (species.toLowerCase().includes(birdDataset[key].scientific_name.toLowerCase())) {
      return birdDataset[key];
    }
  }

  // Default fallback
  return {
    species: species,
    scientific_name: "Unknown",
    common_name: species.split('_')[1] || species,
    description: "暂无该鸟类的详细描述信息。",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=400"
  };
};

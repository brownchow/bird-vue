/**
 * 鸟类数据接口
 * 定义了鸟类信息的数据结构
 */
export interface Bird {
  species: string;           // 物种唯一标识 (科学名_英文名)
  scientific_name: string;   // 拉丁学名 (如: Chloris chloris)
  common_name: string;       // 中文名称 (如: 欧金翅雀)
  description: string;       // 鸟类描述信息 (形态、习性等)
  image: string;             // 鸟类图片 URL
}

/**
 * 本地鸟类数据库
 * 
 * 存储常见鸟类的详细信息 (中文名、学名、描述、图片等)
 * 后端返回的物种标识符会在这里查询对应的详细信息
 * 
 * 键值：物种唯一标识 (species_english_name 格式)
 * 值：鸟类详细信息对象
 */
export const birdDataset: Record<string, Bird> = {
  "Cuculus micropterus_Indian Cuckoo": {
    species: "Cuculus micropterus_Indian Cuckoo",
    scientific_name: "Cuculus micropterus",
    common_name: "大杜鹃",
    description: "俗称布谷鸟，体色灰褐，腹部有细横纹。叫声低沉悠长，繁殖季节常在林间鸣叫。",
    image: "https://birdcount.in/wp-content/uploads/2016/11/177023731_Parth-Kansara-e1605000297590.jpg"
  },
  "Streptopelia chinensis_Spotted Dove": {
    species: "Streptopelia chinensis_Spotted Dove",
    scientific_name: "Streptopelia chinensis",
    common_name: "珠颈斑鸠",
    description: "体型中等，颈部有黑白点状斑纹，形似珍珠。常见于公园和庭院，叫声为三声一度的咕咕声。",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30eba3?auto=format&fit=crop&q=80&w=400"
  },
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
  },
  "Alcedo atthis_Common Kingfisher": {
    species: "Alcedo atthis_Common Kingfisher",
    scientific_name: "Alcedo atthis",
    common_name: "普通翠鸟",
    description: "体型较小，羽色艳丽，背部铜绿色，喉部白色。常静立于水边，俯冲捕食小鱼。",
    image: "https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&q=80&w=400"
  }
};

/**
 * 根据物种标识获取鸟类详细信息
 * 
 * 使用场景：
 * - 后端返回鸟类识别结果 (只包含 species 和 confidence)
 * - 前端调用此函数补充该鸟类的中文名、描述、图片等详情信息
 * 
 * @param species - 物种名称 (后端返回的识别结果物种标识)
 * @returns 返回该物种的详细信息，如果未找到则返回默认信息
 * 
 * 查询逻辑：
 * 1. 精确匹配 - 直接从 birdDataset 中查找
 * 2. 模糊匹配 - 如果精确匹配失败，尝试通过学名模糊匹配
 * 3. 降级处理 - 如果都失败，返回包含默认信息的对象，并从 species 中提取英文名作为 common_name
 */
export const getBirdData = (species: string): Bird => {
  // 精确匹配：直接从字典中查找，O(1) 时间复杂度
  if (birdDataset[species]) return birdDataset[species];
  
  // 模糊匹配：通过学名进行部分匹配
  // 用途：处理后端返回的物种标识格式可能略有不同的情况
  for (const key in birdDataset) {
    if (species.toLowerCase().includes(birdDataset[key].scientific_name.toLowerCase())) {
      return birdDataset[key];
    }
  }

  // 降级处理：如果本地数据库中没有该物种信息
  // 返回占位符数据，避免 UI 显示错误
  // 从 species 中提取英文名 (通常格式为 "科学名_英文名")
  return {
    species: species,
    scientific_name: "Unknown",
    common_name: species.split('_')[1] || species,
    description: "暂无该鸟类的详细描述信息。",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=400"
  };
};

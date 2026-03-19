<script setup lang="ts">
import { ArrowLeft, User, Mic, Verified, Info } from 'lucide-vue-next';
import { getBirdData } from '../data/birds';

const props = defineProps<{
  results: any;
}>();

const emit = defineEmits(['back']);

const detections = props.results?.detections || [];
const birdResults = detections.map((d: any) => ({
  ...d,
  ...getBirdData(d.species)
}));

const primaryMatch = birdResults[0];
const otherMatches = birdResults.slice(1);
</script>

<template>
  <div class="min-h-screen pb-32">
    <!-- 顶部导航栏 -->
    <header class="fixed top-0 w-full z-50 bg-[#faf9f5]/80 backdrop-blur-md">
      <div class="flex justify-between items-center px-8 h-16 w-full">
        <div class="flex items-center gap-4">
          <button @click="emit('back')" class="p-2 rounded-full hover:bg-[#efeeea] transition-colors">
            <ArrowLeft class="text-[#33602d]" />
          </button>
          <h1 class="font-['Manrope'] font-bold tracking-tight text-lg text-[#33602d]">识别结果</h1>
        </div>
        <div class="flex items-center gap-4">
          <span class="font-['Manrope'] font-extrabold italic tracking-tighter text-2xl text-[#33602d]">闻啼鸟</span>
          <User class="text-[#33602d] w-8 h-8 p-1 rounded-full hover:bg-[#efeeea] cursor-pointer" />
        </div>
      </div>
    </header>

    <main class="pt-24 px-8 max-w-2xl mx-auto">
      <!-- 搜索元数据 -->
      <section class="mb-12">
        <div class="bg-[#f4f4f0] rounded-xl p-6 flex items-center gap-6">
          <div class="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-[#e3e2df]">
            <img src="https://images.unsplash.com/photo-1475809913362-28a0d4272445?auto=format&fit=crop&q=80&w=400" 
                 alt="音频可视化" 
                 class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-[#33602d]/20 flex items-center justify-center">
              <Mic class="text-white" fill="currentColor" />
            </div>
          </div>
          <div>
            <h2 class="font-['Manrope'] font-bold text-xl text-[#1b1c1a] leading-tight">分析完成</h2>
            <p class="text-[#42493e] text-sm mt-1">录制于 北京 · 奥林匹克森林公园</p>
            <div class="mt-3 flex items-center gap-2">
              <span class="inline-block px-3 py-1 bg-[#bcf0ae] text-[#002201] rounded-full text-xs font-semibold">
                找到 {{ detections.length }} 个匹配项
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 结果列表 -->
      <div class="space-y-8">
        <!-- 主要匹配项 -->
        <article v-if="primaryMatch" class="relative">
          <div class="absolute -left-2 top-0 bottom-0 w-1 bg-[#33602d] rounded-full"></div>
          <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="flex flex-col sm:flex-row items-start gap-6">
              <div class="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-[#efeeea]">
                <img :src="primaryMatch.image" :alt="primaryMatch.common_name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 w-full">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-['Manrope'] font-bold text-2xl text-[#1b1c1a] tracking-tight">{{ primaryMatch.common_name }}</h3>
                    <p class="italic text-sm text-[#42493e]">{{ primaryMatch.scientific_name }}</p>
                  </div>
                  <div class="text-right">
                    <span class="block font-['Manrope'] font-extrabold text-[#33602d] text-2xl">
                      {{ Math.round(primaryMatch.confidence * 100) }}%
                    </span>
                    <span class="text-[10px] uppercase tracking-widest text-[#42493e] font-bold">置信度</span>
                  </div>
                </div>
                <p class="mt-4 text-[#42493e] leading-relaxed text-sm">{{ primaryMatch.description }}</p>
                <div class="mt-6 flex gap-3">
                  <button class="bg-[#3b6934] text-white px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Verified :size="16" /> 确认匹配
                  </button>
                  <button class="bg-[#90cdfd] text-[#025881] px-5 py-2 rounded-full text-sm font-medium hover:bg-opacity-80 transition-all">
                    详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- 其他匹配项 -->
        <article v-for="match in otherMatches" :key="match.species" 
                 class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ml-4">
          <div class="flex items-start gap-6">
            <div class="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-[#efeeea]">
              <img :src="match.image" :alt="match.common_name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-['Manrope'] font-bold text-xl text-[#1b1c1a] tracking-tight">{{ match.common_name }}</h3>
                  <p class="italic text-xs text-[#42493e]">{{ match.scientific_name }}</p>
                </div>
                <div class="text-right">
                  <span class="block font-['Manrope'] font-bold text-[#42493e] text-lg">
                    {{ Math.round(match.confidence * 100) }}%
                  </span>
                  <span class="text-[9px] uppercase tracking-widest text-[#73796d] font-bold">置信度</span>
                </div>
              </div>
              <p class="mt-3 text-[#42493e] leading-relaxed text-xs">{{ match.description }}</p>
            </div>
          </div>
        </article>
      </div>

      <!-- 反馈部分 -->
      <section class="mt-16 text-center">
        <p class="text-sm text-[#42493e] mb-4">没有找到匹配的鸟类？</p>
        <button class="text-[#33602d] font-bold border border-[#c2c9bb]/30 px-6 py-2 rounded-full hover:bg-[#f4f4f0] transition-colors">
          提交手动审核
        </button>
      </section>
    </main>

    <!-- 底部导航栏 (保持 Home 样式) -->
    <nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pb-8 pt-4 bg-[#faf9f5]/80 backdrop-blur-md rounded-t-[1.5rem] z-50 shadow-2xl">
      <a class="flex flex-col items-center justify-center text-[#42493e] px-4 py-2 hover:text-[#33602d] transition-colors" href="#" @click.prevent="emit('back')">
        <Mic :size="24" />
        <span class="text-[11px] font-medium leading-tight">Home</span>
      </a>
      <a class="flex flex-col items-center justify-center bg-[#3b6934] text-white rounded-full px-6 py-2 shadow-lg shadow-[#33602d]/20 active:scale-90 transition-transform" href="#">
        <Info :size="24" />
        <span class="text-[11px] font-medium leading-tight">Library</span>
      </a>
      <a class="flex flex-col items-center justify-center text-[#42493e] px-4 py-2 hover:text-[#33602d] transition-colors" href="#">
        <User :size="24" />
        <span class="text-[11px] font-medium leading-tight">Profile</span>
      </a>
    </nav>
  </div>
</template>

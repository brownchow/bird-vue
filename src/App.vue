<script setup lang="ts">
import { ref } from 'vue';
import Home from './components/Home.vue';
import Analyzing from './components/Analyzing.vue';
import Results from './components/Results.vue';

// 应用状态：'home' | 'analyzing' | 'results'
const appState = ref<'home' | 'analyzing' | 'results'>('home');
const analysisResults = ref<any>(null);

const handleStartAnalysis = () => {
  appState.value = 'analyzing';
};

const handleAnalysisComplete = (results: any) => {
  analysisResults.value = results;
  appState.value = 'results';
};

const handleBackToHome = () => {
  appState.value = 'home';
  analysisResults.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-[#faf9f5] font-['Work_Sans'] text-[#1b1c1a]">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
      mode="out-in"
    >
      <component
        :is="appState === 'home' ? Home : appState === 'analyzing' ? Analyzing : Results"
        :results="analysisResults"
        @start-analysis="handleStartAnalysis"
        @analysis-complete="handleAnalysisComplete"
        @back="handleBackToHome"
      />
    </transition>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Work+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

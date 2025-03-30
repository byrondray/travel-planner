<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  interface TravelPlan {
    id: string;
    destination: string;
    duration: number;
    budget: string;
    date: string;
    timestamp: string;
  }
  
  let savedPlans: TravelPlan[] = [];
  
  onMount(() => {
    loadSavedPlans();
  });
  
  function loadSavedPlans() {
  const plans: TravelPlan[] = [];
  const keys: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('travelPlan_')) {
      keys.push(key);
    }
  }
  
  keys.sort((a, b) => {
    const timeA = parseInt(a.split('_')[1] || '0');
    const timeB = parseInt(b.split('_')[1] || '0');
    return timeB - timeA;
  });
  
  for (const key of keys) {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const plan = JSON.parse(item);
        plans.push({
          id: key,
          destination: plan.destination,
          duration: plan.duration,
          budget: plan.budget,
          date: plan.date || new Date().toISOString().slice(0, 10),
          timestamp: key.split('_')[1] || '0'
        });
      }
    } catch (e) {
      console.error('Error parsing plan:', e);
    }
  }
  
  savedPlans = plans;
}
  
function viewPlan(id: string) {
  const plan = localStorage.getItem(id);
  if (plan) {
    localStorage.setItem('travelPlan', plan);
    localStorage.setItem('currentPlanId', id);
  }
  goto('/results');
}
  
  function deletePlan(id: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    localStorage.removeItem(id);
    loadSavedPlans();
  }
  
  function createNewPlan() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Saved Travel Plans</title>
</svelte:head>

<main class="max-w-3xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Your Saved Travel Plans</h1>
  
  {#if savedPlans.length > 0}
    <ul class="grid gap-4 list-none p-0">
      {#each savedPlans as plan}
        <li class="relative">
          <a 
            href="/results" 
            on:click|preventDefault={() => viewPlan(plan.id)}
            class="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors text-left flex justify-between items-center w-full"
          >
            <div>
              <h2 class="text-xl font-semibold">{plan.destination}</h2>
              <p class="text-gray-600">{plan.duration} days • {plan.budget} budget</p>
              <p class="text-gray-500 text-sm">{plan.date}</p>
            </div>
            <button 
              type="button"
              class="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
              on:click={(e) => deletePlan(plan.id, e)}
              aria-label="Delete plan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="text-center py-10 border border-gray-200 rounded-lg bg-gray-50">
      <p class="text-gray-600 mb-4">You don't have any saved travel plans yet.</p>
      <button 
        on:click={createNewPlan}
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Your First Plan
      </button>
    </div>
  {/if}
  
  {#if savedPlans.length > 0}
    <div class="mt-6">
      <button 
        on:click={createNewPlan}
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create New Plan
      </button>
    </div>
  {/if}
</main>
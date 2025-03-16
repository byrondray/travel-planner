<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  /** @type {{ destination: string, duration: number, budget: string, planHtml: string } | null} */
  let travelPlan = null;
  
  onMount(() => {
    const storedPlan = localStorage.getItem('travelPlan');
    
    if (storedPlan) {
      travelPlan = JSON.parse(storedPlan);
    } else {
      goto('/');
    }
  });
  
  function createNewPlan() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Your Travel Plan</title>
</svelte:head>

<main class="max-w-3xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Your Travel Plan</h1>
  
  {#if travelPlan}
    <div class="mb-8 pb-4 border-b border-gray-200">
      <h2 class="text-2xl font-bold">{travelPlan.destination}</h2>
      <p class="text-gray-600">{travelPlan.duration} days • {travelPlan.budget} budget</p>
    </div>
    
    <div class="prose prose-indigo max-w-none mb-8">
      {@html travelPlan.planHtml}
    </div>
  {:else}
    <p class="text-gray-600">Loading your travel plan...</p>
  {/if}
  
  <button 
    on:click={createNewPlan}
    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    Create a New Plan
  </button>
</main>
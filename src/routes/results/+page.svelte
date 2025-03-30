<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  interface TravelPlan {
    id: string;
    destination: string;
    duration: number;
    budget: string;
    interests?: string;
    travelStyle?: string;
    planHtml: string;
    date?: string;
  }

  let travelPlan: TravelPlan | null = null;
  let debugStorageContent = '';
  let loadingError = '';

  onMount(() => {
    console.log("Results page mounted");
    
    const currentPlanId = localStorage.getItem('currentPlanId');
    console.log("Current plan ID:", currentPlanId);
    
    if (!currentPlanId) {
      loadingError = "No plan ID found in local storage";
      return;
    }
    
    const storedPlan = localStorage.getItem(currentPlanId);
    debugStorageContent = storedPlan || 'No plan data found';
    
    if (!storedPlan) {
      loadingError = `Plan with ID ${currentPlanId} not found`;
      return;
    }
    
    try {
      travelPlan = JSON.parse(storedPlan) as TravelPlan;
      console.log("Loaded plan:", travelPlan);
      
      if (!travelPlan.planHtml) {
        console.error("Plan HTML is missing");
        travelPlan.planHtml = '<p>No itinerary content available. Please try generating a new plan.</p>';
      } else {
        console.log("Plan HTML length:", travelPlan.planHtml.length);
        console.log("HTML preview:", travelPlan.planHtml.substring(0, 100));
      }
    } catch (e) {
      console.error("Error parsing plan:", e);
      loadingError = "Error loading the travel plan data";
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
      <h2 class="text-2xl font-bold">{travelPlan.destination || 'Unknown Destination'}</h2>
      <p class="text-gray-600">{travelPlan.duration || '?'} days • {travelPlan.budget || 'unknown'} budget</p>
    </div>
    
    <div class="prose prose-indigo max-w-none mb-8">
      {@html travelPlan.planHtml}
    </div>
  {:else if loadingError}
    <div class="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-6">
      <p>{loadingError}</p>
      <p class="mt-2">Please return to the home page to create a new travel plan.</p>
    </div>
  {:else}
    <p class="text-gray-600">Loading your travel plan...</p>
    <div class="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto max-h-40">
      <pre class="text-xs">{debugStorageContent}</pre>
    </div>
  {/if}
  
  <div class="flex space-x-4 mt-6">
    <button 
      on:click={createNewPlan}
      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Create a New Plan
    </button>
    
    <a 
      href="/plans"
      class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      View All Plans
    </a>
  </div>
</main>
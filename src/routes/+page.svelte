<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { writable, type Writable } from 'svelte/store';
  
  export let form;
  
  interface InterestOption {
    id: string;
    label: string;
  }
  
  interface FormState {
    destination: string;
    duration: number;
    budget: string;
    travelStyle: string;
    interests: string[];
  }
  
  const formState: Writable<FormState> = writable({
    destination: '',
    duration: 7,
    budget: 'medium',
    travelStyle: 'balanced',
    interests: []
  });
  
  let isLoading = false;
  
  const interestOptions: InterestOption[] = [
    { id: 'food', label: 'Food & Dining' },
    { id: 'museums', label: 'Museums & Art' },
    { id: 'history', label: 'History & Culture' },
    { id: 'nature', label: 'Nature & Outdoors' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'nightlife', label: 'Nightlife' },
    { id: 'sports', label: 'Sports & Activities' },
    { id: 'family', label: 'Family-Friendly' }
  ];
  
  function toggleInterest(id: string): void {
    $formState = {
      ...$formState,
      interests: $formState.interests.includes(id) 
        ? $formState.interests.filter(i => i !== id)
        : [...$formState.interests, id]
    };
  }
  
  function getSelectedInterests(): string {
    return $formState.interests
      .map(id => interestOptions.find(opt => opt.id === id)?.label)
      .filter(Boolean)
      .join(', ');
  }
</script>

<svelte:head>
  <title>AI Travel Planner</title>
</svelte:head>

<main class="max-w-3xl mx-auto p-6">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">AI Travel Planner</h1>
    <a href="/plans" class="text-indigo-600 hover:text-indigo-800">
      View Saved Plans
    </a>
  </div>
  
  <p class="text-gray-600 mb-6">Fill out the form below to generate a personalized travel itinerary.</p>
  
  <form 
    method="POST" 
    action="?/generatePlan" 
    use:enhance={({ formData, cancel }) => {
      isLoading = true;
      
      formData.set('destination', $formState.destination);
      formData.set('duration', $formState.duration.toString());
      formData.set('budget', $formState.budget);
      formData.set('travelStyle', $formState.travelStyle);
      formData.set('interests', getSelectedInterests());
      
      if (!$formState.destination) {
        isLoading = false;
        cancel();
        return;
      }
      
      return async ({ result, update }) => {
        isLoading = false;
        
        if (result.type === 'success' && result.data) {
          const planId = `travelPlan_${Date.now()}`;
          const planData = {
            id: planId,
            destination: result.data.destination || $formState.destination,
            duration: Number(result.data.duration || $formState.duration),
            budget: result.data.budget || $formState.budget,
            interests: result.data.interests || getSelectedInterests(),
            travelStyle: result.data.travelStyle || $formState.travelStyle,
            planHtml: typeof result.data.planHtml === 'string' ? result.data.planHtml : '<p>No plan content received</p>',
            date: new Date().toISOString().slice(0, 10)
          };
          
          localStorage.setItem(planId, JSON.stringify(planData));
          
          localStorage.setItem('currentPlanId', planId);
          
          goto('/results');
        } else {
          await update();
        }
      };
    }}
    class="space-y-6"
  >
    <div>
      <label for="destination" class="block text-sm font-medium text-gray-700 mb-1">Destination</label>
      <input
        id="destination"
        name="destination"
        bind:value={$formState.destination}
        placeholder="e.g., Tokyo, Paris, New York"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
    
    <div>
      <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
      <input
        id="duration"
        name="duration"
        type="number"
        bind:value={$formState.duration}
        min="1"
        max="30"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
    
    <div>
      <label for="budget" class="block text-sm font-medium text-gray-700 mb-1">Budget</label>
      <select 
        id="budget"
        name="budget"
        bind:value={$formState.budget}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="budget">Budget</option>
        <option value="medium">Medium</option>
        <option value="luxury">Luxury</option>
      </select>
    </div>
    
    <div>
      <span class="block text-sm font-medium text-gray-700 mb-2">Interests</span>
      <div class="grid grid-cols-2 gap-2">
        {#each interestOptions as option}
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={$formState.interests.includes(option.id)}
              on:change={() => toggleInterest(option.id)}
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">{option.label}</span>
          </label>
        {/each}
      </div>
    </div>
    
    <div>
      <label for="travelStyle" class="block text-sm font-medium text-gray-700 mb-1">Travel Style</label>
      <select 
        id="travelStyle"
        name="travelStyle"
        bind:value={$formState.travelStyle}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="relaxed">Relaxed</option>
        <option value="balanced">Balanced</option>
        <option value="packed">Action-packed</option>
      </select>
    </div>
    
    <button 
      type="submit" 
      disabled={isLoading}
      class={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} cursor-pointer`}
    >
      {#if isLoading}
        <div class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating Travel Plan...
        </div>
      {:else}
        Generate Travel Plan
      {/if}
    </button>
    
    {#if form?.error}
      <div class="p-3 bg-red-100 border border-red-300 rounded-md text-red-700">
        {form.error}
      </div>
    {/if}
  </form>
</main>
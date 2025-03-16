<script>
  import { goto } from '$app/navigation';
  
  let destination = '';
  let duration = 7;
  let budget = 'medium';
  let interests = '';
  let travelStyle = 'balanced';
  let loading = false;
  
  async function handleSubmit() {
    loading = true;
    
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        body: JSON.stringify({
          destination,
          duration,
          budget,
          interests,
          travelStyle
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        localStorage.setItem('travelPlan', JSON.stringify(result));
        
        goto('/results');
      } else {
        throw new Error('Failed to generate travel plan');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate travel plan. Please try again.');
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>AI Travel Planner</title>
</svelte:head>

<main class="max-w-3xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-4">AI Travel Planner</h1>
  <p class="text-gray-600 mb-6">Fill out the form below to generate a personalized travel itinerary.</p>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div>
      <label for="destination" class="block text-sm font-medium text-gray-700 mb-1">Destination</label>
      <input
        id="destination"
        type="text"
        bind:value={destination}
        placeholder="e.g., Tokyo, Paris, New York"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
    
    <div>
      <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
      <input
        id="duration"
        type="number"
        bind:value={duration}
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
        bind:value={budget}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="budget">Budget</option>
        <option value="medium">Medium</option>
        <option value="luxury">Luxury</option>
      </select>
    </div>
    
    <div>
      <label for="interests" class="block text-sm font-medium text-gray-700 mb-1">Interests (comma separated)</label>
      <textarea
        id="interests"
        bind:value={interests}
        placeholder="e.g., museums, food, hiking, architecture"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-24"
      ></textarea>
    </div>
    
    <div>
      <label for="travelStyle" class="block text-sm font-medium text-gray-700 mb-1">Travel Style</label>
      <select 
        id="travelStyle" 
        bind:value={travelStyle}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="relaxed">Relaxed</option>
        <option value="balanced">Balanced</option>
        <option value="packed">Action-packed</option>
      </select>
    </div>
    
    <button 
      type="submit" 
      disabled={loading}
      class={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
    >
      {loading ? 'Generating...' : 'Generate Travel Plan'}
    </button>
  </form>
</main>
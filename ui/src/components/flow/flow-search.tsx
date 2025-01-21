import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { FlowTag } from "./flow-tag"
import { InputTags } from "@/components/ui/input-tags"

interface FlowSearchProps {
  onSearchChange: (results: { items: any[] }) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags: string[]
}

export function FlowSearch({ onSearchChange, selectedTags, onTagsChange, availableTags }: FlowSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [allTags, setAllTags] = useState<string[]>([])

  // Add useEffect to fetch and process tags when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      const results = await api.getFlows();
      // Extract unique tags from all flows
      const tags = new Set<string>();
      results.items.forEach(flow => {
        flow.tags.forEach((tag: string) => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    };
    fetchTags();
  }, []);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    // Trigger search whenever tags or query changes
    handleSearch(searchQuery);
  }, [searchQuery, selectedTags]);

  const handleSearch = async (query: string) => {
    let results;
    
    if (query.trim()) {
      // First get fuzzy search results
      results = await api.searchFlows(query);
    } else {
      // If no query, get all flows
      results = await api.getFlows();
    }

    // Filter by selected tags if any
    if (selectedTags.length > 0) {
      results.items = results.items.filter(flow => 
        selectedTags.every(tag => flow.tags.includes(tag))
      );
      results.filtered = results.items.length;
    }

    // Get pinned flows and reorder results
    const pinnedUrls = await api.getPinnedFlows().then(res => res.items.map(flow => flow.url));
    
    // Sort items so pinned flows appear first
    results.items.sort((a, b) => {
      const isPinnedA = pinnedUrls.includes(a.url);
      const isPinnedB = pinnedUrls.includes(b.url);
      if (isPinnedA && !isPinnedB) return -1;
      if (!isPinnedA && isPinnedB) return 1;
      return 0;
    });

    onSearchChange(results);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleTagsChange = async (newTags: string[]) => {
    onTagsChange(newTags);
    
    // Get base results depending on search query
    const results = searchQuery.trim()
      ? await api.searchFlows(searchQuery)
      : await api.getFlows();

    // Filter results based on the new tags
    if (newTags.length > 0) {
      results.items = results.items.filter(flow =>
        newTags.every(tag => flow.tags.includes(tag))
      );
    }
    
    results.filtered = results.items.length;
    onSearchChange(results);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Search input - left half */}
        <input
          type="text"
          placeholder="Search flows..."
          className="flex-1 bg-secondary rounded-lg px-4 py-2 text-foreground w-1/2"
          onChange={handleInputChange}
          value={searchQuery}
        />
        
        {/* Tag input - right half */}
        <InputTags
          className="w-1/2"
          placeholder="Add tags..."
          value={selectedTags}
          onChange={handleTagsChange}
        />
      </div>
    </div>
  )
} 
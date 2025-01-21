import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

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

    onSearchChange(results);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleTagClick = async (tag: string) => {
    // Calculate newTags array
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag) // Remove tag
      : [...selectedTags, tag]; // Add tag

    // Update tags state
    onTagsChange(newTags);

    // Get base results depending on search query
    const results = searchQuery.trim()
      ? await api.searchFlows(searchQuery) // Search with query
      : await api.getFlows(); // Get all flows

    // Only filter results if there are any selected tags
    if (newTags.length > 0) {
      results.items = results.items.filter(flow =>
        newTags.every(tag => flow.tags.includes(tag)) // Filter by newTags
      );
      results.filtered = results.items.length;
    }

    // Update search results
    onSearchChange(results);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Fuzzy search over flowname+description+tags"
          className="flex-1 bg-secondary rounded-lg px-4 py-2 text-foreground"
          onChange={handleInputChange}
          value={searchQuery}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            className={`cursor-pointer ${
              selectedTags.includes(tag)
                ? 'bg-primary hover:bg-primary/80'
                : 'bg-secondary/20 hover:bg-secondary/40'
            } text-muted border border-border px-4 py-2 rounded-lg text-sm`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
} 
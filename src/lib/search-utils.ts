import { Task, Project } from '@/types';

// Simple fuzzy search - matches if all characters appear in order
export function fuzzyMatch(query: string, text: string): { matches: boolean; score: number } {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  if (!query) return { matches: true, score: 0 };
  
  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    return { matches: true, score: 100 - textLower.indexOf(queryLower) };
  }
  
  // Fuzzy match - all characters must appear in order
  let queryIndex = 0;
  let score = 0;
  let consecutiveMatches = 0;
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
      consecutiveMatches++;
      score += consecutiveMatches * 2; // Reward consecutive matches
    } else {
      consecutiveMatches = 0;
    }
  }
  
  if (queryIndex === queryLower.length) {
    return { matches: true, score };
  }
  
  return { matches: false, score: 0 };
}

export interface SearchResult {
  type: 'task' | 'project';
  item: Task | Project;
  score: number;
  matchField: string;
}

export function searchTasks(query: string, tasks: Task[]): SearchResult[] {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];
  
  for (const task of tasks) {
    // Search in title
    const titleMatch = fuzzyMatch(query, task.title);
    if (titleMatch.matches) {
      results.push({
        type: 'task',
        item: task,
        score: titleMatch.score + 50, // Title matches get priority
        matchField: 'title',
      });
      continue;
    }
    
    // Search in description
    if (task.description) {
      const descMatch = fuzzyMatch(query, task.description);
      if (descMatch.matches) {
        results.push({
          type: 'task',
          item: task,
          score: descMatch.score,
          matchField: 'description',
        });
        continue;
      }
    }
    
    // Search in tags
    for (const tag of task.tags) {
      const tagMatch = fuzzyMatch(query, tag.name);
      if (tagMatch.matches) {
        results.push({
          type: 'task',
          item: task,
          score: tagMatch.score + 20,
          matchField: `tag: ${tag.name}`,
        });
        break;
      }
    }
    
    // Search in assignee names
    for (const assignee of task.assignees) {
      const assigneeMatch = fuzzyMatch(query, assignee.name);
      if (assigneeMatch.matches) {
        results.push({
          type: 'task',
          item: task,
          score: assigneeMatch.score + 10,
          matchField: `assignee: ${assignee.name}`,
        });
        break;
      }
    }
  }
  
  // Sort by score descending
  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

export function searchProjects(query: string, projects: Project[]): SearchResult[] {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];
  
  for (const project of projects) {
    const nameMatch = fuzzyMatch(query, project.name);
    if (nameMatch.matches) {
      results.push({
        type: 'project',
        item: project,
        score: nameMatch.score + 100,
        matchField: 'name',
      });
      continue;
    }
    
    if (project.description) {
      const descMatch = fuzzyMatch(query, project.description);
      if (descMatch.matches) {
        results.push({
          type: 'project',
          item: project,
          score: descMatch.score,
          matchField: 'description',
        });
      }
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  const index = textLower.indexOf(queryLower);
  if (index === -1) return text;
  
  return text;
}

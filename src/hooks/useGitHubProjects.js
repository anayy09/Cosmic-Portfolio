import { useState, useEffect } from 'react';
import axios from 'axios';

const useGitHubProjects = (username) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        // First, get the user's pinned repositories
        const { data: userData } = await axios.get(
          `https://api.github.com/users/${username}`
        );

        // Then get all repositories and sort by stars
        const { data: repos } = await axios.get(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
        );

        // Process and format the repository data
        const formattedRepos = repos
          .filter(repo => !repo.fork) // Filter out forked repositories
          .sort((a, b) => b.stargazers_count - a.stargazers_count) // Sort by stars
          .slice(0, 6) // Take top 6
          .map(repo => ({
            id: repo.id,
            name: repo.name,
            description: repo.description || 'No description provided',
            url: repo.html_url,
            homepage: repo.homepage,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics || [],
            updatedAt: repo.updated_at,
            isArchived: repo.archived,
          }));

        setProjects(formattedRepos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub projects:', err);
        setError('Failed to fetch projects from GitHub');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [username]);

  return { projects, loading, error };
};

export default useGitHubProjects;
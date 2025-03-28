import { useState, useEffect } from 'react';

const useHashnodeBlogs = (usernameOrHostname) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!usernameOrHostname) {
        setLoading(false);
        return;
      }

      try {
        // First, try to determine if the input is a hostname or username
        const isHostname = usernameOrHostname.includes('.');
        
        // GraphQL query - different based on whether we have a username or hostname
        const query = isHostname 
          ? `
            query Publication {
              publication(host: "${usernameOrHostname}") {
                isTeam
                title
                posts(first: 10) {
                  edges {
                    node {
                      title
                      brief
                      url
                      slug
                      coverImage {
                        url
                      }
                      publishedAt
                      reactionCount
                      responseCount
                    }
                  }
                }
              }
            }
          `
          : `
            query User {
              user(username: "${usernameOrHostname}") {
                publications(first: 10) {
                  edges {
                    node {
                      posts(first: 10) {
                        edges {
                          node {
                            title
                            brief
                            url
                            slug
                            coverImage {
                              url
                            }
                            publishedAt
                            reactionCount
                            responseCount
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `;

        const response = await fetch("https://gql.hashnode.com/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        let posts = [];
        
        if (isHostname) {
          // Check if publication exists
          if (!data.data || !data.data.publication) {
            throw new Error(`Publication not found for hostname: ${usernameOrHostname}`);
          }
          
          // Check if posts property exists on publication
          if (!data.data.publication.posts) {
            throw new Error('Posts data not available in the publication response');
          }
          
          posts = data.data.publication.posts.edges.map(edge => edge.node);
        } else {
          // Check if user exists
          if (!data.data || !data.data.user) {
            throw new Error(`User not found: ${usernameOrHostname}`);
          }
          
          // Check if publications exists for user
          if (!data.data.user.publications || !data.data.user.publications.edges || data.data.user.publications.edges.length === 0) {
            throw new Error(`No publications found for user: ${usernameOrHostname}`);
          }
          
          // Get the first publication's posts
          const firstPublication = data.data.user.publications.edges[0].node;
          
          if (!firstPublication.posts || !firstPublication.posts.edges) {
            throw new Error('Posts data not available in the user publication response');
          }
          
          posts = firstPublication.posts.edges.map(edge => edge.node);
        }
        
        // Format the blog data
        const formattedBlogs = posts.map(post => ({
          title: post.title,
          brief: post.brief,
          slug: post.slug,
          coverImage: post.coverImage,
          date: new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          reactions: post.reactionCount,
          comments: post.responseCount,
          url: post.url || `https://${usernameOrHostname}.hashnode.dev/${post.slug}`
        }));

        setBlogs(formattedBlogs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Hashnode blogs:', err);
        setError(`Failed to fetch blogs from Hashnode: ${err.message}`);
        setLoading(false);
        setBlogs([]); // Ensure blogs is an empty array on error
      }
    };

    fetchBlogs();
  }, [usernameOrHostname]);

  return { blogs, loading, error };
};

export default useHashnodeBlogs;
import { useState, useEffect } from 'react';
import axios from 'axios';

const useHashnodeBlogs = (username) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        // GraphQL query to fetch user's articles from Hashnode
        const query = `
          query GetUserArticles($username: String!) {
            user(username: $username) {
              publication {
                posts(page: 0) {
                  title
                  brief
                  slug
                  coverImage
                  dateAdded
                  totalReactions
                  responseCount
                }
              }
            }
          }
        `;

        const { data } = await axios.post('https://api.hashnode.com/', {
          query,
          variables: { username }
        });

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const posts = data.data.user.publication.posts;
        
        // Format the blog data
        const formattedBlogs = posts.map(post => ({
          title: post.title,
          brief: post.brief,
          slug: post.slug,
          coverImage: post.coverImage,
          date: new Date(post.dateAdded).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          reactions: post.totalReactions,
          comments: post.responseCount,
          url: `https://${username}.hashnode.dev/${post.slug}`
        }));

        setBlogs(formattedBlogs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Hashnode blogs:', err);
        setError('Failed to fetch blogs from Hashnode');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [username]);

  return { blogs, loading, error };
};

export default useHashnodeBlogs;
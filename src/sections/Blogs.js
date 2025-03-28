import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import useHashnodeBlogs from '../hooks/useHashnodeBlogs';
import { FaCalendarAlt, FaHeart, FaComment, FaExternalLinkAlt } from 'react-icons/fa';

const BlogsSection = styled.section`
  min-height: 100vh;
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const BlogsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled(motion.div)`
  background: rgba(10, 25, 47, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(66, 133, 244, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(66, 133, 244, 0.2);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const BlogContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const BlogTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.light};
  line-height: 1.3;
`;

const BlogExcerpt = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  flex-grow: 1;
  
  /* Limit to 3 lines with ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const BlogDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BlogStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const BlogStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const ReadMoreLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  transition: all 0.3s ease;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.theme.colors.accent};
    
    svg {
      transform: translateX(3px);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(66, 133, 244, 0.3);
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.primary};
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff6b6b;
  padding: 2rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
`;

const ViewAllButton = styled(motion.a)`
  display: block;
  margin: 3rem auto 0;
  padding: 0.8rem 2rem;
  background: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
  max-width: 200px;
  
  &:hover {
    background: rgba(66, 133, 244, 0.1);
    color: ${props => props.theme.colors.primary};
    transform: translateY(-3px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Blogs = ({ hashnodeUsername }) => {
  const { blogs, loading, error } = useHashnodeBlogs(hashnodeUsername);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  return (
    <BlogsSection id="blogs" ref={ref}>
      <SectionTitle
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        Latest Articles
      </SectionTitle>
      
      <SectionSubtitle
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        Thoughts, insights, and explorations on software development and machine learning
      </SectionSubtitle>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : error ? (
        <ErrorMessage>
          <h3>Error Loading Blogs</h3>
          <p>{error}</p>
        </ErrorMessage>
      ) : (
        <>
          <BlogsContainer
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {blogs.slice(0, 6).map((blog, index) => (
              <BlogCard key={index} variants={itemVariants}>
                <BlogContent>
                  <BlogTitle>{blog.title}</BlogTitle>
                  <BlogExcerpt>{blog.brief}</BlogExcerpt>
                  
                  <BlogMeta>
                    <BlogDate>
                      <FaCalendarAlt /> {blog.date}
                    </BlogDate>
                    
                    <BlogStats>
                      <BlogStat>
                        <FaHeart /> {blog.reactions}
                      </BlogStat>
                      <BlogStat>
                        <FaComment /> {blog.comments}
                      </BlogStat>
                    </BlogStats>
                  </BlogMeta>
                  
                  <ReadMoreLink href={blog.url} target="_blank" rel="noopener noreferrer">
                    Read More <FaExternalLinkAlt />
                  </ReadMoreLink>
                </BlogContent>
              </BlogCard>
            ))}
          </BlogsContainer>
          
          <ViewAllButton
            href={`https://${hashnodeUsername}.hashnode.dev/`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Articles
          </ViewAllButton>
        </>
      )}
    </BlogsSection>
  );
};

export default Blogs;
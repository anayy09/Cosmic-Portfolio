import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import useHashnodeBlogs from '../hooks/useHashnodeBlogs';
import { FaCalendarAlt, FaArrowRight, FaBookOpen } from 'react-icons/fa';

const BlogsSection = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

const SectionHeader = styled.div`
  max-width: 1400px;
  margin: 0 auto 3rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
  }
`;

const SectionTitleGroup = styled.div``;

const SectionLabel = styled(motion.span)`
  font-family: ${props => props.theme.fonts.code};
  color: ${props => props.theme.colors.primary};
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 4vw, 3rem);
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const ViewAllLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.muted};
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    svg {
      transform: translateX(4px);
    }
  }
`;

const BlogsGrid = styled(motion.div)`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const FeaturedBlog = styled(motion.a)`
  grid-column: 1;
  grid-row: 1 / 3;
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.theme.gradients.nebula};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: rgba(91, 141, 239, 0.4);
    box-shadow: 0 20px 60px rgba(91, 141, 239, 0.15);
    transform: translateY(-4px);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-column: 1;
    grid-row: auto;
    padding: 2rem;
    border-radius: 16px;
  }
`;

const FeaturedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  background: ${props => props.theme.gradients.nebula};
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
  width: fit-content;
`;

const FeaturedTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.light};
  margin: 0 0 1rem;
  line-height: 1.4;
  font-weight: 600;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.4rem;
  }
`;

const FeaturedExcerpt = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.muted};
  flex-grow: 1;
  margin: 0 0 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.9rem;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const FeaturedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.muted};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  svg {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.primaryMuted};
  }
`;

const ReadMore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  margin-left: auto;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  ${FeaturedBlog}:hover & svg {
    transform: translateX(4px);
  }
`;

const BlogCard = styled(motion.a)`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: rgba(91, 141, 239, 0.35);
    box-shadow: 0 12px 40px rgba(91, 141, 239, 0.12);
    transform: translateY(-3px);
  }
`;

const BlogTitle = styled.h4`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.light};
  margin: 0 0 0.75rem;
  line-height: 1.4;
  font-weight: 600;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BlogExcerpt = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.muted};
  flex-grow: 1;
  margin: 0 0 1rem;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.muted};
`;

const BlogDate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  
  svg {
    font-size: 0.75rem;
    color: ${props => props.theme.colors.primaryMuted};
  }
`;

const BlogReadMore = styled.span`
  color: ${props => props.theme.colors.primaryMuted};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  svg {
    font-size: 0.7rem;
    transition: transform 0.3s ease;
  }
  
  ${BlogCard}:hover & svg {
    transform: translateX(3px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid rgba(91, 141, 239, 0.2);
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
  border-radius: 16px;
  max-width: 600px;
  margin: 0 auto;
`;

const Blogs = ({ hashnodeUsername }) => {
  const { blogs, loading, error } = useHashnodeBlogs(hashnodeUsername);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.1 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
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

  const blogsToShow = isMobile ? blogs.slice(0, 3) : blogs.slice(0, 5);
  const featuredBlog = blogsToShow[0];
  const otherBlogs = blogsToShow.slice(1);

  return (
    <BlogsSection id="blogs" ref={ref}>
      <SectionHeader>
        <SectionTitleGroup>
          <SectionLabel variants={headerVariants} initial="hidden" animate={controls}>
            Blog
          </SectionLabel>
          <SectionTitle variants={headerVariants} initial="hidden" animate={controls}>
            Latest Articles
          </SectionTitle>
        </SectionTitleGroup>
        
        <ViewAllLink
          href={`https://${hashnodeUsername}.hashnode.dev/`}
          target="_blank"
          rel="noopener noreferrer"
          variants={headerVariants}
          initial="hidden"
          animate={controls}
        >
          View all articles <FaArrowRight />
        </ViewAllLink>
      </SectionHeader>

      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : error ? (
        <ErrorMessage>
          <h3>Error Loading Blogs</h3>
          <p>{error}</p>
        </ErrorMessage>
      ) : blogs.length > 0 ? (
        <BlogsGrid
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {featuredBlog && (
            <FeaturedBlog 
              href={featuredBlog.url} 
              target="_blank" 
              rel="noopener noreferrer"
              variants={itemVariants}
            >
              <FeaturedBadge>
                <FaBookOpen /> Latest
              </FeaturedBadge>
              <FeaturedTitle>{featuredBlog.title}</FeaturedTitle>
              <FeaturedExcerpt>{featuredBlog.brief}</FeaturedExcerpt>
              <FeaturedMeta>
                <MetaItem>
                  <FaCalendarAlt /> {featuredBlog.date}
                </MetaItem>
                <ReadMore>
                  Read article <FaArrowRight />
                </ReadMore>
              </FeaturedMeta>
            </FeaturedBlog>
          )}
          
          {otherBlogs.map((blog, index) => (
            <BlogCard 
              key={index} 
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
            >
              <BlogTitle>{blog.title}</BlogTitle>
              <BlogExcerpt>{blog.brief}</BlogExcerpt>
              <BlogMeta>
                <BlogDate>
                  <FaCalendarAlt /> {blog.date}
                </BlogDate>
                <BlogReadMore>
                  Read <FaArrowRight />
                </BlogReadMore>
              </BlogMeta>
            </BlogCard>
          ))}
        </BlogsGrid>
      ) : null}
    </BlogsSection>
  );
};

export default Blogs;
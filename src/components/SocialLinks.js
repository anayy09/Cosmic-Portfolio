import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaRss, FaFilePdf } from 'react-icons/fa';

const SocialLinksContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-top: 1.5rem;
  align-items: center;
  height: 100%;
  justify-content: flex-start;
`;

const SocialLink = styled(motion.a)`
  color: ${props => props.theme.colors.muted};
  font-size: 1.4rem;
  transition: ${props => props.theme.transitions.fast};
  align-self: center;
  margin-top: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.light};
    transform: translateY(-2px);
  }
`;

const CvButton = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  padding: 0.7rem 1.25rem;
  background: transparent;
  color: ${props => props.theme.colors.light};
  border: 1px solid rgba(91, 141, 239, 0.3);
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 180px;
  
  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  &:hover {
    background: rgba(91, 141, 239, 0.08);
    border-color: rgba(91, 141, 239, 0.5);
    transform: translateY(-2px);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0.55rem 1rem;
    font-size: 0.85rem;
    max-width: 160px;
  }
`;

const iconVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: i => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 180,
      damping: 18
    }
  }),
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

const SocialLinks = ({ github, linkedin, email, blog, cv }) => {
  const allLinks = [];

  if (github) allLinks.push({ type: 'social', url: github, icon: <FaGithub />, label: "GitHub" });
  if (linkedin) allLinks.push({ type: 'social', url: linkedin, icon: <FaLinkedin />, label: "LinkedIn" });
  if (email) allLinks.push({ type: 'social', url: `mailto:${email}`, icon: <FaEnvelope />, label: "Email" });
  if (blog) allLinks.push({ type: 'social', url: blog, icon: <FaRss />, label: "Blog" });
  if (cv) allLinks.push({ type: 'cv', url: cv, label: "CV" });

  return (
    <SocialLinksContainer>
      {allLinks.map((link, i) => {
        if (link.type === 'cv') {
          // Check if CV link is internal (starts with /) or external
          const isInternalLink = link.url.startsWith('/');
          
          return (
            <CvButton
              key={link.label}
              aria-label={link.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: (allLinks.length + 0.5 + i * 0.1), type: "spring", stiffness: 100 } }}
              whileHover={{ y: -3, transition: { type: "spring", stiffness: 300 } }}
              whileTap={{ y: 0 }}
            >
              {isInternalLink ? (
                <Link to={link.url}>
                  View CV <FaFilePdf style={{ marginLeft: '0.5rem' }} />
                </Link>
              ) : (
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  View CV <FaFilePdf style={{ marginLeft: '0.5rem' }} />
                </a>
              )}
            </CvButton>
          );
        } else { // 'social'
          // Calculate delay for social links based on their original position
          const socialLinkIndex = allLinks.filter(l => l.type === 'social').findIndex(sl => sl.label === link.label);
          return (
            <SocialLink
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              custom={socialLinkIndex}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              {link.icon}
            </SocialLink>
          );
        }
      })}
    </SocialLinksContainer>
  );
};

export default SocialLinks;
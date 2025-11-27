import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaPaperPlane, FaCheck, FaTimes } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const ContactSection = styled.section`
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

const ContactWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

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
  margin: 0 0 1rem;
`;

const SectionSubtitle = styled(motion.p)`
  max-width: 500px;
  margin: 0 auto;
  font-size: 1rem;
  color: ${props => props.theme.colors.muted};
  line-height: 1.6;
`;

const ContactGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  align-items: start;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ContactInfoCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 2.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem;
    border-radius: 16px;
  }
`;

const InfoHeading = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.light};
  margin: 0 0 0.5rem;
  font-weight: 600;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.muted};
  margin: 0 0 1.5rem;
  line-height: 1.6;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ContactLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid transparent;
  color: ${props => props.theme.colors.light};
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(91, 141, 239, 0.08);
    border-color: rgba(91, 141, 239, 0.2);
    transform: translateX(4px);
  }
`;

const LinkIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.gradient || props.theme.gradients.nebulaSubtle};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
`;

const LinkText = styled.span`
  color: ${props => props.theme.colors.muted};
  font-size: 0.95rem;
`;

const ContactFormCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 2.5rem;
  transition: all 0.4s ease;
  
  &:hover {
    border-color: rgba(91, 141, 239, 0.2);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem;
    border-radius: 16px;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.muted};
  font-weight: 500;
`;

const FormInput = styled.input`
  padding: 1rem 1.25rem;
  background: rgba(15, 23, 41, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: ${props => props.theme.colors.light};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(91, 141, 239, 0.4);
    background: rgba(15, 23, 41, 0.7);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.muted};
    opacity: 0.5;
  }
`;

const FormTextarea = styled.textarea`
  padding: 1rem 1.25rem;
  background: rgba(15, 23, 41, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: ${props => props.theme.colors.light};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: rgba(91, 141, 239, 0.4);
    background: rgba(15, 23, 41, 0.7);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.muted};
    opacity: 0.5;
  }
`;

const SubmitButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1rem 2rem;
  background: ${props => props.theme.gradients.nebula};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(91, 141, 239, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    justify-content: center;
  }
`;

const FormStatus = styled(motion.div)`
  padding: 0.85rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  
  &.success {
    background: rgba(46, 213, 115, 0.12);
    color: #2ed573;
    border: 1px solid rgba(46, 213, 115, 0.2);
  }
  
  &.error {
    background: rgba(255, 71, 87, 0.12);
    color: #ff4757;
    border: 1px solid rgba(255, 71, 87, 0.2);
  }
`;

const Contact = ({ email, linkedin, github }) => {
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();
  
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      
      setFormStatus({ type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.' });
      formRef.current.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }
  };
  
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
        staggerChildren: 0.15,
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
        stiffness: 80,
        damping: 12
      }
    }
  };
  
  return (
    <ContactSection id="contact" ref={ref}>
      <ContactWrapper>
        <SectionHeader>
          <SectionLabel variants={headerVariants} initial="hidden" animate={controls}>
            Contact
          </SectionLabel>
          <SectionTitle variants={headerVariants} initial="hidden" animate={controls}>
            Get In Touch
          </SectionTitle>
          <SectionSubtitle variants={headerVariants} initial="hidden" animate={controls}>
            Have a question or want to work together? Feel free to reach out!
          </SectionSubtitle>
        </SectionHeader>
        
        <ContactGrid
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          style={{ alignItems: 'stretch' }}
        >
          <ContactInfoCard variants={itemVariants} style={{ height: '100%' }}>
            <InfoHeading>Let's Connect</InfoHeading>
            <InfoText>
              I'm always open to new opportunities and collaborations. Don't hesitate to reach out!
            </InfoText>
            
            <ContactLinks>
              <ContactLink href={`mailto:${email}`}>
                <LinkIcon gradient="linear-gradient(135deg, #333 0%, #6e5494 100%)">
                  <FaEnvelope />
                </LinkIcon>
                <div>
                  <div style={{ fontWeight: 500 }}>Email</div>
                  <LinkText>{email}</LinkText>
                </div>
              </ContactLink>
              
              <ContactLink href={linkedin} target="_blank" rel="noopener noreferrer">
                <LinkIcon gradient="linear-gradient(135deg, #333 0%, #6e5494 100%)">
                  <FaLinkedin />
                </LinkIcon>
                <div>
                  <div style={{ fontWeight: 500 }}>LinkedIn</div>
                  <LinkText>Connect with me</LinkText>
                </div>
              </ContactLink>
              
              <ContactLink href={github} target="_blank" rel="noopener noreferrer">
                <LinkIcon gradient="linear-gradient(135deg, #333 0%, #6e5494 100%)">
                  <FaGithub />
                </LinkIcon>
                <div>
                  <div style={{ fontWeight: 500 }}>GitHub</div>
                  <LinkText>View my work</LinkText>
                </div>
              </ContactLink>
            </ContactLinks>
          </ContactInfoCard>
          
          <ContactFormCard variants={itemVariants} style={{ height: '100%' }}>
            <ContactForm ref={formRef} onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormInput
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormInput
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <FormLabel htmlFor="subject">Subject</FormLabel>
                <FormInput
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="What's this about?"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="message">Message</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  required
                  placeholder="Your message..."
                />
              </FormGroup>
              
              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ alignSelf: 'flex-end' }}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Send Message <FaPaperPlane />
                  </>
                )}
              </SubmitButton>
              
              {formStatus && (
                <FormStatus
                  className={formStatus.type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {formStatus.type === 'success' ? <FaCheck /> : <FaTimes />}
                  {formStatus.message}
                </FormStatus>
              )}
            </ContactForm>
          </ContactFormCard>
        </ContactGrid>
      </ContactWrapper>
    </ContactSection>
  );
};

export default Contact;
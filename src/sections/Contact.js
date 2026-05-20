import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiSend, FiCheck, FiX } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

const ContactSection = styled.section`
  padding: 6rem 0;
  position: relative;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 4rem 0;
  }
`;

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 1.5rem;
  }
`;

const SectionLabel = styled(motion.p)`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.875rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2.75rem;
  max-width: 52ch;
`;

const ContactGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 1.5rem;
  align-items: start;

  @media (max-width: ${props => props.theme.breakpoints.tabletL}) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled(motion.div)`
  background: rgba(14, 20, 32, 0.72);
  border: 1px solid rgba(91, 141, 239, 0.1);
  border-radius: ${props => props.theme.radius.lg};
  padding: 2rem;
`;

const InfoTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${props => props.theme.colors.light};
  letter-spacing: -0.01em;
  margin: 0 0 0.5rem 0;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.muted};
  line-height: 1.7;
  margin: 0 0 1.75rem 0;
  max-width: none;
`;

const ContactLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid rgba(91, 141, 239, 0.1);
  background: transparent;
  color: ${props => props.theme.colors.light};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(91, 141, 239, 0.07);
    border-color: rgba(91, 141, 239, 0.25);
    color: ${props => props.theme.colors.light};
    transform: translateX(3px);
  }
`;

const LinkIconBox = styled.div`
  width: 34px;
  height: 34px;
  border-radius: ${props => props.theme.radius.md};
  background: rgba(91, 141, 239, 0.1);
  border: 1px solid rgba(91, 141, 239, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 0.95rem;
  flex-shrink: 0;
`;

const LinkLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.light};
`;

const LinkValue = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.muted};
  margin-left: auto;
  font-family: ${props => props.theme.fonts.code};
`;

const ORCIDBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid rgba(91, 141, 239, 0.1);
  background: transparent;
  margin-top: 0.5rem;
`;

const ORCIDIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: ${props => props.theme.radius.md};
  background: rgba(91, 141, 239, 0.08);
  border: 1px solid rgba(91, 141, 239, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.65rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  letter-spacing: 0.02em;
  flex-shrink: 0;
`;

const FormCard = styled(motion.div)`
  background: rgba(14, 20, 32, 0.72);
  border: 1px solid rgba(91, 141, 239, 0.1);
  border-radius: ${props => props.theme.radius.lg};
  padding: 2rem;
  transition: border-color 0.25s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.18);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
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
  gap: 0.4rem;
`;

const Label = styled.label`
  font-family: ${props => props.theme.fonts.code};
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${props => props.theme.colors.muted};
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  background: rgba(8, 12, 20, 0.5);
  border: 1px solid rgba(91, 141, 239, 0.1);
  border-radius: ${props => props.theme.radius.md};
  color: ${props => props.theme.colors.light};
  font-size: 0.875rem;
  font-family: ${props => props.theme.fonts.main};
  transition: border-color 0.2s ease, background 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(91, 141, 239, 0.35);
    background: rgba(8, 12, 20, 0.7);
  }

  &::placeholder {
    color: ${props => props.theme.colors.subtle};
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  background: rgba(8, 12, 20, 0.5);
  border: 1px solid rgba(91, 141, 239, 0.1);
  border-radius: ${props => props.theme.radius.md};
  color: ${props => props.theme.colors.light};
  font-size: 0.875rem;
  font-family: ${props => props.theme.fonts.main};
  min-height: 110px;
  resize: vertical;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(91, 141, 239, 0.35);
    background: rgba(8, 12, 20, 0.7);
  }

  &::placeholder {
    color: ${props => props.theme.colors.subtle};
  }
`;

const SubmitButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1.75rem;
  background: ${props => props.theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${props => props.theme.radius.md};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: ${props => props.theme.fonts.main};
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.2s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background: #4a7fdf;
    box-shadow: 0 0 24px rgba(91, 141, 239, 0.3);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    align-self: stretch;
    justify-content: center;
  }
`;

const StatusMessage = styled(motion.div)`
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.radius.md};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  &.success {
    background: rgba(72, 187, 120, 0.1);
    color: #48BB78;
    border: 1px solid rgba(72, 187, 120, 0.2);
  }

  &.error {
    background: rgba(220, 90, 90, 0.1);
    color: #FC8181;
    border: 1px solid rgba(220, 90, 90, 0.2);
  }
`;

const Contact = ({ email, linkedin, github, orcid }) => {
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

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
      setFormStatus({ type: 'success', message: 'Message sent. I\'ll get back to you soon.' });
      formRef.current.reset();
    } catch {
      setFormStatus({ type: 'error', message: 'Failed to send. Please email me directly.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFormStatus(null), 5000);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <ContactSection id="contact" ref={ref}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel>{'// contact.init'}</SectionLabel>
          <SectionTitle>Get in Touch</SectionTitle>
          <SectionSubtitle>
            Open to research collaborations, full-time roles from Dec 2026, and interesting technical conversations.
          </SectionSubtitle>
        </motion.div>

        <ContactGrid
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <InfoCard variants={itemVariants}>
            <InfoTitle>Reach out</InfoTitle>
            <InfoText>
              Gainesville, FL. Available full-time from December 2026.
            </InfoText>

            <ContactLinks>
              <ContactLink href={`mailto:${email}`}>
                <LinkIconBox><FiMail /></LinkIconBox>
                <LinkLabel>Email</LinkLabel>
                <LinkValue>{email}</LinkValue>
              </ContactLink>
              <ContactLink href={linkedin} target="_blank" rel="noopener noreferrer">
                <LinkIconBox><FiLinkedin /></LinkIconBox>
                <LinkLabel>LinkedIn</LinkLabel>
                <LinkValue>anaysinhal</LinkValue>
              </ContactLink>
              <ContactLink href={github} target="_blank" rel="noopener noreferrer">
                <LinkIconBox><FiGithub /></LinkIconBox>
                <LinkLabel>GitHub</LinkLabel>
                <LinkValue>anayy09</LinkValue>
              </ContactLink>
              {orcid && (
                <ORCIDBox>
                  <ORCIDIcon>iD</ORCIDIcon>
                  <LinkLabel>ORCID</LinkLabel>
                  <LinkValue style={{ marginLeft: 'auto' }}>
                    <a
                      href={`https://orcid.org/${orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit' }}
                    >
                      {orcid}
                    </a>
                  </LinkValue>
                </ORCIDBox>
              )}
            </ContactLinks>
          </InfoCard>

          <FormCard variants={itemVariants}>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" id="name" name="name" required placeholder="Your name" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" name="email" required placeholder="you@email.com" />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <Label htmlFor="subject">Subject</Label>
                <Input type="text" id="subject" name="subject" required placeholder="Research, collaboration, role..." />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required placeholder="Your message..." />
              </FormGroup>
              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                {isSubmitting ? 'Sending...' : <><FiSend size={14} /> Send Message</>}
              </SubmitButton>
              {formStatus && (
                <StatusMessage
                  className={formStatus.type}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formStatus.type === 'success' ? <FiCheck size={14} /> : <FiX size={14} />}
                  {formStatus.message}
                </StatusMessage>
              )}
            </Form>
          </FormCard>
        </ContactGrid>
      </Container>
    </ContactSection>
  );
};

export default Contact;

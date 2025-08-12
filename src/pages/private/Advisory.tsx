import React from 'react';
import styled from 'styled-components';
import { Card, Button } from 'antd';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 0;
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 20px;
  margin-bottom: 3rem;
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.3);
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.15rem;
  margin-bottom: 0;
  opacity: 0.95;
  line-height: 1.7;
  max-width: 900px;
`;

const SectionTitle = styled.h2`
  color: #dc2626;
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #dc2626, #991b1b);
    border-radius: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const CardBox = styled(Card)`
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.08);
  border: none;
  transition: all 0.25s ease;

  &:hover { transform: translateY(-6px); box-shadow: 0 14px 36px rgba(220,38,38,0.18); }
  .ant-card-body { padding: 1.5rem; }
`;

const BulletList = styled.ul`
  margin: 0; padding: 0; list-style: none;
  li { position: relative; padding-left: 1.5rem; margin-bottom: .75rem; color: #374151; }
  li::before { content: '✓'; position: absolute; left: 0; color: #dc2626; font-weight: 700; }
`;

const CTA = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #fff;
  padding: 2rem;
  border-radius: 16px;
  margin-top: 2.5rem;
  text-align: center;
`;

const Advisory: React.FC = () => (
  <PageWrapper>
    <PageContainer>
      <HeroSection>
        <Title>Private Advisory Services</Title>
        <Subtitle>
          Receive expert, unbiased advice on all aspects of your financial life. Our advisory team partners with you
          to develop strategies for wealth preservation, growth, and succession.
        </Subtitle>
      </HeroSection>

      <SectionTitle>Our Advisory Services</SectionTitle>
      <Grid>
        {[
          { t: 'Financial Consulting', d: 'Comprehensive portfolio reviews and actionable recommendations.' },
          { t: 'Tax & Legal Advisory', d: 'Strategies for tax efficiency and regulatory compliance.' },
          { t: 'Family Office Services', d: 'Multi‑generational planning and family governance.' },
          { t: 'Philanthropic Planning', d: 'Structure charitable giving for sustained impact.' },
          { t: 'Business Advisory', d: 'Succession, liquidity events, and expansion strategies.' },
          { t: 'Alternative Investments', d: 'Access and diligence for private markets and alternatives.' },
        ].map((s, i) => (
          <CardBox key={i} bordered={false}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>{s.t}</h3>
            <p style={{ marginTop: '.5rem', color: '#6b7280' }}>{s.d}</p>
          </CardBox>
        ))}
      </Grid>

      <SectionTitle>Why Choose UBAS FinTrust?</SectionTitle>
      <BulletList>
        <li><strong>Trusted, experienced advisors</strong> — Deep multi‑disciplinary expertise</li>
        <li><strong>Holistic, client‑centered approach</strong> — Your goals drive every decision</li>
        <li><strong>Discreet, confidential service</strong> — Privacy and security by design</li>
      </BulletList>

      <CTA>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.5rem' }}>Ready for a confidential consultation?</h3>
        <p style={{ opacity: .9, marginBottom: '1rem' }}>Speak with our private advisory team today.</p>
        <Button type="primary" style={{ background: '#dc2626', borderColor: '#dc2626', height: 46, padding: '0 20px', borderRadius: 10 }}>
          Contact Advisory
        </Button>
      </CTA>
    </PageContainer>
  </PageWrapper>
);

export default Advisory;

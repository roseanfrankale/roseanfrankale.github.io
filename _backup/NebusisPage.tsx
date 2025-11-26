import React from 'react';

const NebusisPage = () => {
  // Note: You will need to import and use react-feather for icons
  // and handle any JS-driven animations with React hooks (useEffect).
  return (
    <>
      {/* Hero Section */}
      <section className="case-hero mb-5" style={{ paddingTop: '5rem' }}>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <h1 className="case-title">Nebusis®</h1>
            </div>
          </div>
          <div className="hero-content mt-3 row justify-content-center">
            {/* Left Column: Image */}
            <div className="col-lg-6 text-center">
              <div className="hero-image-container">
                <div className="hero-mockup">
                  <img src={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/NEBUSIS Dribble Landing.png`} alt="Nebusis Dashboard" className="hero-case-image" />
                </div>
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="col-lg-5 align-items-center justify-content-center">
              <div className="hero-case-content">
                <p className="case-subtitle">Transforming ISO compliance through design.</p>

                <a href="https://www.nebusis.com/" target="_blank" rel="noopener noreferrer" className="btn-primary d-inline-flex align-items-center gap-2">
                  View Site {/* <i data-feather="arrow-right" aria-hidden="true"></i> */}
                </a>
                
                <div className="hero-case-details">
                  {/* Meta items */}
                  <div className="meta-item">
                    <p className="meta-label">Client</p>
                    <p className="meta-value">Nebusis Cloud Services LLC</p>
                  </div>
                  <div className="meta-item">
                    <p className="meta-label">My Role</p>
                    <p className="meta-value">Product Manager, UI/UX Design, Project & Operations Management</p>
                  </div>
                  <div className="meta-item">
                    <p className="meta-label">Timeline</p>
                    <p className="meta-value">Nov 2020 - Jun 2023</p>
                  </div>
                  <div className="meta-item">
                    <p className="meta-label">Tech Stack</p>
                    <div className="tech-badges hero-case-badge">
                      <span className="badge">Figma</span>
                      <span className="badge">Adobe CC</span>
                      <span className="badge">Wordpress</span>
                      <span className="badge">Elementor</span>
                      <span className="badge">GSuite</span>
                      <span className="badge">ClickUp</span>
                      <span className="badge">Mailchimp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="case-section">
        <div className="container">
          <div className="section-header">
            <div className="section-number">01 — Overview</div>
            <h2 className="section-title">Simplifying the Complex</h2>
          </div>

          <div className="two-column-text">
            <p>Nebusis® is an AI-powered SaaS platform designed to revolutionize how organizations manage ISO compliance. Traditional compliance management was plagued by manual processes, fragmented systems, and poor user experiences that made simple tasks unnecessarily complex.</p>
            
            <p>My role encompassed product management, UI/UX design, and project management, guiding the platform from concept through launch. The journey involved navigating a major crisis, rebuilding from scratch, and ultimately delivering a solution that transforms compliance from burden to strategic advantage.</p>
          </div>

          <div className="key-insights">
            <h3>Project Highlights</h3>
            <ul>
              <li>Led complete redesign of compliance management platform serving enterprise clients</li>
              <li>Recovered from critical website failure by rebuilding entire system in compressed timeframe</li>
              <li>Implemented mobile-first design approach using Google UX principles</li>
              <li>Created comprehensive design system with 50+ custom assets and vectors</li>
              <li>Delivered 4 distinct landing pages with integrated AI policy generation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Challenge Section */}
      <section id="challenge" className="case-section">
        <div className="container">
          <div className="section-header">
            <div className="section-number">02 — The Challenge</div>
            <h2 className="section-title">Understanding the Problem</h2>
            <p className="section-description">
              ISO compliance systems were stuck in the past, creating friction rather than facilitating progress.
            </p>
          </div>

          <div className="problem-solution-grid">
            <div className="problem-card">
              <div className="card-icon">{/* <i data-feather="alert-triangle"></i> */}</div>
              <h3 className="card-title">The Problem</h3>
              <p className="card-text">
                Organizations struggled with outdated ISO management systems that required extensive manual work, created compliance gaps, and provided frustrating user experiences. Teams spent more time fighting the system than improving actual compliance.
              </p>
            </div>

            <div className="solution-card">
              <div className="card-icon">{/* <i data-feather="check-circle"></i> */}</div>
              <h3 className="card-title">The Solution</h3>
              <p className="card-text">
                Nebusis® transforms compliance management through intelligent automation, intuitive design, and real-time analytics. We made the complex simple and the tedious automated.
              </p>
            </div>
          </div>

          {/* Visual Comparison: Before vs After */}
          <div className="visual-comparison mt-5">
            <div className="comparison-side before-side">
              <h3>Before</h3>
              <a href={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/final_landing/neb_old_frame_1.png`}> 
                <div className="hoverbox">
                  <img src={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/final_landing/neb_old_frame_1.png`} alt="Original Nebusis Interface" />
                  <div className="hoverbox-content">{/* <i className="text-white" data-feather="plus"></i> */}</div>
                </div>
              </a>
              <p className="mt-3">The original interface was cluttered, difficult to navigate, and not optimized for modern workflows.</p>
            </div>
            
            <div className="comparison-side after-side">
              <h3>After</h3>
              <a href={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/final_landing_2/neb_1.png`}> 
                <div className="hoverbox">
                  <img src={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/final_landing_2/neb_1.png`} alt="Redesigned Nebusis Interface" />
                  <div className="hoverbox-content">{/* <i className="text-white" data-feather="plus"></i> */}</div>
                </div>
              </a>
              <p className="mt-3">Clean, modern interface with clear information hierarchy and intuitive navigation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ... Continue converting the rest of the nebusis.html sections ... */}

      {/* Results & Impact Section */}
      <section id="results" className="case-section">
        <div className="container">
          <div className="section-header">
            <div className="section-number">05 — Results & Impact</div>
            <h2 className="section-title">Measurable Success</h2>
            <p className="section-description">
              Quantifiable improvements across engagement, efficiency, and user satisfaction
            </p>
          </div>

          <div className="results-grid">
            <div className="result-item">
              <div className="result-number">12%</div>
              <div className="result-label">Increase in User Engagement</div>
            </div>
            <div className="result-item">
              <div className="result-number">100%</div>
              <div className="result-label">Mobile Responsive Design</div>
            </div>
            <div className="result-item">
              <div className="result-number">4</div>
              <div className="result-label">Landing Pages Created</div>
            </div>
            <div className="result-item">
              <div className="result-number">50+</div>
              <div className="result-label">Custom Design Assets</div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="case-study-showcase">
            <div className="showcase-row">
              <div className="showcase-item">
                <a href={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/mockups/nebusis_dashboard_mockup.png`}>
                  <div className="hoverbox rounded overlay overflow-hidden">
                    <img src={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/mockups/nebusis_dashboard_mockup.png`} alt="Nebusis Dashboard Interface" />
                    <div className="hoverbox-content">{/* <i className="text-white" data-feather="plus"></i> */}</div>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="showcase-row">
              <div className="showcase-item showcase-item--half">
                <a href={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/mockups/policy_managment_mockup.png`}>
                  <div className="hoverbox rounded overlay overflow-hidden">
                    <img src={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/mockups/policy_managment_mockup.png`} alt="Policy Management Interface" />
                    <div className="hoverbox-content">{/* <i className="text-white" data-feather="plus"></i> */}</div>
                  </div>
                </a>
              </div>
              <div className="showcase-item showcase-item--half">
                <a href={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/mockups/nebusis_risk_opp_mockup_laptop.png`}>
                  <div className="hoverbox rounded overlay overflow-hidden">
                    <img src={`${process.env.PUBLIC_URL}/assets/img/nebusis_photos/mockups/nebusis_risk_opp_mockup_laptop.png`} alt="Risk Tracking Dashboard" />
                    <div className="hoverbox-content">{/* <i className="text-white" data-feather="plus"></i> */}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Let's Work Together</h2>
          <p className="cta-text">Interested in discussing how I can help bring your next project to life?</p>
          <form action="mailto:rosean.frankalexander@gmail.com" method="get" encType="text/plain" className="cta-form">
            <input type="email" name="email" placeholder="Enter your email address" required />
            <input type="hidden" name="subject" value="Project Inquiry from Nebusis Case Study" />
            <button type="submit" className="btn-primary">Get in Touch</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default NebusisPage;
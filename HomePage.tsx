import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, GitHub, Dribbble, Youtube, Music } from 'react-feather';

const HomePage = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section id="hero">
        <div className="animated-bg"></div>
        <div className="container text-center position-relative z-1">
          <h1 className="hero-title">
            Hello, I'm <span className="highlight">RoSean</span>
          </h1>
          <p className="hero-subtext mb-4">Front-End Engineer • Designer • Musician</p>

          <div className="hero-actions mb-5">
            <a href="#work" className="custom-btn-outline">View My Work</a>
            <a href="#about" className="custom-btn-outline">About Me</a>
          </div>
          <div className="hero-socials">
            <a href="https://www.linkedin.com/in/rfrankale/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a>
            <a href="https://github.com/roseanfrankale/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHub /></a>
            <a href="https://dribbble.com/rjfa/" target="_blank" rel="noopener noreferrer" aria-label="Dribbble"><Dribbble /></a>
            <a href="https://www.youtube.com/playlist?list=PLq8eop32VW4_lzzDk9UZI9XWkdyXlaMcV" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube /></a>
            <Link to="/music" aria-label="Music"><Music /></Link>
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section id="work" className="py-5">
        <div className="container">
          <div className="section-title-stacked mb-5">
            <h2 className="title-main">Featured</h2>
            <p className="title-sub">Work</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-6">
              <Link to="/nebusis" className="project-card-link">
                <div className="project-card">
                  <div className="project-bg" style={{ backgroundImage: `url(/assets/img/nebusis_photos/NEBUSIS Dribble Landing.png)` }}></div>
                  <div className="overlay"></div>
                  <div className="project-content">
                    <h2 className="fw-bold">Nebusis®</h2>
                    <p>SaaS ISO-based platform simplifying management systems.</p>
                  </div>
                  <div className="project-footer">
                    <span className="badge rounded-pill border border-light">SaaS Platform</span>
                    <span className="cta-link">→ Read More</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Project 2 */}
            <div className="col-md-6 col-lg-6">
              <Link to="/qurado" className="project-card-link">
                <div className="project-card">
                  <div className="project-bg" style={{ backgroundImage: `url(/assets/img/qurado/Qurado_Dribble_Landing.png)` }}></div>
                  <div className="overlay"></div>
                  <div className="project-content">
                    <h2 className="fw-bold">Qurado</h2>
                    <p>E-commerce platform redesign for small businesses.</p>
                  </div>
                  <div className="project-footer">
                    <span className="badge rounded-pill border border-light">E-Commerce</span>
                    <span className="cta-link">→ View Project</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Project 3 */}
            <div className="col-md-6 col-lg-6">
              <Link to="/naesor" className="project-card-link">
                <div className="project-card">
                  <div className="project-bg" style={{ backgroundImage: `url(/assets/img/naesor/NAESOR Dribble Landing Page.png)` }}></div>
                  <div className="overlay"></div>
                  <div className="project-content">
                    <h2 className="fw-bold">Naesor</h2>
                    <p>Conceptual album app designed for a Google challenge.</p>
                  </div>
                  <div className="project-footer">
                    <span className="badge rounded-pill border border-light">Music App</span>
                    <span className="cta-link">→ Explore</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Project 4 */}
            <div className="col-md-6 col-lg-6">
              <Link to="/bruvue" className="project-card-link">
                <div className="project-card">
                  <div className="project-bg" style={{ backgroundImage: `url(/assets/img/bruvue_photos/BruVue_Landing_1.png)` }}></div>
                  <div className="overlay"></div>
                  <div className="project-content">
                    <h2 className="fw-bold">BruVue</h2>
                    <p>Tools for bar sensors and analytics – first design project.</p>
                  </div>
                  <div className="project-footer">
                    <span className="badge rounded-pill border border-light">Analytics</span>
                    <span className="cta-link">→ Learn More</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-5" id="about">
        <div className="container">
          <div className="row g-5 align-items-start">
            {/* Left Column: Narrative (Sticky) */}
            <div className="col-lg-5">
              <div className="position-sticky" style={{ top: '8rem' }}>
                <div className="section-title-stacked mb-5">
                  <h2 className="title-main">About</h2>
                  <p className="title-sub">Me</p>
                </div>

                <p className="lead">
                  I'm a designer and product thinker with a passion for blending design, branding,
                  and strategy. My work focuses on crafting intuitive user experiences and scalable
                  digital products.
                </p>
                <div className="about-img-wrapper text-center my-4">
                  <img src="/assets/img/sean_pro_foto_dl_1 .jpeg" alt="Rosean portrait" className="img-fluid rounded-3 shadow about-img" />
                </div>
                <div className="text-center">
                  <a href="/resume.html" target="_blank" rel="noopener noreferrer" className="custom-btn">View CV</a>
                  <a href="#connect" className="custom-btn">Let's Connect</a>
                </div>
              </div>
            </div>

            {/* Right Column: Data (Skills & Experience) */}
            <div className="col-lg-6 offset-lg-1">
              {/* Pills Navigation */}
              <div className="about-pills-wrapper">
                <ul className="nav nav-pills mb-4" id="about-pills" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-skills-tab" data-bs-toggle="pill" data-bs-target="#pills-skills" type="button" role="tab" aria-controls="pills-skills" aria-selected={true}>Skills & Tools</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-experience-tab" data-bs-toggle="pill" data-bs-target="#pills-experience" type="button" role="tab" aria-controls="pills-experience" aria-selected={false}>Experience</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-education-tab" data-bs-toggle="pill" data-bs-target="#pills-education" type="button" role="tab" aria-controls="pills-education" aria-selected={false}>Education</button>
                  </li>
                </ul>
              </div>

              {/* Tab Content */}
              <div className="tab-content" id="pills-tabContent">
                {/* Skills & Tools Pane */}
                <div className="tab-pane fade show active" id="pills-skills" role="tabpanel" aria-labelledby="pills-skills-tab">
                  {/* Web Development */}
                  <h4 className="skills-sub-heading">Web Development</h4>
                  <div className="row row-cols-3 row-cols-sm-4 row-cols-md-4 g-4 text-center mb-5">
                    <div className="col"><div className="skill-item"><i className="fab fa-html5" style={{ color: '#e34f26' }}></i><span>HTML5</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-css3-alt" style={{ color: '#264de4' }}></i><span>CSS3</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-js-square" style={{ color: '#f7df1e' }}></i><span>JavaScript</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fas fa-code" style={{ color: '#0769ad' }}></i><span>jQuery</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-react" style={{ color: '#61dafb' }}></i><span>React</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-vuejs" style={{ color: '#4fc08d' }}></i><span>Vue.js</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-node-js" style={{ color: '#68a063' }}></i><span>Node.js</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fas fa-database" style={{ color: '#00758f' }}></i><span>MySQL</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-github" style={{ color: '#333' }}></i><span>GitHub</span></div></div>
                  </div>

                  {/* Design */}
                  <h4 className="skills-sub-heading">Design</h4>
                  <div className="row row-cols-3 row-cols-sm-4 row-cols-md-4 g-4 text-center mb-5">
                    <div className="col"><div className="skill-item"><i className="fab fa-figma" style={{ color: '#f24e1e' }}></i><span>Figma</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-sketch" style={{ color: '#f7b500' }}></i><span>Sketch</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fas fa-paint-brush" style={{ color: '#ff61f6' }}></i><span>Framer</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fas fa-project-diagram" style={{ color: '#ffd02f' }}></i><span>Miro</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-adobe" style={{ color: '#31a8ff' }}></i><span>Photoshop</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-adobe" style={{ color: '#ff3366' }}></i><span>InDesign</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-adobe" style={{ color: '#ff61f6' }}></i><span>Adobe XD</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-adobe" style={{ color: '#ff9a00' }}></i><span>Illustrator</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fas fa-palette" style={{ color: '#00c4cc' }}></i><span>Canva</span></div></div>
                  </div>

                  {/* Business Tools */}
                  <h4 className="skills-sub-heading">Business Tools</h4>
                  <div className="row row-cols-3 row-cols-sm-4 row-cols-md-4 g-4 text-center">
                    <div className="col"><div className="skill-item"><i className="fab fa-google" style={{ color: '#4285f4' }}></i><span>Google Workspace</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-salesforce" style={{ color: '#00a1e0' }}></i><span>Salesforce</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-slack" style={{ color: '#4a154b' }}></i><span>Slack</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-jira" style={{ color: '#0052cc' }}></i><span>Jira</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-trello" style={{ color: '#0079bf' }}></i><span>Trello</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-confluence" style={{ color: '#172b4d' }}></i><span>Confluence</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-hubspot" style={{ color: '#ff7a59' }}></i><span>HubSpot</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-mailchimp" style={{ color: '#ffe01b' }}></i><span>Mailchimp</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fas fa-tasks" style={{ color: '#f06a6a' }}></i><span>Asana</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fab fa-microsoft" style={{ color: '#00a4ef' }}></i><span>Microsoft Teams</span></div></div>
                    <div className="col"><div className="skill-item"><i className="fas fa-sticky-note" style={{ color: '#000' }}></i><span>Notion</span></div></div>
                  </div>
                </div>

                {/* Experience Pane */}
                <div className="tab-pane fade" id="pills-experience" role="tabpanel" aria-labelledby="pills-experience-tab">
                  <div className="experience-list">
                    {/* Freelance */}
                    <div className="experience-item">
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <h4 className="mb-0">Freelance Product & Technology Consultant</h4>
                        <span className="experience-date">Jul 2019 - Present</span>
                      </div>
                      <p className="experience-company">Independent Contractor</p>
                      <p className="small">Drive product strategy, design, and technical initiatives for diverse clients across multiple industries. Specialize in UI/UX optimization, frontend development, and AI-powered project management solutions that deliver measurable business impact.</p>
                    </div>

                    {/* Nebusis */}
                    <div className="experience-item">
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <h4 className="mb-0">Director of Product & Technology</h4>
                        <span className="experience-date">Nov 2020 - Jun 2024</span>
                      </div>
                      <p className="experience-company">Nebusis Cloud Services • Reston, VA / Madrid, Spain</p>
                      <p className="small">Led strategic product initiatives in partnership with CEO, driving a <strong>12% increase in user engagement</strong> through data-driven roadmap execution. Spearheaded ISO AI project implementations and orchestrated seamless multi-location client onboarding across global markets. Architected scalable software processes that enhanced operational efficiency.</p>
                      <a href="https://www.nebusis.com" target="_blank" rel="noopener noreferrer" className="card-link">Visit Site →</a>
                    </div>

                    {/* Add other experiences here... */}

                  </div>
                </div>

                {/* Education Pane */}
                <div className="tab-pane fade" id="pills-education" role="tabpanel" aria-labelledby="pills-education-tab">
                  <div className="experience-list">
                    <div className="experience-item">
                      <h4 className="mb-0">North Carolina Wesleyan University</h4>
                      <p className="experience-company mb-1">B.S. Computer Information Systems</p>
                      <p className="experience-company">B.A. Business Administration</p>
                    </div>
                    <div className="experience-item">
                      <h4 className="mb-0">Coursera Certifications</h4>
                      <p className="experience-company mb-1">Digital Product Management (UVA, Darden)</p>
                      <p className="experience-company">Google UI/UX</p>
                    </div>
                    {/* Add other education here... */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT SECTION */}
      <section className="py-5" id="connect">
        <div className="container">
          <div className="text-center mt-4 mb-3">
            <h2 className="display-6 fw-bold">Let's Connect</h2>
            <p className="lead">Have a project idea, collaboration, or just want to say hi? Drop me a line below.</p>
          </div>
          {/* Custom HubSpot Form */}
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <form id="my-modern-form" className="p-4 p-md-5 rounded shadow">
                <div className="mb-3">
                  <label htmlFor="firstname" className="form-label visually-hidden">First Name</label>
                  <input type="text" className="form-control" id="firstname" name="firstname" placeholder="Enter your name" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label visually-hidden">Email address</label>
                  <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="message_field" className="form-label visually-hidden">Your Message</label>
                  <textarea className="form-control" id="message_field" name="message_field" rows={3} placeholder="Enter your message" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Send Message</button>
                <div id="form-message" className="mt-3 text-center"></div>
              </form>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
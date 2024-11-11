import React, { useState, useEffect, useRef } from "react";
import './preview1.css';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { Document, Packer, Paragraph, TextRun } from "docx";

const Preview1 = () => {
  let [isLoading, setIsLoading] = useState(false);
  let { cv: formData, isCvAvailable } = useSelector(state => state.userAuth);
  let navigate = useNavigate();
  const cvRef = useRef();
  useEffect(() => {
    if (!isCvAvailable) {
      navigate('/template');
    }
  }, [isCvAvailable, navigate]);

  if (!isCvAvailable) {
    return null;
  }

  const downloadPDF = () => {
    const element = cvRef.current;
    const options = {
      margin: 1,
      filename: 'CV.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(options)
      .save();
  };

  // Function to download the CV as a DOCX file
  const downloadDOCX = async () => {
    const doc = new Document();

    // Adding the CV content
    doc.addSection({
      children: [
        new Paragraph({
          text: formData.name,
          heading: "Title",
        }),
        new Paragraph({
          text: formData.jobTitle,
          heading: "Heading2",
        }),
        new Paragraph({
          text: "SUMMARY",
          heading: "Heading3",
        }),
        new Paragraph(`Phone: ${formData.phone}`),
        new Paragraph(`Email: ${formData.email}`),
        new Paragraph(`Location: ${formData.location}`),
        new Paragraph(`Social Media: ${formData.socialMedia}`),
        new Paragraph({
          text: "AWARDS",
          heading: "Heading3",
        }),
        ...formData.awards.map((award) =>
          new Paragraph({
            text: `${award.title} - ${award.organization} / ${award.year} / ${award.location}`,
          })
        ),
        new Paragraph({
          text: "ACHIEVEMENTS",
          heading: "Heading3",
        }),
        ...formData.achievements.map((achievement) =>
          new Paragraph(achievement.description)
        ),
        new Paragraph({
          text: "EDUCATION",
          heading: "Heading3",
        }),
        ...formData.education.map((edu) =>
          new Paragraph(`${edu.degree} - ${edu.institution} / ${edu.year}`)
        ),
        new Paragraph({
          text: "WORK EXPERIENCE",
          heading: "Heading3",
        }),
        ...formData.workExperience.map((work) => {
          const responsibilities = work.responsibilities.map(responsibility =>
            new Paragraph(`• ${responsibility}`)
          );
          return [
            new Paragraph(`${work.title} - ${work.company} / ${work.duration}`),
            ...responsibilities,
          ];
        }).flat(),
      ],
    });

    // Generate and download the DOCX file
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CV.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const editHandler = () => {
    navigate(`/editcv/${formData.cvTemplateType}`);
  };

  // conditional statement for the right cv preview template


  return (
    <div className='container-cv'>
      <h1 class="text-center">Preview CV</h1>

      <div className="cv-container" ref={cvRef}>
        {/* Left Column */}
        <div className="left-column">
          <div className="profile-picture">
            <img src="profile.jpg" alt="Profile Picture" />
          </div>
          <h1 className="name">{formData.name}</h1>
          <h2 className="job-title">{formData.jobTitle}</h2>

          <section className="section summary-section">
            <h3>SUMMARY</h3>
            <ul>
              <li><i className="fas fa-phone"></i> {formData.phone}</li>
              <li><i className="fas fa-envelope"></i> {formData.email}</li>
              <li><i className="fas fa-map-marker-alt"></i> {formData.location}</li>
              <li><i className="fas fa-globe"></i> {formData.socialMedia}</li>
            </ul>
          </section>

          <section className="section awards-section">
            <h3>AWARDS</h3>
            {formData.awards.map((award, index) => (
              <p key={index}>
                <strong>{award.title}</strong><br />
                {award.organization} / {award.year} / {award.location}
              </p>
            ))}
          </section>

          <section className="section achievements-section">
            <h3>ACHIEVEMENTS</h3>
            {formData.achievements.map((achievement, index) => (
              <p key={index}>{achievement.description}</p>
            ))}
          </section>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <section className="section summary">
            <h3>SUMMARY</h3>
            <p>{formData.summary}</p>
          </section>

          <section className="section education">
            <h3>EDUCATION</h3>
            {formData.education.map((edu, index) => (
              <div className="education-item" key={index}>
                <h4>{edu.degree}</h4>
                <p>{edu.institution} / {edu.year}</p>
                <p>{edu.details}</p>
              </div>
            ))}
          </section>

          <section className="section work-experience">
            <h3>WORK EXPERIENCE</h3>
            {formData.workExperience.map((work, index) => (
              <div className="work-item" key={index}>
                <h4>{work.title}</h4>
                <p>{work.company} / {work.duration}</p>
                <ul>
                  {work.responsibilities.map((responsibility, i) => (
                    <li key={i}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
      </div>
      <div className="cv-button-con text-center mt-3">
        <button onClick={downloadPDF} className="btn btn-primary m-2">Download PDF</button>
        <button onClick={downloadDOCX} className="btn btn-primary m-2">Download DOCX</button>
        <button onClick={editHandler} className="btn btn-primary m-2">Edit CV</button>
      </div>


    </div>
  )
};

export default Preview1;
























































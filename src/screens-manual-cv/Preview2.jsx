import React, { useState, useEffect, useRef } from "react";
import './preview2.css';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { Document, Packer, Paragraph } from "docx"; // Import docx library

const Preview2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { cv: formData, isCvAvailable } = useSelector(state => state.userAuth);
  const navigate = useNavigate();
  const pdfRef = useRef();
  let { user } = useSelector(state => state.userAuth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!isCvAvailable) {
      navigate('/template');
    }
  }, [isCvAvailable, navigate]);

  if (!isCvAvailable) {
    return null;
  }

  const downloadPDF = () => {
    const element = pdfRef.current;
    const options = {
      margin: 1,
      filename: `${formData.name}_CV.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
  };

  const downloadDOCX = async () => {
    const doc = new Document();
    doc.addSection({
      children: [
        new Paragraph({ text: `${formData.name}'s CV`, heading: "Title" }),
        new Paragraph({ text: "Contact Information", heading: "Heading2" }),
        new Paragraph(`Phone: ${formData.phone}`),
        new Paragraph(`Email: ${formData.email}`),
        new Paragraph(`Location: ${formData.location}`),
        new Paragraph({ text: "Education", heading: "Heading2" }),
        ...formData.education.map((edu) =>
          new Paragraph(`${edu.degree} at ${edu.institution} (${edu.year})`)
        ),
        new Paragraph({ text: "Skills", heading: "Heading2" }),
        ...Object.entries(formData.skills).map(
          ([skill, level]) => new Paragraph(`${skill}: ${level}`)
        ),
        new Paragraph({ text: "Publications", heading: "Heading2" }),
        ...formData.publications.map((pub) =>
          new Paragraph(`${pub.title}. ${pub.journal} (${pub.year}): ${pub.pages}`)
        ),
        new Paragraph({ text: "Research Experience", heading: "Heading2" }),
        ...formData.researchExperience.map((exp) => [
          new Paragraph(`${exp.role} at ${exp.institution} (${exp.duration})`),
          new Paragraph(exp.description),
        ]).flat(),
        new Paragraph({ text: "Awards & Honors", heading: "Heading2" }),
        ...formData.awards.map((award) =>
          new Paragraph(`${award.year} - ${award.title}, ${award.institution}`)
        ),
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.name}_CV.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const editHandler = () => {
    navigate(`/editcv/${formData.cvTemplateType}`);
  };

  return (
    <div className="container-cv">
      <h1 className="text-center">Preview CV</h1>
      <div className="cv-container" ref={pdfRef}>
        <div className="cv-header">
          <h1 className="cv-title">{formData.name}'s CV</h1>
          <div className="contact-info">
            <p><i className="fas fa-phone"></i> {formData.phone}</p>
            <p><i className="fas fa-map-marker-alt"></i> {formData.location}</p>
            <p><i className="fas fa-envelope"></i> {formData.email}</p>
          </div>
        </div>
        <div className="cv-main">
          <div className="cv-left">
            <section className="section education">
              <h3>Education</h3>
              {formData.education.map((edu, index) => (
                <div className="education-item" key={index}>
                  <p>{edu.year}</p>
                  <div>
                    <h4>{edu.degree}</h4>
                    <p>{edu.institution}</p>
                    <p>{edu.details}</p>
                  </div>
                </div>
              ))}
            </section>
            <section className="section skills">
              <h3>Additional Skills</h3>
              <ul>
                <li>R: {formData.skills.R}</li>
                <li>Spanish: {formData.skills.Spanish}</li>
                <li>Mandarin: {formData.skills.Mandarin}</li>
              </ul>
            </section>
          </div>
          <div className="cv-right">
            <section className="section publications">
              <h3>Publications</h3>
              {formData.publications.map((pub, index) => (
                <p key={index}>
                  {pub.title}. <i>{pub.journal}</i> ({pub.year}): {pub.pages}.
                </p>
              ))}
            </section>
            <section className="section research-experience">
              <h3>Research Experience</h3>
              {formData.researchExperience.map((exp, index) => (
                <div className="research-item" key={index}>
                  <p>{exp.duration}</p>
                  <div>
                    <h4>{exp.role}</h4>
                    <p>{exp.institution}</p>
                    <p>{exp.description}</p>
                  </div>
                </div>
              ))}
            </section>
            <section className="section awards">
              <h3>Awards & Honors</h3>
              {formData.awards.map((award, index) => (
                <p key={index}>
                  {award.year} - {award.title}, {award.institution}
                </p>
              ))}
            </section>
          </div>
        </div>
      </div>
      <div className="cv-button-con text-center mt-3">
        <button onClick={downloadPDF} className="btn btn-primary m-2">Download PDF</button>
        <button onClick={downloadDOCX} className="btn btn-primary m-2">Download DOCX</button>
        <button onClick={editHandler} className="btn btn-primary m-2">Edit CV</button>
      </div>
    </div>
  );
};

export default Preview2;



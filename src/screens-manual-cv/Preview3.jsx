import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Document, Packer, Paragraph } from "docx";
import { useSelector } from "react-redux";

const Preview3 = () => {
  // Redux data from state
  const { cv: formData, isCvAvailable } = useSelector(state => state.userAuth);

  const cvRef = useRef();

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

  const downloadDOCX = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: formData?.fullName || "Full Name", heading: "Title" }),
          new Paragraph({ text: formData?.profileTitle || "Profile Title", heading: "Heading2" }),
          new Paragraph(formData?.phone || "Phone"),
          new Paragraph(formData?.email || "Email"),
          new Paragraph(formData?.linkedin || "LinkedIn"),
          new Paragraph(formData?.location || "Location"),
          new Paragraph("PROFILE"),
          new Paragraph(formData?.profileDescription || "Profile Description"),

          new Paragraph("PROFESSIONAL EXPERIENCE"),
          ...(formData?.experience || []).map(job => 
            new Paragraph(`${job.role} - ${job.company} | ${job.startDate} - ${job.endDate} | ${job.location}`)
          ),
          
          new Paragraph("EDUCATION"),
          new Paragraph(`${formData?.education.degree} - ${formData?.education.institution} | ${formData?.education.startDate} - ${formData?.education.endDate}`),

          new Paragraph("CERTIFICATION"),
          ...(formData?.certifications || []).map(cert => 
            new Paragraph(`${cert.title} | ${cert.organization}`)
          ),

          new Paragraph("TECHNICAL SKILLS"),
          new Paragraph((formData?.skills || [])),

          new Paragraph("Powered by Enhancv"),
        ],
      }],
    });

    try {
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CV.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating DOCX:", error);
      alert("There was an error generating the DOCX file. Please try again.");
    }
  };

  // Conditionally rendering the CV based on the availability of data
  if (!isCvAvailable) {
    return <div>No CV available</div>;
  }

  return (
    <div
      ref={cvRef}
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
        lineHeight: 1.5,
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header Section */}
      <header style={{ textAlign: "left", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "36px", margin: 0 }}>{formData?.fullName || "Full Name"}</h1>
        <p style={{ fontSize: "18px", fontStyle: "italic", margin: "5px 0" }}>
          {formData?.profileTitle || "I solve problems and help people overcome obstacles."}
        </p>
        <div style={{ fontSize: "14px", marginTop: "10px" }}>
          <p>
            <span>📞 {formData?.phone || "+1-000-000"} </span> |
            <span> ✉️ {formData?.email || "email@example.com"} </span> |
            <span> 🔗 <a href={formData?.linkedin || "#"}>{formData?.linkedin || "linkedin.com"}</a> </span>
          </p>
          <p>📍 {formData?.location || "New York City, NY"}</p>
        </div>
      </header>

      {/* Profile Section */}
      <section>
        <h2 style={{ borderBottom: "2px solid black", paddingBottom: "5px" }}>PROFILE</h2>
        <p>{formData?.profileDescription || "Result-oriented project team leader with experience covering project and product management."}</p>
      </section>

      {/* Professional Experience Section */}
      <section>
        <h2 style={{ borderBottom: "2px solid black", paddingBottom: "5px" }}>PROFESSIONAL EXPERIENCE</h2>
        {(formData?.experience || []).map((job, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3>{job.role}</h3>
            <p><strong>{job.company}</strong> | {job.startDate} - {job.endDate} | {job.location}</p>
            <ul>
              {job.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education Section */}
      <section>
        <h2 style={{ borderBottom: "2px solid black", paddingBottom: "5px" }}>EDUCATION</h2>
        <p><strong>{formData?.education?.degree || "Degree"}</strong></p>
        <p>{formData?.education?.institution || "Institution"} | {formData?.education?.startDate || "Start"} - {formData?.education?.endDate || "End"}</p>
      </section>

      {/* Certification Section */}
      <section>
        <h2 style={{ borderBottom: "2px solid black", paddingBottom: "5px" }}>CERTIFICATION</h2>
        {(formData?.certifications || []).map((cert, index) => (
          <p key={index}>{cert.title} | {cert.organization}</p>
        ))}
      </section>

      {/* Technical Skills Section */}
      <section>
        <h2 style={{ borderBottom: "2px solid black", paddingBottom: "5px" }}>TECHNICAL SKILLS</h2>
        <p>{(formData?.skills || [])}</p>
      </section>

      {/* Footer Section */}
      <footer style={{ marginTop: "40px", textAlign: "center" }}>
        <p>Powered by Enhancv</p>
      </footer>

      {/* Buttons for downloading */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
        <button onClick={downloadPDF} style={buttonStyle}>Download PDF</button>
        <button onClick={downloadDOCX} style={buttonStyle}>Download DOCX</button>
      </div>
    </div>
  );
};

// Button styles
const buttonStyle = {
  padding: "10px 20px",
  margin: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default Preview3;






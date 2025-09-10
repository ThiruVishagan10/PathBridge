"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PortfolioForm() {
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    degree: "",
    collegeName: "",
    yearOfPassing: "",
    skills: "",
    projects: [{ name: "", description: "" }],
    experiences: [{ companyName: "", role: "", duration: "" }],
    certifications: [""],
    linkedinUrl: "",
    githubUrl: "",
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [notification, setNotification] = useState("");

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, { companyName: "", role: "", duration: "" }]
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, ""]
    });
  };

  const removeExperience = (index) => {
    if (formData.experiences.length > 1) {
      const updatedExperiences = formData.experiences.filter((_, i) => i !== index);
      setFormData({ ...formData, experiences: updatedExperiences });
    }
  };

  const removeCertification = (index) => {
    if (formData.certifications.length > 1) {
      const updatedCertifications = formData.certifications.filter((_, i) => i !== index);
      setFormData({ ...formData, certifications: updatedCertifications });
    }
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: "", description: "" }]
    });
  };

  const removeProject = (index) => {
    if (formData.projects.length > 1) {
      const updatedProjects = formData.projects.filter((_, i) => i !== index);
      setFormData({ ...formData, projects: updatedProjects });
    }
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = formData.projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    );
    setFormData({ ...formData, projects: updatedProjects });
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = formData.experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setFormData({ ...formData, experiences: updatedExperiences });
  };

  const handleCertificationChange = (index, value) => {
    const updatedCertifications = formData.certifications.map((cert, i) => 
      i === index ? value : cert
    );
    setFormData({ ...formData, certifications: updatedCertifications });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation with scroll to field
    let firstEmptyField = null;
    if (!formData.name) firstEmptyField = "name";
    else if (!formData.about) firstEmptyField = "about";
    else if (!formData.degree) firstEmptyField = "degree";
    else if (!formData.collegeName) firstEmptyField = "collegeName";
    else if (!formData.yearOfPassing) firstEmptyField = "yearOfPassing";
    else if (!formData.skills) firstEmptyField = "skills";
    
    if (firstEmptyField) {
      const element = document.querySelector(`[name="${firstEmptyField}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      element?.focus();
      setNotification(`Please fill in the highlighted field`);
      setTimeout(() => setNotification(""), 3000);
      return;
    }
    
    const incompleteProjects = formData.projects.findIndex(p => !p.name || !p.description);
    if (incompleteProjects !== -1) {
      const projectElement = document.querySelector(`#project-${incompleteProjects}`);
      projectElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      setNotification(`Please complete Project ${incompleteProjects + 1} fields`);
      setTimeout(() => setNotification(""), 3000);
      return;
    }
    
    const jsonData = JSON.stringify(formData);
    console.log("Form Data as JSON:", jsonData);
    
    try {
      const response = await fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('Success:', result);
          setGeneratedData(result);
          setIsGenerated(true);
        } else {
          const text = await response.text();
          console.log('Success (non-JSON):', text);
          setGeneratedData({ code: text, html: text });
          setIsGenerated(true);
        }
      } else {
        const errorText = await response.text();
        console.error('Error:', response.statusText, errorText);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const downloadCode = async () => {
    try {
      const response = await fetch('http://localhost:8000/download-txt');
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-code.txt';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download code error:', error);
    }
  };

  const downloadHTML = async () => {
    try {
      const response = await fetch('http://localhost:8000/download-html');
      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio.html';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download HTML error:', error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white px-6 py-12">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-screen h-screen object-cover -z-10"
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl bg-gray-900/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          PathBridge Portfolio Generator
        </h1>

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-300 text-center backdrop-blur-sm"
          >
            {notification}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </motion.div>

          {/* About */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label className="block text-sm font-medium mb-2">About</label>
            <textarea
              name="about"
              rows="4"
              placeholder="Write a short bio about yourself..."
              value={formData.about}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
            ></textarea>
          </motion.div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedinUrl"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedinUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                placeholder="https://github.com/yourusername"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </motion.div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-300">Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium mb-2">Degree</label>
                <input
                  type="text"
                  name="degree"
                  placeholder="B.Sc Computer Science"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium mb-2">Year of Passing</label>
                <input
                  type="text"
                  name="yearOfPassing"
                  placeholder="2022"
                  value={formData.yearOfPassing}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
              </motion.div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <label className="block text-sm font-medium mb-2">College Name</label>
              <input
                type="text"
                name="collegeName"
                placeholder="XYZ University"
                value={formData.collegeName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </motion.div>
          </div>

          {/* Skills */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label className="block text-sm font-medium mb-2">Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="React, Next.js, Tailwind, Python..."
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </motion.div>

          {/* Projects */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-300">Projects</h3>
              <button
                type="button"
                onClick={addProject}
                className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition"
              >
                + Add More
              </button>
            </div>
            {formData.projects.map((project, index) => (
              <div key={index} id={`project-${index}`} className="space-y-4 p-4 border border-gray-600 rounded-xl relative">
                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full text-white text-xs flex items-center justify-center transition"
                  >
                    ×
                  </button>
                )}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <input
                    type="text"
                    placeholder="Portfolio Website"
                    value={project.name}
                    onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows="3"
                    placeholder="A modern portfolio built using Next.js and Tailwind CSS"
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  />
                </motion.div>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-300">Experience (Optional)</h3>
              <button
                type="button"
                onClick={addExperience}
                className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition"
              >
                + Add More
              </button>
            </div>
            {formData.experiences.map((exp, index) => (
              <div key={index} className="space-y-4 p-4 border border-gray-600 rounded-xl relative">
                {formData.experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full text-white text-xs flex items-center justify-center transition"
                  >
                    ×
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input
                      type="text"
                      placeholder="ABC Corp"
                      value={exp.companyName}
                      onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <input
                      type="text"
                      placeholder="2022-Present"
                      value={exp.duration}
                      onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
                    />
                  </motion.div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <input
                    type="text"
                    placeholder="Software Engineer"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  />
                </motion.div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-300">Certifications (Optional)</h3>
              <button
                type="button"
                onClick={addCertification}
                className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition"
              >
                + Add More
              </button>
            </div>
            {formData.certifications.map((cert, index) => (
              <motion.div key={index} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="relative">
                <input
                  type="text"
                  placeholder="AWS Certified Solutions Architect"
                  value={cert}
                  onChange={(e) => handleCertificationChange(index, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
                {formData.certifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full text-white text-xs flex items-center justify-center transition"
                  >
                    ×
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 mt-6 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Generate Portfolio 🚀
          </motion.button>

          {/* Download Options */}
          {isGenerated && generatedData && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-300 text-center">Download Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadCode}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg transition text-white font-medium"
                >
                  📄 Download as Code
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadHTML}
                  className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg transition text-white font-medium"
                >
                  🌐 Download as HTML
                </motion.button>
              </div>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
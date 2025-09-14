"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import EducationSection from "./portfolio/EducationSection";
import ProjectsSection from "./portfolio/ProjectsSection";

export default function PortfolioForm() {
  const [templateName, setTemplateName] = useState<string>("");
  
  useEffect(() => {
    // Get template name from localStorage if available
    const storedTemplate = localStorage.getItem('selectedTemplate');
    if (storedTemplate) {
      setTemplateName(storedTemplate);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    about: "",
    degree: "",
    collegeName: "",
    yearOfPassing: "",
    skills: "",
    achievements: [{ name: "", description: "" }],
    projects: [{ name: "", description: "" }],
    experiences: [{ companyName: "", role: "", duration: "" }],
    certifications: [""],
    linkedinUrl: "",
    githubUrl: "",
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const removeExperience = (index: number) => {
    if (formData.experiences.length > 1) {
      const updatedExperiences = formData.experiences.filter((_, i) => i !== index);
      setFormData({ ...formData, experiences: updatedExperiences });
    }
  };

  const removeCertification = (index: number) => {
    if (formData.certifications.length > 1) {
      const updatedCertifications = formData.certifications.filter((_, i) => i !== index);
      setFormData({ ...formData, certifications: updatedCertifications });
    }
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, { name: "", description: "" }]
    });
  };

  const removeAchievement = (index: number) => {
    if (formData.achievements.length > 1) {
      const updatedAchievements = formData.achievements.filter((_, i) => i !== index);
      setFormData({ ...formData, achievements: updatedAchievements });
    }
  };

  const handleAchievementChange = (index: number, field: string, value: string) => {
    const updatedAchievements = formData.achievements.map((achievement, i) => 
      i === index ? { ...achievement, [field]: value } : achievement
    );
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  const addProject = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "" }]
    }));
  }, []);

  const removeProject = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  }, []);

  const handleProjectChange = useCallback((index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
      return { ...prev, projects: updatedProjects };
    });
  }, []);

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExperiences = formData.experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setFormData({ ...formData, experiences: updatedExperiences });
  };

  const handleCertificationChange = (index: number, value: string) => {
    const updatedCertifications = formData.certifications.map((cert, i) => 
      i === index ? value : cert
    );
    setFormData({ ...formData, certifications: updatedCertifications });
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation with scroll to field
    let firstEmptyField = null;
    if (!formData.name) firstEmptyField = "name";
    else if (!formData.about) firstEmptyField = "about";
    else if (!formData.degree) firstEmptyField = "degree";
    else if (!formData.collegeName) firstEmptyField = "collegeName";
    else if (!formData.yearOfPassing) firstEmptyField = "yearOfPassing";
    else if (!formData.skills) firstEmptyField = "skills";
    else if (!formData.achievements.some(ach => ach.name.trim() !== '' || ach.description.trim() !== '')) {
      const element = document.querySelector('.achievements-section');
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      setNotification('Please fill in at least one achievement');
      setTimeout(() => setNotification(""), 3000);
      return;
    }
    
    if (firstEmptyField) {
      const element = document.querySelector(`[name="${firstEmptyField}"]`) as HTMLElement;
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      (element as HTMLInputElement)?.focus();
      setNotification(`Please fill in the highlighted field`);
      setTimeout(() => setNotification(""), 3000);
      return;
    }
    

    
    // Clean form data to ensure all values are strings
    const cleanedData = {
      ...formData,
      templateName: templateName,
      skills: formData.skills.trim(),
      certifications: formData.certifications.filter(cert => cert.trim() !== ''),
      achievements: formData.achievements,
      projects: formData.projects.filter(proj => proj.name.trim() !== '' || proj.description.trim() !== ''),
      experiences: formData.experiences.filter(exp => exp.companyName.trim() !== '' || exp.role.trim() !== '' || exp.duration.trim() !== '')
    };
    
    console.log("Cleaned Form Data:", cleanedData);
    console.log("Achievements being sent:", cleanedData.achievements);
    
    setIsLoading(true);
    
    const apiUrls = ['http://localhost:8000', 'https://8fnxbhw0-8000.inc1.devtunnels.ms'];
    let response;
    let connected = false;
    
    for (const url of apiUrls) {
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanedData),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        connected = true;
        break;
      } catch (err) {
        const error = err as Error;
        console.log(`Failed to connect to ${url}: ${error.message}`);
        continue;
      }
    }
    
    if (!connected) {
      // Mock success for testing UI when backend is not available
      setTimeout(() => {
        setIsGenerated(true);
        setNotification('✅ Portfolio generated successfully! (Demo Mode)');
        setIsLoading(false);
      }, 2000);
      return;
    }
    
    try {
      setIsGenerated(true);
      setNotification('✅ Portfolio generated successfully!');
    } catch (error) {
      const err = error as Error;
      if (err instanceof TypeError) {
        setNotification('❌ Network connection failed');
      } else if (err.message?.includes('HTTP')) {
        setNotification(`❌ Server error: ${err.message}`);
      } else {
        setNotification('❌ Failed to generate portfolio');
      }
      console.error('Portfolio generation error:', err);
    }
    
    setIsLoading(false);
  };

  const downloadCode = async () => {
    const apiUrls = ['http://localhost:8000/download-code', 'https://8fnxbhw0-8000.inc1.devtunnels.ms/download-code'];
    
    for (const url of apiUrls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        const blob = new Blob([text], { type: 'text/plain' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'portfolio-code.txt';
        a.click();
        URL.revokeObjectURL(downloadUrl);
        return;
      } catch (error) {
        const err = error as Error;
        console.log(`Failed to download from ${url}: ${err.message}`);
        continue;
      }
    }
    
    // Mock download for demo mode
    const mockCode = `// Portfolio Code for ${formData.name}\n\nconst portfolio = ${JSON.stringify(formData, null, 2)};`;
    const blob = new Blob([mockCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHTML = async () => {
    const apiUrls = ['http://localhost:8000/download-html', 'https://8fnxbhw0-8000.inc1.devtunnels.ms/download-html'];
    
    for (const url of apiUrls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const html = await response.text();
        const blob = new Blob([html], { type: 'text/html' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'portfolio.html';
        a.click();
        URL.revokeObjectURL(downloadUrl);
        return;
      } catch (error) {
        const err = error as Error;
        console.log(`Failed to download from ${url}: ${err.message}`);
        continue;
      }
    }
    
    // Mock HTML download for demo mode
    const mockHTML = `<!DOCTYPE html>\n<html>\n<head>\n  <title>${formData.name} - Portfolio</title>\n</head>\n<body>\n  <h1>${formData.name}</h1>\n  <p>${formData.about}</p>\n  <h2>Education</h2>\n  <p>${formData.degree} from ${formData.collegeName} (${formData.yearOfPassing})</p>\n  <h2>Skills</h2>\n  <p>${formData.skills}</p>\n</body>\n</html>`;
    const blob = new Blob([mockHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRedo = () => {
    setIsGenerated(false);
    setNotification('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-6 py-12">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl bg-gray-900/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/portfolio-templates">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
            >
              ← Back
            </motion.button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            PathBridge Portfolio Generator
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl text-center backdrop-blur-sm ${
              notification.includes('✅') 
                ? 'bg-green-500/20 border border-green-500 text-green-300'
                : 'bg-red-500/20 border border-red-500 text-red-300'
            }`}
          >
            {notification}
          </motion.div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-lg text-gray-300">Generating your portfolio...</p>
          </div>
        )}

        {isGenerated && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-green-400 mb-6">Portfolio Generated Successfully! 🎉</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRedo}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition text-white font-medium"
            >
              🔄 Create Another Portfolio
            </motion.button>
          </div>
        )}

        {!isLoading && !isGenerated && (
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

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <label className="block text-sm font-medium mb-2">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                placeholder="+1 234 567 8900"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </motion.div>
          </div>

          {/* About */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label className="block text-sm font-medium mb-2">About</label>
            <textarea
              name="about"
              rows={4}
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

          {/* Achievements */}
          <div className="space-y-4 achievements-section">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-300">Achievements</h3>
              <button
                type="button"
                onClick={addAchievement}
                className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition"
              >
                + Add More
              </button>
            </div>
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="space-y-4 p-4 border border-gray-600 rounded-xl relative">
                {formData.achievements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full text-white text-xs flex items-center justify-center transition"
                  >
                    ×
                  </button>
                )}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2">Achievement Name</label>
                  <input
                    type="text"
                    placeholder="Best Student Award"
                    value={achievement.name}
                    onChange={(e) => handleAchievementChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Received for outstanding academic performance"
                    value={achievement.description}
                    onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  />
                </motion.div>
              </div>
            ))}
          </div>

          <ProjectsSection 
            projects={formData.projects}
            handleProjectChange={handleProjectChange}
            addProject={addProject}
            removeProject={removeProject}
          />

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

        </form>
        )}
      </motion.div>
    </div>
  );
}
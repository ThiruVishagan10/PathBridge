"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const templates = [
  {
    id: 1,
    name: "Modern",
    description: "Clean and professional design",
    preview: "/templates/template_modern.jpg",
    color: "from-blue-500 to-purple-600",
    hoverColor: "hover:bg-purple-500/20"
  },
  {
    id: 2,
    name: "Creative",
    description: "Bold and artistic layout",
    preview: "/templates/template_creative.jpg",
    color: "from-pink-500 to-red-600",
    hoverColor: "hover:bg-blue-500/20"
  },
  {
    id: 3,
    name: "Minimal",
    description: "Simple and elegant design",
    preview: "/templates/template_minimal.jpg",
    color: "from-green-500 to-teal-600",
    hoverColor: "hover:bg-green-500/20"
  }
];

export default function TemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedTemplate) return;
    
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    setIsLoading(true);
    
    // Store template name in localStorage
    localStorage.setItem('selectedTemplate', template.name);
    
    try {
      await fetch('/api/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateName: template.name }),
      });
    } catch (error) {
      console.log('Failed to send template to backend:', error);
    }
    
    setIsLoading(false);
    window.location.href = '/generate-portfolio';
  };

  return (
    <div className="min-h-screen text-white px-6 py-12">
      <div className="max-w-6xl mx-auto bg-black/20 backdrop-blur-md rounded-3xl p-8 border border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Choose Your Portfolio Template
          </h1>
          <p className="text-gray-300 text-lg">
            Select a template that best represents your style
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${template.hoverColor} ${
                selectedTemplate === template.id
                  ? "border-purple-500 scale-105"
                  : "border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="aspect-[4/3] bg-gray-800 overflow-hidden">
                <img
                  src={template.preview}
                  alt={`${template.name} template preview`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                <p className="text-gray-400">{template.description}</p>
              </div>

              {selectedTemplate === template.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">✓</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : `Continue with ${templates.find(t => t.id === selectedTemplate)?.name} Template`}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
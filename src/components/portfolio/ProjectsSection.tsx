import { motion } from 'framer-motion';

interface ProjectsSectionProps {
  projects: any[];
  handleProjectChange: (index: number, field: string, value: string) => void;
  addProject: () => void;
  removeProject: (index: number) => void;
}

export default function ProjectsSection({ projects, handleProjectChange, addProject, removeProject }: ProjectsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-300">Projects (Optional)</h3>
        <button
          type="button"
          onClick={addProject}
          className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition"
        >
          + Add More
        </button>
      </div>
      {projects.map((project, index) => (
        <div key={index} className="space-y-4 p-4 border border-gray-600 rounded-xl relative">
          {projects.length > 1 && (
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
              rows={3}
              placeholder="A modern portfolio built using Next.js and Tailwind CSS"
              value={project.description}
              onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}